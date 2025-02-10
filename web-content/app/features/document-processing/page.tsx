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

export default function DocumentProcessing() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const [errorMessage, setErrorMessage] = useState(
    "Input search text and a PDF"
  );
  const [isInvalid, setIsInvalid] = useState(false);
  const navigate = useRouter();
  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };
  const [prompt, setPrompt] = useState("");
  const { appState, setAppState } = useAppContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsInvalid(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setIsInvalid(true);
      setErrorMessage("Please select a .pdf file to proceed");
    }
  };
  const handleTextFn = (value: React.SetStateAction<string>) => {
    if (!value || selectedFile === null) {
      setIsInvalid(true);
      setErrorMessage("Please select a .pdf file to proceed");
    } else {
      setIsInvalid(false);
      setErrorMessage("");
    }
    setPrompt(value);
  };
  return (
    <>
      <div className="">
        <div className=" flex flex-wrap gap-3">
          <CardBox
            header="LLM in Amazon Bedrock: Anthropic Claude + Amazon Textract"
            children={
              <div>
                <h4 className=" text-black-slate-900 text-sm font-semibold">
                  Why:
                </h4>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Claude&#8217;s advanced NLP capabilities enable context-aware
                  summarization of 100+ page documents, while Textract extracts
                  structured data from tables, forms, and handwritten notes with
                  98% accuracy.
                </p>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Guardrails:
                </h4>
                <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                  <li>
                    Redact sensitive PII/PHI using Amazon Comprehend Medical for
                    healthcare documents. Block inappropriate customization
                    attempts.
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
                  Process 50K+ monthly documents for legal, healthcare, and
                  manufacturing clients (global). Support 15+ file types (PDF,
                  scanned images, DOCX) with a 4-hour SLA for urgent contracts.
                </p>
              </div>
            }
          />

          <CardBox
            header="Data Sources"
            children={
              <div>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                  <li>DocVQA Dataset (Document Visual Question Answering)</li>
                  <li>
                    Industry-specific templates (SEC filings, clinical trial
                    reports)
                  </li>
                  <li>Archived SharePoint documents</li>
                </ul>
              </div>
            }
          />
          <CardBox
            header="System Name: DocIntel Pro"
            children={
              <div>
                <p className=" font-normal text-sm text-gray-slate-600">
                  An end-to-end platform that classifies documents, extracts key
                  clauses (e.g., NDAs, termination terms), and generates
                  compliance checklists. Features version comparison for revised
                  contracts.
                </p>
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
                  Image Render API
                </h4>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5 font-[family-name:var(--font-roboto-mono)]">
                  <li>
                    GET /ingest: Accepts documents via URL or binary upload.
                    Performs OCR, language detection, and metadata tagging.
                  </li>
                  <li>
                    Input: File/URL, priority level (e.g., "urgent"), document
                    type (e.g., "invoice").
                  </li>
                  <li>
                    Output: Document ID, extracted text, detected entities
                    (e.g., "company_name": "Acme Corp").
                  </li>
                </ul>
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
            navigate.push(`/more-features/document-processing`);
          }
        }}
        acceptTypes=".pdf"
      />
    </>
  );
}
