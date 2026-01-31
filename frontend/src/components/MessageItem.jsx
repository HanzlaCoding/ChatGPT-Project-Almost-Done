import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

const MessageItem = ({ message, isLoading = false }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 w-full justify-start"
      >
        <div className="h-8 w-8 rounded-full bg-[#6c5dd3] flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-[#6c5dd3]/20">
          <Sparkles size={16} fill="currentColor" />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 rounded-bl-none shadow-sm flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-[#6c5dd3] animate-[bounce_1s_infinite_0ms]"></span>
            <span className="w-2 h-2 rounded-full bg-[#6c5dd3] animate-[bounce_1s_infinite_200ms]"></span>
            <span className="w-2 h-2 rounded-full bg-[#6c5dd3] animate-[bounce_1s_infinite_400ms]"></span>
          </div>
          <span className="text-xs text-gray-400 font-medium ml-2">
            Thinking...
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 w-full",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {message.role === "ai" && (
        <div className="h-8 w-8 rounded-full bg-[#6c5dd3] flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-[#6c5dd3]/20">
          <Sparkles size={16} fill="currentColor" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed border",
          message.role === "user"
            ? "bg-[#6c5dd3] text-white border-transparent rounded-br-none shadow-md shadow-[#6c5dd3]/20"
            : "bg-white border-gray-100 text-gray-800 rounded-bl-none shadow-sm"
        )}
      >
        <Markdown>{message.content}</Markdown>
      </div>

      {message.role === "user" && (
        <img
          src="abc.jpeg"
          alt="User"
          className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm mt-1"
        />
      )}
    </motion.div>
  );
};

export default MessageItem;
