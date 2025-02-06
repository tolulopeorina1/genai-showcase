"use client";
import { Button } from "@heroui/button";
import { useDisclosure, Textarea, Select, SelectItem } from "@heroui/react";
import { Form, Input, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { authenticateUser, loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import CardBox from "@/app/components/places/CardBox";
import { useAppContext } from "@/app/context/StoreContext";
import {
  Cpu,
  Money,
  Box,
  DocumentText,
  UserSquare,
  User,
  CloudConnection,
  AttachCircle,
  Microphone2,
  Send2,
  TableDocument,
  Global,
  Add,
} from "iconsax-react";
import { models } from "@/app/constants/mock-data";
import FooterComponent from "@/app/components/places/Footer";

export default function MarketingContent() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };
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
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // Initialize an empty errors object
    const newErrors: Record<string, string> = {};

    // Check for missing fields and set errors for specific fields
    if (!data.email) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";

    // If there are errors, update the state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    // Clear errors if validation passes
    setErrors({});

    const payload = {
      email: data.email,
      password: data.password,
    };
    try {
      const loginUser = await loginUserApi(payload);
      if (loginUser?.data?.success) {
        setResponse({
          responseType: "success",
          responseMessage: "Login Successful",
        });
        setIsOpenRes(true);
        //route to login
      } else {
        setResponse({
          responseType: "fail",
          responseMessage: loginUser?.response?.data?.message,
        });
        setIsOpenRes(true);
      }
      if (loginUser?.data?.success) {
        navigate.push("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-[168px]",
  ];

  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200",
  ];
  const [progress, setProgress] = useState(80);

  // useEffect(() => {
  //   setProgress(value);
  // }, [value]);

  // Convert progress (0-100) to degrees (0-180)
  const progressDegrees = (progress / 100) * 180;

  const radius = 40;
  const circumference = Math.PI * radius; // ~125.6
  const progressOffset = circumference - (progress / 100) * circumference;

  // // Calculate marker position using angle
  // const angle = (progress / 100) * 180; // Converts 0-100% to 0-180 degrees
  // const markerX = 50 + radius * Math.cos((angle - 180) * (Math.PI / 180)); // X Position
  // const markerY = 50 + radius * Math.sin((angle - 180) * (Math.PI / 180)); // Y Position

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

  return (
    <>
      <div className="">
        <div className=" flex flex-wrap gap-3">
          <CardBox
            header="LLM in Amazon Bedrock: Anthropic Claude"
            children={
              <div>
                <h4 className=" text-black-slate-900 text-sm font-semibold">
                  Why:
                </h4>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Claude generates creative, brand-aligned copy for emails,
                  social media, and ads while maintaining tone consistency.
                </p>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Guardrails:
                </h4>
                <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                  <li>
                    Validate content against brand guidelines using predefined
                    style guides.
                  </li>
                  <li>
                    Add disclaimers for AI-generated content where legally
                    required.
                  </li>
                </ul>
              </div>
            }
          />

          <CardBox
            header="Use Case Specification"
            children={
              <div>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Serve 500+ SMBs in e-commerce and professional services (North
                  America & EU). Generate 10K+ monthly assets, including
                  LinkedIn ads and product descriptions.
                </p>
              </div>
            }
          />

          <CardBox
            header="Data Sources"
            children={
              <div>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                  <li>Marketing Campaign Dataset</li>
                  <li>Brand style guides (PDF/PPT)</li>
                  <li>Historical campaign performance data</li>
                </ul>
              </div>
            }
          />
          <CardBox
            header="System Name: CampaignGen Studio"
            children={
              <div>
                <p className=" font-normal text-sm text-gray-slate-600">
                  A platform that auto-generates localized content, suggests
                  visual assets, and predicts engagement metrics.
                </p>
              </div>
            }
          />
          <CardBox
            header="Architectural Diagram"
            children={
              <div>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                  <li></li>
                </ul>
              </div>
            }
          />
          <CardBox
            header="APIs to Create"
            children={
              <div>
                <h4 className=" text-black-slate-900 text-sm font-semibold">
                  Content Generation API
                </h4>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Method:
                </h4>
                <p className=" font-normal text-sm text-gray-slate-600 font-[family-name:var(--font-roboto-mono)] ">
                  POST /generate: Creates text/assets based on product specs and
                  target demographics.
                </p>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Input:
                </h4>
              </div>
            }
          />
        </div>

        <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
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
          console.log("I was clicked");
        }}
      />
    </>
  );
}

// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Button, Input } from "@heroui/react";
// import { div } from "framer-motion/client";
// import { Edit2 } from "iconsax-react";

// export default function MarketingContentGenerator2() {
//   const [prompt, setPrompt] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>(
//     []
//   );

//   const handleGenerate = async () => {
//     // if (!prompt.trim()) return;
//     setLoading(true);

//     // Append user message
//     setMessages((prev) => [...prev, { role: "user", content: "prompt" }]);

//     // Send request to backend
//     const response = await fetch("/api/prompt", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });

//     const reader = response.body?.getReader();
//     const decoder = new TextDecoder();
//     let accumulatedText = "";

//     while (reader) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       accumulatedText += decoder.decode(value, { stream: true });

//       // Update the last message progressively
//       setMessages((prev) => [
//         ...prev.slice(0, -1),
//         { role: "bot", content: accumulatedText },
//       ]);
//     }

//     setLoading(false);
//     setPrompt(""); // Clear input
//   };

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   const postData = async () => {
//     const response = await fetch("api/prompt/route", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt: "Test prompt" }),
//     });
//     const data = await response.json();
//     console.log(data);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="w-1/4 bg-gray-100 p-4 flex flex-col">
//         <h2 className="text-xl font-bold mb-4">CecureGPT</h2>
//         <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full mb-4">
//           + New Chat
//         </Button>
//         <div className="flex flex-col space-y-2">
//           <Button variant="ghost" className="text-left">
//             How to use Google
//           </Button>
//           <Button variant="ghost" className="text-left">
//             Cover letter for a job app...
//           </Button>
//           <Button variant="ghost" className="text-left">
//             What is AWS Lambda
//           </Button>
//         </div>
//         <div className="mt-auto text-gray-600 text-sm">Henry Olakunle</div>
//       </aside>

//       {/* Chat Section */}
//       <main className="w-3/4 flex flex-col">
//         <header className="bg-white p-4 shadow-md text-xl font-semibold flex gap-x-2 items-center ">
//           <span>How to use Google</span> <Edit2 size="20" color="#636C7E" />
//         </header>

//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.map((msg, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className={`flex ${msg.role === "user" ? "justify-end" : ""}`}
//             >
//               <div
//                 className={`p-4 rounded-lg shadow-md ${
//                   msg.role === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-black"
//                 } max-w-lg`}
//               >
//                 {msg.content}
//                 {msg.role === "bot" && (
//                   <div className="flex justify-between mt-2">
//                     <Button
//                       variant="ghost"
//                       onPress={() => handleCopy(msg.content)}
//                     >
//                       <div>copy</div>
//                     </Button>
//                     <Button variant="ghost" onPress={handleGenerate}>
//                       <div>refresh</div>
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Input Section */}
//         <div className="p-4 border-t flex items-center">
//           <Input
//             type="text"
//             placeholder="Ask me something you want to know"
//             className="flex-1 p-4 border rounded-lg"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//           <Button
//             className="p-4 bg-blue-500 hover:bg-blue-600 text-white"
//             onPress={handleGenerate}
//             disabled={loading}
//           >
//             {loading ? "..." : <div>send</div>}
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
//   postData;
// }
