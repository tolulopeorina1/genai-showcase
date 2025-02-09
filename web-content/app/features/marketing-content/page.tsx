"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { usePathname, useRouter } from "next/navigation";
import CardBox from "@/app/components/places/CardBox";
import FooterComponent from "@/app/components/places/Footer";
import { useAppContext } from "@/app/context/StoreContext";
import Image from "next/image";
import architecture from "@/public/images/architecture.jpg";

export default function MarketingContent() {
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();
  const [prompt, setPrompt] = useState("");
  const pathname = usePathname();
  const { appState } = useAppContext();
  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
                <div>
                  <Image src={architecture} alt="architecture"></Image>
                </div>
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
        loading={loading}
        handleGenerate={() => {
          setLoading(true);
          appState.forms.inputChange(prompt);
          navigate.push(`${pathname}/response`);
        }}
      />
      {/* <FooterComponent
              selectedFile={selectedFile}
              handleClear={handleClear}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleButtonClick={handleButtonClick}
              setPrompt={handleTextFn}
              errorMessage={errorMessage}
              isInvalid={isInvalid}
              loading={loading}
              handleGenerate={() => {
                if (!selectedFile) {
                  setIsInvalid(true);
                  return;
                } else {
                  setLoading(true);
                  setIsInvalid(false);
                  appState.forms.inputChange(prompt);
                  setAppState((prevState) => ({
                    ...prevState,
                    forms: {
                      ...prevState.forms,
                      selectedFile,
                    },
                  }));
                  navigate.push(`${pathname}/response`);
                }
              }}
            /> */}
    </>
  );
}
