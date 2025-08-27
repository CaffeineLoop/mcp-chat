package com.mcp.chat;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.HashMap;


public class McpHttpServer {
    private final ChatService chatService;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private final Map<String, Function<JsonObject, Object>> handlers = new HashMap<>();

    public McpHttpServer(ChatService chatService) {
        this.chatService = chatService;
        registerHandlers();
    }

    private void registerHandlers() {
        handlers.put("ping", params -> Map.of("pong", true));

        handlers.put("create_user", params -> {
            String username = getAsString(params, "username");
            boolean ok = chatService.createUser(username);
            if (!ok) return Map.of("ok", false, "error", "could not create user");
            return Map.of("ok", true, "username", username);
        });

        handlers.put("create_room", params -> {
            String room = getAsString(params, "room");
            boolean ok = chatService.createRoom(room);
            if (!ok) return Map.of("ok", false, "error", "could not create room");
            return Map.of("ok", true, "room", room);
        });

        handlers.put("join_room", params ->
                chatService.joinRoom(getAsString(params, "username"), getAsString(params, "room")));

        handlers.put("leave_room", params ->
                chatService.leaveRoom(getAsString(params, "username")));

        handlers.put("send_message", params ->
                chatService.sendMessage(getAsString(params, "username"), getAsString(params, "content")));

        handlers.put("list_rooms", params -> chatService.listRooms());

        handlers.put("list_users", params -> chatService.listUsers(getAsString(params, "room")));

        handlers.put("get_messages", params -> chatService.getMessages(getAsString(params, "room")));
    }

    private static String getAsString(JsonObject params, String key) {
        if (params == null || !params.has(key) || params.get(key).isJsonNull()) return null;
        return params.get(key).getAsString();
    }

    public void start(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/mcp", this::handleMcp);
        server.setExecutor(null);
        server.start();
        System.out.println("MCP HTTP server started on port " + port + " (POST JSON to /mcp)");
    }

    private void handleMcp(HttpExchange exchange) {
        // ADD CORS headers
        Headers responseHeaders = exchange.getResponseHeaders();
        responseHeaders.add("Access-Control-Allow-Origin", "*");
        responseHeaders.add("Access-Control-Allow-Methods", "POST, OPTIONS");
        responseHeaders.add("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight OPTIONS request
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            try {
                exchange.sendResponseHeaders(200, -1);
                return;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        try {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, new McpResponse(false, null, "Only POST is allowed"));
                return;
            }

            Headers reqHeaders = exchange.getRequestHeaders();
            String contentType = reqHeaders.getFirst("Content-Type");
            if (contentType == null || !contentType.contains("application/json")) {
                // still try to read the body
            }

            String body = readStream(exchange.getRequestBody());
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();
            McpRequest req = gson.fromJson(json, McpRequest.class);
            if (req == null || req.getMethod() == null) {
                sendResponse(exchange, 400, new McpResponse(false, null, "Invalid request"));
                return;
            }

            Function<JsonObject, Object> handler = handlers.get(req.getMethod());
            if (handler == null) {
                sendResponse(exchange, 400, new McpResponse(false, null, "Unknown method: " + req.getMethod()));
                return;
            }

            Object result = handler.apply(req.getParams());
            sendResponse(exchange, 200, new McpResponse(true, result, null));

        } catch (Exception e) {
            e.printStackTrace();
            try { sendResponse(exchange, 500, new McpResponse(false, null, "Server error: " + e.getMessage())); }
            catch (IOException ignored) {}
        }
    }

    private void sendResponse(HttpExchange exchange, int status, McpResponse response) throws IOException {
        // Create a response that matches frontend expectations
        Map<String, Object> frontendResponse = new HashMap<>();
        frontendResponse.put("success", response.isOk());
        frontendResponse.put("result", response.getResult());
        frontendResponse.put("error", response.getError());
        frontendResponse.put("status", response.isOk() ? "ok" : "error");

        byte[] resp = gson.toJson(frontendResponse).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, resp.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(resp);
        }
    }

    private static String readStream(InputStream is) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            return sb.toString();
        }
    }
}