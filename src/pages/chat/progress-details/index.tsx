import ExerciseComponent from "@/components/customcomponents/ExerciseComponent";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import { IMAGES } from "@/contants/images";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BMISummaryCard from "./BMISummaryCard";
import ProgressCharts from "./ProgressCharts";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface WorkoutDetails {
  exercises?: Array<{
    week: number;
    day: number;
    exercises: Array<{
      _id: string;
      exercise_info: {
        _id: string;
        title: string;
        thumbnail: string;
      };
      sets: Array<{
        reps: number;
        rest: number;
      }>;
      progress?: {
        sets_completion: number;
      };
      finished?: {
        media: Array<{
          url: string;
          type: string;
          created_at: string;
        }>;
      };
    }>;
  }>;
}

interface Statistics {
  [key: string]: unknown;
}

const ProgressDetails = () => {
  const navigate = useNavigate();

  const [day, setDay] = useState(1);
  const [week, setWeek] = useState(1);

  const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetails>({});
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const { state } = useLocation();
  const [option1, setOption1] = useState<
    Array<{ value: number; label: string }>
  >([]); // for week options

  const getWorkoutDetails = useCallback(async () => {
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
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      //   setDeleteExercise(false);
      //   setDeleteLoader(false);
    }
  }, [state?.workout_id, state?.user?._id]);

  const getStatistics = useCallback(async () => {
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
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      //   setDeleteExercise(false);
      //   setDeleteLoader(false);
    }
  }, [state?.workout_id, state?.user?._id]);

  useEffect(() => {
    getStatistics();
    getWorkoutDetails();
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, [getStatistics, getWorkoutDetails]);

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
  }, [week, workoutDetails, day]);

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
                      value={week.toString()}
                      onChange={(value) => setWeek(Number(value))}
                      icon={IMAGES.calendar}
                      className="py-2 px-3 w-[120px] cursor-pointer text-xs text-white"
                      options={Array.from(
                        new Set(
                          workoutDetails?.exercises?.map((item) => item.week)
                        )
                      )
                        .sort((a, b) => a - b)
                        .map((weekNumber) => ({
                          value: weekNumber.toString(),
                          label: `Week ${weekNumber}`,
                        }))}
                    />
                  </div>
                  <div className="relative ">
                    <SelectComponent
                      value={day.toString()}
                      onChange={(value) => setDay(Number(value))}
                      className="py-2 px-3 w-[90px] cursor-pointer text-xs text-white"
                      options={option1.map((option) => ({
                        value: option.value.toString(),
                        label: option.label,
                      }))}
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

                {/* Media Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Workout Media
                  </h3>
                  {workoutDetails.exercises &&
                  workoutDetails?.exercises
                    ?.find(
                      (item__) => item__.week === week && item__.day === day
                    )
                    ?.exercises?.some(
                      (exercise) => exercise?.finished?.media?.length > 0
                    ) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {workoutDetails?.exercises
                        ?.find(
                          (item__) => item__.week === week && item__.day === day
                        )
                        ?.exercises?.map((exercise, exerciseIndex) =>
                          exercise?.finished?.media?.map(
                            (mediaItem, mediaIndex) => (
                              <div
                                key={`${exerciseIndex}-${mediaIndex}`}
                                className="bg-gray-800 rounded-lg p-4"
                              >
                                {/* <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                      {exerciseIndex + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-white font-medium text-sm">
                                      {exercise?.exercise_info?.title}
                                    </h4>
                                    <p className="text-gray-400 text-xs">
                                      Completed on{" "}
                                      {new Date(
                                        mediaItem.created_at
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div> */}

                                {mediaItem.type === "image" ? (
                                  <div
                                    className="relative cursor-pointer w-full aspect-square overflow-hidden rounded-lg bg-gray-700"
                                    onClick={() =>
                                      window.open(mediaItem.url, "_blank")
                                    }
                                  >
                                    <img
                                      src={mediaItem.url}
                                      alt={`Workout media ${mediaIndex + 1}`}
                                      className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                                      loading="lazy"
                                    />
                                  </div>
                                ) : mediaItem.type === "video" ? (
                                  <div
                                    className="relative cursor-pointer w-full aspect-square overflow-hidden rounded-lg bg-gray-700 "
                                    onClick={() =>
                                      window.open(mediaItem.url, "_blank")
                                    }
                                  >
                                    <video
                                      src={mediaItem.url}
                                      controls
                                      className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                                      preload="metadata"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        window.open(mediaItem.url, "_blank");
                                      }}
                                    >
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                ) : (
                                  <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">
                                      Unsupported media type
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          )
                        )}
                    </div>
                  ) : (
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-white font-medium text-lg mb-2">
                          No Media Available
                        </h4>
                        <p className="text-gray-400 text-sm">
                          No workout media has been uploaded for this day yet.
                        </p>
                      </div>
                    </div>
                  )}
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
