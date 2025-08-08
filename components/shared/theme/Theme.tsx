import React from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import Image from "next/image";

const ThemeSwitcher = () => {
  const { mode, setMode } = useTheme();

  return (
    <button
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
      className="p-2 rounded-full"
      aria-label="Toggle Theme"
    >
      {mode === "light" ? (
        <Image src="/assets/icons/sun.svg" alt="sun" width={20} height={20} />
      ) : (
        <Image src="/assets/icons/moon.svg" alt="moon" width={20} height={20} />
      )}
    </button>
  );
};

export default ThemeSwitcher;
