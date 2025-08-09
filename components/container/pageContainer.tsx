"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={clsx("max-w-screen-lg flex flex-col gap-5", className)}>
      {children}
    </div>
  );
}
