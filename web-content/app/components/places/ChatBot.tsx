"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Use a ref for the scroll-to-bottom element.
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Unique conversation id.
  const conversationId = useRef<string>(crypto.randomUUID());
  // This ref accumulates the assistant message so far.
  const latestAssistantMessage = useRef<string>("");

  // Scroll to the bottom of the messages list whenever it updates.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Trigger file input.
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Called when one of the first-prompt options is clicked.
  const handleFirstPrompts = async (prompt: string) => {
    setInput(prompt);
    // Allow state to update
    await new Promise((resolve) => setTimeout(resolve, 0));
    await handleSubmit(prompt);
  };

  // Helper to parse each streamed chunk.
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

  // Main handler that sends the prompt and streams the response.
  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setShowFirstPrompts(false);

    const userMessage = prompt.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
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

      // Append an empty assistant message to be updated as chunks stream in.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      // Read the streamed response.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the new chunk and add to the buffer.
        buffer += decoder.decode(value, { stream: true });
        // Split the buffer on double newlines (each complete message chunk).
        const parts = buffer.split("\n\n");

        // Process each complete chunk.
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i].replace(/^data: /, "").trim();
          if (part) {
            const text = parseStreamChunk(part);
            if (text) {
              latestAssistantMessage.current += text;
              // Update the last assistant message.
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

        // Keep the last (possibly incomplete) part in the buffer.
        buffer = parts[parts.length - 1];
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${
            error instanceof Error ? error.message : "Something went wrong. Please try again."
          }`,
        },
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
        {(onClose: () => void) => (
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
                {showFirstPrompts ? (
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
                          key={prompt}
                          className="bg-[#F6F9FE] rounded-[7px] border border-solid border-[#C4D9F3] p-2 font-medium text-xs cursor-pointer"
                          onClick={() => handleFirstPrompts(prompt)}
                        >
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Render chat messages once a conversation has started.
                  <div className="flex flex-col space-y-2">
                    {messages.map((message, i) =>
                      message.role === "assistant" ? (
                        <div key={i} className="max-w-[420px]">
                          <div className="my-2 bg-blue-slate-250 rounded-lg p-4 overflow-x-hidden">
                            <div>
                              <div className="flex gap-x-3">
                                <div className="bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                                  <Cpu size="20" color="#E8EAED" />
                                </div>
                                {/* Optionally show the previous user message as a header */}
                                <h3 className="text-black-slate-900 font-semibold text-lg">
                                  {messages[i - 1]?.content || "AI Assistant"}
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
                          key={i}
                          className="flex gap-x-3 justify-end my-2 items-center"
                        >
                          <p className="text-right">{message.content}</p>
                          <div className="bg-blue-slate-500 rounded-full w-8 h-8 flex justify-center items-center">
                            <User size="20" color="#E8EAED" />
                          </div>
                        </div>
                      )
                    )}
                    {/* This dummy div is used as the scrolling target */}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              {loading && (
                <div className="flex justify-center mt-2">
                  <Image src={thinking} alt="loading" width={38} height={38} />
                </div>
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
                handleGenerate={() => {
                  handleSubmit(input);
                }}
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
