"use client";

import { useEffect, useState } from "react";

import { DonateModal } from "@/components/donate-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DonateModal />
    </>
  );
};
