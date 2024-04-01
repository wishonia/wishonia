"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("92642270-3574-4992-9524-22046fb93044");
  }, []);

  return null;
};
