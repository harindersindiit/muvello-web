import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  iconAlt?: string;
  canDelete?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

interface SelectComponentProps {
  value?: string | "";
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: DropdownOption[];
  className?: string;
  icon?: string;
  iconAlt?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fallbackValue?: string;
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
  fallbackValue = "",
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
        <div className="flex items-center gap-2 text-white w-full">
          {value ? (
            <>
              {(() => {
                const selectedOption = options.find(
                  (option) => option.value === value
                );
                return (
                  <>
                    {selectedOption?.icon && (
                      <img
                        src={selectedOption.icon}
                        alt={selectedOption.iconAlt || selectedOption.label}
                        className="w-5 h-5 flex-shrink-0"
                      />
                    )}
                    <span className="text-white">
                      {selectedOption?.label || fallbackValue || value}
                    </span>
                  </>
                );
              })()}
            </>
          ) : (
            <>
              {icon && (
                <img
                  src={icon}
                  alt={iconAlt}
                  className="w-5 h-5 flex-shrink-0"
                />
              )}
              <SelectValue placeholder={placeholder} className="text-white" />
            </>
          )}
        </div>
      </SelectTrigger>

      <SelectContent
        className={`${getVariantClasses()} text-white border-none shadow-[0px_10px_20px_0px_rgba(0,0,0,0.10),0px_3px_6px_0px_rgba(0,0,0,0.10)] [&_*]:text-white`}
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
              className="cursor-pointer hover:text-primary text-white data-[highlighted]:text-white data-[state=checked]:text-white focus:text-white"
            >
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <img
                      src={option.icon}
                      alt={option.iconAlt || option.label}
                      className="w-5 h-5 flex-shrink-0 self-center"
                    />
                  )}
                  <span className="self-center">{option.label}</span>
                </div>

                {option.canDelete && option.onDelete && (
                  <button
                    type="button"
                    className={`text-xs rounded-full px-3 py-1 border border-red-500 text-red-400 hover:text-white hover:bg-red-500 transition-colors ${
                      option.isDeleting ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      event.nativeEvent?.stopImmediatePropagation?.();

                      if (!option.isDeleting) {
                        option.onDelete?.();
                      }
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      event.nativeEvent?.stopImmediatePropagation?.();
                    }}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      event.nativeEvent?.stopImmediatePropagation?.();
                    }}
                    onPointerUp={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      event.nativeEvent?.stopImmediatePropagation?.();
                    }}
                    disabled={option.isDeleting}
                  >
                    {option.isDeleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
