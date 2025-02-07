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
  DocumentUpload,
  Edit2,
  TickCircle,
  Trash,
} from "iconsax-react";
import HeaderComponent from "../../components/places/HeaderComponent";
import { useRouter } from "next/navigation";
import { models } from "../../constants/mock-data";
import Image from "next/image";
import { div } from "framer-motion/client";

export default function VirtualTryOn() {
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
    <div className=" h-[calc(100vh-71px)]">
      <HeaderComponent
        header={"Cecure Intelligence Limited - Gen AI Showcase"}
      />
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-slate-200 p-4 flex flex-col border border-solid border-r-gray-slate-100">
          <Textarea
            className="w-full my-3"
            label="Negative prompt"
            labelPlacement="outside"
            placeholder="Add negative prompt"
            variant="bordered"
            name="negative prompt"
            classNames={{
              inputWrapper: wrapperStyle,
              label: "text-sm",
            }}
          />
          <Input
            label="Product/Service"
            labelPlacement="outside"
            name="product/service"
            placeholder="Product/Service"
            className=" w-full my-3"
            size="lg"
            classNames={{
              inputWrapper: wrapperStyle,
              label: "text-sm",
            }}
            type="text"
          />

          <Select
            label="Size (px) / Aspect Ratio"
            labelPlacement="outside"
            className=" text-black-slate-900 font-normal rounded-[8px] bg-gray-slate-200 w-full my-3"
            items={models}
            placeholder="1280 x 720 (16:9)"
            name="aspect ratio"
            classNames={{
              trigger: selectInput,
              value: "text-black-slate-900",
            }}
            variant="flat"
            size="lg"
          >
            {(model) => (
              <SelectItem key={model.id} textValue={model.name}>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col">
                    <span className="text-small">{model.name}</span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>

          <Slider
            label="Numbers of Images"
            step={1}
            maxValue={100}
            minValue={0}
            defaultValue={50}
            showTooltip
            classNames={{
              thumb: "bg-white border-1 border-black w-5 h-5", // Circular thumb with black border
              track: "bg-[#D9D9D9]",
            }}
            tooltipProps={{ placement: "bottom" }}
            hideValue
          />
          <div className="items-center my-3 mt-auto">
            <Button
              type="submit"
              variant="flat"
              className="w-[247px] bg-blue-slate-600 text-white rounded-lg"
              disabled={loading}
              size="lg"
            >
              {loading ? <Spinner /> : "Regenerate"}
            </Button>
          </div>
        </aside>

        {/* Chat Section */}
        <main className="w-3/4 flex flex-col">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="  w-full">
              {!selectedFile && (
                <div
                  className={` flex justify-center flex-col gap-x-3 m-auto w-[540px] h-[264px] border-[1.5px] border-dashed border-[#D0D5DD] rounded-2xl ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-400 bg-gray-50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className=" flex justify-center items-center w-12 h-12 rounded-full bg-gray-slate-50 mx-auto">
                    <DocumentUpload size="20" color="#484F5B" />
                  </div>
                  <div className=" text-center">
                    <h4 className=" text-black-slate-900 font-normal">
                      <span
                        className=" cursor-pointer text-blue-slate-500 font-semibold"
                        onClick={handleButtonClick}
                      >
                        Click to upload
                      </span>{" "}
                      <span>or drag and drop</span>
                    </h4>
                    <h4>PDF, DOC, DOCX and TXT</h4>
                    <h4>Max. 20mb</h4>
                  </div>
                </div>
              )}
              {/* {selectedFile && (
                <div className=" flex gap-x-3">
                  <div className=" flex justify-center items-center w-12 h-12 rounded-full bg-gray-slate-25">
                    <TickCircle size="20" color="#10B981" variant="Bold" />
                  </div>
                  <div>
                    <h4 className=" text-black-slate-900 font-semibold">
                      {selectedFile.name}
                    </h4>
                    <h4 className=" text-gray-slate-500 text-sm font-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </h4>
                  </div>
                </div>
              )} */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                name="media"
                id="file-upload"
              />
            </div>
            {previewUrl && (
              <div className="w-full max-h-[25rem] flex items-center justify-center overflow-hidden border rounded-[17px]">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto object-contain"
                />
              </div>
            )}
            {!selectedFile && (
              <div className="flex justify-end items-center my-4 mx-auto w-[540px]">
                <Button
                  type="submit"
                  variant="flat"
                  className="w-[247px] bg-blue-slate-600 text-white rounded-lg"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? <Spinner /> : "Generate"}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
