package com.mcp.chat;

import java.util.Objects;

public class User {
    private final String username;

    public User(String username) {
        this.username = username;
    }

    public String getUsername() { return username; }

    public void receiveMessage(Message message) {
        System.out.println(message.toString());
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User u = (User) o;
        return Objects.equals(username, u.username);
    }
    @Override public int hashCode() { return Objects.hash(username); }
}
