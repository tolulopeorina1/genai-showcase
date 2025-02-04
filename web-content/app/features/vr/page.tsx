"use client";
import { Button } from "@heroui/button";
import { useDisclosure, Textarea } from "@heroui/react";
import { cn, Form, input, Input, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { authenticateUser, loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DocumentUpload, TickCircle, Trash } from "iconsax-react";
import ProductListItem from "@/app/components/places/Product-Item";
import { propImages } from "@/app/constants/mock-data";

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
    <div className="">
      <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
        <div className=" my-[1rem] mx-auto">
          <h2 className=" text-[52px] font-semibold text-center text-black">
            Virtual Try-On and Personalized Shopping Experiences
          </h2>
          <h4 className=" text-[18px] font-normal text-center text-black">
            Select an outfit to get started
          </h4>

          <div className=" my-3">
            <div
              className={cn(
                "my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:px-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              )}
            >
              {propImages.map((item) => (
                <ProductListItem
                  key={item.id}
                  {...item}
                  isLiked={itemSelected.id === item.id}
                  onclickAction={handleSelectedItem}
                />
              ))}
            </div>
          </div>

          <Form
            className="w-full"
            validationErrors={errors}
            onSubmit={onSubmit}
          >
            {itemSelected.id && (
              <div className="flex justify-center items-center w-full my-4">
                <Button
                  type="submit"
                  variant="flat"
                  className="w-[247px] bg-blue-slate-600 text-white rounded-lg"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? <Spinner /> : "Try outfit"}
                </Button>
              </div>
            )}
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
