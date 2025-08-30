import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectComponentProps {
  value?: string | "";
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
  icon?: string;
  iconAlt?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  value,
  onChange,
  placeholder = "Select an option",
  options = [],
  className = "",
  icon,
  iconAlt = "icon",
  variant = "default",
  size = "md",
  disabled = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 bg-transparent";
      case "ghost":
        return "bg-transparent hover:bg-gray-100";
      default:
        return "bg-lightdark border-none text-white";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-4 px-3 text-xs";
      case "lg":
        return "py-8 px-5 text-base";
      default:
        return "py-7 px-4 text-sm";
    }
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        disabled={disabled}
        className={`${getVariantClasses()} ${getSizeClasses()} w-full rounded-full flex !shadow-none focus:!shadow-none focus:!ring-0 focus:!ring-transparent items-center justify-between gap-2 placeholder:text-gray-400 ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center gap-[16px] text-grey w-full">
          {icon && <img src={icon} alt={iconAlt} className="relative left-1" />}
          <SelectValue placeholder={placeholder} className="text-white" />
        </div>
      </SelectTrigger>

      {/* <SelectContent
        className={`${getVariantClasses()} text-white border-none shadow-[0px_10px_20px_0px_rgba(0,0,0,0.10),0px_3px_6px_0px_rgba(0,0,0,0.10)]`}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={`cursor-pointer hover:text-primary`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent> */}

      <SelectContent
        className={`${getVariantClasses()} text-white border-none shadow-[0px_10px_20px_0px_rgba(0,0,0,0.10),0px_3px_6px_0px_rgba(0,0,0,0.10)]`}
      >
        {/* Optional Placeholder Item (not selectable but gives context) */}
        {!value && (
          <SelectItem
            value="__placeholder__"
            disabled
            className="text-gray-400 cursor-default"
          >
            {placeholder}
          </SelectItem>
        )}

        {options
          .filter((option) => option.value !== "")
          .map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer hover:text-primary"
            >
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
