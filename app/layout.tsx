import React, { useEffect } from "react";
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
    <html lang="en">
      <body className="relative">
        {/* <ClerkProvider
                  appearance={{
                    elements: {
                      formButtonPrimary: "primary-gradient",
                      footerActionLink:
                        "primary-gradient hover:text-primary-500",
                    },
                  }}
                > */}
        <ThemeProvider>{children}</ThemeProvider>
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
