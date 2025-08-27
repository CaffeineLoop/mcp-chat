import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Plus, Send, LogOut, UserPlus, Hash, Clock, User } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

// CSS styles
const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  
  // Login styles
  loginContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  loginBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #475569',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  loginIcon: {
    backgroundColor: '#2563eb',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  loginTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
  },
  loginSubtitle: {
    color: '#94a3b8',
  },

  // Input styles
  inputContainer: {
    position: 'relative',
    marginBottom: '16px',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '12px',
    color: '#94a3b8',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    border: '1px solid #475569',
    borderRadius: '8px',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
  },

  // Button styles
  primaryButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '500',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px',
    transition: 'background-color 0.2s',
  },
  primaryButtonHover: {
    backgroundColor: '#1d4ed8',
  },
  primaryButtonDisabled: {
    backgroundColor: '#475569',
    cursor: 'not-allowed',
  },

  // Sidebar styles
  sidebar: {
    width: '320px',
    backgroundColor: '#1e293b',
    borderRight: '1px solid #475569',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #475569',
  },
  sidebarHeaderTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  sidebarIcon: {
    backgroundColor: '#2563eb',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
  },
  sidebarSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  sidebarButtons: {
    display: 'flex',
    gap: '8px',
  },
  newRoomButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  logoutButton: {
    backgroundColor: '#475569',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },

  // Rooms list
  roomsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
  },
  roomsTitle: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  roomItem: {
    width: '100%',
    textAlign: 'left',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
    backgroundColor: 'transparent',
    transition: 'all 0.2s',
  },
  roomItemActive: {
    backgroundColor: '#2563eb',
    color: 'white',
  },
  roomItemInactive: {
    color: '#cbd5e1',
    backgroundColor: 'transparent',
  },
  roomItemHover: {
    backgroundColor: '#475569',
    color: 'white',
  },
  emptyRooms: {
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
    padding: '32px 0',
    lineHeight: '1.6',
  },

  // Main content
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  // Chat header
  chatHeader: {
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #475569',
    padding: '16px',
  },
  chatHeaderTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chatRoomTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
  },
  chatUserCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#94a3b8',
  },
  leaveRoomButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userTags: {
    marginTop: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  userTag: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
  },
  userTagCurrent: {
    backgroundColor: '#2563eb',
    color: 'white',
  },
  userTagOther: {
    backgroundColor: '#475569',
    color: '#cbd5e1',
  },

  // Messages
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#0f172a',
  },
  messagesContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  message: {
    display: 'flex',
    gap: '12px',
  },
  messageAvatar: {
    backgroundColor: '#475569',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageAvatarText: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'white',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  messageSender: {
    fontWeight: '500',
    color: 'white',
  },
  messageTime: {
    fontSize: '12px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  messageText: {
    color: '#e2e8f0',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
  },
  emptyMessages: {
    textAlign: 'center',
    padding: '48px 0',
  },
  emptyMessagesIcon: {
    color: '#475569',
    margin: '0 auto 16px',
  },
  emptyMessagesText: {
    color: '#64748b',
  },

  // Welcome screen
  welcomeScreen: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  welcomeContent: {
    textAlign: 'center',
  },
  welcomeIcon: {
    color: '#475569',
    margin: '0 auto 16px',
  },
  welcomeTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '8px',
  },
  welcomeSubtitle: {
    color: '#94a3b8',
    marginBottom: '24px',
  },
  welcomeButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '500',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Message input
  messageInputContainer: {
    backgroundColor: '#1e293b',
    borderTop: '1px solid #475569',
    padding: '16px',
  },
  messageInputWrapper: {
    display: 'flex',
    gap: '12px',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#475569',
    border: '1px solid #64748b',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    resize: 'none',
    minHeight: '48px',
    maxHeight: '120px',
  },
  sendButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#475569',
    cursor: 'not-allowed',
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
  },
  modal: {
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '16px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#475569',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },

  // Toast messages
  toast: {
    position: 'fixed',
    top: '16px',
    right: '16px',
    padding: '12px 24px',
    borderRadius: '8px',
    color: 'white',
    zIndex: 50,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  toastError: {
    backgroundColor: '#dc2626',
  },
  toastSuccess: {
    backgroundColor: '#16a34a',
  },
};

// API helper function
const callMcpApi = async (method, params = {}) => {
  try {
    const response = await fetch(`${API_BASE}/mcp`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ method, params })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle both the outer success and inner result.ok
    if (data.success) {
      // For methods that return result.ok (like create_user, join_room, etc.)
      if (data.result && typeof data.result === 'object' && 'ok' in data.result) {
        return {
          success: data.result.ok,
          result: data.result,
          error: data.result.error || null
        };
      }
      // For methods that return direct results (like list_rooms)
      return {
        success: true,
        result: data.result,
        error: null
      };
    } else {
      return {
        success: false,
        result: null,
        error: data.error || 'API call failed'
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    // Add more specific error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { 
        success: false, 
        result: null,
        error: 'Cannot connect to server. Make sure the backend is running on port 8000.' 
      };
    }
    return { 
      success: false, 
      result: null,
      error: error.message 
    };
  }
};


const MCPChatApp = () => {
  // State management
  const [currentUser, setCurrentUser] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for real-time updates
  useEffect(() => {
    if (!currentRoom || !isLoggedIn) return;

    const interval = setInterval(async () => {
      await Promise.all([
        loadMessages(),
        loadRoomUsers()
      ]);
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [currentRoom, isLoggedIn]);

  // Load functions
  const loadRooms = async () => {
    const response = await callMcpApi('list_rooms');
    if (response.success) {
      setRooms(response.result || []);
    }
  };

  const loadMessages = async () => {
    if (!currentRoom) return;
    const response = await callMcpApi('get_messages', { room: currentRoom });
    if (response.success) {
      setMessages(response.result || []);
    }
  };

  const loadRoomUsers = async () => {
    if (!currentRoom) return;
    const response = await callMcpApi('list_users', { room: currentRoom });
    if (response.success) {
      setRoomUsers(response.result || []);
    }
  };

  // Show messages
  const showMessage = (msg, type = 'error') => {
    if (type === 'error') {
      setError(msg);
      setTimeout(() => setError(''), 3000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // User actions
  const handleLogin = async () => {
    if (!newUsername.trim()) {
      showMessage('Please enter a username');
      return;
    }
    
    setLoading(true);
    const response = await callMcpApi('create_user', { username: newUsername.trim() });
    
    if (response.success) {
      setCurrentUser(newUsername.trim());
      setIsLoggedIn(true);
      setNewUsername('');
      showMessage('Logged in successfully!', 'success');
      await loadRooms();
    } else {
      showMessage(response.error || 'Failed to create user');
    }
    setLoading(false);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      showMessage('Please enter a room name');
      return;
    }

    setLoading(true);
    const response = await callMcpApi('create_room', { room: newRoomName.trim() });
    
    if (response.success) {
      showMessage('Room created successfully!', 'success');
      setNewRoomName('');
      setShowCreateRoom(false);
      await loadRooms();
    } else {
      showMessage(response.error || 'Failed to create room');
    }
    setLoading(false);
  };

  const handleJoinRoom = async (roomName) => {
    setLoading(true);
    const response = await callMcpApi('join_room', { username: currentUser, room: roomName });
    
    if (response.success) {
      setCurrentRoom(roomName);
      showMessage(`Joined room: ${roomName}`, 'success');
      await Promise.all([loadMessages(), loadRoomUsers()]);
    } else {
      showMessage(response.error || 'Failed to join room');
    }
    setLoading(false);
  };

  const handleLeaveRoom = async () => {
    setLoading(true);
    const response = await callMcpApi('leave_room', { username: currentUser });
    
    if (response.success) {
      showMessage(`Left room: ${currentRoom}`, 'success');
      setCurrentRoom('');
      setMessages([]);
      setRoomUsers([]);
    } else {
      showMessage(response.error || 'Failed to leave room');
    }
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const response = await callMcpApi('send_message', { 
      username: currentUser, 
      content: messageInput.trim() 
    });

    if (response.success) {
      setMessageInput('');
      await loadMessages();
      messageInputRef.current?.focus();
    } else {
      showMessage(response.error || 'Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentRoom) {
        handleSendMessage();
      } else {
        handleLogin();
      }
    }
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <div style={styles.loginHeader}>
            <div style={styles.loginIcon}>
              <MessageSquare size={32} color="white" />
            </div>
            <h1 style={styles.loginTitle}>MCP Chat</h1>
            <p style={styles.loginSubtitle}>Enter your username to start chatting</p>
          </div>

          <div>
            <div style={styles.inputContainer}>
              <User size={20} style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !newUsername.trim()}
              style={{
                ...styles.primaryButton,
                ...(loading || !newUsername.trim() ? styles.primaryButtonDisabled : {})
              }}
            >
              <UserPlus size={20} />
              {loading ? 'Creating User...' : 'Create User & Login'}
            </button>
          </div>

          {error && (
            <div style={{...styles.toast, ...styles.toastError, position: 'relative', top: 'auto', right: 'auto', marginTop: '16px'}}>
              {error}
            </div>
          )}

          {success && (
            <div style={{...styles.toast, ...styles.toastSuccess, position: 'relative', top: 'auto', right: 'auto', marginTop: '16px'}}>
              {success}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarHeaderTop}>
            <div style={styles.sidebarIcon}>
              <MessageSquare size={20} color="white" />
            </div>
            <div>
              <h1 style={styles.sidebarTitle}>MCP Chat</h1>
              <p style={styles.sidebarSubtitle}>@{currentUser}</p>
            </div>
          </div>

          <div style={styles.sidebarButtons}>
            <button
              onClick={() => setShowCreateRoom(true)}
              style={styles.newRoomButton}
            >
              <Plus size={16} />
              New Room
            </button>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentUser('');
                setCurrentRoom('');
                setMessages([]);
                setRoomUsers([]);
                setRooms([]);
              }}
              style={styles.logoutButton}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Rooms list */}
        <div style={styles.roomsList}>
          <h3 style={styles.roomsTitle}>ROOMS</h3>
          <div>
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => handleJoinRoom(room)}
                disabled={loading}
                style={{
                  ...styles.roomItem,
                  ...(currentRoom === room ? styles.roomItemActive : styles.roomItemInactive)
                }}
                onMouseEnter={(e) => {
                  if (currentRoom !== room) {
                    Object.assign(e.target.style, styles.roomItemHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentRoom !== room) {
                    Object.assign(e.target.style, styles.roomItemInactive);
                  }
                }}
              >
                <Hash size={16} />
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{room}</span>
              </button>
            ))}

            {rooms.length === 0 && (
              <p style={styles.emptyRooms}>
                No rooms available.<br />Create one to get started!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.mainContent}>
        {currentRoom ? (
          <>
            {/* Chat header */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderTop}>
                <div style={styles.chatHeaderLeft}>
                  <Hash size={20} color="#94a3b8" />
                  <h2 style={styles.chatRoomTitle}>{currentRoom}</h2>
                  <div style={styles.chatUserCount}>
                    <Users size={16} />
                    <span>{roomUsers.length}</span>
                  </div>
                </div>
                <button
                  onClick={handleLeaveRoom}
                  style={styles.leaveRoomButton}
                >
                  <LogOut size={16} />
                  Leave Room
                </button>
              </div>

              {roomUsers.length > 0 && (
                <div style={styles.userTags}>
                  {roomUsers.map((user) => (
                    <span
                      key={user}
                      style={{
                        ...styles.userTag,
                        ...(user === currentUser ? styles.userTagCurrent : styles.userTagOther)
                      }}
                    >
                      {user}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Messages */}
            <div style={styles.messagesContainer}>
              <div style={styles.messagesContent}>
                {messages.map((message, index) => (
                  <div key={index} style={styles.message}>
                    <div style={styles.messageAvatar}>
                      <span style={styles.messageAvatarText}>
                        {message.senderUsername.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div style={styles.messageContent}>
                      <div style={styles.messageHeader}>
                        <span style={styles.messageSender}>{message.senderUsername}</span>
                        <span style={styles.messageTime}>
                          <Clock size={12} />
                          {message.timestamp}
                        </span>
                      </div>
                      <div style={styles.messageText}>{message.content}</div>
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div style={styles.emptyMessages}>
                    <MessageSquare size={48} style={styles.emptyMessagesIcon} />
                    <p style={styles.emptyMessagesText}>No messages yet. Start the conversation!</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message input */}
            <div style={styles.messageInputContainer}>
              <div style={styles.messageInputWrapper}>
                <textarea
                  ref={messageInputRef}
                  placeholder={`Message #${currentRoom}`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows="1"
                  style={styles.messageInput}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  style={{
                    ...styles.sendButton,
                    ...(!messageInput.trim() ? styles.sendButtonDisabled : {})
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // No room selected
          <div style={styles.welcomeScreen}>
            <div style={styles.welcomeContent}>
              <Hash size={64} style={styles.welcomeIcon} />
              <h3 style={styles.welcomeTitle}>Welcome to MCP Chat!</h3>
              <p style={styles.welcomeSubtitle}>Select a room from the sidebar to start chatting</p>
              <button
                onClick={() => setShowCreateRoom(true)}
                style={styles.welcomeButton}
              >
                <Plus size={20} />
                Create Your First Room
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create room modal */}
      {showCreateRoom && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Create New Room</h3>
            <div>
              <div style={styles.inputContainer}>
                <Hash size={20} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateRoom();
                    }
                  }}
                  style={styles.input}
                  autoFocus
                />
              </div>

              <div style={styles.modalButtons}>
                <button
                  onClick={() => {
                    setShowCreateRoom(false);
                    setNewRoomName('');
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={loading || !newRoomName.trim()}
                  style={{
                    ...styles.primaryButton,
                    flex: 1,
                    ...(loading || !newRoomName.trim() ? styles.primaryButtonDisabled : {})
                  }}
                >
                  {loading ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast messages */}
      {error && (
        <div style={{...styles.toast, ...styles.toastError}}>
          {error}
        </div>
      )}

      {success && (
        <div style={{...styles.toast, ...styles.toastSuccess}}>
          {success}
        </div>
      )}
    </div>
  );
};

export default MCPChatApp;