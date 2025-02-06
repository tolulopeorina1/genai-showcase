"use client";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Select,
  SelectItem,
} from "@heroui/react";
import { Form, Input, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { locations, users } from "@/app/constants/mock-data";
import { checkFraudApi } from "@/app/services/endpointServices";
import { v4 as uuidv4 } from "uuid";
import CardBox from "@/app/components/places/CardBox";
import Link from "next/link";

export default function FraudPage() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const [data, setData] = useState<any>({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [progress, setProgress] = useState(0);
  const radius = 40;
  const circumference = Math.PI * radius; // ~125.6

  const [rotation, setRotation] = useState(270); // Default to left

  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };
  const generateId = () => uuidv4();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = generateId();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Initialize an empty errors object
    const newErrors: Record<string, string> = {};

    // Check for missing fields and set errors for specific fields
    if (!data.amount) newErrors.amount = "Amount is required";
    if (!data.location) newErrors.location = "Location is required";
    if (!data.recipient) newErrors.recipient = "Recipient's name is required";
    if (!data.sender) newErrors.sender = "Sender's name is required";

    // If there are errors, update the state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    // Clear errors if validation passes
    setErrors({});

    const payload = {
      amount: data.amount,
      location: data.location,
      sender_info: data.sender + id,
      recipent_info: id + data.recipient,
    };

    try {
      const checkFraud = await checkFraudApi(payload);

      if (checkFraud?.data?.statusCode === 200) {
        setResponse({
          responseType: "success",
          responseMessage: "Successful",
        });
        setIsOpenRes(true);
        setData(checkFraud?.data?.body);
        setProgress(Number(checkFraud?.data?.body?.fraud_score));
        // fraud_score
        // reason
        onOpen();
      } else {
        setResponse({
          responseType: "fail",
          responseMessage: JSON.parse(checkFraud?.data?.body)?.error,
        });
        setIsOpenRes(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
      // setTimeout(toggleNotification, 2000);
      toggleNotification();
    }
  };

  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-lg",
  ];

  useEffect(() => {
    const calculateRotation = (value: number): number => {
      // Linear conversion: 0-100 → 270°-90° (180° total rotation)
      return 270 + value * 1.8;
    };
    const newRotation = calculateRotation(progress);
    setRotation(newRotation);
  }, [progress]);

  return (
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
                Claude excels in understanding complex patterns and generating
                insights from structured and unstructured data.
              </p>
              <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                Guardrails:
              </h4>
              <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                <li>
                  Ensure data privacy and compliance with regulations like GDPR
                  and PCI DSS.
                </li>
                <li>
                  Implement strict access controls and encryption for sensitive
                  transaction data.
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
                Payment Verification to Prevent Fraud within the Financial
                Services Industry. Using various Financial Advisors from 5
                different financial institutions in the UK & Africa
              </p>
              <p className=" font-normal text-sm text-gray-slate-600 py-2">
                Put Financial Advisors on a web application such that
                capabilities to detect fraudulent transactions are shown, we
                would also be displaying a Dashboard (Risk/Fraud Persona)
              </p>
            </div>
          }
        />

        <CardBox
          header="Data Sources"
          children={
            <div>
              <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                <li>
                  <Link
                    href="https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml"
                    target="_blank"
                    className=" text-blue-slate-500 text-wrap break-words"
                  >
                    IBM Transactions for Anti-Money Laundering (AML)
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.kaggle.com/c/ieee-fraud-detection"
                    target="_blank"
                    className=" text-blue-slate-500 text-wrap break-words"
                  >
                    https://www.kaggle.com/c/ieee-fraud-detection
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.kaggle.com/datasets/ealtman2019/credit-card-transactions"
                    target="_blank"
                    className=" text-blue-slate-500 text-wrap break-words"
                  >
                    https://www.kaggle.com/datasets/ealtman2019/credit-card-transactions
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud"
                    target="_blank"
                    className=" text-blue-slate-500 text-wrap break-words"
                  >
                    https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
                  </Link>
                </li>
              </ul>
            </div>
          }
        />
        <CardBox
          header="Architectural Diagram"
          children={
            <div>
              <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                <li>
                  <Link
                    href="https://app.diagrams.net/#G1ncBecM_SAQuBnUvmf5IqQ0L6uS8_LcQZ#%7B%22pageId%22%3A%22ZUCaLZY7QMhTB9v3b_fR%22%7D"
                    target="_blank"
                    className=" text-blue-slate-500 text-wrap break-words"
                  >
                    https://app.diagrams.net/#G1ncBecM_SAQuBnUvmf5IqQ0L6uS8_LcQZ#%7B%22pageId%22%3A%22ZUCaLZY7QMhTB9v3b_fR%22%7D
                  </Link>
                </li>
              </ul>
            </div>
          }
        />
        <CardBox
          header="APIs to Create"
          children={
            <div>
              <h4 className=" text-black-slate-900 text-sm font-semibold">
                Fraud Detection API
              </h4>
              <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                Purpose:
              </h4>
              <p className=" font-normal text-sm text-gray-slate-600">
                Analyze transactions and flag potential laundering.
              </p>
              <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                Method:
              </h4>
              <p className=" font-normal text-sm text-gray-slate-600 font-[family-name:var(--font-roboto-mono)] ">
                POST /detect-fraud
              </p>
              <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                Input:
              </h4>
            </div>
          }
        />
      </div>
      <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className=" py-4">
                  <div className=" flex justify-center">
                    <div className="relative w-[270px] h-[150px]">
                      <svg
                        className="w-full h-full relative"
                        viewBox="0 0 100 60"
                      >
                        {" "}
                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient
                            id="progressGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#12F312" />
                            <stop offset="80%" stopColor="#FCA327" />
                            <stop offset="100%" stopColor="#D00707" />
                          </linearGradient>
                        </defs>
                        {/* Progress Arc */}
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          fill="none"
                          stroke="url(#progressGradient)"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          // strokeDashoffset={progressOffset}
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Animated Tracking Marker */}
                      <div
                        className=" absolute right-[48%] bottom-[10px] h-[122px]"
                        style={{
                          transform: ` rotate(${rotation}deg)`,
                          transition: "transform 0.5s ease-in-out",
                          transformOrigin: "bottom",
                        }}
                      >
                        <svg
                          width="8"
                          height="21"
                          viewBox="0 0 8 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 0.384766C1.79086 0.384766 0 2.17563 0 4.38477C0 6.5939 1.79086 8.38477 4 8.38477C6.20914 8.38477 8 6.5939 8 4.38477C8 2.17563 6.20914 0.384766 4 0.384766ZM3.25 19.6163C3.25 20.0305 3.58579 20.3663 4 20.3663C4.41421 20.3663 4.75 20.0305 4.75 19.6163H3.25ZM3.25 4.38477L3.25 19.6163H4.75L4.75 4.38477H3.25Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                      {data?.status !== "High Fraud Score" && (
                        <div className=" absolute text-center bottom-[-20px] right-[76px]">
                          <h4 className=" text-[40px] font-extrabold text-black-slate-900">
                            {progress}
                          </h4>
                          <h4 className=" text-black-slate-700 font-medium">
                            {" "}
                            /100
                          </h4>
                          <div className=" bg-green-slate-50 rounded-[23px] px-1 py-2 text-center">
                            <p className=" text-green-slate-800 font-medium text-xs ">
                              Good Fraud Score
                            </p>
                          </div>
                        </div>
                      )}

                      {data?.status === "High Fraud Score" && (
                        <div className=" absolute text-center bottom-[-20px] right-[76px]">
                          <h4 className=" text-[40px] font-extrabold text-black-slate-900">
                            {progress}
                          </h4>
                          <h4 className=" text-black-slate-700 font-medium">
                            {" "}
                            /100
                          </h4>
                          <div className=" bg-red-slate-50 rounded-[23px] px-1 py-2 text-center">
                            <p className=" text-red-slate-800 font-medium text-xs ">
                              High Fraud Score
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {data?.status !== "High Fraud Score" && (
                    <div>
                      <p className=" text-gray-slate-500 text-center font-normal my-4">
                        {data?.reason}
                      </p>
                    </div>
                  )}
                  {data?.status === "High Fraud Score" && (
                    <div className=" px-6">
                      <p className=" text-gray-slate-500 text-center font-normal my-4">
                        This transaction is marked as a{" "}
                        <strong> Potential Fraudulent Transaction</strong>{" "}
                        because of the following:
                      </p>

                      <ul className=" text-gray-slate-500 font-normal list-disc">
                        <li>{data?.reason}</li>
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-center items-center w-full">
                    <Button
                      type="submit"
                      variant="flat"
                      className="w-[247px] bg-blue-slate-600 text-white rounded-lg"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? <Spinner /> : "Go to dashboard"}
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        <AlertComponent
          isOpenRes={isOpenRes}
          toggleNotification={toggleNotification}
          responseType={response.responseType}
          responseMessage={response.responseMessage}
        />
      </div>
    </div>
  );
}

// translateX(-50%)
