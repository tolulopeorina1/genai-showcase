"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Cpu } from "iconsax-react";
import HeaderComponent from "../../components/places/HeaderComponent";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/context/StoreContext";
import { endpointData } from "@/app/constants/endpointa";
import parse from "html-react-parser";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";

export default function DocumentProcessing() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }>({
    role: "",
    content: "",
  });
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { appState } = useAppContext();
  const navigate = useRouter();

  const ParseText = () => {
    const jsxContent = parse(messages.content, {
      replace: (domNode) => {
        if (domNode.type === "tag" && domNode.name === "cpu") {
          return <Cpu size="20" color="#E8EAED" />;
        }
      },
    });
    return jsxContent;
  };

  const goBack = () => {
    navigate.back();
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await uploadFile(
        appState.forms.selectedFile as File,
        appState.forms.inputPrompt
      ); // Call the function after 2 seconds
    }, 2000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
  }, []);

  const uploadFile = async (file: File, description: string) => {
    try {
      setLoading(true);

      if (file && file.type === "application/pdf") {
        setPdfUrl(URL.createObjectURL(file)); // Create a local blob URL for the PDF
      } else {
        alert("Please select a valid PDF file.");
      }
      // Convert file to Base64
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.onerror = (error) => reject(error);
        });

      const fileBase64 = await toBase64(file);

      const payloadbody = {
        fileName: file.name,
        fileData: fileBase64,
        prompt: description,
      };

      // Send request to backend
      const response = await fetch(endpointData.documentSummary, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadbody),
      });

      if (!response.ok) throw new Error("Failed to upload file");

      // Read JSON response
      const data = await response.json();
      const pdfUrl = data.pdfUrl; // Extract pdfUrl

      if (!pdfUrl) throw new Error("No pdfUrl found in response");

      // Add PDF URL to messages
      setMessages({ role: "bot", content: pdfUrl });
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
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
            {loading ? <Spinner /> : <ArrowLeft size="32" color="#636C7E" />}
            <span className=" text-black-slate-900 font-medium">
              Back to homepage
            </span>
          </h2>
          <div></div>
        </header>
        <div className=" px-4 sm:px-6 flex">
          <div className=" my-[1rem] mx-auto max-w-[700px] p-4">
            <div className=" my-2 bg-blue-slate-250 rounded-lg p-4">
              {messages.content !== "" && <ParseText />}
            </div>
          </div>

          <div>
            {pdfUrl !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {" "}
                <iframe
                  src={pdfUrl}
                  className="w-full max-w-3xl h-[500px] border customScrollBar"
                  title="PDF Preview"
                ></iframe>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
