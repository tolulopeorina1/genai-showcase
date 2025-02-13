"use client";

import { useRef, useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Slider,
  Spinner,
} from "@heroui/react";
import {
  ArrowLeft,
  DocumentUpload,
  Edit2,
  TickCircle,
  Trash,
} from "iconsax-react";
import HeaderComponent from "../../components/places/HeaderComponent";
import { useRouter } from "next/navigation";
import { aspectRatio, models } from "../../constants/mock-data";
import Image from "next/image";
import { div } from "framer-motion/client";
import { endpointData } from "@/app/constants/endpointa";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";
import { Amplify } from "aws-amplify";
Amplify.configure(ampConfig);
import { downloadData, getUrl } from "aws-amplify/storage";
import { ampConfig } from "@/aws-amp-config";

export default function VirtualTryOn() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useRouter();
  const generateId = () => uuidv4();
  const [returnedImages, setReturnedImages] = useState<string[]>([]);
  const [isGeneratedImage, setIsGenerate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const goBack = () => {
    navigate.back();
  };
  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-[8px]",
  ];
  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-300 rounded-[8px] bg-gray-slate-200",
  ];

  const getImageUrls = async (imagesPaths: string[]) => {
    console.log(imagesPaths);
    try {
      const urlPromises = imagesPaths?.map(async (path) => {
        const { url } = await getUrl({ path });
        console.log(url);

        return url.toString();
      });
      return Promise.all(urlPromises);
    } catch (err) {
      setError("Error generating plot URLs");
      return [];
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Check if file is an image and generate preview URL
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const [formData, setFormData] = useState({
    negativePrompt: "",
    productService: "",
    aspectRatio: "", // Assuming default empty or set to a default option
    numImages: 3, // Default value of the slider
  });
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // Handle drag-and-drop file selection
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Function to resize the image
  const resizeImage = async (
    file: File,
    minWidth: number = 320,
    minHeight: number = 320,
    maxWidth: number = 4096,
    maxHeight: number = 4096
  ) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    let targetWidth = img.width;
    let targetHeight = img.height;

    // Scale up if the image is smaller than the minimum dimensions
    if (targetWidth < minWidth || targetHeight < minHeight) {
      const scale = Math.max(minWidth / targetWidth, minHeight / targetHeight);
      targetWidth = Math.round(targetWidth * scale);
      targetHeight = Math.round(targetHeight * scale);
    }

    // Scale down if the image is larger than the maximum dimensions
    if (targetWidth > maxWidth || targetHeight > maxHeight) {
      const scale = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
      targetWidth = Math.round(targetWidth * scale);
      targetHeight = Math.round(targetHeight * scale);
    }

    // Use browser-image-compression to resize the image
    const options = {
      maxWidthOrHeight: Math.max(targetWidth, targetHeight), // Resize to fit within the target dimensions
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error resizing image:", error);
      throw error;
    }
  };

  const uploadFile = async (
    file: File,
    sessionId: string,
    negativePrompt?: string,
    serviceType?: string,
    numberOfImages: string = "3",
    sizeWithRatio: string = "1280 x 720 (16:9)"
  ) => {
    try {
      if (!previewUrl) return;
      setLoading(true);
      const formData = new FormData();
      const resizedImage = await resizeImage(file, 640, 640, 640, 640);
      console.log(resizedImage, file);

      formData.append("sessionId", sessionId); // Required
      formData.append("image", resizedImage); // Required file upload
      if (negativePrompt) formData.append("negativePrompt", negativePrompt);
      if (serviceType) formData.append("serviceType", serviceType);
      formData.append("numberOfImages", numberOfImages); // Default: 3
      formData.append("sizeWithRatio", sizeWithRatio); // Default: 1280x720
      console.log(formData);

      const response = await fetch(
        "https://jjg4puugocxyustegcaqzy6yi40lqfos.lambda-url.us-east-1.on.aws",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Upload successful:", result);
      if (result?.imagePaths.length > 0) {
        const imagePaths = await getImageUrls(result?.imagePaths);
        setReturnedImages(imagePaths);
        setIsGenerate(true);
      } else {
        setIsGenerate(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setIsGenerate(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className=" h-[calc(100vh-71px)]">
      <HeaderComponent
        header={"Cecure Intelligence Limited - Gen AI Showcase"}
      />
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-slate-200 p-4 flex flex-col border border-solid border-r-gray-slate-100">
          <Textarea
            className="w-full my-3"
            label="Negative prompt"
            labelPlacement="outside"
            placeholder="Add negative prompt"
            variant="bordered"
            name="negativePrompt"
            value={formData.negativePrompt}
            onChange={handleChange}
            classNames={{
              inputWrapper: wrapperStyle,
              label: "text-sm",
            }}
          />

          <Input
            label="Product/Service"
            labelPlacement="outside"
            name="productService"
            placeholder="Product/Service"
            value={formData.productService}
            onChange={handleChange}
            className="w-full my-3"
            size="lg"
            classNames={{
              inputWrapper: wrapperStyle,
              label: "text-sm",
            }}
            type="text"
          />

          <Select
            label="Size (px) / Aspect Ratio"
            labelPlacement="outside"
            className="text-black-slate-900 font-normal rounded-[8px] bg-gray-slate-200 w-full my-3"
            items={aspectRatio}
            placeholder="1280 x 720 (16:9)"
            name="aspectRatio"
            // selectedKeys={new Set([formData.aspectRatio])}
            onChange={(key) =>
              setFormData((prev) => ({
                ...prev,
                aspectRatio: key.target.value,
              }))
            }
            classNames={{
              trigger: selectInput,
              value: "text-black-slate-900",
            }}
            variant="flat"
            size="lg"
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

          <Slider
            label="Numbers of Images"
            step={1}
            maxValue={5}
            minValue={1}
            defaultValue={formData.numImages}
            value={formData.numImages}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                numImages: Array.isArray(value) ? value[0] : value,
              }))
            }
            showTooltip
            classNames={{
              thumb: "bg-white border-1 border-black w-5 h-5",
              track: "bg-[#D9D9D9]",
            }}
            tooltipProps={{ placement: "bottom" }}
            hideValue
          />

          {selectedFile && (
            <motion.div
              className="items-center my-3 mt-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                type="submit"
                variant="flat"
                className="w-[247px] bg-blue-slate-600 text-white rounded-lg"
                disabled={loading}
                size="lg"
                onPress={() =>
                  uploadFile(
                    selectedFile as File,
                    generateId(),
                    formData.negativePrompt,
                    formData.productService,
                    formData.numImages.toString()
                  )
                }
              >
                {loading ? <Spinner /> : "Regenerate"}
              </Button>
            </motion.div>
          )}
        </aside>

        {/* Chat Section */}
        <main className="w-3/4 flex flex-col">
          <header className=" grid grid-cols-3 items-center px-8 py-2">
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

            <div></div>
          </header>

          {!isGeneratedImage ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="  w-full">
                <div
                  className={` flex justify-center flex-col gap-x-3 m-auto w-[540px] h-[264px] border-[1.5px] border-dashed border-[#D0D5DD] rounded-2xl ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-400 bg-gray-50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {!selectedFile && (
                    <>
                      <div className=" flex justify-center items-center w-12 h-12 rounded-full bg-gray-slate-50 mx-auto">
                        <DocumentUpload size="20" color="#484F5B" />
                      </div>
                      <div className=" text-center">
                        <h4 className=" text-black-slate-900 font-normal">
                          <span
                            className=" cursor-pointer text-blue-slate-500 font-semibold"
                            onClick={handleButtonClick}
                          >
                            Click to upload
                          </span>{" "}
                          <span>or drag and drop</span>
                        </h4>
                        <h4>JPEG, GIF, PNG and TIFF</h4>
                        <h4>Max. 20mb</h4>
                      </div>
                    </>
                  )}
                  {selectedFile && (
                    <div className=" flex gap-x-3 flex-col justify-center items-center">
                      <div className=" flex justify-center items-center w-12 h-12 rounded-full bg-gray-slate-25">
                        <TickCircle size="20" color="#10B981" variant="Bold" />
                      </div>
                      <div className=" text-center">
                        <h4 className=" text-black-slate-900 font-semibold my-2">
                          {selectedFile.name}
                        </h4>
                        <h4 className=" text-gray-slate-500 text-sm font-medium">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </h4>
                      </div>
                      <div
                        className=" mx-auto cursor-pointer my-2"
                        onClick={handleClear}
                      >
                        <Trash size="20" color="#DC2626" />
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  name="media"
                  id="file-upload"
                  accept=" .jpeg, .jpg"
                />
              </div>
              {/* {previewUrl && (
              <div className="w-full max-h-[25rem] flex items-center justify-center overflow-hidden border rounded-[17px]">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto object-contain"
                />
              </div>
            )} */}

              {selectedFile && (
                <motion.div
                  className="flex justify-end items-center my-4 mx-auto w-[540px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    type="submit"
                    variant="flat"
                    className="w-[247px] bg-blue-slate-600 text-white rounded-lg"
                    disabled={loading}
                    size="lg"
                    onPress={() =>
                      uploadFile(
                        selectedFile as File,
                        generateId(),
                        formData.negativePrompt,
                        formData.productService,
                        formData.numImages.toString()
                      )
                    }
                  >
                    {loading ? <Spinner /> : "Generate"}
                  </Button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className=" flex items-center justify-center flex-wrap gap-2 h-[calc(100vh-119px)] overflow-y-scroll customScrollBar">
              {returnedImages.map((item) => (
                <img
                  src={item}
                  alt={item}
                  key={item}
                  width={400}
                  className=" min-w-[100px] max-w-[300px] rounded-lg"
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
