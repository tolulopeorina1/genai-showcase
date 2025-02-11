"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { Cpu, Refresh, User } from "iconsax-react";
import { motion } from "framer-motion";
import { useAppContext } from "@/app/context/StoreContext";
import FooterComponent from "@/app/components/places/Footer";

export default function Response() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { appState } = useAppContext();
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Input search text");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

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
  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    // Wait for state update before fetching response
    await new Promise((resolve) => setTimeout(resolve, 0));

    console.log(messages); // This will still log the old state

    // Send request to backend
    const response = await fetch("/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";

    let botMessage = { role: "bot", content: "" };

    setMessages((prev) => [...prev, botMessage]); // Append an empty bot message first

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulatedText += decoder.decode(value, { stream: true });

      // Update only the last bot message without removing previous ones
      // setMessages((prev) =>
      //   prev.map((msg, index) =>
      //     index === prev.length - 1 && msg.role === "bot"
      //       ? { ...msg, content: accumulatedText }
      //       : msg
      //   )
      // );
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

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await handleGenerate(appState.forms.inputPrompt); // Call the function after 2 seconds
    }, 2000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
  }, []);
  const handleTextFn = (value: React.SetStateAction<string>) => {
    if (!value) {
      setIsInvalid(true);
      setErrorMessage("Please select a text input");
    } else {
      setIsInvalid(false);
      setErrorMessage("");
    }
    setPrompt(value);
  };

  return (
    <>
      <div className="">
        <div className=" px-4 sm:px-6">
          <div className=" my-[1rem] mx-auto max-w-[800px] p-4">
            {messages.map((message, i) => {
              if (message.role === "bot") {
                return (
                  <div key={i}>
                    <div className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4">
                      <div>
                        <div className=" flex gap-x-3">
                          <div className=" bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                            <Cpu size="20" color="#E8EAED" />
                          </div>
                          <h3 className=" text-black-slate-900 font-semibold text-lg">
                            {messages[i - 1].content}
                          </h3>
                        </div>
                        <p className=" text-black-slate-900 font-normal ml-11">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <div
                      className=" flex items-center gap-x-2 bg-gray-slate-100 w-[95px] rounded-[4px] p-1 cursor-pointer"
                      onClick={() => handleGenerate(messages[i - 1].content)}
                    >
                      <Refresh size="20" color="#636C7E" />
                      <span className=" font-medium text-xs text-black-slate-900">
                        Regenerate
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <motion.div
                    className=" flex gap-x-3 justify-end my-2 items-center"
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className=" text-right">{message.content}</p>
                    <div className=" bg-blue-slate-500 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                      <User size="20" color="#E8EAED" />
                    </div>
                  </motion.div>
                );
              }
            })}
          </div>

          <AlertComponent
            isOpenRes={isOpenRes}
            toggleNotification={toggleNotification}
            responseType={response.responseType}
            responseMessage={response.responseMessage}
          />
        </div>
      </div>

      <FooterComponent
        selectedFile={selectedFile}
        handleClear={handleClear}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleButtonClick={handleButtonClick}
        setPrompt={handleTextFn}
        loading={loading}
        handleGenerate={() => {
          if (!prompt) {
            setIsInvalid(true);
            return;
          } else {
            setLoading(true);
            setIsInvalid(false);
            handleGenerate(prompt);
          }
        }}
        value={prompt}
        acceptTypes=".txt, .xlsx, .csv"
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    </>
  );
}
