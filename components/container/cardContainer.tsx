"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
}

export default function CardContainer({
  children,
  className,
}: CardContainerProps) {
  return (
    <div
      className={clsx(
        "rounded-lg shadow-md background-light200_dark200 p-4 flex flex-col gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}
