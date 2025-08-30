import React, { useState, useRef, KeyboardEvent } from "react";
import TextInput from "./TextInput";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onChange: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onChange,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    console.log(
      "30",
      newOtp.every((digit) => digit === "")
    );

    if (newOtp.every((digit) => digit === "")) {
      onChange(newOtp.join(""));
    }

    // Trigger onComplete when all inputs are filled
    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <form className="flex items-center justify-between my-8">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          placeholder=""
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          style={{
            textAlign: "center",
            margin: "0 5px",
            width: "clamp(45px, 5vw, 55px)",
            height: "clamp(55px, 6vw, 65px)",
            fontSize: "1.2rem",
            borderRadius: 30,
            padding: "10px",
            appearance: "none",
          }}
          maxLength={1}
          error=""
        />
      ))}
    </form>
  );
};

export default OTPInput;
