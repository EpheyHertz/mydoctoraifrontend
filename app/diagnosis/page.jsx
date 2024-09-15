'use client';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import ProtectedRoute from '../components/ProtectedRoute';

export default function DiagnosisPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Current chat messages
  const [chatList, setChatList] = useState([]); // List of previous chats
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [chatId, setChatId] = useState(null); // Selected chat ID

  useEffect(() => {
    const storedChatId = localStorage.getItem('chat_id');
    if (storedChatId) {
      setChatId(storedChatId);
      fetchChatMessages(storedChatId); // Fetch messages for stored chat_id
    }

    fetchChatList(); // Fetch list of all previous chats on load
  }, []);

  // Fetch the list of chats from the backend
  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chatbot', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setChatList(data); // Update the chat list
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  };

  // Fetch messages for a selected chat
  const fetchChatMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/apis/user/chats/${chatId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Set content type
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch chat messages');
      }
  
      const data = await res.json(); // Use .json() to parse the response body
  
      // console.log(data); // To verify the data structure
      setChatHistory(data.messages); // Set chat history for the selected chat (already a list of messages)
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };
  
  // Function to render Markdown safely
  const renderMarkdown = (text) => {
    try {
      // Convert Markdown text to HTML
      const dirtyHTML = marked(text);
      
      // Sanitize the HTML to remove any potential XSS vulnerabilities
      const cleanHTML = DOMPurify.sanitize(dirtyHTML);
      
      // Return the sanitized HTML
      return { __html: cleanHTML };
    } catch (error) {
      console.error('Error rendering Markdown:', error);
      return { __html: '' }; // Return empty HTML in case of an error
    }
  };

  // Handle copying text to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const userMessage = { sender: 'user', message: message };

    setChatHistory([...chatHistory, userMessage]);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message, chat_id: chatId }), // Include chat_id
      });
      const data = await res.json();

      if (data.message) {
        setChatHistory((prev) => [...prev, { sender: 'bot', message: data.message }]);
        if (data.chat_id && !chatId) {
          setChatId(data.chat_id);
          localStorage.setItem('chat_id', data.chat_id);
        }
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', message: 'An error occurred. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle chat selection from the chat list
  const selectChat = (selectedChatId) => {
    setChatId(selectedChatId);
    localStorage.setItem('chat_id', selectedChatId);
    fetchChatMessages(selectedChatId); // Fetch and display messages for the selected chat
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-lg flex flex-col lg:flex-row">
          {/* Chat List Section */}
          <div className="lg:w-1/4 border-r pr-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Chats</h2>
            <ul className="space-y-4">
  {Array.isArray(chatList) && chatList.length === 0 ? (
    <p className="text-gray-500">No chats available</p>
  ) : (
    Array.isArray(chatList) ? (
      chatList.map((chat) => (
        <li
          key={chat.id}
          className={`p-4 bg-gray-200 rounded-lg cursor-pointer ${
            chatId === chat.id ? 'bg-blue-200' : ''
          }`}
          onClick={() => selectChat(chat.id)}
        >
          Chat with {chat.sender ? chat.doctor.name : 'Doctor AI'}
          <span className="block text-xs text-gray-600">
            Last updated: {new Date(chat.updated_at).toLocaleString()}
          </span>
        </li>
      ))
    ) : (
      <p className="text-red-500">Unable to load chats</p>
    )
  )}
</ul>

          </div>

          {/* Chat Conversation Section */}
          <div className="lg:w-3/4 lg:pl-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Conversation</h2>
            <div className="h-[400px] overflow-y-scroll mb-6 p-6 border border-gray-300 rounded-lg bg-gray-50">
              {chatHistory.length === 0 && (
                <p className="text-gray-500">No messages yet. Start a conversation!</p>
              )}
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded-md ${
                    chat.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  <strong>{chat.sender === 'user' ? 'You' : 'Doctor AI'}: </strong>
                  <span dangerouslySetInnerHTML={renderMarkdown(chat.message)} />
                  {chat.sender !== 'user' && (
                    <button
                      onClick={() => copyToClipboard(chat.message, index)}
                      className="ml-4 text-sm text-gray-500 hover:underline flex items-center"
                    >
                      {copiedIndex === index ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1 text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4M15 13v6.75a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V13.75M15 12V6.75a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75V12"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type your symptoms..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <button
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={sendMessage}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
