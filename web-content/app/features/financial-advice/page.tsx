"use client";
import { useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "iconsax-react";
import CardBox from "@/app/components/places/CardBox";
import FooterComponent from "@/app/components/places/Footer";
import { useAppContext } from "@/app/context/StoreContext";
import Image from "next/image";
import architecture from "@/public/images/architecture.jpg";

export default function FinancialAdvice() {
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
  const pathname = usePathname();
  const { appState } = useAppContext();

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
                  Claude&#8217;s ability to generate human-like responses makes
                  it ideal for personalized financial advice.
                </p>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Guardrails:
                </h4>
                <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                  <li>
                    Ensure compliance with financial regulations like MiFID II
                    and FINRA.
                  </li>
                  <li>Provide disclaimers for AI-generated advice.</li>
                </ul>
              </div>
            }
          />

          <CardBox
            header="Use Case Specification"
            children={
              <div>
                <p className=" font-normal text-sm text-gray-slate-600">
                  A web app that provides tailored financial advice and wealth
                  management strategies based on user profiles, goals, and risk
                  tolerance. It helps users optimize investments, plan for
                  retirement, and achieve financial goals.
                </p>
              </div>
            }
          />

          <CardBox
            header="Data Sources"
            children={
              <div>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                  <a
                    href="https://www.kaggle.com/code/noeyislearning/sme-financial-insights"
                    target="_blank"
                    className=" text-blue-slate-500 text-wrap break-words"
                  >
                    <li>
                      https://www.kaggle.com/code/noeyislearning/sme-financial-insights
                    </li>
                  </a>
                </ul>
              </div>
            }
          />
          <CardBox
            header="Architectural Diagram"
            children={
              <div>
                <Image src={architecture} alt="architecture"></Image>
              </div>
            }
          />
          <CardBox
            header="APIs to Create"
            children={
              <div>
                <h4 className=" text-black-slate-900 text-sm font-semibold">
                  Financial Advice API
                </h4>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Purpose:
                </h4>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Generate personalized financial recommendations.
                </p>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Method:
                </h4>
                <p className=" font-normal text-sm text-gray-slate-600 font-[family-name:var(--font-roboto-mono)] ">
                  POST /generate-advice
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
          appState.forms.inputChange(prompt);
          navigate.push(`${pathname}/response`);
        }}
      />
    </>
  );
}

// {selectedFile.size < 1024 * 1024
//   ? `${(selectedFile.size / 1024).toFixed(2)} KB`
//   : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`}
