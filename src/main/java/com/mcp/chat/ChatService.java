package com.mcp.chat;

import java.util.*;
import java.util.stream.Collectors;

public class ChatService {
    private final Map<String, User> users = new HashMap<>();
    private final Map<String, ChatSession> sessions = new HashMap<>();
    private final Map<User, ChatSession> activeSession = new HashMap<>();

    private final MessageProtocol messageProtocol = new MessageProtocolImpl();
    private final RoomProtocol roomProtocol = new RoomProtocolImpl();

    public synchronized boolean createUser(String username) {
        if (username == null || username.isBlank() || users.containsKey(username)) return false;
        users.put(username, new User(username));
        return true;
    }

    public synchronized boolean createRoom(String roomName) {
        if (roomName == null || roomName.isBlank() || sessions.containsKey(roomName)) return false;
        sessions.put(roomName, new ChatSession(new ChatRoom(roomName), messageProtocol, roomProtocol));
        return true;
    }

    public synchronized ChatSession getOrCreateSession(String roomName) {
        return sessions.computeIfAbsent(roomName,
                rn -> new ChatSession(new ChatRoom(rn), messageProtocol, roomProtocol));
    }

    public synchronized Map<String, Object> joinRoom(String username, String roomName) {
        Map<String, Object> res = new HashMap<>();
        User u = users.get(username);
        if (u == null) { res.put("ok", false); res.put("error", "User does not exist"); return res; }

        ChatSession s = getOrCreateSession(roomName);

        ChatSession old = activeSession.get(u);
        if (old != null && !old.getRoom().getName().equals(roomName)) {
            old.leave(u);
            activeSession.remove(u);
        }

        s.join(u);
        activeSession.put(u, s);
        res.put("ok", true);
        res.put("room", roomName);
        return res;
    }

    public synchronized Map<String, Object> leaveRoom(String username) {
        Map<String, Object> res = new HashMap<>();
        User u = users.get(username);
        if (u == null) { res.put("ok", false); res.put("error", "User does not exist"); return res; }

        ChatSession s = activeSession.get(u);
        if (s == null) { res.put("ok", false); res.put("error", "User not in any room"); return res; }

        s.leave(u);
        activeSession.remove(u);
        res.put("ok", true);
        res.put("room", s.getRoom().getName());
        return res;
    }

    public synchronized Map<String, Object> sendMessage(String username, String content) {
        Map<String, Object> res = new HashMap<>();
        User u = users.get(username);
        if (u == null) { res.put("ok", false); res.put("error", "User does not exist"); return res; }

        ChatSession s = activeSession.get(u);
        if (s == null) { res.put("ok", false); res.put("error", "User not in any room"); return res; }

        s.handleMessage(u, content);
        List<Message> msgs = s.getRoom().getMessages();
        Message last = msgs.isEmpty() ? null : msgs.get(msgs.size() - 1);

        res.put("ok", true);
        res.put("message", last);
        return res;
    }

    public synchronized List<String> listRooms() {
        return new ArrayList<>(sessions.keySet());
    }

    public synchronized List<String> listUsers(String roomName) {
        ChatSession s = sessions.get(roomName);
        if (s == null) return Collections.emptyList();
        return s.getRoom().getUsers().stream().map(User::getUsername).collect(Collectors.toList());
    }

    public synchronized List<Message> getMessages(String roomName) {
        ChatSession s = sessions.get(roomName);
        if (s == null) return Collections.emptyList();
        return s.getRoom().getMessages();
    }

    public synchronized boolean userExists(String username) { return users.containsKey(username); }
}
