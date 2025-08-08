import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeProvider";

export const metadata: Metadata = {
  title: "Mingle",
  description: "Social Network",
  icons: {
    icon: "/public//assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="" data-theme="light">
      <body className="relative">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
