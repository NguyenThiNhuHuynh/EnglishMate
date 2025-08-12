"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Theme from "../theme/Theme";
import { Icon } from "@iconify/react/dist/iconify.js";

type SidebarProps = {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const isAsk = pathname === "/ask-fix" || pathname?.startsWith("/ask-fix/");

  const NavItem: React.FC<{
    href: string;
    icon: string;
    label: string;
    active?: boolean;
  }> = ({ href, icon, label, active }) => (
    <Link
      href={href}
      className={clsx(
        "px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-3",
        active
          ? "bg-primary-100 text-dark100_light100 font-medium"
          : "text-dark300_light300 hover:text-primary100",
        "md:justify-center lg:justify-start"
      )}
      title={label}
      onClick={() => {
        onCloseMobile?.();
      }}
    >
      <Icon icon={icon} width="24" height="24" />
      <span className="md:hidden lg:inline">{label}</span>
    </Link>
  );

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 h-screen background-light200_dark200 flex flex-col justify-between border-r border-light400_dark400 transition-transform",
          "w-[240px] md:w-20 lg:w-[240px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-label="Sidebar"
      >
        <div className="flex flex-col items-stretch gap-6 py-6">
          <div className="px-4 flex items-center justify-between mx-auto">
            <Link href="/" className="md:hidden lg:flex items-center gap-1">
              <p className="text-dark100_light100 text-[28px] font-medium logo2">
                English<span className="text-primary100 logo">Mate</span>
              </p>
            </Link>
            <Link
              href="/"
              className="hidden md:flex lg:hidden items-center justify-center w-10 h-10 rounded-xl background-light400_dark400 text-primary100 mx-auto"
              title="EnglishMate"
              onClick={onCloseMobile}
            >
              <span className="text-sm font-semibold">EM</span>
            </Link>

            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-dark300_light300 hover:text-primary100"
              aria-label="Close menu"
              title="Close"
            >
              <Icon
                icon="material-symbols:close-rounded"
                width="22"
                height="22"
              />
            </button>
          </div>

          <div className="px-4 block mx-auto">
            <Theme />
          </div>

          <nav className="flex flex-col gap-3 w-full px-4">
            <NavItem
              href="/"
              icon="solar:user-linear"
              label="Profile"
              active={pathname === "/"}
            />
            <NavItem
              href="/ask-fix"
              icon="material-symbols:post-outline-rounded"
              label="Ask Fix"
              active={isAsk}
            />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
