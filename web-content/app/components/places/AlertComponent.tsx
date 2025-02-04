import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";

export default function AlertComponent({
  isOpenRes,
  toggleNotification,
  responseType,
  responseMessage,
}: {
  isOpenRes: boolean;
  toggleNotification: () => void;
  responseType: string;
  responseMessage: string;
}) {
  return (
    <AnimatePresence>
      {isOpenRes && (
        <motion.div
          initial={{ x: 300, opacity: 0 }} // Slide in from the right
          animate={{ x: 0, opacity: 1 }} // Position when visible
          exit={{ x: 300, opacity: 0 }} // Slide out to the right
          transition={{ duration: 0.3 }} // Animation duration
          className={`fixed right-5 top-5 z-50 w-[300px] rounded-lg ${
            responseType === "success" ? "bg-[#d9ffd9]" : "bg-[#ffd6d6]"
          } p-4 shadow-lg`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-grow">
              {responseType === "success" ? (
                <h4 className="font-medium text-default-900">Success</h4>
              ) : (
                <h4 className="font-medium text-default-900">Error</h4>
              )}

              <p className="text-sm text-default-700">{responseMessage}</p>
            </div>
            <Button
              isIconOnly
              radius="full"
              size="sm"
              onPress={toggleNotification}
            >
              ✖
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
