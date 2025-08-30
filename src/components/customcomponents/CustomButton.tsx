import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface CustomButtonProps {
  text: string;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  disableHover?: boolean;
}

const CustomButton = ({
  text,
  type,
  style,
  className,
  onClick,
  icon,
  disabled = false,
  disableHover = false,
}: CustomButtonProps) => {
  const hoverClasses = disableHover
    ? ""
    : "hover:opacity-80 hover:shadow-lg cursor-pointer";
  return (
    <Button
      disabled={disabled}
      type={type}
      onClick={onClick}
      style={style}
      variant="outline"
      className={`w-full rounded-full py-7 bg-primary  text-black font-semibold transition-all duration-300 ${hoverClasses} ${className}`}
    >
      {icon ? icon : null}
      {text ? text : null}

      {disabled && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
    </Button>
  );
};

export default CustomButton;
