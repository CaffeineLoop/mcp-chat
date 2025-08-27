package com.mcp.chat;

import java.util.HashMap;
import java.util.Map;

public class ChatSession {
    private final ChatRoom room;
    private final Map<User, Role> userRoles = new HashMap<>();
    private final MessageProtocol messageProtocol;
    private final RoomProtocol roomProtocol;

    public ChatSession(ChatRoom room, MessageProtocol messageProtocol, RoomProtocol roomProtocol) {
        this.room = room;
        this.messageProtocol = messageProtocol;
        this.roomProtocol = roomProtocol;
    }

    public ChatRoom getRoom() { return room; }

    public void assignRole(User user, Role role) { userRoles.put(user, role); }
    public Role getRole(User user) { return userRoles.getOrDefault(user, Role.NONE); }

    public void handleMessage(User sender, String content) {
        if (!room.getUsers().contains(sender)) {
            System.out.println("You are not in room " + room.getName() + ". Please join first.");
            return;
        }
        messageProtocol.sendMessage(this, sender, content);
    }

    public void join(User user) { roomProtocol.joinRoom(this, user); }
    public void leave(User user) { roomProtocol.leaveRoom(this, user); }
}
