"use client";
import { Button, useDisclosure } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { authenticateUser, loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import {
  Add,
  ArrowLeft,
  Cpu,
  PresentionChart,
  Refresh,
  User,
} from "iconsax-react";
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

  const [progress, setProgress] = useState(80);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { appState } = useAppContext();

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

  // Convert progress (0-100) to degrees (0-180)
  const progressDegrees = (progress / 100) * 180;

  const radius = 40;
  const circumference = Math.PI * radius; // ~125.6
  const progressOffset = circumference - (progress / 100) * circumference;
  const angle = (progress / 100) * 180;
  const rotationAngle = angle - 90; // Adjust for proper tangent direction
  const markerX = 50 + radius * Math.cos((angle - 180) * (Math.PI / 180));
  const markerY = 50 + radius * Math.sin((angle - 180) * (Math.PI / 180));

  const addProgress = () => {
    setProgress((prev) => prev + 10);
  };
  const [rotation, setRotation] = useState(270); // Default to left

  useEffect(() => {
    const calculateRotation = (value: number): number => {
      // Linear conversion: 0-100 → 270°-90° (180° total rotation)
      return 270 + value * 1.8;
    };
    const newRotation = calculateRotation(progress);
    setRotation(newRotation);
  }, [progress]);
  // getFinancialAdviceApi
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

            {/* <div>
              <div className=" flex justify-end mr-11">
                <div className="  bg-gray-slate-200 border border-solid border-gray-slate-100 rounded-[10px] p-2 w-fit">
                  <div className=" flex gap-x-3 items-center">
                    <h4 className=" text-black-slate-900 font-semibold text-sm">
                      Transaction_22_Jan_2024.pdf
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
                    {1000 < 1024 * 1024
                      ? `${(1000 / 1024).toFixed(2)} KB`
                      : `${(1000 / (1024 * 1024)).toFixed(2)} MB`}
                  </h4>
                </div>
              </div>
              <div className=" flex gap-x-3 justify-between my-2 items-center">
                <p className=" text-right">
                  Lorem ipsum dolor sit amet consectetur. Egestas pulvinar vel
                  massa non platea dictum adipiscing venenatis. Quis platea
                  neque purus est elementum dolor in
                </p>
                <div className=" bg-blue-slate-500 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                  <User size="20" color="#E8EAED" />
                </div>
              </div>

              <div className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4">
                <div>
                  <div className=" flex gap-x-3">
                    <div className=" bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                      <Cpu size="20" color="#E8EAED" />
                    </div>
                    <h3 className=" text-black-slate-900 font-semibold text-lg">
                      Heading
                    </h3>
                  </div>
                  <p className=" text-black-slate-900 font-normal ml-11">
                    Lorem ipsum dolor sit amet consectetur. Vitae eleifend
                    imperdiet id sed orci vestibulum augue tellus. Dictumst
                    quisque eget metus felis tortor. Augue scelerisque
                    pellentesque scelerisque dui non tincidunt pharetra.
                    Interdum tortor suspendisse facilisi laoreet interdum amet
                    sit. Lacus ac pharetra adipiscing mattis. Pharetra etiam
                    diam arcu lectus sagittis pretium lectus. Lectus elit metus
                    enim urna ultricies quis egestas gravida enim. Faucibus
                    vitae sit scelerisque vel dignissim nunc nibh eu in. Id
                    malesuada at placerat ac quis risus risus. Vulputate leo ut
                    eu elementum. Turpis eget sed varius imperdiet sem facilisi
                    dui. Faucibus sit dui arcu blandit convallis tempor ut
                    neque.
                  </p>
                </div>
              </div>
            </div> */}

            <div className=" flex items-center gap-x-2 bg-gray-slate-100 w-[130px] rounded-[4px] p-1 cursor-pointer mt-2">
              <PresentionChart size="20" color="#636C7E" />
              <span className=" font-medium text-xs text-black-slate-900">
                View dashboard
              </span>
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
        handleGenerate={() => handleGenerates(prompt)}
        value={prompt}
      />
    </>
  );
}
