"use client";
import { Spinner, Button, SelectItem, Select } from "@heroui/react";
import React from "react";
import { useState } from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { useRouter, usePathname } from "next/navigation";
import CardBox from "@/app/components/places/CardBoxGrid";
import usecase5 from "@/public/images/architecture/usecase5.png";
import Image from "next/image";

import { models } from "@/app/constants/mock-data";
export default function AiInventory() {
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const pathname = usePathname();

  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };

  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200",
  ];

  return (
    <div className="">
      <div className=" grid grid-cols-3 gap-3 ">
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
                <Image src={usecase5} alt="AI inventory" />
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
            onPress={() => {
              setLoading(true);
              navigate.push(`${pathname}/response`);
            }}
          >
            {loading ? <Spinner /> : "Go to Dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
