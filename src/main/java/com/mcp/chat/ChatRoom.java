package com.mcp.chat;

import java.util.ArrayList;
import java.util.List;

public class ChatRoom {
    private final String name;
    private final List<User> users = new ArrayList<>();
    private final List<Message> messages = new ArrayList<>();

    public ChatRoom(String name) { this.name = name; }
    public String getName() { return name; }

    public synchronized void addUser(User user) {
        if (!users.contains(user)) {
            users.add(user);
            System.out.println(user.getUsername() + " joined room " + name);
        }
    }

    public synchronized void removeUser(User user) {
        if (users.remove(user)) {
            System.out.println(user.getUsername() + " left room " + name);
        }
    }

    public synchronized List<User> getUsers() { return new ArrayList<>(users); }

    public synchronized void addMessage(Message message) { messages.add(message); }
    public synchronized List<Message> getMessages() { return new ArrayList<>(messages); }

    public synchronized void broadcast(Message message, String senderUsername) {
        for (User u : users) {
            if (!u.getUsername().equals(senderUsername)) {
                u.receiveMessage(message);
            }
        }
    }
}
