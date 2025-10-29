"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import { IMAGES } from "@/contants/images";

export default function ProgressCharts({ statistics }) {
  const [exerciseWeek, setExerciseWeek] = useState("1");
  const [weightWeek, setWeightWeek] = useState("1");

  const options = Array.from({ length: statistics.length }, (_, index) => ({
    label: `Week ${index + 1}`,
    value: (index + 1).toString(),
  }));

  const exerciseData = useMemo(() => {
    const selectedWeekData = statistics.find(
      (w) => w.week === parseInt(exerciseWeek)
    );

    if (!selectedWeekData) return [];

    return selectedWeekData.days.map((day) => ({
      name: `Day ${day.day}`,
      completed: day.completed_exercises,
      total: day.total_exercises,
    }));
  }, [exerciseWeek, statistics]);

  const weightData = useMemo(() => {
    const selectedWeekData = statistics.find(
      (w) => w.week === parseInt(weightWeek)
    );

    if (!selectedWeekData) return [];

    return selectedWeekData.days.map((day) => ({
      name: `Day ${day.day}`,
      value: day.weight_value,
    }));
  }, [weightWeek, statistics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
      {/* Exercise Progress */}
      <div className="">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-semibold text-base">
            Exercise Progress
          </h3>
          <div className="flex gap-2">
            <SelectComponent
              value={exerciseWeek}
              onChange={setExerciseWeek}
              icon={IMAGES.calendar}
              className="py-2 px-3 w-[120px] cursor-pointer"
              options={options}
            />

            {/* <Button
              variant="ghost"
              className="bg-[#1a1a1a] cursor-pointer px-4 py-1 font-normal rounded-full text-xs text-white"
            >
              This Week <ChevronDown className="w-4 h-4 ml-1" />
            </Button> */}
          </div>
        </div>
        <div className="h-[360px] bg-[#1f1f1f] rounded-2xl p-4 pl-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={exerciseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="name"
                stroke="#888"
                tick={{ fontSize: 12 }} // 👈 font size here
              />
              <YAxis
                stroke="#fff"
                domain={[0, 8]}
                tick={{ fontSize: 12 }} // 👈 font size here
              />
              <Tooltip
                contentStyle={{
                  fontSize: "13px",
                  backgroundColor: "#222",
                  border: "none",
                }}
                labelStyle={{ fontSize: "13px", color: "#fff" }}
                itemStyle={{ fontSize: "13px", color: "#A3FF12" }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#A3FF12"
                strokeWidth={2}
                dot={false}
                name="Completed Exercises"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3391FF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Total Exercises"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Body Weight Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-semibold text-base">
            Body Weight Progress (in Lbs)
          </h3>
          <SelectComponent
            value={weightWeek}
            onChange={setWeightWeek}
            icon={IMAGES.calendar}
            className="py-2 px-3 w-[120px] cursor-pointer"
            options={options}
          />
        </div>
        <div className="h-[360px] bg-[#1f1f1f] rounded-2xl p-4 pl-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="name"
                stroke="#888"
                tick={{ fontSize: 12 }} // 👈 Set font size for X-axis ticks
              />
              <YAxis
                stroke="#fff"
                tick={{ fontSize: 12 }} // 👈 Set font size for Y-axis ticks
                domain={[0, 350]} // 👈 Sets Y-axis from 0 to 100
              />
              <Tooltip
                contentStyle={{
                  fontSize: "13px",
                  backgroundColor: "#222",
                  border: "none",
                }}
                labelStyle={{ fontSize: "13px", color: "#fff" }}
                itemStyle={{ fontSize: "13px", color: "#A3FF12" }}
                cursor={{ fill: "transparent" }} // 👈 This removes the white hover bar
              />

              {/* <ReferenceLine y={55} stroke="#3391FF" /> */}

              <Bar
                dataKey="value"
                fill="#A3FF12"
                barSize={25}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
