"use client";

import { useState, useRef, useEffect } from "react";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: "user" | "bot"; jsonData?: any }>>([
    { id: 1, text: "Hello! I'm your Plant Disease Expert. Describe your plant's symptoms or condition, and I'll analyze it and provide a detailed diagnosis in JSON format.", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessageText = inputValue.trim();
      const userMessage = {
        id: messages.length + 1,
        text: userMessageText,
        sender: "user" as const,
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputValue("");
      setIsLoading(true);

      try {
        // Prepare conversation history (excluding the initial greeting)
        const conversationHistory = updatedMessages
          .filter(msg => msg.id !== 1) // Exclude initial greeting
          .map(msg => ({
            sender: msg.sender,
            text: msg.text,
          }));

        // Call Gemini API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessageText,
            conversationHistory: conversationHistory,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        const data = await response.json();
        
        const botResponse = {
          id: updatedMessages.length + 1,
          text: data.message,
          sender: "bot" as const,
          jsonData: data.jsonData || null,
        };
        
        setMessages((prev) => [...prev, botResponse]);
      } catch (error: any) {
        console.error("Chat error:", error);
        const errorMessage = {
          id: updatedMessages.length + 1,
          text: error.message || "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "bot" as const,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7faf3b] to-[#6a9331] text-white shadow-[0_8px_24px_rgba(127,175,59,0.4)] hover:shadow-[0_12px_32px_rgba(127,175,59,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Open chat"
        >
          <svg
            className="h-6 w-6 sm:h-7 sm:w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#ff8c42] border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Full Page Chat Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-[#7faf3b] to-[#6a9331] text-white shadow-md">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">Plant Disease Expert</h3>
                <p className="text-xs sm:text-sm text-white/80">Online - Disease Analysis</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
              aria-label="Close chat"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#f5f9f0] to-white space-y-4">
            <div className="max-w-4xl mx-auto w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#7faf3b] to-[#6a9331] text-white"
                        : "bg-white text-[#2d3436] border border-[#e1e8ed] shadow-sm"
                    }`}
                  >
                    {message.sender === "bot" && message.jsonData ? (
                      <div className="space-y-3">
                        <div className="border-b border-gray-200 pb-2 mb-3">
                          <h4 className="font-semibold text-lg text-[#7faf3b] mb-1">
                            {message.jsonData.diseaseName !== "Unknown" ? message.jsonData.diseaseName : "Analysis"}
                          </h4>
                          <div className="flex gap-2 text-xs">
                            <span className={`px-2 py-1 rounded ${
                              message.jsonData.confidence === "High" ? "bg-green-100 text-green-800" :
                              message.jsonData.confidence === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              Confidence: {message.jsonData.confidence}
                            </span>
                            <span className={`px-2 py-1 rounded ${
                              message.jsonData.severity === "Severe" ? "bg-red-100 text-red-800" :
                              message.jsonData.severity === "Moderate" ? "bg-orange-100 text-orange-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              Severity: {message.jsonData.severity}
                            </span>
                            <span className={`px-2 py-1 rounded ${
                              message.jsonData.urgency === "High" ? "bg-red-100 text-red-800" :
                              message.jsonData.urgency === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              Urgency: {message.jsonData.urgency}
                            </span>
                          </div>
                        </div>
                        
                        {message.jsonData.analysis && (
                          <div>
                            <h5 className="font-semibold text-sm mb-1">Analysis:</h5>
                            <p className="text-sm text-gray-700">{message.jsonData.analysis}</p>
                          </div>
                        )}
                        
                        {message.jsonData.symptoms && message.jsonData.symptoms.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-sm mb-1">Symptoms:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {message.jsonData.symptoms.map((symptom: string, idx: number) => (
                                <li key={idx}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {message.jsonData.causes && message.jsonData.causes.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-sm mb-1">Possible Causes:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {message.jsonData.causes.map((cause: string, idx: number) => (
                                <li key={idx}>{cause}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {message.jsonData.treatment && message.jsonData.treatment.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-sm mb-1 text-[#7faf3b]">Treatment:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {message.jsonData.treatment.map((treatment: string, idx: number) => (
                                <li key={idx}>{treatment}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {message.jsonData.prevention && message.jsonData.prevention.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-sm mb-1 text-[#7faf3b]">Prevention:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {message.jsonData.prevention.map((prevention: string, idx: number) => (
                                <li key={idx}>{prevention}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {message.jsonData.recommendations && (
                          <div className="bg-[#f5f9f0] p-3 rounded-lg mt-3">
                            <h5 className="font-semibold text-sm mb-1 text-[#7faf3b]">Recommendations:</h5>
                            <p className="text-sm text-gray-700">{message.jsonData.recommendations}</p>
                          </div>
                        )}
                        
                        <details className="mt-3">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View Raw JSON
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(message.jsonData, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 bg-white text-[#2d3436] border border-[#e1e8ed] shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#7faf3b] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-[#7faf3b] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-[#7faf3b] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Farm Assistant is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 border-t border-[#e1e8ed] bg-white">
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-end gap-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-black min-h-[50px] sm:min-h-[56px] max-h-32 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-[#e1e8ed] focus:outline-none focus:ring-2 focus:ring-[#7faf3b]/50 focus:border-[#7faf3b] resize-none text-sm sm:text-base"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-[50px] w-[50px] sm:h-14 sm:w-14 rounded-xl bg-gradient-to-r from-[#7faf3b] to-[#6a9331] text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                  aria-label="Send message"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

