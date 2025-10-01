import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/contants/images";
import { ChevronDown } from "lucide-react";
import BMIRangeBar from "./BMIRangeBar";
import { useEffect, useMemo, useState } from "react";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
export default function BMISummaryCard({ state, title, statistics }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [BMI, setBMI] = useState(0);
  const [weekBMI, setWeekBMI] = useState(1);
  const options = Array.from({ length: statistics.length }, (_, index) => ({
    label: `Week ${index + 1}`,
    value: index + 1,
  }));

  // Calculate progress percentage based on the formula: (completed_exercises / total_exercises) * 100
  const calculatedProgress =
    state.total_exercises === 0
      ? 0
      : Math.round((state.completed_exercises / state.total_exercises) * 100);

  // Ensure progress is between 0 and 100
  const finalProgress = Math.min(100, Math.max(0, calculatedProgress));

  useEffect(() => {
    const selectedWeekData = statistics.find((w) => w.week === weekBMI);
    console.log(selectedWeekData);
    const findBMI = selectedWeekData?.days.find((day) => day.bmi != null);
    setBMI(findBMI ? findBMI.bmi : 0);
  }, [weekBMI, statistics]);

  return (
    <div className="bg-black text-white rounded-xl w-full space-y-3">
      {/* Top Row */}
      <div className="flex items-start justify-between flex-wrap">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="w-17 h-17">
            <AvatarImage
              src={state?.user?.profile_picture || IMAGES.placeholderAvatar}
            />
            <AvatarFallback>CF</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg leading-5 mb-2">
              {state?.user?.fullname}
            </h2>
            <p className="text-gray-400 text-sm">{title}</p>
          </div>
          <Button
            className="ml-4 cursor-pointer bg-lime-400 text-black rounded-full px-4 py-1 text-sm font-semibold hover:bg-lime-500 transition"
            onClick={() => {
              const id = state?.user?._id;
              navigate(
                "/user/profile",
                user._id != id ? { state: { id } } : undefined
              );
            }}
          >
            View Profile
          </Button>
        </div>

        {/* Progress Circle */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg
              className="absolute top-0 left-0"
              width="56"
              height="56"
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="#333333"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke={
                  finalProgress >= 80
                    ? "#A3FF12"
                    : finalProgress >= 50
                    ? "#FFA500"
                    : finalProgress > 0
                    ? "#3391FF"
                    : "#666"
                }
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                strokeDasharray="100"
                strokeDashoffset={100 - finalProgress}
              />
            </svg>
            <span
              className="text-sm font-semibold"
              style={{
                color:
                  finalProgress >= 80
                    ? "#A3FF12"
                    : finalProgress >= 50
                    ? "#FFA500"
                    : finalProgress > 0
                    ? "#3391FF"
                    : "#666",
              }}
            >
              {finalProgress}%
            </span>
          </div>
          <div className="text-start">
            <p className="text-xs text-gray-400 mb-1">Progress</p>
            <p
              className="text-sm font-semibold"
              style={{
                color:
                  finalProgress >= 80
                    ? "#A3FF12"
                    : finalProgress >= 50
                    ? "#FFA500"
                    : finalProgress > 0
                    ? "#3391FF"
                    : "#666",
              }}
            >
              {finalProgress == 100
                ? "Completed"
                : state.total_done_exercises > 0
                ? "In Progress"
                : "Not Started"}
            </p>
          </div>
        </div>
      </div>

      {/* Header + Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">BMI</h3>
        {/* <Button
          variant="ghost"
          className="bg-[#1a1a1a] cursor-pointer px-4 py-1 font-normal rounded-full text-xs text-white"
        >
          This Week <ChevronDown className="w-4 h-4 ml-1" />
        </Button> */}
        <SelectComponent
          value={weekBMI}
          onChange={setWeekBMI}
          icon={IMAGES.calendar}
          className="py-2 px-3 w-[130px] cursor-pointer"
          options={options}
        />
      </div>

      {/* BMI Bar */}
      <div className="bg-[#1f1f1f] rounded-2xl t-2">
        {/* Range Bar */}
        <BMIRangeBar currentBMI={BMI} week={weekBMI} />
      </div>
    </div>
  );
}
