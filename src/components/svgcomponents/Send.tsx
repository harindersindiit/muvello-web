interface SendProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

const SendIcon = ({
  className = "",
  color = "white",
  width = 24,
  height = 24,
  onClick = null,
}: SendProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      onClick={onClick}
    >
      <path
        d="M7.39993 6.32015L15.8899 3.49015C19.6999 2.22015 21.7699 4.30015 20.5099 8.11015L17.6799 16.6002C15.7799 22.3102 12.6599 22.3102 10.7599 16.6002L9.91993 14.0802L7.39993 13.2402C1.68993 11.3402 1.68993 8.23015 7.39993 6.32015Z"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1101 13.6486L13.6901 10.0586"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SendIcon;
