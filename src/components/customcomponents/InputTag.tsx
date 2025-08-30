import React, { useState } from "react";

import { Dumbbell } from "lucide-react";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import TextInput from "./TextInput"; // custom input component

const InputTag = ({
  onClickRightIcon,
  showInput = true,
}: {
  onClickRightIcon?: () => void;
  showInput?: boolean;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([
    "Bench Press",
    "Chest Dips",
    "Skull Crushers",
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!selectedExercises.includes(trimmed)) {
        setSelectedExercises((prev) => [...prev, trimmed]);
      }
      setInputValue("");
    }
  };

  const handleRemove = (exercise: string) => {
    setSelectedExercises((prev) => prev.filter((item) => item !== exercise));
  };

  const [timeday, setTimeday] = useState("");

  return (
    <div>
      <TextInput
        placeholder="Select Exercises "
        value={inputValue}
        onChange={(val: string) => setInputValue(val)}
        onKeyDown={handleKeyDown}
        type="text"
        icon={<Dumbbell size={16} />}
        inputClassName="!bg-[#333333] pr-10"
        rightIcon={
          <img
            src={IMAGES.arrowRight}
            onClick={onClickRightIcon}
            alt=""
            className="w-5 h-5 cursor-pointer"
          />
        }
      />

      <div className="flex gap-2 flex-wrap mt-3 mb-3">
        {selectedExercises.map((exercise, index) => (
          <div
            key={index}
            className="bg-[#B0FF2B] text-sm font-semibold text-black rounded-full px-3 py-4 flex items-center gap-2 shadow"
          >
            {index + 1}. {exercise}
            <Icon
              icon="system-uicons:cross-circle"
              className="cursor-pointer text-red-600 hover:text-red-800"
              style={{ width: "24px", height: "24px" }}
              onClick={() => handleRemove(exercise)}
            />
          </div>
        ))}
      </div>

      {showInput && (
        <>
          <Link
            to="#"
            className="text-primary font-semibold hover:text-white transition-all duration-300 text-sm  flex items-center gap-2 mb-3"
          >
            <Icon
              icon="f7:plus-app"
              style={{ width: "21px", height: "21px" }}
            />
            Add New Exercise
          </Link>
          <TextInput
            placeholder="Workout Time/day"
            value={timeday}
            onChange={(value: string) => setTimeday(value)}
            type="text"
            inputClassName="!bg-[#333333]"
            icon={<img src={IMAGES.clock} alt="" className="w-5 h-5" />}
          />
        </>
      )}
    </div>
  );
};

export default InputTag;
