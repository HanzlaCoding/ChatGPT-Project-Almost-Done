import React, { useRef } from "react";
import { Sparkles, Send, Zap, Image as ImageIcon, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const ActionButton = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
    {icon} {label}
  </button>
);

const ChatInput = ({ input, setInput, handleSend, handleKeyDown, isLoading }) => {
  const textareaRef = useRef();

  const handleTextareaHeight = () => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  return (
    <div className="p-4 md:p-8 pt-0 z-10 bg-gradient-to-t from-white via-white to-transparent">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-2 relative transition-all focus-within:shadow-[0_8px_40px_-12px_rgba(108,93,211,0.2)] focus-within:border-[#6c5dd3]/40">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Initiate a query or send a command to the AI..."
            className="w-full h-8 md:h-12 resize-none rounded-2xl bg-transparent p-4 pl-10 text-base text-gray-900 outline-none placeholder:text-gray-400 custom-scrollbar"
            style={{
              height: "auto",
              minHeight: "36px",
              maxHeight: "102px",
            }}
          />
          <Sparkles
            size={16}
            className="text-[#6c5dd3] absolute top-5 left-4"
          />
        </div>

        <div className="flex items-center justify-between px-2 pb-2 mt-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <ActionButton icon={<Zap size={14} />} label="Reasoning" />
            <ActionButton
              icon={<ImageIcon size={14} />}
              label="Create Image"
            />
            <ActionButton
              icon={<Globe size={14} />}
              label="Deep Research"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#6c5dd3] text-white shadow-lg shadow-[#6c5dd3]/20 hover:bg-[#5b4eb8] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className={cn(isLoading && "opacity-0")} />
            {isLoading && (
              <div className="absolute animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
