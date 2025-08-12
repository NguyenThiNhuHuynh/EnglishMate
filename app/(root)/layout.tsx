"use client";

import Sidebar from "@/components/shared/sidebar/Sidebar";
import React, { useState } from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react/dist/iconify.js";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="background-light500_dark500 relative min-h-screen flex">
      <button
        type="button"
        className="md:hidden fixed top-3 left-3 z-50 inline-flex items-center justify-center rounded-lg p-2 background-light200_dark200 border text-primary100 shadow-sm"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        title="Menu"
      >
        <Icon icon="solar:hamburger-menu-linear" width="22" height="22" />
      </button>

      <Sidebar
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={clsx(
          "flex-1 flex flex-col overflow-y-auto transition-[margin] duration-300",
          "ml-0",
          "md:ml-16",
          "lg:ml-[240px]"
        )}
      >
        <section className="background-light500_dark500 flex-1 flex flex-col">
          <div className="background-light500_dark500 mx-auto size-full p-6">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
