"use client";
import { useState } from "react";
import { createWorker } from "tesseract.js";

export function useOCRProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const processImage = async (imageFile) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const worker = await createWorker("spa", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const {
        data: { text },
      } = await worker.recognize(imageFile);
      await worker.terminate();

      setIsProcessing(false);
      return text;
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
      throw err;
    }
  };

  return { processImage, isProcessing, progress, error };
}
