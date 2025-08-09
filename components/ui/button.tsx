import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children?: React.ReactNode;
  title?: string;
  color?: string; // background color
  fontColor?: string;
  border?: string;
  size?: "small" | "large";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  title,
  color = "background-primary100",
  fontColor = "text-dark100_light200",
  border = "",
  size = "large",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => {
  const sizeClass =
    size === "small" ? "w-auto px-[30px] py-[10px]" : "w-full py-[12px]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "text-[16px] font-medium whitespace-nowrap rounded-[12px]",
        sizeClass,
        color,
        fontColor,
        border,
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children || title}
    </button>
  );
};

export default Button;
