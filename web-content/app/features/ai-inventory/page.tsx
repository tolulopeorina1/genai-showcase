"use client";
import { Button } from "@heroui/button";
import { useDisclosure, Textarea } from "@heroui/react";
import { cn, Form, input, Input, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import { DocumentUpload, TickCircle, Trash } from "iconsax-react";
import CardBox from "@/app/components/places/CardBox";

export default function AiInventory() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // Initialize an empty errors object
    const newErrors: Record<string, string> = {};

    // Check for missing fields and set errors for specific fields
    if (!data.email) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";

    // If there are errors, update the state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    // Clear errors if validation passes
    setErrors({});

    const payload = {
      email: data.email,
      password: data.password,
    };
    try {
      const loginUser = await loginUserApi(payload);
      if (loginUser?.data?.success) {
        setResponse({
          responseType: "success",
          responseMessage: "Login Successful",
        });
        setIsOpenRes(true);
        //route to login
      } else {
        setResponse({
          responseType: "fail",
          responseMessage: loginUser?.response?.data?.message,
        });
        setIsOpenRes(true);
      }
      if (loginUser?.data?.success) {
        navigate.push("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-lg text-xs",
  ];

  return (
    <div className="">
      <div className=" flex flex-wrap gap-3">
        <CardBox
          header="LLM in Amazon Bedrock: Amazon Forecast + Claude"
          children={
            <div>
              <h4 className=" text-black-slate-900 text-sm font-semibold">
                Why:
              </h4>
              <p className=" font-normal text-sm text-gray-slate-600">
                Forecast analyzes sales trends, while Claude interprets
                unstructured data (e.g., weather reports impacting demand).
              </p>
              <h4 className=" text-black-slate-900 text-sm font-semibold my-2">
                Guardrails:
              </h4>
              <ul className=" font-normal text-sm text-gray-slate-600 list-disc pl-5">
                <li>
                  Restrict inventory recommendations to 10-15% over/under
                  historical levels.
                </li>
                <li>Alert humans for orders exceeding $50K value.</li>
              </ul>
            </div>
          }
        />

        <CardBox
          header="Use Case Specification"
          children={
            <div>
              <p className=" font-normal text-sm text-gray-slate-600"></p>
            </div>
          }
        />

        <CardBox
          header="Data Sources"
          children={
            <div>
              <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                <li>Retail Sales Dataset</li>
                <li>Supplier lead time logs</li>
                <li>POS system transactions</li>
              </ul>
            </div>
          }
        />
        <CardBox
          header="System Name: SmartStock Planner"
          children={
            <div>
              <p className=" font-normal text-sm text-gray-slate-600">
                Predicts SKU-level demand, automates purchase orders, and
                simulates stockout scenarios.
              </p>
            </div>
          }
        />
        <CardBox
          header="Architectural Diagram"
          children={
            <div>
              <ul className=" list-disc font-normal text-sm text-gray-slate-600 pl-5">
                <li></li>
              </ul>
            </div>
          }
        />
        <CardBox
          header="APIs to Create"
          children={
            <div>
              <h4 className=" text-black-slate-900 text-sm font-semibold">
                Stock Alert API
              </h4>
              <p className=" font-normal text-sm text-gray-slate-600 font-[family-name:var(--font-roboto-mono)] ">
                GET /alerts: Triggers replenishment requests for low-stock items
              </p>
              <h4 className=" text-black-slate-900 text-sm font-semibold">
                Supplier API
              </h4>
              <p className=" font-normal text-sm text-gray-slate-600 font-[family-name:var(--font-roboto-mono)] ">
                POST /order: Automates POs to vendors via EDI integration.
              </p>
            </div>
          }
        />
      </div>

      <AlertComponent
        isOpenRes={isOpenRes}
        toggleNotification={toggleNotification}
        responseType={response.responseType}
        responseMessage={response.responseMessage}
      />
    </div>
  );
}

// translateX(-50%)
