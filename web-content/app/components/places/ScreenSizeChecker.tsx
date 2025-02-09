"use client";
import { useState, useEffect } from "react";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

const ScreenSizeChecker = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      onOpen();
    };
    if (window.innerWidth < 768) {
      handleResize();
    }
  });
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      onOpen();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Screen size alert
            </ModalHeader>
            <ModalBody>
              <p>Please switch to a larger screen to access this app.</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  ) : null;
};

export default ScreenSizeChecker;
