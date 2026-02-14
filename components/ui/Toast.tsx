"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDone: () => void;
  durationMs?: number;
}

export default function Toast({
  message,
  visible,
  onDone,
  durationMs = 2000,
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDone, 300); // wait for fade-out
    }, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, onDone]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#323232] text-white text-sm px-5 py-3 rounded-lg shadow-lg transition-opacity duration-300 z-50 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
