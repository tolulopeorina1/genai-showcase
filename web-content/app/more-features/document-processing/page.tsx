"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Cpu } from "iconsax-react";
import HeaderComponent from "../../components/places/HeaderComponent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import pdfReader from "@/public/images/PDF Reader.png";
import { useAppContext } from "@/app/context/StoreContext";
import { endpointData } from "@/app/constants/endpointa";

export default function DocumentProcessing() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isDragging, setIsDragging] = useState(false);
  const { appState, setAppState } = useAppContext();
  const navigate = useRouter();

  const handleGenerate = async () => {
    // if (!prompt.trim()) return;
    setLoading(true);

    // Append user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: appState.forms.inputPrompt },
    ]);
    const bodyPayload = {
      prompt: appState.forms.inputPrompt,
      object_key: appState.forms.selectedFile,
      bucket_name: "cil-gen-ai-use-cases",
    };

    // endpointData.documentSummary
    // Send request to backend
    const response = await fetch(
      "https://y8zhxgsk38.execute-api.us-east-1.amazonaws.com/dev/textract-gen-ai",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      }
    );

    console.log(response);

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

  const handleGenerates = async (prompt: string) => {
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

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await uploadFile(
        appState.forms.selectedFile as File,
        appState.forms.inputPrompt
      ); // Call the function after 2 seconds
    }, 2000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
    console.log(appState.forms.inputPrompt, appState.forms.selectedFile);
  }, []);

  const uploadFile = async (file: File, description: string) => {
    try {
      setLoading(true);
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
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     role: "user",
      //     name: file.name,
      //     size: file.size,
      //     description,
      //     status: "",
      //     statusCode: 200,
      //     flags: ["none"],
      //     reason: "",
      //     fraud_score: 20,
      //   },
      // ]);
      const payloadbody = {
        role: "user",
        content: [
          {
            document: {
              name: file.name,
              format: file.type,
              source: {
                bytes: fileBase64,
              },
            },
          },
          { text: description },
        ],
      };

      // Send request to backend
      const response = await fetch(
        "https://y8zhxgsk38.execute-api.us-east-1.amazonaws.com/dev/textract-gen-ai",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadbody),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let streamedReason = "";

      // Add a "bot" response placeholder
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     role: "bot",
      //     name: file.name,
      //     size: file.size,
      //     description: "",
      //     status: "",
      //     statusCode: 200,
      //     flags: ["none"],
      //     reason: "",
      //     fraud_score: 20,
      //   }, // Placeholder
      // ]);
      console.log(response);

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
            reason:
              newBody?.reason ??
              "Please provide a file with an actual transaction.",
          };
          console.log(body);

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
                <button onClick={() => handleGenerate()}>test api</button>
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
