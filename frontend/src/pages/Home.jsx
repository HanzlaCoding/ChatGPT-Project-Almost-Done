import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { chatApi, messageApi } from "../api/api";
import { io } from "socket.io-client";
import NewChatModal from "@/components/NewChatModal";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON?.parse(localStorage.getItem("user") || "{}");
  const [chats, setChats] = useState(null);
  const token = JSON.parse(localStorage.getItem("token") || "{}");
  console.log("Token from Home:", token);
  const [err, setErr] = useState("")

  if (err.status == 401) {
    return <Navigate to="/login" replace />
  }

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchChats = async () => {
    await chatApi.get(
      `/getChats?userId=${user._id}`).then((res) => {
        console.log(res.data);
        setChats(res.data.chats)
      })
      .catch((err) => {
        setErr(err)
        console.log(`Some error occur: ${err}`);
      })
  };

  useEffect(() => {
    messageApi.get('/getMessages')
      .then((res) => {
        console.log(res.data);
        setMessages(res.data.messages)
      })
      .catch((err) => {
        return console.log(`Some error occur ${err.message}`);
      })
  },[])

  useEffect(() => {
    fetchChats();
  }, [chats?.length]);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    socketRef.current = io(socketUrl, {
      auth: {
        token: `token=${token}`,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected with ID:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("Connection Error:", err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket Disconnected");
      }
    };

  }, [token]); // Dependency: Jab token mile tabhi connect ho

  useEffect(() => {
    if (!socketRef.current) return;

    // Server se message aane par kya karna hai
    const handleIncomingMessage = (data) => {
      console.log("AI ka jawab aaya:", data);

      // AI ka message list mein add karein
      // Note: Backend se 'data' object aa raha hai ya string, wo check kar lein
      // Hum maan rahe hain backend { content: "...", role: "model" } bhej raha hai
      const aiMsg = {
        role: "model", // ya "ai"
        content: data.content || data // Agar object hai to .content, warna direct data
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false); // Jawab aa gaya, loading band
    };

    // Event Listener On karein
    socketRef.current.on("message", handleIncomingMessage);

    // CLEANUP: Jab component band ho, listener hata dein (Memory Leak fix)
    return () => {
      socketRef.current.off("message", handleIncomingMessage);
    };

  }, [socketRef.current]); // Dependency ensure karegi ki socket ready ho

  // 2. SENDER (Jab button click ho)
  const handleSend = async () => {
    if (!input.trim()) return;

    // A. Pehle User ka message screen par dikhao (Optimistic UI)
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    // B. Loading start karo
    setIsLoading(true);

    // C. Server ko message bhejo
    socketRef.current.emit("ai-message", {
      chatId: "695a86eb93c304f905a1306d",
      content: input
    });

    // D. Input clear karo
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans">
      <Sidebar
        user={user}
        chats={chats}
        onNewChat={() => setIsNewChatModalOpen(true)}
        onLogout={logOut}
        onNavigate={navigate}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full h-full bg-white">
        {/* Content Body */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            user={user}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
            isLoading={isLoading}
          />
        </div>
      </main>
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreate={(title) => {
          setMessages([]);
          console.log("New chat created:", title);
        }}
      />
    </div>
  );
};

export default Home;