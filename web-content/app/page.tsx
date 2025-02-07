"use client";
import Image from "next/image";
import logo from "@/public/images/cil-logo.png";
import facebook from "@/public/images/svgs/facebook.svg";
import linkedin from "@/public/images/svgs/linkedin.svg";
import x from "@/public/images/svgs/x.svg";
import chatBot from "@/public/images/svgs/chatBot.svg";

import awsPartner from "@/public/images/aws-partner.png";
import Link from "next/link";
import {
  Cpu,
  Money,
  Box,
  DocumentText,
  UserSquare,
  User,
  CloudConnection,
  AttachCircle,
  Microphone2,
  Send2,
  TableDocument,
  Global,
  Add,
} from "iconsax-react";
import React, { useRef, useState } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { users } from "./constants/mock-data";
import FooterComponent from "./components/places/Footer";
import thinking from "@/public/images/svgs/thinking.svg";

const homepageItems = [
  {
    text: "Automated Fraud Detection and Prevention",
    link: "/features/fraud-detection",
    icon: <Cpu size="20" color="#2572D0" />,
  },
  {
    text: "Personalized Financial Advice and Wealth Management",
    link: "/features/financial-advice",
    icon: <Money size="20" color="#2572D0" />,
  },
  {
    text: "Dynamic Content Generation for Marketing Campaigns",
    link: "/features/marketing-content",
    icon: <Box size="20" color="#2572D0" />,
  },
  {
    text: "AI Inventory Management and Demand Forecasting",
    link: "/features/ai-inventory",
    icon: <DocumentText size="20" color="#2572D0" />,
  },
  {
    text: "Virtual Try-On and Personalized Shopping Experiences",
    link: "/features/virtual-tryon",
    icon: <UserSquare size="20" color="#2572D0" />,
  },
  {
    text: "Automated Document Processing and Summarization",
    link: "/features/document-processing",
    icon: <TableDocument size="20" color="#2572D0" />,
  },
  {
    text: "Employee Training and Onboarding with AI Tutors",
    link: "/features/employee-training",
    icon: <User size="20" color="#2572D0" />,
  },
  {
    text: "Predictive Maintenance for Operational Efficiency",
    link: "/features/predictive-maintenance",
    icon: <CloudConnection size="20" color="#2572D0" />,
  },
  {
    text: "AI-Driven Compliance and Risk Management",
    link: "/features/ai-compliance",
    icon: <Cpu size="20" color="#2572D0" />,
  },
];

const wrapperStyle = [
  "bg-white",
  "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
  "border border-solid border-gray-slate-300 rounded-[168px]",
];
const selectInput = [
  "placeholder:text-black-slate-900",
  "border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200",
];

export default function Home() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [prompt, setPrompt] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

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
    <div className=" flex flex-col max-h-dvh font-[family-name:var(--font-jakarta-sans)] min-h-dvh relative ">
      <header className=" flex-col md:flex md:flex-row bg-gray-slate-200 py-4 flex justify-between items-center border-b border-solid border-b-gray-slate-100 px-8">
        <h1 className=" text-black-slate-900 font-semibold text-xl">
          Cecure Intelligence Limited - Gen AI Showcase
        </h1>
        <div className=" flex gap-x-4 items-center">
          <Image src={logo} alt="logo" width={38} height={38} />
          <Image src={awsPartner} alt="logo" width={38} height={38} />
        </div>
      </header>
      <main className="px-8 py-4 overflow-y-auto pb-[100px]">
        <div className=" grid grid-cols-2 h-full justify-between gap-y-8">
          <div className=" grid gap-y-2 min-w-[420px] justify-between">
            {homepageItems.map((item, index) => (
              <Link
                className=" backdrop-blur-sm bg-gray-slate-550 border border-solid border-blue-slate-200 rounded-[7px] py-2 px-[12px] flex items-center text-black text-[14px] font-medium min-w-[420px] gap-x-1"
                key={item.text}
                href={item.link}
              >
                {item.icon}
                {item.text}
              </Link>
            ))}
          </div>
          <div className=" text-end flex flex-col">
            <div>
              <h1 className=" text-black font-medium text-[48px] ">
                CIL Gen AI Solutions for Modern Enterprisers
              </h1>
              <h4 className=" font-normal text-[#2D3139]">
                Explore 10 Industry-Leading AI Use Cases Designed for Security,
                Efficiency, and Innovation.
              </h4>
            </div>

            <div className=" mt-4">
              <div className=" flex justify-end gap-x-2">
                <Link
                  href={"https://web.facebook.com/cecureintelligence"}
                  target="_blank"
                >
                  <Image src={facebook} alt="facebook" />
                </Link>
                <Link href={"https://twitter.com/cil_teams"} target="_blank">
                  <Image src={x} alt="x" />
                </Link>
                <Link
                  href={
                    "https://www.linkedin.com/company/cecureintelligence/mycompany/"
                  }
                  target="_blank"
                >
                  <Image src={linkedin} alt="linkedin" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className=" fixed bottom-0 left-0 right-0 bg-white pb-2 px-32 z-50">
        <div>
          {selectedFile && (
            <div className=" flex gap-x-3 items-center bg-gray-slate-200 border border-solid border-gray-slate-100 rounded-[168px] p-2 w-fit">
              <h4 className=" text-black-slate-900 font-normal text-sm">
                {selectedFile.name}
              </h4>
              <Button
                onPress={handleClear}
                color="primary"
                variant="shadow"
                className=" bg-transparent shadow-none text-blue-slate-600 font-medium px-0 min-w-4 h-full"
              >
                <span className=" rotate-45">
                  <Add size="20" color="#636C7E" />
                </span>
              </Button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            name="media"
            id="file-upload"
          />
        </div>
        <Input
          aria-label="Prompt input"
          className="w-full my-2"
          classNames={{
            inputWrapper: wrapperStyle,
          }}
          startContent={
            <div className=" flex items-center gap-x-2">
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={handleButtonClick}
              >
                <AttachCircle size="20" color="#636C7E" />
              </button>
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                <Microphone2 size="20" color="#636C7E" />
              </button>
            </div>
          }
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              <Send2 size="20" color="#636C7E" />
            </button>
          }
          placeholder="Ask me something you want to know"
          type="text"
          variant="bordered"
        />

        <div className=" flex">
          <Button
            startContent={<Global size="20" color="#636C7E" />}
            variant="bordered"
            className="bg-gray-slate-200 text-black-slate-900 border border-gray-slate-100 px-[10px] font-normal rounded-[168px]"
            disabled={false}
          >
            Search web
          </Button>
          <Select
            aria-label="Model"
            className=" text-black-slate-900 px-[10px] font-normal rounded-[168px] w-[200px] bg-gray-slate-200"
            items={users}
            placeholder="Change Model"
            name="model"
            classNames={{ trigger: selectInput, value: "text-black-slate-900" }}
            variant="flat"
          >
            {(location) => (
              <SelectItem key={location.id} textValue={location.name}>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col">
                    <span className="text-small">{location.name}</span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
        </div>
      </footer>
      <div
        className=" mb-4 fixed right-9 flex gap-x-2 bottom-[85px] cursor-pointer"
        onClick={onOpen}
      >
        <div className=" bg-white border border-solid border-[#D7DADF] rounded-[40px] py-4 px-[20px] h-[44px] flex items-center justify-center mr-[-20px] ">
          Hi there! 👋🏽
        </div>
        <Image src={chatBot} alt="chat" width={80} height={80} />
      </div>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        className=" rounded-none"
        hideCloseButton
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 border-b-gray-slate-300 border border-solid bg-blue-slate-250">
                <div className=" flex justify-between " onClick={onClose}>
                  <h4 className=" text-black-slate-900 text-sm font-semibold ">
                    CIL Gen-AI Chat bot
                  </h4>
                  <span className=" rotate-45 cursor-pointer">
                    <Add size="20" color="#636C7E" />
                  </span>
                </div>
              </DrawerHeader>
              <DrawerBody>
                <div className=" flex flex-col justify-between h-full">
                  <div className=" text-black-slate-900">
                    <h3 className=" font-normal text-4xl">Hi there!</h3>
                    <h3 className=" text-[32px] font-bold">
                      Get started with what need to know
                    </h3>
                  </div>
                  <Image src={thinking} alt="logo" width={38} height={38} />
                  <div className=" grid grid-cols-2 gap-4">
                    <div className=" bg-[#F6F9FE] rounded-[7px] border bordr-solid border-[#C4D9F3] p-4 font-medium text-sm">
                      Automated Fraud Detection and Prevention
                    </div>
                    <div className=" bg-[#F6F9FE] rounded-[7px] border bordr-solid border-[#C4D9F3] p-4 font-medium text-sm">
                      Automated Fraud Detection and Prevention
                    </div>
                  </div>

                  {messages.map((message, i) => {
                    if (message.role === "bot") {
                      return (
                        <div key={i}>
                          <div className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4">
                            <div>
                              <div className=" flex gap-x-3">
                                <div className=" bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                                  <Cpu size="20" color="#E8EAED" />
                                </div>
                                <h3 className=" text-black-slate-900 font-semibold text-lg">
                                  {messages[i - 1].content}
                                  connf
                                </h3>
                              </div>
                              <p className=" text-black-slate-900 font-normal ml-11">
                                {message.content}
                                bidndnd
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className=" flex gap-x-3 justify-end my-2 items-center"
                          key={i}
                        >
                          <p className=" text-right">
                            {message.content}
                            djdjdjd
                          </p>
                          <div className=" bg-blue-slate-500 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                            <User size="20" color="#E8EAED" />
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </DrawerBody>
              <DrawerFooter className=" block">
                <FooterComponent
                  selectedFile={selectedFile}
                  handleClear={handleClear}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleButtonClick={handleButtonClick}
                  setPrompt={setPrompt}
                  handleGenerate={() => {
                    // appState.forms.inputChange(prompt);
                    // navigate.push(`/more-features/document-processing`);
                  }}
                  notFixedPosition
                />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
