"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import Theme from "../theme/Theme";
import { Icon } from "@iconify/react/dist/iconify.js";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  //   const { profile, setProfile, logout } = useAuth();

  //   useEffect(() => {
  //     let isMounted = true;
  //     const fetchProfile = async () => {
  //       try {
  //         const userId = localStorage.getItem("userId");
  //         if (userId) {
  //           const profileData = await getMyProfile(userId);
  //           if (isMounted) {
  //             setProfile(profileData.userProfile);
  //           }
  //         }
  //       } catch (err) {
  //         setError("Failed to fetch profile");
  //         console.error(err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchProfile();
  //     return () => {
  //       isMounted = false;
  //     };
  //   }, []);

  const handleNavigateToSignIn = () => {
    router.push("/sign-in");
  };

  if (loading) return <div className="mt-96">Loading...</div>;
  if (error) return <div className="mt-96">Error: {error}</div>;

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-[240px] background-light200_dark200 flex flex-col justify-between">
      <div className="flex flex-col items-center gap-6 py-6">
        <Link href="/" className="flex items-center gap-1">
          <p className="text-dark100_light100 text-[28px] font-medium logo2">
            English
            <span className="text-primary100 logo">Mate</span>
          </p>
        </Link>

        <Theme />

        <nav className="flex flex-col gap-3 w-full px-4">
          <Link
            href="/"
            className={clsx(
              "px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-3", // Thêm flex và gap
              pathname === "/" &&
                "bg-primary-100 text-dark100_light100 font-medium",
              pathname !== "/" && "text-dark300_light300",
              pathname === "/" && "text-dark100_light100",
              "hover:text-primary100"
            )}
          >
            <Icon icon="solar:user-linear" width="24" height="24" />
            <span>Profile</span>
          </Link>

          <Link
            href="/ask-fix"
            className={clsx(
              "px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-3", // Thêm flex và gap
              pathname === "/ask-fix" &&
                "bg-primary-100 text-dark100_light100 font-medium",
              pathname !== "/ask-fix" && "text-dark300_light300",
              pathname === "/ask-fix" && "text-dark100_light100",
              "hover:text-primary100"
            )}
          >
            <Icon
              icon="material-symbols:post-outline-rounded"
              width="24"
              height="24"
            />
            <span>Ask Fix</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
