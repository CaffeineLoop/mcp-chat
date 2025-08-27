package com.mcp.chat;

public class RoomProtocolImpl implements RoomProtocol {
    @Override public void joinRoom(ChatSession session, User user) {
        session.getRoom().addUser(user);
        session.assignRole(user, Role.RECEIVER);
    }
    @Override public void leaveRoom(ChatSession session, User user) {
        session.getRoom().removeUser(user);
        session.assignRole(user, Role.NONE);
    }
}
