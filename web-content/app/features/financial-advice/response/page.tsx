"use client";
import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { authenticateUser, loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cpu } from "iconsax-react";

export default function Response() {
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

  const goBack = () => {
    navigate.back();
  };
  return (
    <div className="">
      <div className=" grid grid-cols-3 items-center">
        <h2
          className=" flex gap-x-2 items-center cursor-pointer"
          onClick={goBack}
        >
          {" "}
          <ArrowLeft size="32" color="#636C7E" />
          <span className=" text-black-slate-900 font-medium">
            Back to homepage
          </span>
        </h2>
        <h2 className=" my-4 text-xl font-semibold text-center mx-auto">
          Suggested Financial Plan
        </h2>
        <div></div>
      </div>
      <div className=" px-4 sm:px-6">
        <div className=" my-[1rem] mx-auto max-w-[718px] rounded-lg border border-solid border-gray-slate-100 p-4">
          <div>
            <div className=" flex gap-x-3">
              <div className=" bg-black-slate-800 rounded-full w-8 h-8 flex justify-center items-center">
                <Cpu size="20" color="#E8EAED" />
              </div>
              <h3 className=" text-black-slate-900 font-semibold text-lg">
                Heading
              </h3>
            </div>
            <p className=" text-black-slate-900 font-normal ml-11">
              Lorem ipsum dolor sit amet consectetur. Vitae eleifend imperdiet
              id sed orci vestibulum augue tellus. Dictumst quisque eget metus
              felis tortor. Augue scelerisque pellentesque scelerisque dui non
              tincidunt pharetra. Interdum tortor suspendisse facilisi laoreet
              interdum amet sit. Lacus ac pharetra adipiscing mattis. Pharetra
              etiam diam arcu lectus sagittis pretium lectus. Lectus elit metus
              enim urna ultricies quis egestas gravida enim. Faucibus vitae sit
              scelerisque vel dignissim nunc nibh eu in. Id malesuada at
              placerat ac quis risus risus. Vulputate leo ut eu elementum.
              Turpis eget sed varius imperdiet sem facilisi dui. Faucibus sit
              dui arcu blandit convallis tempor ut neque.
            </p>
          </div>
          <div className=" ml-11 my-2">
            <div className=" flex gap-x-3">
              <h3 className=" text-black-slate-900 font-semibold text-lg">
                Heading
              </h3>
            </div>
            <p className=" text-black-slate-900 font-normal">
              Lorem ipsum dolor sit amet consectetur. Vitae eleifend imperdiet
              id sed orci vestibulum augue tellus. Dictumst quisque eget metus
              felis tortor. Augue scelerisque pellentesque scelerisque dui non
              tincidunt pharetra. Interdum tortor suspendisse facilisi laoreet
              interdum amet sit. Lacus ac pharetra adipiscing mattis. Pharetra
              etiam diam arcu lectus sagittis pretium lectus. Lectus elit metus
              enim urna ultricies quis egestas gravida enim. Faucibus vitae sit
              scelerisque vel dignissim nunc nibh eu in. Id malesuada at
              placerat ac quis risus risus. Vulputate leo ut eu elementum.
              Turpis eget sed varius imperdiet sem facilisi dui. Faucibus sit
              dui arcu blandit convallis tempor ut neque.
            </p>
          </div>
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
