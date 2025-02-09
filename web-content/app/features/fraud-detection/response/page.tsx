"use client";
import { Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";

import { Add, Cpu, PresentionChart, User } from "iconsax-react";
import FooterComponent from "@/app/components/places/Footer";
import { endpointData } from "@/app/constants/endpointa";
import Speedometer from "@/app/components/places/Speedometer";

export default function Response() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    {
      role: string;
      name: string;
      size: number;
      description: string;
      flags: string[];
      fraud_score: number;
      reason: string;
      status: string;
      statusCode: number;
    }[]
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

  const calculateRotation = (value: number): number => {
    // Linear conversion: 0-100 → 270°-90° (180° total rotation)
    return 270 + value * 1.8;
  };

  // useEffect(() => {
  //   if (!selectedFile) {
  //     setIsInvalid(true);
  //   } else {
  //     setIsInvalid(false);
  //   }
  // }, [selectedFile]);

  const uploadFile = async (file: File, description: string) => {
    try {
      // Convert file to base64
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64String = (reader.result as string).split(",")[1]; // Remove prefix
            resolve(base64String);
          };
          reader.onerror = (error) => reject(error);
        });

      const fileBase64 = await toBase64(file);

      // Add user message before request
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          name: file.name,
          size: file.size,
          description,
          status: "",
          statusCode: 200,
          flags: ["none"],
          reason: "",
          fraud_score: 20,
        },
      ]);

      // Send request to backend
      const response = await fetch(endpointData.newFraudDetection, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          file_name: file.name,
          file_content: fileBase64,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let streamedReason = "";

      // Add a "bot" response placeholder
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          name: file.name,
          size: file.size,
          description: "",
          status: "",
          statusCode: 200,
          flags: ["none"],
          reason: "",
          fraud_score: 20,
        }, // Placeholder
      ]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulatedText += decoder.decode(value, { stream: true });

        try {
          // Try parsing JSON progressively
          const json = JSON.parse(accumulatedText);
          const body = json?.body || {};
          const newBody = JSON.parse(body);
          // Extract all required fields
          const updatedData = {
            statusCode: json?.statusCode ?? null,
            fraud_score: newBody?.fraud_score ?? null,
            status: newBody?.status ?? "",
            flags: newBody?.flags ?? [],
            reason: newBody?.reason ?? "No reason provided",
          };
          console.log(typeof newBody);

          // Stream the "reason" field letter by letter for a typing effect
          const targetReason = updatedData.reason;
          if (streamedReason.length < targetReason.length) {
            for (let i = streamedReason.length; i < targetReason.length; i++) {
              setTimeout(() => {
                streamedReason += targetReason[i]; // Append each character
                setMessages((prev) =>
                  prev.map((msg, index) =>
                    index === prev.length - 1 && msg.role === "bot"
                      ? { ...msg, reason: streamedReason }
                      : msg
                  )
                );
              }, i * 20); // Adjust typing speed (50ms per character)
            }
          }

          // Update all fields except "reason" instantly
          setMessages((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1 && msg.role === "bot"
                ? { ...msg, ...updatedData, reason: streamedReason }
                : msg
            )
          );
        } catch (error) {
          // Ignore errors until JSON is fully parsed
        }
      }
    } catch (error) {
      console.error("Upload Error:", error);
    }
    setLoading(false);
    setPrompt("");
    handleClear();
  };

  return (
    <>
      <div className="">
        <div className=" px-4 sm:px-6">
          <div className=" my-[1rem] mx-auto max-w-[800px] p-4">
            <div>
              {messages.map((message, i) => {
                if (message.role === "user") {
                  return (
                    <div key={i}>
                      <div className=" flex justify-end mr-11">
                        <div className="  bg-gray-slate-200 border border-solid border-gray-slate-100 rounded-[10px] p-2 w-fit">
                          <div className=" flex gap-x-3 items-center">
                            <h4 className=" text-black-slate-900 font-semibold text-sm">
                              {message.name}
                            </h4>

                            <Button
                              onPress={() => {}}
                              color="primary"
                              variant="shadow"
                              className=" bg-transparent shadow-none text-blue-slate-600 font-medium px-0 min-w-4 h-full"
                            >
                              <span className=" rotate-45">
                                <Add size="20" color="#636C7E" />
                              </span>
                            </Button>
                          </div>
                          <h4 className=" text-gray-slate-500 text-sm font-medium mt-2">
                            {message.size < 1024 * 1024
                              ? `${(message.size / 1024).toFixed(2)} KB`
                              : `${(message.size / (1024 * 1024)).toFixed(
                                  2
                                )} MB`}
                          </h4>
                        </div>
                      </div>

                      <div className=" flex gap-x-3 justify-between my-2 items-center">
                        <p className=" text-right">{message.description}</p>
                        <div className=" bg-blue-slate-500 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                          <User size="20" color="#E8EAED" />
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4"
                      key={i}
                    >
                      <div className=" bg-black-slate-800 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                        <Cpu size="20" color="#E8EAED" />
                      </div>
                      <div>
                        <Speedometer
                          calculateRotation={() =>
                            calculateRotation(message.fraud_score)
                          }
                          arrayItem={message}
                        />
                        <p className=" mt-5  text-black-slate-700 font-normal text-sm">
                          {message.reason}
                        </p>
                        {message.flags.length > 1 &&
                          message.flags.map((item) => (
                            <ul
                              className=" list-disc text-black-slate-700 font-normal text-sm my-2"
                              key={item}
                            >
                              <li>{item}</li>
                            </ul>
                          ))}
                        <div className=" flex items-center gap-x-2 bg-gray-slate-100 w-[130px] rounded-[4px] p-1 cursor-pointer mt-2">
                          <PresentionChart size="20" color="#636C7E" />
                          <span className=" font-medium text-xs text-black-slate-900">
                            View dashboard
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
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
          if (!selectedFile) {
            setIsInvalid(true);
            return;
          } else {
            setIsInvalid(false);
            uploadFile(selectedFile as File, prompt);
          }
        }}
        value={prompt}
        acceptTypes=".txt, .xlsx, .csv"
        errorMessage={"Please select a .txt .xlsx .csv file types"}
        isInvalid={isInvalid}
      />
    </>
  );
}
