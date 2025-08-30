import React from "react";

const BmiBar = ({ currentBMI, week }) => {
  const getCategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#00BFFF" };
    if (bmi < 25) return { label: "Normal", color: "#7eff6a" };
    if (bmi < 30) return { label: "Overweight", color: "#FFD700" };
    return { label: "Obese", color: "#FF6347" };
  };

  const category = getCategory(currentBMI);
  const percent = ((currentBMI - 10) / (40 - 10)) * 100;
  const position = Math.max(0, Math.min(percent, 100));

  const marks = [18.5, 25, 30, 35, 40];

  const getMarkPosition = (mark) => {
    const pct = ((mark - 10) / (40 - 10)) * 100;
    return `${Math.max(0, Math.min(pct, 100))}%`;
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-2xl shadow-md w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">
          Week {week} BMI:{" "}
          <span style={{ color: category.color }}>{currentBMI}</span>
        </h2>
        <span style={{ color: category.color }}>{category.label}</span>
      </div>

      <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400">
        {/* Marker */}
        <div
          className="absolute top-[-4px] h-14 w-[5px] bg-black z-10"
          style={{ left: `${position}%` }}
        />
      </div>

      {/* Bottom labels aligned */}
      <div className="relative mt-4 h-4">
        {/* Starting label */}
        <span
          className="absolute text-xs text-gray-300"
          style={{ left: 0, transform: "translateX(0%)" }}
        >
          &lt;10
        </span>

        {marks.map((mark, index) => (
          <span
            key={index}
            className="absolute text-xs text-gray-300"
            style={{
              left: getMarkPosition(mark),
              transform: "translateX(-50%)",
            }}
          >
            {mark}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BmiBar;
