import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import { Add, Cpu, User } from "iconsax-react";
import Image from "next/image";
import FooterComponent from "./Footer";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import thinking from "@/public/images/svgs/bot.svg";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const firstPromptsArray = [
  "Automated Fraud Detection and Prevention",
  "Financial Advice and Wealth Management",
  "Content Generation for Marketing Campaigns",
  "AI-Driven Compliance and Risk Management",
];

export default function ChatBotComponent({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [showFirstPrompts, setShowFirstPrompts] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string>(crypto.randomUUID());
  const latestAssistantMessage = useRef<string>("");
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFirstPrompts = async (prompt: string) => {
    setInput(prompt);
    await handleSubmit(prompt);
  };

  const parseStreamChunk = (chunk: string) => {
    try {
      // Remove any prefix that might be present
      const jsonStr = chunk.replace(/^data:\s*/, '').trim();
      if (!jsonStr) return "";

      const data = JSON.parse(jsonStr);
      return data.contentBlockDelta?.delta?.text || "";
    } catch (error) {
      console.error("Error parsing chunk:", error);
      return "";
    }
  };

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setShowFirstPrompts(false);
    const userMessage = prompt.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Reset assistant message
    latestAssistantMessage.current = "";
    
    try {
      // Add empty assistant message immediately
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({
          prompt: userMessage,
          conversation_id: conversationId.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and add it to our buffer
        buffer += decoder.decode(value, { stream: true });

        // Split on double newlines to separate events
        const lines = buffer.split('\n\n');
        
        // Process all complete messages
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line) {
            const text = parseStreamChunk(line);
            if (text) {
              latestAssistantMessage.current += text;
              
              setMessages(prev => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                
                if (lastIndex >= 0 && newMessages[lastIndex].role === "assistant") {
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

        // Keep the last incomplete message in the buffer
        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Something went wrong. Please try again."}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="lg"
      className="rounded-none"
      hideCloseButton
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1 border-b-gray-slate-300 border border-solid bg-blue-slate-250">
              <div className="flex justify-between" onClick={onClose}>
                <h4 className="text-black-slate-900 text-sm font-semibold">
                  CIL Gen-AI Chat bot
                </h4>
                <span className="rotate-45 cursor-pointer">
                  <Add size="20" color="#636C7E" />
                </span>
              </div>
            </DrawerHeader>
            <DrawerBody>
              <div className="flex flex-col h-full max-w-[420px]">
                {showFirstPrompts && (
                  <div className="flex flex-col justify-between h-full">
                    <div className="text-black-slate-900">
                      <h3 className="font-normal text-4xl">Hi there!</h3>
                      <h3 className="text-[32px] font-bold">
                        Get started with what you need to know
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {firstPromptsArray.map((prompt) => (
                        <div
                          className="bg-[#F6F9FE] rounded-[7px] border border-solid border-[#C4D9F3] p-2 font-medium text-xs cursor-pointer"
                          key={prompt}
                          onClick={() => handleFirstPrompts(prompt)}
                        >
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message, i) => (
                  message.role === "assistant" ? (
                    <div
                      key={i}
                      className="max-w-[420px]"
                      ref={messagesEndRef}
                    >
                      <div className="my-2 bg-blue-slate-250 rounded-lg p-4 overflow-x-hidden">
                        <div>
                          <div className="flex gap-x-3">
                            <div className="bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                              <Cpu size="20" color="#E8EAED" />
                            </div>
                            <h3 className="text-black-slate-900 font-semibold text-lg">
                              {messages[i - 1]?.content}
                            </h3>
                          </div>
                          <p className="text-black-slate-900 font-normal ml-11">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex gap-x-3 justify-end my-2 items-center"
                      key={i}
                    >
                      <p className="text-right">{message.content}</p>
                      <div className="bg-blue-slate-500 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                        <User size="20" color="#E8EAED" />
                      </div>
                    </div>
                  )
                ))}
              </div>
              {loading && (
                <Image src={thinking} alt="logo" width={38} height={38} />
              )}
            </DrawerBody>
            <DrawerFooter className="block">
              <FooterComponent
                selectedFile={selectedFile}
                handleClear={handleClear}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                handleButtonClick={handleButtonClick}
                setPrompt={setInput}
                handleGenerate={() => handleSubmit(input)}
                value={input}
                loading={loading}
                notFixedPosition
              />
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}