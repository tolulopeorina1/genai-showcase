"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { div } from "framer-motion/client";
import { Edit2 } from "iconsax-react";

export default function MarketingContentGenerator2() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const handleGenerate = async () => {
    // if (!prompt.trim()) return;
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: "prompt" }]);

    // Send request to backend
    const response = await fetch("/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulatedText += decoder.decode(value, { stream: true });

      // Update the last message progressively
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: accumulatedText },
      ]);
    }

    setLoading(false);
    setPrompt(""); // Clear input
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const postData = async () => {
    const response = await fetch("api/prompt/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Test prompt" }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-100 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">CecureGPT</h2>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full mb-4">
          + New Chat
        </Button>
        <div className="flex flex-col space-y-2">
          <Button variant="ghost" className="text-left">
            How to use Google
          </Button>
          <Button variant="ghost" className="text-left">
            Cover letter for a job app...
          </Button>
          <Button variant="ghost" className="text-left">
            What is AWS Lambda
          </Button>
        </div>
        <div className="mt-auto text-gray-600 text-sm">Henry Olakunle</div>
      </aside>

      {/* Chat Section */}
      <main className="w-3/4 flex flex-col">
        <header className="bg-white p-4 shadow-md text-xl font-semibold flex gap-x-2 items-center ">
          <span>How to use Google</span> <Edit2 size="20" color="#636C7E" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`flex ${msg.role === "user" ? "justify-end" : ""}`}
            >
              <div
                className={`p-4 rounded-lg shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } max-w-lg`}
              >
                {msg.content}
                {msg.role === "bot" && (
                  <div className="flex justify-between mt-2">
                    <Button
                      variant="ghost"
                      onPress={() => handleCopy(msg.content)}
                    >
                      <div>copy</div>
                    </Button>
                    <Button variant="ghost" onPress={handleGenerate}>
                      <div>refresh</div>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 border-t flex items-center">
          <Input
            type="text"
            placeholder="Ask me something you want to know"
            className="flex-1 p-4 border rounded-lg"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            className="p-4 bg-blue-500 hover:bg-blue-600 text-white"
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? "..." : <div>send</div>}
          </Button>
        </div>
      </main>
    </div>
  );
}
