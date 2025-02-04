"use client";
import { Button } from "@heroui/button";
import { useDisclosure, Textarea } from "@heroui/react";
import { Form, Input, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { authenticateUser, loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";

export default function MarketingContent() {
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
    "border border-solid border-gray-slate-300 rounded-lg",
  ];

  const [progress, setProgress] = useState(80);

  // useEffect(() => {
  //   setProgress(value);
  // }, [value]);

  // Convert progress (0-100) to degrees (0-180)
  const progressDegrees = (progress / 100) * 180;

  const radius = 40;
  const circumference = Math.PI * radius; // ~125.6
  const progressOffset = circumference - (progress / 100) * circumference;

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

  return (
    <div className="">
      <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
        <div className=" my-[5rem] mx-auto max-w-[434px]">
          <h2 className=" my-4 text-xl font-semibold text-center">
            Enter your campaign details
          </h2>
          <Form
            className="w-full "
            validationErrors={errors}
            onSubmit={onSubmit}
          >
            <Input
              label="Target Audience"
              labelPlacement="outside"
              name="audience"
              placeholder="Target Audience"
              className=" w-full my-2"
              size="lg"
              classNames={{
                inputWrapper: wrapperStyle,
                label: "text-sm",
              }}
              type="text"
            />
            <Input
              label="Product/Service"
              labelPlacement="outside"
              name="product/service"
              placeholder="Product/Service"
              className=" w-full my-2"
              size="lg"
              classNames={{
                inputWrapper: wrapperStyle,
                label: "text-sm",
              }}
              type="text"
            />
            <Textarea
              className="w-full my-2"
              label="Campaign Goals"
              labelPlacement="outside"
              placeholder="Describe what you want to achieve with your campaign as details as you can be."
              variant="bordered"
              name="goals"
              classNames={{
                inputWrapper: wrapperStyle,
                label: "text-sm",
              }}
            />

            <div className="flex justify-end items-center w-full">
              <Button
                type="submit"
                variant="flat"
                className="w-[247px] bg-blue-slate-600 text-white rounded-lg"
                disabled={loading}
                size="lg"
              >
                {loading ? <Spinner /> : "Get recommendation"}
              </Button>
            </div>
          </Form>
        </div>

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
