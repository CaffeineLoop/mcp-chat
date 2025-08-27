package com.mcp.chat;

import java.time.LocalDateTime;

public class MessageProtocolImpl implements MessageProtocol {
    @Override
    public void sendMessage(ChatSession session, User sender, String content) {
        session.assignRole(sender, Role.SENDER);

        Message m = new Message(session.getRoom().getName(), sender.getUsername(), content, LocalDateTime.now());
        session.getRoom().addMessage(m);
        session.getRoom().broadcast(m, sender.getUsername());

        session.assignRole(sender, Role.RECEIVER);
    }
}
