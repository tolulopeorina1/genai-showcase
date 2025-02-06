"use client";
import {
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import {
  Add,
  ArrowLeft,
  AttachCircle,
  Cpu,
  Global,
  Microphone2,
  Refresh,
  Send2,
  User,
} from "iconsax-react";
import { motion } from "framer-motion";
import { useAppContext } from "@/app/context/StoreContext";
import { models } from "@/app/constants/mock-data";
import FooterComponent from "@/app/components/places/Footer";

export default function Response() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  const { appState } = useAppContext();
  const { inputPrompt } = appState.forms;
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

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  console.log(messages, prompt);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
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

  // const postData = async () => {
  //   const response = await fetch("api/prompt/route", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ prompt: prompt }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // };

  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-[168px]",
  ];
  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200",
  ];
  return (
    <>
      <div className="">
        <div className=" px-4 sm:px-6">
          <div className=" my-[1rem] mx-auto max-w-[800px] p-4">
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
                massa non platea dictum adipiscing venenatis. Quis platea neque
                purus est elementum dolor in
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
                  pellentesque scelerisque dui non tincidunt pharetra. Interdum
                  tortor suspendisse facilisi laoreet interdum amet sit. Lacus
                  ac pharetra adipiscing mattis. Pharetra etiam diam arcu lectus
                  sagittis pretium lectus. Lectus elit metus enim urna ultricies
                  quis egestas gravida enim. Faucibus vitae sit scelerisque vel
                  dignissim nunc nibh eu in. Id malesuada at placerat ac quis
                  risus risus. Vulputate leo ut eu elementum. Turpis eget sed
                  varius imperdiet sem facilisi dui. Faucibus sit dui arcu
                  blandit convallis tempor ut neque.
                </p>

                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : ""
                    }`}
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

              {/* <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : ""
                    }`}
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
              </div> */}
            </div>
          </div>

          <div className="  mx-auto max-w-[718px] ">
            <div className=" flex items-center gap-x-2 bg-gray-slate-100 w-[95px] rounded-[4px] p-1 cursor-pointer">
              <Refresh size="20" color="#636C7E" />
              <span className=" font-medium text-xs text-black-slate-900">
                Regenerate
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
        handleGenerate={handleGenerate}
      />
    </>
  );
  handleGenerate;
}
