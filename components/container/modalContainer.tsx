"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface ModalContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ModalContainer({
  children,
  className,
}: ModalContainerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={clsx(
          "flex flex-col gap-5 rounded-lg p-4 w-auto max-w-[90vw] max-h-[90vh] overflow-y-auto background-light500_dark500",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
