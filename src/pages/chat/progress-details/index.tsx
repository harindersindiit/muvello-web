import ExerciseComponent from "@/components/customcomponents/ExerciseComponent";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import { IMAGES } from "@/contants/images";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BMISummaryCard from "./BMISummaryCard";
import ProgressCharts from "./ProgressCharts";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const ProgressDetails = () => {
  const navigate = useNavigate();

  const [day, setDay] = useState(1);
  const [week, setWeek] = useState(1);

  const [workoutDetails, setWorkoutDetails] = useState({});
  const [statistics, setStatistics] = useState([]);
  const { state } = useLocation();
  const [option1, setOption1] = useState([]); // for week options

  const getWorkoutDetails = async () => {
    // setDeleteLoader(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(
        `workout?id=${state?.workout_id}&progress_user_id=${state?.user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.body.workouts[0]);
      setWorkoutDetails(res.data.body.workouts[0]);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      //   setDeleteExercise(false);
      //   setDeleteLoader(false);
    }
  };

  const getStatistics = async () => {
    // setDeleteLoader(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(
        `workout/statistics/${state?.workout_id}/${state?.user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatistics(res.data.body.data);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      //   setDeleteExercise(false);
      //   setDeleteLoader(false);
    }
  };

  useEffect(() => {
    getStatistics();
    getWorkoutDetails();
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);

  useEffect(() => {
    if (workoutDetails?.exercises?.length && week != null) {
      const filteredDays = workoutDetails.exercises
        .filter((item) => item.week === week)
        .map((item) => item.day);

      const daysSet = Array.from(new Set(filteredDays)).sort((a, b) => a - b);

      setOption1(
        daysSet.map((dayNumber) => ({
          value: dayNumber,
          label: `Day ${dayNumber}`,
        }))
      );

      // Reset day if it doesn't exist in the new week
      if (!daysSet.includes(day) && daysSet.length > 0) {
        setDay(daysSet[0]);
      }
    }
  }, [week, workoutDetails]);

  return (
    <div className=" text-white my-6 mb-0 pb-3 px-1">
      {/* Workouts */}
      <div className="mt-8">
        <div className="grid grid-cols-0 md:grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="lg:col-span-8 xl:col-span-9 md:col-span-12">
            <div className="flex items-center gap-4 mb-4">
              <h2
                className="md:text-2xl text-md font-semibold flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <img
                  src={IMAGES.arrowLeft}
                  alt="arrowLeft"
                  className="w-6 h-6 cursor-pointer"
                />
                <span className="text-white">Progress</span>
              </h2>
            </div>
            <BMISummaryCard
              state={state}
              title={state?.workout_title}
              statistics={statistics}
            />
            <ProgressCharts statistics={statistics} />
          </div>

          {/* Sidebar - 4 columns */}
          <div className="col-span-0 md:col-span-12 lg:col-span-4 xl:col-span-3 pl-2">
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-1 scroll-hide">
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-md font-semibold">
                  <span className="text-white">Exercises</span>
                </h2>

                <div className="flex items-center gap-1 ms-auto">
                  <div className="relative ">
                    <SelectComponent
                      value={week}
                      onChange={setWeek}
                      icon={IMAGES.calendar}
                      className="py-2 px-3 w-[120px] cursor-pointer text-xs text-white"
                      options={Array.from(
                        new Set(
                          workoutDetails?.exercises?.map((item) => item.week)
                        )
                      )
                        .sort((a, b) => a - b)
                        .map((weekNumber) => ({
                          value: weekNumber,
                          label: `Week ${weekNumber}`,
                        }))}
                    />
                  </div>
                  <div className="relative ">
                    <SelectComponent
                      value={day}
                      onChange={setDay}
                      className="py-2 px-3 w-[90px] cursor-pointer text-xs text-white"
                      options={option1}
                    />
                  </div>
                </div>
              </div>
              <div className="xl:h-[97dvh] scrollCustom overflow-y-auto ">
                <div
                  className="text-xl font-semibold mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4"
                  // adjust 150px as needed (e.g. header/footer height)
                >
                  {workoutDetails.exercises &&
                    workoutDetails?.exercises
                      ?.find(
                        (item__) => item__.week === week && item__.day === day
                      )
                      ?.exercises?.map((exercise, index) => (
                        <ExerciseComponent
                          total={exercise?.sets?.length || 0}
                          progress={exercise?.progress?.sets_completion || 0}
                          progressShow={true}
                          key={exercise?._id + index}
                          image={exercise?.exercise_info?.thumbnail || ""}
                          title={exercise?.exercise_info?.title || ""}
                          sets={exercise?.sets ? exercise?.sets.length : 0}
                          reps={
                            exercise?.sets
                              ? exercise?.sets
                                  .slice(0, 5)
                                  .map((set: { reps: number }) => set.reps)
                                  .join(", ")
                              : 0
                          }
                          rest={
                            exercise?.sets
                              ? exercise?.sets
                                  .slice(0, 4)
                                  .map(
                                    (set: { rest: number }) => `${set.rest} Sec`
                                  )
                                  .join(", ")
                              : 0
                          }
                          // modified={exercise.modified}
                          className="mb-0 cursor-pointer"
                          onClick={() =>
                            navigate("/user/chat/exercise-details", {
                              state: exercise,
                            })
                          }
                        />
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDetails;
