"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputTitleProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
}

const InputTitle: React.FC<InputTitleProps> = ({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
  name,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && !showPassword ? "password" : "text";

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[16px] text-dark100_light100 font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent h-12 rounded-[12px] border border-[#CCCCCC] px-4 py-2 pr-10 text-dark100_light100 outline-none placeholder:text-dark300_light300"
        />
        {isPasswordType && (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputTitle;
