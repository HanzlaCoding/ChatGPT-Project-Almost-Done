import React from "react";
import { Sparkles } from "lucide-react";
import MessageItem from "./MessageItem";

const ChatArea = ({ messages, isLoading, messagesEndRef, user }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pt-4 md:pt-12">
      {messages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500">
          {/* 3D Bubble Placeholder */}
          <div className="mb-8 relative">
            <div className="h-24 w-24 rounded-full bg-linear-to-br from-[#6c5dd3]/20 via-[#a5a6f6]/20 to-gray-50 blur-xl opacity-70 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-linear-to-tr from-[#6c5dd3] to-[#5b4eb8] shadow-lg shadow-[#6c5dd3]/30 flex items-center justify-center text-white">
                <Sparkles size={32} fill="currentColor" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-medium text-gray-900 mb-2 text-center tracking-tight">
            Good Morning, {user?.fullname?.firstname}
          </h1>
          <h2 className="text-3xl md:text-5xl font-heading font-medium text-gray-400 mb-12 text-center tracking-tight">
            How Can I{" "}
            <span className="text-[#6c5dd3]">Assist You Today?</span>
          </h2>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages?.map((msg, idx) => (

            < MessageItem key={idx} message={msg} />

            // {
            //   "user": "6963c82d5669504f32b69823",
            //   "chat": "695a86eb93c304f905a1306d",
            //   "content": "Okay, I've noted that you are currently learning **Express.js**. I'll keep that in mind for our future conversations!",
            //   "role": "model"
            // }
          ))}

          {isLoading && <MessageItem isLoading={true} />}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatArea;
