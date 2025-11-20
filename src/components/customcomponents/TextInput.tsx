import { Input } from "../ui/input";
import React from "react";

interface TextInputProps {
  placeholder: string;
  type: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref?: React.RefCallback<HTMLInputElement>;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  error?: string;
  maxLength?: number;
  className?: string;
  inputClassName?: string;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  name?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      placeholder,
      type,
      value,
      onChange,
      onKeyDown,
      icon,
      style,
      error,
      maxLength,
      className,
      inputClassName,
      rightIcon,
      disabled,
      name,
    },
    ref
  ) => {
    return (
      <div className={`relative ${className}`}>
        {/* Wrap input and icons in a fixed-height div */}
        <div className="relative h-[56px]">
          {" "}
          {/* Adjust height as needed */}
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            {icon}
          </div>
          <Input
            name={name}
            type={type}
            placeholder={placeholder}
            className={`${inputClassName} pl-13 py-7 focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-gray-800 rounded-full bg-lightdark border ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-gray-600 focus:border-gray-400"
            } text-white placeholder:text-grey placeholder:font-light focus:outline-none ${
              type === "number"
                ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : ""
            }`}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            ref={ref}
            style={style}
            maxLength={maxLength}
            disabled={disabled}
            // min={0}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message below input wrapper */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
