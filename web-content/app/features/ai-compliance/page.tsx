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
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { models } from "@/app/constants/mock-data";
import { DocumentUpload, TickCircle, Trash } from "iconsax-react";

export default function AiCompliance() {
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();
  const { setAppState } = useAppContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };
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

  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200",
  ];

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
                  Claude’s advanced NLP capabilities enable context-aware
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

        <div className=" flex justify-end gap-x-3 py-4 items-center fixed bottom-0 left-0 right-0 px-16 bg-white">
          <Select
            aria-label="Model"
            className=" text-black-slate-900 px-[10px] font-normal rounded-[168px] w-[200px] bg-gray-slate-200"
            items={models}
            placeholder="Change Model"
            name="model"
            classNames={{
              trigger: selectInput,
              value: "text-black-slate-900",
            }}
            variant="flat"
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
          <div className="">
            <Button
              type="submit"
              variant="flat"
              className="w-[200px] bg-blue-slate-600 text-white rounded-lg"
              disabled={false}
              size="lg"
              onPress={onOpen}
            >
              {false ? <Spinner /> : "Upload document"}
            </Button>
          </div>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className=" py-4">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <h4 className=" text-black-slate-900 font-semibold text-lg text-center">
                      Upload document
                    </h4>
                    <p className=" text-gray-slate-600 text-sm text-center font-normal">
                      Please upload the document you want to check for
                      compliance
                    </p>

                    <div className="  w-full">
                      <div
                        className={` flex justify-center flex-col gap-x-3 m-auto h-[264px] border-[1.5px] border-dashed border-[#D0D5DD] rounded-2xl ${
                          isDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-400 bg-gray-50"
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        {!selectedFile && (
                          <>
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
                              <h4>PDF or TXT</h4>
                              <h4>Max. 20mb</h4>
                            </div>
                          </>
                        )}
                        {selectedFile && (
                          <div className=" flex justify-center flex-col gap-y-2 items-center">
                            <div className=" flex justify-center flex-col items-center w-12 h-12 rounded-full bg-gray-slate-25 ">
                              <TickCircle
                                size="20"
                                color="#10B981"
                                variant="Bold"
                              />
                            </div>

                            <h4 className=" text-black-slate-900 font-semibold text-center">
                              {selectedFile.name}
                            </h4>
                            <h4 className=" text-gray-slate-500 text-sm font-medium text-center">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                              MB
                            </h4>
                            <div
                              className=" mx-auto cursor-pointer"
                              onClick={handleClear}
                            >
                              <Trash size="20" color="#DC2626" />
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        name="media"
                        id="file-upload"
                        accept=" .txt, .pdf"
                      />
                    </div>

                    <div className="flex justify-end items-center my-4 mx-auto">
                      <Button
                        // type="submit"
                        variant="flat"
                        className="w-[157px] bg-blue-slate-600 text-white rounded-lg"
                        disabled={loading}
                        size="lg"
                        onPress={() => {
                          if (!selectedFile) return;
                          setLoading(true);
                          setAppState((prevState) => ({
                            ...prevState,
                            forms: {
                              ...prevState.forms,
                              selectedFile,
                            },
                          }));
                          navigate.push(`/more-features/ai-compliance`);
                        }}
                      >
                        {loading ? <Spinner /> : "Proceed"}
                      </Button>
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
          <AlertComponent
            isOpenRes={isOpenRes}
            toggleNotification={toggleNotification}
            responseType={response.responseType}
            responseMessage={response.responseMessage}
          />
        </div>
      </div>
    </>
  );
}
