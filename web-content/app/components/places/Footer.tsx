import { models } from "@/app/constants/mock-data";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import {
  AttachCircle,
  Microphone2,
  Send2,
  Global,
  Add,
  Chart,
} from "iconsax-react";
import { RefObject, SetStateAction } from "react";
export default function FooterComponent({
  selectedFile,
  handleClear,
  fileInputRef,
  handleFileChange,
  handleButtonClick,
  setPrompt,
  handleGenerate,
  value,
  handleShowDashboard,
  showDashboard,
  errorMessage,
  isInvalid,
  acceptTypes,
  notFixedPosition,
}: {
  selectedFile: File | null;
  handleClear: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  setPrompt: (value: SetStateAction<string>) => void;
  handleGenerate?: (() => Promise<void>) | (() => void);
  value?: string;
  handleShowDashboard?: (() => Promise<void>) | (() => void);
  showDashboard?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  acceptTypes?: string;
  notFixedPosition?: boolean;
}) {
  const wrapperStyle = [
    "bg-white",
    "placeholder:text-gray-slate-400 dark:placeholder:text-white/60",
    "border border-solid border-gray-slate-300 rounded-[168px]",
  ];
  const selectInput = [
    "placeholder:text-black-slate-900",
    "border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200",
  ];
  return (
    <div>
      <footer
        className={` ${
          !notFixedPosition &&
          "fixed bottom-0 left-0 right-0 bg-white pb-2 px-32 z-50"
        }`}
      >
        <div>
          {selectedFile && (
            <div className=" flex gap-x-3 items-center bg-gray-slate-200 border border-solid border-gray-slate-100 rounded-[168px] p-2 w-fit">
              <h4 className=" text-black-slate-900 font-normal text-sm">
                {selectedFile.name}
              </h4>
              <Button
                onPress={handleClear}
                color="primary"
                variant="shadow"
                className=" bg-transparent shadow-none text-blue-slate-600 font-medium px-0 min-w-4 h-full"
              >
                <span className=" rotate-45">
                  <Add size="20" color="#636C7E" />
                </span>
              </Button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            name="media"
            id="file-upload"
            accept={acceptTypes}
          />
        </div>

        <Input
          aria-label="Prompt input"
          className="w-full my-2"
          classNames={{
            inputWrapper: wrapperStyle,
          }}
          onChange={(e) => setPrompt(e.target.value)}
          errorMessage={errorMessage}
          isInvalid={isInvalid}
          value={value}
          startContent={
            <div className=" flex items-center gap-x-2">
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={handleButtonClick}
              >
                <AttachCircle size="20" color="#636C7E" />
              </button>
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => {}}
              >
                <Microphone2 size="20" color="#636C7E" />
              </button>
            </div>
          }
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={handleGenerate}
            >
              <Send2 size="20" color="#636C7E" />
            </button>
          }
          placeholder="Ask me something you want to know"
          type="text"
          variant="bordered"
        />

        <div className=" flex">
          {!notFixedPosition && (
            <Button
              startContent={<Global size="20" color="#636C7E" />}
              variant="bordered"
              className="bg-gray-slate-200 text-black-slate-900 border border-gray-slate-100 px-[10px] font-normal rounded-[168px]"
              disabled={false}
            >
              Search web
            </Button>
          )}
          {!notFixedPosition && (
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
          )}

          {showDashboard && (
            <Button
              startContent={<Chart size="20" color="#636C7E" />}
              variant="bordered"
              className="bg-gray-slate-200 text-black-slate-900 border border-gray-slate-100 px-[10px] font-normal rounded-[168px]"
              disabled={false}
              onPress={handleShowDashboard}
            >
              Show Chart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
