import { Textarea } from "../ui/textarea";
import React from "react";

interface CustomTextAreaProps {
  placeholder?: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  icon?: React.ReactNode;
  error?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
  name?: string;
}

const CustomTextArea = React.forwardRef<
  HTMLTextAreaElement,
  CustomTextAreaProps
>(
  (
    {
      name,
      placeholder,
      value,
      onChange,
      icon,
      error,
      maxLength,
      rows = 10,
      className,
    },
    ref
  ) => {
    return (
      <div className="relative">
        <div className="flex items-start">
          <div className="absolute left-5 top-4 pointer-events-none">
            {icon}
          </div>
          <Textarea
            name={name}
            ref={ref}
            placeholder={placeholder}
            value={value}
            rows={rows}
            onChange={onChange}
            className={`${className} resize-y min-h-[100px] py-4 pl-13 focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-grey rounded-xl bg-lightdark border border-transparent text-white placeholder:text-grey placeholder:font-light focus:outline-none focus:border-grey`}
            maxLength={maxLength}
            autore
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;
