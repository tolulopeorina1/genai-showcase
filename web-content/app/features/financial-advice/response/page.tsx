"use client";
import { Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { usePathname, useRouter } from "next/navigation";
import { Cpu, PresentionChart, User } from "iconsax-react";
import { endpointData } from "@/app/constants/endpointa";
import FooterComponent from "@/app/components/places/Footer";
import { useAppContext } from "@/app/context/StoreContext";

export default function Response() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();

  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { appState } = useAppContext();
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Input search text");
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await handleGenerates(appState.forms.inputPrompt); // Call the function after 2 seconds
    }, 2000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
  }, []);

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

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    // Wait for state update before fetching response
    await new Promise((resolve) => setTimeout(resolve, 0));
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

    // const fileBase64 = await toBase64(file as File);

    const bodypayload = {
      body: {
        prompt: prompt,
        // document: {
        //   filename: selectedFile?.name,
        //   file: fileBase64,
        //   mimetype: "text/plain",
        // },
      },
    };

    // Send request to backend
    const response = await fetch(endpointData.financialAdvisor, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodypayload),
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
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.role === "bot"
            ? { ...msg, content: accumulatedText }
            : msg
        )
      );
    }

    setLoading(false);
    setPrompt(""); // Clear input
  };

  const handleGenerates = async (prompt: string) => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    // Send request to backend
    const response = await fetch(endpointData.financialAdvisor, {
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

      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;

      try {
        // Attempt to parse the JSON from the accumulated text
        const parsed = JSON.parse(accumulatedText);

        if (parsed?.advice) {
          let newText = parsed.advice
            .map((item: { type: string; text: string }) => item.text)
            .join("\n\n");

          setMessages((prev) => [
            ...prev.slice(0, -1), // Remove the last bot message
            { role: "bot", content: newText }, // Append updated bot message
          ]);
        }
      } catch (error) {
        // JSON is incomplete, keep accumulating
      }
    }
    console.log(messages);

    setLoading(false);
    setPrompt(""); // Clear input
  };
  const pathname = usePathname();
  const handleTextFn = (value: React.SetStateAction<string>) => {
    if (!value) {
      setIsInvalid(true);
      setErrorMessage("Please select a .txt, .csv or .xlsx file to proceed");
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
                    {/* <div
                      className=" flex items-center gap-x-2 bg-gray-slate-100 w-[95px] rounded-[4px] p-1 cursor-pointer"
                      onClick={() => handleGenerate(messages[i - 1].content)}
                    >
                      <Refresh size="20" color="#636C7E" />
                      <span className=" font-medium text-xs text-black-slate-900">
                        Regenerate
                      </span>
                    </div> */}
                  </div>
                );
              } else {
                return (
                  <div
                    className=" flex gap-x-3 justify-end my-2 items-center"
                    key={i}
                  >
                    <p className=" text-right">{message.content}</p>
                    <div className=" bg-blue-slate-500 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                      <User size="20" color="#E8EAED" />
                    </div>
                  </div>
                );
              }
            })}
            <div
              className=" flex items-center gap-x-2 bg-gray-slate-100 w-fit rounded-[4px] p-1 cursor-pointer mt-2"
              onClick={() => {
                setLoading(true);
                navigate.push(`${pathname}/dashboard`);
              }}
            >
              <span className=" font-medium text-xs text-black-slate-900">
                {loading ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  <PresentionChart size="20" color="#636C7E" />
                )}
              </span>
              <span className=" w-fit text-xs font-medium">View dashboard</span>
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
        setPrompt={handleTextFn}
        loading={loading}
        handleGenerate={() => {
          if (!selectedFile) {
            setIsInvalid(true);
            return;
          } else {
            setLoading(true);
            setIsInvalid(false);
            handleGenerates(prompt);
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
