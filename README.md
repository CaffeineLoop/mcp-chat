# 🗨️ MCP Chat

A full-stack chat application built with **Java (backend)** and **React (frontend)**.  
The backend exposes a JSON-based HTTP API, and the frontend consumes it to provide a real-time chat experience.  

---

## ✨ Features

- **Backend (Java + HttpServer + Gson)**  
  - Lightweight HTTP server with JSON endpoints  
  - Chat service with users, rooms, messages  
  - CORS support for frontend integration  
  - API methods:  
    - `ping`  
    - `create_user`  
    - `create_room`  
    - `join_room`  
    - `leave_room`  
    - `send_message`  
    - `list_rooms`  
    - `list_users`  
    - `get_messages`  

- **Frontend (React + CSS)**  
  - Room creation & join flow  
  - User creation & user list display  
  - Chat window to send & fetch messages  
  - Fully hooked to backend  

- **Integration**  
  - Testable with Talend API Tester, Postman, or cURL  
  - Deployed locally at `http://localhost:8080/mcp`  

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
[git clone https://github.com/CaffeineLoop/mcp-chat
cd mcp-chat

2. Backend (Java)

Requirements: Java 17+, Maven/Gradle

Run the backend:

cd backend
mvn compile exec:java -Dexec.mainClass="com.mcp.chat.Main"


Server starts at:

http://localhost:8080/mcp

3. Frontend (React)

Requirements: Node.js 18+, npm

Run the frontend:

cd mcp-chat-ui
npm install
npm start


App runs at:

http://localhost:8000

🛠 Example API Requests
Ping
POST http://localhost:8000/mcp
{
  "method": "ping",
  "params": {}
}


Response:

{
  "success": true,
  "result": { "pong": true }
}

Create User
POST http://localhost:8080/mcp
{
  "method": "create_user",
  "params": { "username": "dz_ian" }
}


Response:

{
  "success": true,
  "result": { "ok": true, "username": "dz_ian" }
}

🧰 Tech Stack

Backend: Java 17, HttpServer, Gson

Frontend: React, CSS

Build Tools: Maven, npm

Testing: Talend API Tester / Postman

📚 Future Work

🔗 Add JDBC + PostgreSQL for persistent storage

👤 Add authentication & sessions


🌍 Deploy on cloud (Heroku, Render, etc.)

📜 License

MIT License – feel free to use, modify, and share.

