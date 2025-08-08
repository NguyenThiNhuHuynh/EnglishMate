"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface TextAreaProps {
  iconSrc?: string;
  avatarSrc?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: () => void;
  className?: string;
}

const TextArea = ({
  iconSrc,
  avatarSrc,
  placeholder,
  value,
  onChange,
  onClick,
  className = "",
}: TextAreaProps) => {
  return (
    <div className={`flex gap-[9px] w-full ${className}`}>
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
      <div className="flex w-full background-light400_dark400 px-[20px] py-[12px] rounded-[12px]">
        <textarea
          value={value}
          onChange={onChange}
          rows={1}
          placeholder={placeholder}
          className="w-full h-14 bg-transparent resize-none outline-none text-dark100_light100 text-[16px] font-normal placeholder:text-dark300_light300"
        />
        {iconSrc && (
          <div className="flex justify-between mt-2">
            <button
              onClick={onClick}
              className="text-primary-100 text-[20px] hover:opacity-80"
            >
              <Icon
                icon={iconSrc}
                className="size-[24px] placeholder:text-dark300_light300"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
