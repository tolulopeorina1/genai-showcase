"use client";
import { Button, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { loginUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import { Add, Cpu, PresentionChart, User } from "iconsax-react";

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
      <div className=" px-4 sm:px-6">
        <div className=" my-[1rem] mx-auto max-w-[800px] p-4">
          <div>
            <div className=" flex justify-end mr-11">
              <div className="  bg-gray-slate-200 border border-solid border-gray-slate-100 rounded-[10px] p-2 w-fit">
                <div className=" flex gap-x-3 items-center">
                  <h4 className=" text-black-slate-900 font-semibold text-sm">
                    Transaction_22_Jan_2024.pdf
                  </h4>

                  <Button
                    onPress={() => {}}
                    color="primary"
                    variant="shadow"
                    className=" bg-transparent shadow-none text-blue-slate-600 font-medium px-0 min-w-4 h-full"
                  >
                    <span className=" rotate-45">
                      <Add size="20" color="#636C7E" />
                    </span>
                  </Button>
                </div>
                <h4 className=" text-gray-slate-500 text-sm font-medium mt-2">
                  {1000 < 1024 * 1024
                    ? `${(1000 / 1024).toFixed(2)} KB`
                    : `${(1000 / (1024 * 1024)).toFixed(2)} MB`}
                </h4>
              </div>
            </div>
            <div className=" flex gap-x-3 justify-between my-2 items-center">
              <p className=" text-right">
                Lorem ipsum dolor sit amet consectetur. Egestas pulvinar vel
                massa non platea dictum adipiscing venenatis. Quis platea neque
                purus est elementum dolor in
              </p>
              <div className=" bg-blue-slate-500 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                <User size="20" color="#E8EAED" />
              </div>
            </div>

            <div className=" flex gap-x-3 my-2 bg-blue-slate-250 rounded-lg p-4">
              <div className=" bg-black-slate-800 rounded-full w-8 h-8 min-w-8 flex justify-center items-center">
                <Cpu size="20" color="#E8EAED" />
              </div>
              <div>
                <div className="relative w-[270px] h-[150px]">
                  <svg className="w-full h-full relative" viewBox="0 0 100 60">
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
                  {/* {data?.status !== "High Fraud Score" && (
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
                      )} */}

                  <div className=" absolute text-center bottom-[-20px] right-[76px]">
                    <h4 className=" text-[40px] font-extrabold text-black-slate-900">
                      {progress}
                    </h4>
                    <h4 className=" text-black-slate-700 font-medium"> /100</h4>
                    <div className=" bg-red-slate-50 rounded-[23px] px-1 py-2 text-center">
                      <p className=" text-red-slate-800 font-medium text-xs ">
                        High Fraud Score
                      </p>
                    </div>
                  </div>
                </div>
                <p className=" mt-3  text-black-slate-700 font-normal text-sm">
                  Transaction looks good and less likely to be a fraudulent
                  transaction giving with a score of <strong>20/100</strong>.
                </p>
                <div className=" flex items-center gap-x-2 bg-gray-slate-100 w-[130px] rounded-[4px] p-1 cursor-pointer mt-2">
                  <PresentionChart size="20" color="#636C7E" />
                  <span className=" font-medium text-xs text-black-slate-900">
                    View dashboard
                  </span>
                </div>
              </div>
            </div>
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
