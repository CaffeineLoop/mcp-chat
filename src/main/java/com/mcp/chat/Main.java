package com.mcp.chat;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class Main {
    private static final Scanner sc = new Scanner(System.in);
    private static final ChatService chatService = new ChatService();

    public static void main(String[] args) throws IOException {
        if (args.length > 0 && args[0].equalsIgnoreCase("--server")) {
            McpHttpServer server = new McpHttpServer(chatService);
            server.start(8000);
            System.out.println("Press Ctrl+C to stop.");
            Object lock = new Object();
            synchronized (lock) {
                try { lock.wait(); } catch (InterruptedException ignored) {}
            }
        } else {
            runConsole();
        }
    }

    private static void runConsole() {
        System.out.println("== MCP Chat App (Console) ==");
        boolean running = true;
        while (running) {
            printMenu();
            String opt = sc.nextLine().trim();
            switch (opt) {
                case "1": createUser(); break;
                case "2": createRoom(); break;
                case "3": joinRoom(); break;
                case "4": leaveRoom(); break;
                case "5": sendMessage(); break;
                case "6": listRooms(); break;
                case "7": listUsersInRoom(); break;
                case "8": running = false; break;
                default: System.out.println("Invalid option");
            }
        }
        System.out.println("Bye!");
    }

    private static void printMenu() {
        System.out.println("\n1) Create user  2) Create room  3) Join room  4) Leave room  5) Send message");
        System.out.println("6) List rooms   7) List users in room   8) Exit");
        System.out.print("Choose: ");
    }

    private static void createUser() {
        System.out.print("Enter username: ");
        String name = sc.nextLine().trim();
        if (name.isEmpty()) { System.out.println("Invalid name"); return; }
        if (!chatService.createUser(name)) {
            System.out.println("User already exists or could not be created"); return;
        }
        System.out.println("Created user " + name);
    }

    private static void createRoom() {
        System.out.print("Enter room name: ");
        String rname = sc.nextLine().trim();
        if (rname.isEmpty()) { System.out.println("Invalid room name"); return; }
        if (!chatService.createRoom(rname)) {
            System.out.println("Room already exists or could not be created"); return;
        }
        System.out.println("Created room " + rname);
    }

    private static void joinRoom() {
        System.out.print("Enter username: ");
        String uname = sc.nextLine().trim();
        if (!chatService.userExists(uname)) { System.out.println("No such user. Create first."); return; }
        System.out.print("Enter room name: ");
        String rname = sc.nextLine().trim();
        Map<String, Object> r = chatService.joinRoom(uname, rname);
        System.out.println(r);
    }

    private static void leaveRoom() {
        System.out.print("Enter username: ");
        String uname = sc.nextLine().trim();
        Map<String, Object> r = chatService.leaveRoom(uname);
        System.out.println(r);
    }

    private static void sendMessage() {
        System.out.print("Enter username: ");
        String uname = sc.nextLine().trim();
        System.out.print("Enter message: ");
        String msg = sc.nextLine();
        Map<String, Object> r = chatService.sendMessage(uname, msg);
        System.out.println(r);
    }

    private static void listRooms() {
        List<String> rooms = chatService.listRooms();
        if (rooms.isEmpty()) System.out.println("No rooms");
        else {
            System.out.println("Rooms:");
            rooms.forEach(r -> System.out.println(" - " + r));
        }
    }

    private static void listUsersInRoom() {
        System.out.print("Enter room name: ");
        String rname = sc.nextLine().trim();
        List<String> users = chatService.listUsers(rname);
        if (users.isEmpty()) System.out.println("No users");
        else {
            System.out.println("Users in " + rname + ":");
            users.forEach(u -> System.out.println(" - " + u));
        }
    }
}
