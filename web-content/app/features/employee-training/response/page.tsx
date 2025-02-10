"use client";
import { Button, Checkbox } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import { Add, Cpu, Refresh, User } from "iconsax-react";
import { motion } from "framer-motion";
import { useAppContext } from "@/app/context/StoreContext";
import { models } from "@/app/constants/mock-data";
import FooterComponent from "@/app/components/places/Footer";
import { endpointData } from "@/app/constants/endpointa";

export default function Response() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();
  const [modules, setModules] = useState<
    { id: string; title: string; description: string; checked: boolean }[]
  >([]);
  const [moduleId, setModuleId] = useState("module-1");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { appState } = useAppContext();
  const [modulesArray, setModulesArray] = useState<
    { id: string; title: string; description: string; checked: boolean }[]
  >([]);

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

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [checked, setChecked] = useState(false);

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    await new Promise((resolve) => setTimeout(resolve, 0)); // Ensure state update

    // Send request to backend
    const response = await fetch(endpointData.aiTutorPost, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";

    let botMessage = { role: "bot", content: "" };

    // Append an empty bot message first
    setMessages((prev) => [...prev, botMessage]);

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode streamed chunk
      const chunk = decoder.decode(value, { stream: true });

      // Parse JSON response chunk (assuming streaming JSON format)
      try {
        const json = JSON.parse(chunk);
        if (json.response) {
          const text = json.response;

          for (let i = 0; i < text.length; i++) {
            accumulatedText += text[i]; // Add one character at a time

            // Smooth typing effect update
            await new Promise((resolve) => setTimeout(resolve, 30)); // Adjust speed here

            setMessages((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1 && msg.role === "bot"
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            );
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    setLoading(false);
    setPrompt(""); // Clear input
  };

  const getResponse = async () => {
    setLoading(true);

    try {
      const response = await fetch(endpointData.aiTutorGet);
      const text = await response.text(); // Read response as text
      const jsonData = JSON.parse(text); // Parse stringified JSON
      console.log(typeof jsonData?.body);
      const modulesArray =
        typeof jsonData.body === "string"
          ? JSON.parse(jsonData.body)
          : jsonData.body;

      setModules(modulesArray);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getResponse();
    }, 1000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
  }, []);

  return (
    <>
      <div className="">
        <div className=" px-4 sm:px-6">
          <div className=" my-[1rem] mx-auto max-w-[800px] p-4">
            {modules.length > 0 && (
              <motion.div
                className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className=" w-full">
                  <div className=" flex gap-x-3">
                    <div className=" bg-black-slate-800 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                      <Cpu size="20" color="#E8EAED" />
                    </div>
                    <h3 className=" text-black-slate-900 font-semibold text-lg">
                      Let&rsquo;s Learn
                    </h3>
                  </div>

                  {modules.map((module, i) => (
                    <div
                      className=" flex items-center justify-between my-3"
                      key={module.id}
                    >
                      <div className=" flex items-center gap-x-3">
                        <div className=" bg-[#D7DADF] text-black-slate-900 rounded flex items-center justify-center w-7 h-7">
                          <span className=" font-semibold">{i + 1}</span>
                        </div>
                        <p
                          className={` font-normal ${
                            module.id === moduleId && " line-through"
                          }`}
                        >
                          {module.title}
                        </p>
                      </div>

                      <div>
                        <Checkbox
                          onValueChange={(e) => {
                            if (e) {
                              setModuleId(module.id);
                              handleGenerate(modules[i].description);
                            } else {
                              setModuleId("");
                            }
                          }}
                          isSelected={moduleId === module.id}
                        ></Checkbox>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {messages.map((message, i) => {
              if (message.role === "bot") {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4">
                      <div>
                        <div className=" flex gap-x-3">
                          <div className=" bg-black-slate-800 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
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
                  </motion.div>
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
        setPrompt={setPrompt}
        handleGenerate={() => {
          setLoading(true);
          handleGenerate(prompt);
        }}
        value={prompt}
        loading={loading}
      />
    </>
  );
}
