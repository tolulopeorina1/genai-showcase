"use client";
import { useDisclosure } from "@heroui/react";
import { useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { usePathname, useRouter } from "next/navigation";
import CardBox from "@/app/components/places/CardBox";
import Image from "next/image";
import architecture from "@/public/images/architecture.jpg";
import FooterComponent from "@/app/components/places/Footer";
import { useAppContext } from "@/app/context/StoreContext";

export default function VirtualReality() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [itemSelected, setItemSelected] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [prompt, setPrompt] = useState("");
  const { appState } = useAppContext();
  const pathname = usePathname();

  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };

  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-lg text-xs",
  ];

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

  const handleSelectedItem = (value: { id: string; name: string }) => {
    setItemSelected(value);
  };

  return (
    <>
      <div className="">
        <div className=" flex flex-wrap gap-3">
          <CardBox
            header="LLM in Amazon Bedrock: Stable Diffusion XL"
            children={
              <div>
                <h4 className=" text-black-slate-900 text-sm font-semibold">
                  Why:
                </h4>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Generates high-resolution lifestyle images tailored to user
                  preferences (e.g., showing apparel on similar body types).
                </p>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Guardrails:
                </h4>
                <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                  <li>Watermark AI-generated images.</li>
                  <li>Block inappropriate customization attempts.</li>
                </ul>
              </div>
            }
          />

          <CardBox header="Use Case Specification" children={<div></div>} />

          <CardBox
            header="Data Sources"
            children={
              <div>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                  <li>Fashion MNIST Dataset</li>
                  <li>User-uploaded room photos</li>
                  <li>Product 3D mesh files</li>
                </ul>
              </div>
            }
          />
          <CardBox
            header="System Name: StyleVision Personalizer"
            children={
              <div>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Lets users visualize products in custom settings (e.g., "this
                  couch in my living room").
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

                <p className=" font-normal text-sm text-gray-slate-600 font-[family-name:var(--font-roboto-mono)] ">
                  GET /render: Generates images with user-selected
                  backgrounds/styles.
                </p>
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
          navigate.push(`/more-features/virtual-tryon`);
        }}
      />
    </>
  );
}
