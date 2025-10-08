import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowLeft, Search } from "lucide-react";
import { IMAGES } from "@/contants/images";
import { useLocation, useNavigate } from "react-router-dom";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import FullScreenLoader from "@/components/ui/loader";
import TextInput from "@/components/customcomponents/TextInput";
import { Icon } from "@iconify/react/dist/iconify.js";
const COLORS = [
  "#A3FF12", // Lime Green
  "#3391FF", // Blue
  "#FFA500", // Orange
  "#FF69B4", // Pink
  "#00CED1", // Dark Turquoise
  "#8A2BE2", // Blue Violet
  "#FF4500", // Orange Red
  "#32CD32", // Lime Green
  "#FFD700", // Gold
  "#20B2AA", // Light Sea Green
  "#DC143C", // Crimson
  "#7B68EE", // Medium Slate Blue
  "#40E0D0", // Turquoise
  "#FF6347", // Tomato
  "#6A5ACD", // Slate Blue
];

const AthletesComparison = () => {
  const [exerciseProgressData, setExerciseProgressData] = useState([]);
  const [onceConfirm, setOnceConfirm] = useState(false);

  const [weightProgressData, setWeightProgressData] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAthletesTemp, setSelectedAthletesTemp] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    getProgress();
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);

  const handleCheckboxChange = (athleteId: number) => {
    if (selectedAthletesTemp.includes(athleteId)) {
      setSelectedAthletesTemp(
        selectedAthletesTemp.filter((id) => id !== athleteId)
      );
    } else {
      if (selectedAthletesTemp.length < 10) {
        setSelectedAthletesTemp([...selectedAthletesTemp, athleteId]);
      }
    }
  };

  const handleCancelSelection = () => {
    if (!onceConfirm) {
      navigate(-1);
      return;
    }
    setSelectedAthletesTemp([]);
    setShowPopup(false);
    setSearchText("");
  };

  /////// ==== progress === ///
  const [allAthletesData, setAllAthletesData] = useState([]);

  const getProgress = async () => {
    try {
      setLoading(true);
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(
        `/workout/progress/${state?.workout_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllAthletesData(res.data.body);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setShowPopup(true);
      setLoading(false);
    }
  };

  const [exerciseWeek, setExerciseWeek] = useState(1);
  const [weightWeek, setWeightWeek] = useState(1);

  const [apiData, setApiData] = useState([]);

  const [options, setOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const getStatistics = async (selectedAthletesTemp) => {
    if (selectedAthletesTemp.length < 2)
      return toast.error("Select at least 2 athletes");
    setSelectedAthletes(selectedAthletesTemp);

    setOnceConfirm(true);
    setLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post(
        `workout/all-statistics`,
        {
          users: selectedAthletesTemp,
          workout_id: state?.workout_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiData_ = res.data.body.data;
      setApiData(apiData_);

      const options_ = Array.from(
        { length: apiData_.completedExercises.length },
        (_, index) => ({
          label: `Week ${index + 1}`,
          value: index + 1,
        })
      );

      setOptions(options_);

      setExerciseProgressData(
        apiData_.completedExercises[exerciseWeek - 1].days
      );

      setWeightProgressData(apiData_.weightComparison[weightWeek - 1].days);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setSearchText("");
      setShowPopup(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiData.completedExercises?.length) {
      setExerciseProgressData(
        apiData.completedExercises[exerciseWeek - 1].days
      );
    }
  }, [exerciseWeek, apiData]);

  useEffect(() => {
    if (apiData.weightComparison?.length) {
      setWeightProgressData(apiData.weightComparison[exerciseWeek - 1].days);
    }
  }, [weightWeek, apiData]);

  const filteredFollowers = allAthletesData.filter((item) =>
    item.user.fullname.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="text-white my-6 mb-0 pb-3 px-1 relative">
      {/* Selection Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2d2d2d] rounded-2xl w-full max-w-xl">
            <div className="p-7 pb-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  Select Athletes for Comparison
                </h2>
                {/* <div className="relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                </div> */}
              </div>
              <p className="text-gray-400 text-sm mb-5">
                Select min 2 athletes to compare side by side.
              </p>

              <TextInput
                placeholder="Search by name..."
                value={searchText}
                onChange={(e: any) => {
                  setSearchText(e.target.value);
                }}
                type="text"
                icon={
                  <Icon icon="uil:search" color="white" className="w-5 h-5" />
                }
                className="mb-3"
              />

              <div className="space-y-2 max-h-[450px] scrollCustom overflow-y-auto">
                {filteredFollowers.map((athlete) => {
                  // Calculate progress percentage based on the formula: (completed_exercises / total_exercises) * 100
                  const calculatedProgress =
                    athlete.total_exercises === 0
                      ? 0
                      : Math.round(
                          (athlete.completed_exercises /
                            athlete.total_exercises) *
                            100
                        );

                  // Ensure progress is between 0 and 100
                  const finalProgress = Math.min(
                    100,
                    Math.max(0, calculatedProgress)
                  );

                  return (
                    <div
                      key={athlete.user._id}
                      className="flex items-center py-4"
                      style={{ borderBottom: "1px solid #6F6F6F" }}
                      onClick={() => handleCheckboxChange(athlete.user._id)}
                    >
                      <div
                        className={`w-5 h-5 mr-3 border rounded flex items-center justify-center ${
                          selectedAthletesTemp.includes(athlete.user._id)
                            ? "bg-[#A3FF12] border-[#A3FF12]"
                            : "border-gray-500"
                        }`}
                      >
                        {selectedAthletesTemp.includes(athlete.user._id) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center flex-1">
                        <img
                          src={
                            athlete.user.profile_picture ||
                            IMAGES.placeholderAvatar
                          }
                          alt={athlete.user.fullname}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium">
                            {athlete.user.fullname}
                          </h4>
                          <p
                            className={`text-sm ${
                              finalProgress == 100
                                ? "text-[#A3FF12]"
                                : athlete.total_done_exercises > 0
                                ? "text-gray-400"
                                : "text-red-500"
                            }`}
                          >
                            {finalProgress == 100
                              ? "Completed"
                              : athlete.total_done_exercises > 0
                              ? "In Progress"
                              : "Not Started"}
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-xs font-medium"
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
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="#333"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
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
                            strokeDasharray={`${finalProgress} 100`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex p-4 space-x-3 mt-2">
              <button
                className="flex-1 py-3 px-4 text-center border border-gray-600 rounded-full text-white bg-transparent cursor-pointer"
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 px-4 text-center rounded-full text-black font-medium bg-[#A3FF12] hover:bg-[#A3FF12]/90 cursor-pointer"
                onClick={() => getStatistics(selectedAthletesTemp)}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <h2
          className="md:text-2xl text-md font-semibold flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-6 h-6 cursor-pointer" />
          <span className="text-white">{state.title}</span>
        </h2>
        <Button
          variant="outline"
          className="ms-auto bg-[#A3FF12] hover:bg-[#8edf00] text-black font-medium rounded-full text-sm px-6 cursor-pointer"
          onClick={() => {
            setSelectedAthletesTemp(selectedAthletes);
            setShowPopup(true);
          }}
        >
          Edit Comparison
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Exercise Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold text-base">
              Exercise Progress
            </h3>

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
              onClick={() =>
                setExerciseTimeframe(
                  exerciseTimeframe === "This Week" ? "Last Week" : "This Week"
                )
              }
            >
              {exerciseTimeframe} <ChevronDown className="w-4 h-4 ml-1" />
            </Button> */}
          </div>
          <div className="h-[360px] bg-[#1f1f1f] rounded-2xl p-4 pl-0 w-full">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={exerciseProgressData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }} // Add margin for better spacing
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#555" }}
                  axisLine={{ stroke: "#555" }}
                />
                <YAxis
                  stroke="#888"
                  domain={[0, 20]}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#555" }}
                  axisLine={{ stroke: "#555" }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: "13px",
                    backgroundColor: "#222",
                    border: "none",
                  }}
                  labelStyle={{ fontSize: "13px", color: "#fff" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => {
                    const user = allAthletesData.find(
                      (u) => u.user._id === value
                    );
                    return user?.user.fullname || value;
                  }}
                />

                {selectedAthletes.map((userId, index) => {
                  const athlete = allAthletesData.find(
                    (a) => a.user._id === userId
                  );
                  if (!athlete) return null;

                  return (
                    <Line
                      key={athlete.user._id}
                      type="monotone"
                      dataKey={athlete.user._id}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      name={athlete.user.fullname}
                    />
                  );
                })}
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
            {/* <Button
              variant="ghost"
              className="bg-[#1a1a1a] cursor-pointer px-4 py-1 font-normal rounded-full text-xs text-white"
              onClick={() =>
                setWeightTimeframe(
                  weightTimeframe === "This Week" ? "Last Week" : "This Week"
                )
              }
            >
              {weightTimeframe} <ChevronDown className="w-4 h-4 ml-1" />
            </Button> */}
          </div>
          <div className="h-[360px] bg-[#1f1f1f] rounded-2xl p-4 pl-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weightProgressData}
                barGap={0}
                barCategoryGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    fontSize: "13px",
                    backgroundColor: "#222",
                    border: "none",
                  }}
                  labelStyle={{ fontSize: "13px", color: "#fff" }}
                  cursor={{ fill: "transparent" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => {
                    const athlete = allAthletesData.find(
                      (a) => a.user._id === value
                    );
                    return athlete ? athlete.user.fullname : value;
                  }}
                />

                {selectedAthletes.map((userId, index) => (
                  <Bar
                    key={userId}
                    dataKey={userId}
                    name={
                      allAthletesData.find((a) => a.user._id === userId)?.user
                        .fullname || `User ${index + 1}`
                    }
                    fill={COLORS[index % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                    barSize={10}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Athlete Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {allAthletesData
          .filter((athlete) => selectedAthletes.includes(athlete.user._id))
          .map((athlete, index) => {
            // Calculate progress percentage based on the formula: (completed_exercises / total_exercises) * 100
            const calculatedProgress =
              athlete.total_exercises === 0
                ? 0
                : Math.round(
                    (athlete.completed_exercises / athlete.total_exercises) *
                      100
                  );

            // Ensure progress is between 0 and 100
            const finalProgress = Math.min(
              100,
              Math.max(0, calculatedProgress)
            );

            return (
              <div
                key={athlete.user._id}
                className="bg-[#080808] rounded-2xl relative border border-white/10"
              >
                <div
                  className="flex items-center mb-4 p-4 rounded-t-2xl"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          athlete.user.profile_picture ||
                          IMAGES.placeholderAvatar
                        }
                        alt={athlete.user.fullname}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[
                                selectedAthletes.findIndex(
                                  (id) => id === athlete.user._id
                                ) % COLORS.length
                              ],
                          }}
                        ></div>
                        <span className="text-xs text-gray-400">
                          Athlete {index + 1}
                        </span>
                      </div>
                      <h4 className="font-medium text-lg">
                        {athlete.user.fullname}
                      </h4>
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="relative w-14 h-14">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-sm font-medium"
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
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#333"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
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
                          strokeDasharray={`${finalProgress} 100`}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current BMI:</span>
                    <span className="font-medium">{athlete.bmi}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-400">Average Rest Time:</span> */}
                  {/* <span className="font-medium">{athlete.averageRestTime}</span> */}
                  {/* </div> */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Workout Completed:</span>
                    <span className="font-medium">
                      {athlete.completed_exercises}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {loading && <FullScreenLoader />}
    </div>
  );
};

export default AthletesComparison;
