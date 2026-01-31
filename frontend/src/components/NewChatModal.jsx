import React, { useState } from "react";
import { X, MessageSquarePlus, Sparkles, Loader2, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatApi } from "../api/api";

const NewChatModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(""); // <--- New Error State

  // Safe parsing of user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setError(""); // Reset error before request

    try {
      const res = await chatApi.post("/create", {
        user: user?._id,
        title: title,
      });

      console.log(res.data);
      
      // 1. Show Success State
      setIsSuccess(true);
      
      // 2. Pass data back to parent
      if (onCreate) onCreate(res.data);

      // 3. Wait 1.5 seconds, then close and reset
      setTimeout(() => {
        onClose();
        // Reset state after modal closes visually
        setTimeout(() => {
          setTitle("");
          setIsSuccess(false);
          setIsLoading(false);
          setError("");
        }, 300);
      }, 1500);

    } catch (err) {
      console.error(err);
      // 4. Set Error Message from Backend or Default
      setError(
        err.response?.data?.message || 
        "Failed to create chat. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden pointer-events-auto ring-1 ring-black/5"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  /* --- SUCCESS STATE UI --- */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <Check size={40} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Success!
                    </h3>
                    <p className="text-gray-500">
                      New chat "{title}" created.
                    </p>
                  </motion.div>
                ) : (
                  /* --- FORM STATE UI --- */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="relative p-6 pb-0">
                      <div className="absolute top-0 right-0 p-4">
                        <button
                          onClick={onClose}
                          disabled={isLoading}
                          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#6c5dd3]/10 flex items-center justify-center text-[#6c5dd3] mb-4">
                        <MessageSquarePlus size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        New Chat
                      </h2>
                      <p className="text-gray-500 mt-1 text-sm">
                        Give your new conversation a topic or title to get started.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 pt-6">
                      <div className="space-y-4">
                        
                        {/* ERROR ALERT BOX */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 overflow-hidden"
                            >
                              <AlertCircle size={16} className="shrink-0" />
                              <span>{error}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="relative">
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                              setTitle(e.target.value);
                              if (error) setError(""); // Clear error when typing
                            }}
                            placeholder="e.g., Code Debugging, Creative Writing..."
                            disabled={isLoading}
                            className={`w-full p-4 pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-medium placeholder:text-gray-400 placeholder:font-normal disabled:opacity-70 disabled:cursor-not-allowed
                              ${error 
                                ? "focus:border-red-500 focus:ring-red-500/10 border-red-200" 
                                : "focus:border-[#6c5dd3] focus:ring-[#6c5dd3]/10"
                              }
                            `}
                            autoFocus
                          />
                          <Sparkles
                            size={18}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? "text-red-400" : "text-gray-400"}`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button
                          type="button"
                          onClick={onClose}
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!title.trim() || isLoading}
                          className="flex-1 py-3 px-4 bg-[#6c5dd3] hover:bg-[#5b4eb8] text-white font-medium rounded-xl shadow-lg shadow-[#6c5dd3]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Chat"
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewChatModal;