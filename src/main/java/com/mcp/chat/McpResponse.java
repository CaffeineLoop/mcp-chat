package com.mcp.chat;

public class McpResponse {
    private final boolean ok;
    private final Object result;
    private final String error;

    public McpResponse(boolean ok, Object result, String error) {
        this.ok = ok;
        this.result = result;
        this.error = error;
    }

    public boolean isOk() { return ok; }
    public Object getResult() { return result; }
    public String getError() { return error; }
}
