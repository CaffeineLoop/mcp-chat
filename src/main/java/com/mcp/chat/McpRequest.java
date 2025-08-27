package com.mcp.chat;

import com.google.gson.JsonObject;

public class McpRequest {
    private String method;
    private JsonObject params;

    public String getMethod() { return method; }
    public JsonObject getParams() { return params; }
}
