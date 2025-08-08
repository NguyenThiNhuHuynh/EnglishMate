"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  iconSrc?: string;
  avatarSrc?: string;
  cursor?: "text" | "pointer" | "default";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  iconSrc,
  avatarSrc,
  placeholder = "",
  readOnly = false,
  cursor = "text",
  onClick,
  value,
  onChange,
  onKeyDown,
  className = "",
  ...rest // nhận tất cả thuộc tính còn lại của input
}) => {
  return (
    <div className={clsx("flex gap-[9px] items-center w-full", className)}>
      {avatarSrc && (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={avatarSrc || "/assets/images/capy.jpg"}
            alt="Avatar"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div
        className="flex items-center gap-[20px] background-light400_dark400 rounded-full px-[20px] py-[12px] w-full"
        onClick={onClick}
      >
        {iconSrc && (
          <Icon icon={iconSrc} className="size-[24px] text-dark300_light300" />
        )}
        <input
          className={clsx(
            "w-full h-[17px] bg-transparent outline-none placeholder:text-dark300_light300 text-dark100_light100 text-[16px] font-normal",
            `cursor-${cursor}`
          )}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          {...rest} // truyền các props còn lại cho input
        />
      </div>
    </div>
  );
};

export default Input;
