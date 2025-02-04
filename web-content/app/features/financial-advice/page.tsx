"use client";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@heroui/react";
import { cn, Form, input, Input, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import { DocumentUpload, TickCircle, Trash } from "iconsax-react";

export default function FinancialAdvice() {
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

  const [progress, setProgress] = useState(80);

  const radius = 40;
  const circumference = Math.PI * radius; // ~125.6
  const progressOffset = circumference - (progress / 100) * circumference;

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
  return (
    <div className="">
      <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
        <div className=" my-[5rem] mx-auto max-w-[434px]">
          <h2 className=" my-4 text-xl font-semibold text-center ">
            Enter your details
          </h2>
          <Form
            className="w-full "
            validationErrors={errors}
            onSubmit={onSubmit}
          >
            <Input
              label="Age"
              labelPlacement="outside"
              name="age"
              placeholder="Age"
              className=" w-full my-2"
              size="lg"
              classNames={{
                inputWrapper: wrapperStyle,
                label: "text-sm",
              }}
              type="number"
            />
            <Input
              label="Income"
              labelPlacement="outside"
              name="income"
              placeholder="Income"
              className=" w-full my-2"
              size="lg"
              classNames={{
                inputWrapper: wrapperStyle,
                label: "text-sm",
              }}
              type="number"
            />
            <Input
              label="Risk Tolerance"
              labelPlacement="outside"
              name="risk tolerance"
              placeholder="Risk Tolerance"
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
              label="Financial Goals"
              labelPlacement="outside"
              placeholder="Describe what you want to achieve with your finances as details as you can be."
              variant="bordered"
              name=""
              classNames={{
                inputWrapper: wrapperStyle,
                label: "text-sm",
              }}
            />
            <div className=" w-full">
              <label htmlFor="file-upload" className=" text-sm">
                Transaction data
              </label>
              <div className=" flex justify-between mt-2 w-full">
                {!selectedFile && (
                  <div className=" flex gap-x-3">
                    <div className=" flex justify-center items-center w-12 h-12 rounded-full bg-gray-slate-50">
                      <DocumentUpload size="20" color="#484F5B" />
                    </div>
                    <div>
                      <h4 className=" text-black-slate-900 font-semibold">
                        Select your document
                      </h4>
                      <h4 className=" text-gray-slate-500 text-sm font-medium">
                        Max. 5MB
                      </h4>
                    </div>
                  </div>
                )}
                {selectedFile && (
                  <div className=" flex gap-x-3">
                    <div className=" flex justify-center items-center w-12 h-12 rounded-full bg-gray-slate-25">
                      <TickCircle size="20" color="#10B981" variant="Bold" />
                    </div>
                    <div>
                      <h4 className=" text-black-slate-900 font-semibold">
                        {selectedFile.name}
                      </h4>
                      <h4 className=" text-gray-slate-500 text-sm font-medium">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </h4>
                    </div>
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
                {!selectedFile && (
                  <Button
                    onPress={handleButtonClick}
                    color="primary"
                    variant="shadow"
                    className=" bg-transparent shadow-none text-blue-slate-600 font-medium"
                  >
                    Upload
                  </Button>
                )}
                {selectedFile && (
                  <Button
                    onPress={handleClear}
                    color="primary"
                    variant="shadow"
                    className=" bg-transparent shadow-none text-blue-slate-600 font-medium"
                  >
                    <Trash size="20" color="#DC2626" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-end items-center w-full my-4">
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
