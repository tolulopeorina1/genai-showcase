"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Cpu, TickCircle } from "iconsax-react";
import HeaderComponent from "../../components/places/HeaderComponent";
import { useRouter } from "next/navigation";
import { models } from "../../constants/mock-data";
import { useAppContext } from "@/app/context/StoreContext";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";

export default function AiComplaince() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }>({
    role: "",
    content: "",
  });
  const navigate = useRouter();
  const { appState } = useAppContext();
  const generateId = () => uuidv4();

  const handleGenerate = async (file: File) => {
    setLoading(true);
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
    const userId = generateId();

    const bodyPayload = {
      fileContent: fileBase64,
      fileName: appState.forms.selectedFile?.name,
      complianceStandard: "",
      userId: userId,
    };
    // Send request to backend
    const response = await fetch(
      "https://y8zhxgsk38.execute-api.us-east-1.amazonaws.com/dev/regulatory-checker/upload-document-v2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      }
    );

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode streamed chunk
      const chunk = decoder.decode(value, { stream: true });

      // Parse JSON response chunk (assuming streaming JSON format)
      try {
        const json = JSON.parse(chunk);
        console.log(json, "Keys:", Object.keys(json));
        if (json.pdf_download_url) {
          setMessages({ role: "bot", content: json.pdf_download_url });
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    setLoading(false);
    setPrompt(""); // Clear input
  };

  const goBack = () => {
    navigate.back();
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await handleGenerate(appState.forms.selectedFile as File);
    }, 2000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
  }, []);

  const compliance = ["GDRP", "HIPAA", "CIS"];
  const [activeComplaince, setActiveComplaince] = useState("GDRP");

  return (
    <div className=" h-[calc(100vh-71px)]">
      <HeaderComponent
        header={"Cecure Intelligence Limited - Gen AI Showcase"}
      />
      <div className="flex h-full overflow-y-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-slate-200 p-4 flex flex-col border border-solid border-r-gray-slate-100">
          <h4 className=" text-black-slate-900 text-xl font-semibold mb-1 text-center">
            Regulatory Standards
          </h4>
          <p className=" text-gray-slate-600 text-sm font-normal text-center">
            Select what you want to check against
          </p>

          <div className=" my-3">
            {compliance.map((item) => (
              <div
                className=" border border-solid border-[#484F5B] rounded-lg py-2 flex gap-x-2 justify-center items-center my-2 cursor-pointer"
                key={item}
                onClick={() => setActiveComplaince(item)}
              >
                {item}{" "}
                {activeComplaince === item && (
                  <TickCircle size="20" color="#10B981" />
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Section */}
        <main className="w-3/4 flex flex-col [calc(100vh-71px)] overflow-y-auto customScrollBar">
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
          <div className=" mb-[1rem] mx-auto max-w-[700px] p-4 h-">
            <div className=" my-2 bg-blue-slate-250 rounded-lg p-4 min-w-[668px]">
              <div>
                <div className=" flex gap-x-3">
                  <div className=" bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                    {loading ? <Spinner /> : <Cpu size="20" color="#E8EAED" />}
                  </div>
                  <h3 className=" text-black-slate-900 font-semibold text-lg">
                    Compliance Result
                  </h3>
                </div>
                <h3 className=" text-black-slate-900 font-semibold text-lg ml-11">
                  You document would be displayed below
                </h3>

                {messages.content !== "" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {" "}
                    <iframe
                      src={messages.content}
                      className="w-full max-w-3xl h-[500px] border customScrollBar"
                      title="PDF Preview"
                    ></iframe>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
