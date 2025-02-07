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
import { Button, Select, SelectItem, Spinner } from "@heroui/react";
import { models } from "@/app/constants/mock-data";

export default function PredictiveMaintenance() {
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

  const [progress, setProgress] = useState(80);

  // Convert progress (0-100) to degrees (0-180)
  const progressDegrees = (progress / 100) * 180;

  const radius = 40;
  const circumference = Math.PI * radius; // ~125.6
  const progressOffset = circumference - (progress / 100) * circumference;
  console.log(appState.forms.inputPrompt);
  // // Calculate marker position using angle
  // const angle = (progress / 100) * 180; // Converts 0-100% to 0-180 degrees
  // const markerX = 50 + radius * Math.cos((angle - 180) * (Math.PI / 180)); // X Position
  // const markerY = 50 + radius * Math.sin((angle - 180) * (Math.PI / 180)); // Y Position

  const angle = (progress / 100) * 180;
  const rotationAngle = angle - 90; // Adjust for proper tangent direction
  const markerX = 50 + radius * Math.cos((angle - 180) * (Math.PI / 180));
  const markerY = 50 + radius * Math.sin((angle - 180) * (Math.PI / 180));

  const addProgress = () => {
    setProgress((prev) => prev + 10);
  };
  const [rotation, setRotation] = useState(270); // Default to left

  useEffect(() => {
    const calculateRotation = (value: number): number => {
      // Linear conversion: 0-100 → 270°-90° (180° total rotation)
      return 270 + value * 1.8;
    };
    const newRotation = calculateRotation(progress);
    setRotation(newRotation);
  }, [progress]);
  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200",
  ];

  return (
    <>
      <div className="">
        <div className=" flex flex-wrap gap-3">
          <CardBox
            header="LLM in Amazon Bedrock: Amazon Lookout for Equipment + Claude"
            children={
              <div>
                <h4 className=" text-black-slate-900 text-sm font-semibold">
                  Why:
                </h4>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Lookout analyzes IoT sensor patterns (vibration, temperature),
                  while Claude interprets maintenance logs to predict failures
                  14 days in advance.
                </p>
                <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                  Guardrails:
                </h4>
                <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                  <li>
                    Flag predictions with &lt;85% confidence for manual review.
                  </li>
                  <li>
                    Enforce safety locks to prevent automated shutdowns in
                    critical infrastructure.
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
                  Monitor 5,000+ industrial assets (HVAC systems, wind turbines,
                  assembly line robots) across energy, aviation, and automotive
                  sectors in North America and the Middle East. Predict
                  equipment failures 14–21 days in advance using IoT sensor data
                  (vibration, temperature) and maintenance logs. Reduces
                  unplanned downtime by 45%, extends asset lifespans by 20%, and
                  auto-dispatches technicians via ServiceNow integration.
                  Includes digital twins for failure simulations and ROI
                  dashboards showing $2M+ annual savings per facility.
                </p>
              </div>
            }
          />

          <CardBox
            header="Data Sources"
            children={
              <div>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                  <li>NASA Turbofan Degradation Dataset</li>
                  <li>Equipment service histories</li>
                  <li>Supplier lead time databases</li>
                </ul>
              </div>
            }
          />
          <CardBox
            header="System Name: MaintainX Predict"
            children={
              <div>
                <p className=" font-normal text-sm text-gray-slate-600">
                  Monitors 10,000+ assets across energy, aviation, and
                  manufacturing. Recommends part replacements, estimates
                  downtime costs, and auto-dispatches field technicians.
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
                  Asset Health API
                </h4>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5 font-[family-name:var(--font-roboto-mono)]">
                  <li>
                    GET /health/&#123;asset_id&#125;: Returns real-time health
                    scores (0-100), predicted failure date, and risk factors.
                  </li>
                </ul>
                <h4 className=" text-black-slate-900 text-sm font-semibold">
                  Work Order API
                </h4>
                <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5 font-[family-name:var(--font-roboto-mono)]">
                  <li>
                    POST /workorder: Generates repair checklists, orders parts
                    via integrated vendors (e.g., Grainger), and books
                    technician slots.
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
            >
              {false ? <Spinner /> : "Go to Dashboard"}
            </Button>
          </div>
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
    </>
  );
}
