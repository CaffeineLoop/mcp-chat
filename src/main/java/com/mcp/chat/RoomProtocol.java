package com.mcp.chat;

public interface RoomProtocol {
    void joinRoom(ChatSession session, User user);
    void leaveRoom(ChatSession session, User user);
}
