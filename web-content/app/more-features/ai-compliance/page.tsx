"use client";

import { useRef, useState } from "react";
import { ArrowLeft, Cpu, TickCircle } from "iconsax-react";
import HeaderComponent from "../../components/places/HeaderComponent";
import { useRouter } from "next/navigation";
import { models } from "../../constants/mock-data";
import Image from "next/image";
import { div } from "framer-motion/client";
import { useAppContext } from "@/app/context/StoreContext";
import { v4 as uuidv4 } from "uuid";

export default function AiComplaince() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const navigate = useRouter();
  const { appState } = useAppContext();
  const generateId = () => uuidv4();

  // const handleGenerate = async () => {
  //   // if (!prompt.trim()) return;
  //   setLoading(true);

  //   // Append user message
  //   setMessages((prev) => [...prev, { role: "user", content: prompt }]);

  //   // Send request to backend
  //   const response = await fetch(
  //     "https://y8zhxgsk38.execute-api.us-east-1.amazonaws.com/dev/regulatory-checker/upload-document-v2",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt }),
  //     }
  //   );

  //   const reader = response.body?.getReader();
  //   const decoder = new TextDecoder();
  //   let accumulatedText = "";

  //   while (reader) {
  //     const { done, value } = await reader.read();
  //     if (done) break;
  //     accumulatedText += decoder.decode(value, { stream: true });

  //     // Update the last message progressively
  //     setMessages((prev) => [
  //       ...prev.slice(0, -1),
  //       { role: "bot", content: accumulatedText },
  //     ]);
  //   }

  //   setLoading(false);
  //   setPrompt(""); // Clear input
  // };
  const handleGenerate = async () => {
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    await new Promise((resolve) => setTimeout(resolve, 0)); // Ensure state update

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

    const fileBase64 = await toBase64(appState.forms.selectedFile as File);
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
    let accumulatedText = "";

    let botMessage = { role: "bot", content: "" };

    // Append an empty bot message first
    setMessages((prev) => [...prev, botMessage]);

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode streamed chunk
      const chunk = decoder.decode(value, { stream: true });

      // Parse JSON response chunk (assuming streaming JSON format)
      try {
        const json = JSON.parse(chunk);
        if (json.response) {
          const text = json.response;

          for (let i = 0; i < text.length; i++) {
            accumulatedText += text[i]; // Add one character at a time

            // Smooth typing effect update
            await new Promise((resolve) => setTimeout(resolve, 30)); // Adjust speed here

            setMessages((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1 && msg.role === "bot"
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            );
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    setLoading(false);
    setPrompt(""); // Clear input
  };

  const getData = async () => {
    const response = await fetch(
      "https://y8zhxgsk38.execute-api.us-east-1.amazonaws.com/dev/regulatory-checker/get-report",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  const goBack = () => {
    navigate.back();
  };
  const compliance = ["GDRP", "HIPAA", "CIS"];
  const [activeComplaince, setActiveComplaince] = useState("GDRP");
  return (
    <div className=" h-[calc(100vh-71px)]">
      <HeaderComponent
        header={"Cecure Intelligence Limited - Gen AI Showcase"}
      />
      <div className="flex h-full">
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
          <button onClick={() => handleGenerate()}>checkendpoint</button>
          <button onClick={() => getData()}>get data</button>

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
                    Compliance Result
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
        </main>
      </div>
    </div>
  );
}
