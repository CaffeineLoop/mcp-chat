package com.mcp.chat;

public interface MessageProtocol {
    void sendMessage(ChatSession session, User sender, String content);
}
