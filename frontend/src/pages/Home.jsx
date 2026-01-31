import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { chatApi, messageApi } from "../api/api";
import { io } from "socket.io-client";
import NewChatModal from "@/components/NewChatModal";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import { Menu } from "lucide-react";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON?.parse(localStorage.getItem("user") || "{}");
  const [chats, setChats] = useState(null);
  const token = JSON.parse(localStorage.getItem("token") || "{}");

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

        setChats(res.data.chats)
      })
      .catch((err) => {
        setErr(err)

      })
  };

  useEffect(() => {
    messageApi.get('/getMessages')
      .then((res) => {

        setMessages(res.data.messages)
      })
      .catch((err) => {
        return;
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

    });

    socketRef.current.on("connect_error", (err) => {

    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();

      }
    };

  }, [token]); // Dependency: Jab token mile tabhi connect ho

  useEffect(() => {
    if (!socketRef.current) return;

    // Server se message aane par kya karna hai
    const handleIncomingMessage = (data) => {


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
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full h-full bg-white">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <span className="font-heading font-bold text-lg text-gray-900">Nexus</span>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
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

        }}
      />
    </div>
  );
};

export default Home;