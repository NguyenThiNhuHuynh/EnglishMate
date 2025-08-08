"use client";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" background-light500_dark500 relative h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto ml-[240px]">
        <section className="background-light500_dark500 flex-1 flex flex-col">
          <div className="background-light500_dark500 mx-auto size-full p-4">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
