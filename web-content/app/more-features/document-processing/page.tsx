"use client";

import { useRef, useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Slider,
  Spinner,
} from "@heroui/react";
import {
  ArrowLeft,
  Cpu,
  DocumentUpload,
  Edit2,
  TickCircle,
  Trash,
} from "iconsax-react";
import HeaderComponent from "../../components/places/HeaderComponent";
import { useRouter } from "next/navigation";
import { models } from "../../constants/mock-data";
import Image from "next/image";
import pdfReader from "@/public/images/PDF Reader.png";

export default function DocumentProcessing() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useRouter();

  const handleGenerate = async () => {
    // if (!prompt.trim()) return;
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

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

  const goBack = () => {
    navigate.back();
  };
  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-[8px]",
  ];
  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-300 rounded-[8px] bg-gray-slate-200",
  ];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Check if file is an image and generate preview URL
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // Handle drag-and-drop file selection
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  return (
    <>
      <div className="">
        <HeaderComponent
          header={"Cecure Intelligence Limited - Gen AI Showcase"}
        />
        <header className=" grid grid-cols-3 items-center px-8 py-2">
          <h2
            className=" flex gap-x-2 items-center cursor-pointer"
            onClick={goBack}
          >
            {" "}
            <ArrowLeft size="32" color="#636C7E" />
            <span className=" text-black-slate-900 font-medium">
              Back to homepage
            </span>
          </h2>

          <div></div>
        </header>
        <div className=" px-4 sm:px-6 flex">
          <div className=" my-[1rem] mx-auto max-w-[700px] p-4">
            {/* {messages.map((message, i) => {
              if (message.role === "bot") {
                return (
                  <div key={i}>
                    <div className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4">
                      <div>
                        <div className=" flex gap-x-3">
                          <div className=" bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                            Cpu{" "}
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
                  </div>
                );
              }
            })} */}
            {/* Chat Section */}
            <div className=" my-2 bg-blue-slate-250 rounded-lg p-4">
              <div>
                <div className=" flex gap-x-3">
                  <div className=" bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                    <Cpu size="20" color="#E8EAED" />
                  </div>
                  <h3 className=" text-black-slate-900 font-semibold text-lg">
                    Here is a summary of the document
                  </h3>
                </div>
                <h3 className=" text-black-slate-900 font-semibold text-lg ml-11">
                  Heading
                </h3>
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
              </div>
            </div>
          </div>

          <div>
            <Image src={pdfReader} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
