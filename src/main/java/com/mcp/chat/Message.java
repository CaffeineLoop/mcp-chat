package com.mcp.chat;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Message {
    private final String roomName;
    private final String senderUsername;
    private final String content;
    private final String timestamp;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Message(String roomName, String senderUsername, String content, LocalDateTime ts) {
        this.roomName = roomName;
        this.senderUsername = senderUsername;
        this.content = content;
        this.timestamp = ts.format(FMT);
    }

    public String getRoomName() { return roomName; }
    public String getSenderUsername() { return senderUsername; }
    public String getContent() { return content; }
    public String getTimestamp() { return timestamp; }

    @Override public String toString() {
        return "[" + timestamp + "][" + roomName + "] " + senderUsername + ": " + content;
    }
}
