"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Cpu, User } from "iconsax-react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string>(crypto.randomUUID());
  const latestAssistantMessage = useRef<string>(""); // Store assistant message to prevent duplication

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseStreamChunk = (chunk: string) => {
    try {
      const data = JSON.parse(chunk);

      if (data.error) {
        throw new Error(data.error);
      }

      return data.contentBlockDelta?.delta?.text || "";
    } catch (error) {
      console.error("Error parsing chunk:", error);
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    latestAssistantMessage.current = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          conversation_id: conversationId.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" }, // Add empty message first
      ]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const messages = buffer.split("\n\n");

        for (let i = 0; i < messages.length - 1; i++) {
          const message = messages[i].replace(/^data: /, "").trim();
          if (message) {
            const text = parseStreamChunk(message);
            if (text) {
              latestAssistantMessage.current += text;

              setMessages((prev) => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;

                if (newMessages[lastIndex]?.role === "assistant") {
                  newMessages[lastIndex] = {
                    role: "assistant",
                    content: latestAssistantMessage.current,
                  };
                }
                return newMessages;
              });
            }
          }
        }

        buffer = messages[messages.length - 1]; // Keep the last incomplete message
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${
            //@ts-ignore
            error.message || "Something went wrong. Please try again."
          }`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gray-50">
      <div className="flex-1 overflow-auto space-y-4 pb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${
              message.role === "assistant" ? "bg-white" : "bg-blue-50"
            } p-4 rounded-lg shadow-sm`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === "assistant" ? "bg-blue-100" : "bg-blue-200"
              }`}
            >
              {message.role === "assistant" ? (
                <Cpu className="w-5 h-5 text-blue-600" color="#2563eb" />
              ) : (
                <User className="w-5 h-5 text-blue-600" color="#2563eb" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1 text-gray-900">
                {message.role === "assistant" ? "AI Assistant" : "You"}
              </div>
              <div className="text-gray-700 whitespace-pre-wrap">
                {message.content ||
                  (isLoading && message.role === "assistant"
                    ? "Thinking..."
                    : "")}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 bg-white p-4 rounded-lg shadow-sm"
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
