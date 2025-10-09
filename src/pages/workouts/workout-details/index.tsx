import CustomButton from "@/components/customcomponents/CustomButton";
import { CustomModal } from "@/components/customcomponents/CustomModal";
import ExerciseComponent from "@/components/customcomponents/ExerciseComponent";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import SendIcon from "@/components/svgcomponents/Send";
import FullScreenLoader from "@/components/ui/loader";
import WorkoutComponentSidebar from "@/components/workoutcommponentsidebar";
import { IMAGES } from "@/contants/images";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { getMaxWeek } from "@/utils/sec";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";

import TextInput from "@/components/customcomponents/TextInput";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";

interface WorkoutDetailsType {
  _id?: string;
  title?: string;
  caption?: string;
  thumbnail?: string;
  fees?: number;
  user_id?: string;
  is_draft?: boolean;
  is_pinned?: boolean;
  totalParticipants?: number;
  updated_at?: string;
  created_at?: string;
  exercises?: any[];
}

const WorkoutDetails = () => {
  const { user } = useUser();
  const { state } = useLocation();
  const workoutId = state?._id; // Only get _id from state
  const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetailsType>({});
  const [workoutLoader, setWorkoutLoader] = useState(false);
  const [workoutAccessLoader, setWorkoutAccessLoader] = useState(false);

  const navigate = useNavigate();
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteExercise, setDeleteExercise] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState([]);
  const [workoutAccess, setWorkoutAccess] = useState({
    isPurchased: false,
    isLoading: true,
    isPaidWorkout: false,
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [openShare, setOpenShare] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [selectedGroupsCopy, setSelectedGroupsCopy] = useState<any[]>([]);

  const [isShared, setIsShared] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [option1, setOption1] = useState([]); // for week options
  const [option2, setOption2] = useState([]); // for day options

  const allSelected =
    selectedGroups.length === groups.length && groups.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups);
    }
  };

  const getWorkoutDetails = useCallback(async () => {
    try {
      setWorkoutLoader(true);
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get(
        `workout?id=${workoutId}&user_id=${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const details = res.data.body.workouts;
      setWorkoutDetails(details[0]);

      console.log(details);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to fetch posts.");
    } finally {
      setWorkoutLoader(false);
    }
  }, [workoutId, user._id]);

  const fetchGroups = async () => {
    // setIsLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get("group", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { body } = res.data;
      setGroups(body.groups || []);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Fetching groups failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgress = useCallback(async () => {
    setDeleteLoader(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(`/workout/progress/${workoutId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (user._id != workoutDetails?.user_id) {
        setProgress(res.data.body.filter((item) => item.user._id === user._id));
      } else {
        setProgress(res.data.body);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setDeleteExercise(false);
      setDeleteLoader(false);
    }
  }, [workoutId]);

  const checkWorkoutAccess = useCallback(async () => {
    try {
      setWorkoutAccessLoader(true);
      const token = localStorageService.getItem("accessToken");

      // Check if workout is paid
      const isPaidWorkout = workoutDetails?.fees && workoutDetails.fees > 0;

      // If user is the creator of the workout, grant access by default
      if (user._id === workoutDetails?.user_id) {
        setWorkoutAccess({
          isPurchased: true,
          isLoading: false,
          isPaidWorkout: isPaidWorkout,
        });
        return;
      }

      if (!isPaidWorkout) {
        setWorkoutAccess({
          isPurchased: true,
          isLoading: false,
          isPaidWorkout: false,
        });
        return;
      }

      // For paid workouts, check if user has purchased
      const res = await axiosInstance.get(
        `/payments/workout-access/${workoutId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkoutAccess({
        isPurchased: res.data.body.isPurchased,
        isLoading: false,
        isPaidWorkout: true,
      });
    } catch (error: any) {
      console.error("Error checking workout access:", error);
      setWorkoutAccess({
        isPurchased: false,
        isLoading: false,
        isPaidWorkout: workoutDetails?.fees && workoutDetails.fees > 0,
      });
    } finally {
      setWorkoutAccessLoader(false);
    }
  }, [workoutId, workoutDetails?.fees, workoutDetails?.user_id, user._id]);

  useEffect(() => {
    checkWorkoutAccess();
    getProgress();
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, [getProgress, checkWorkoutAccess]);

  useEffect(() => {
    getWorkoutDetails();
    fetchGroups();
  }, []);

  useEffect(() => {
    if (week) {
      setDay(1);
    }
  }, [week]);

  const filteredGroups = groups?.filter((group) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGroup = (group: any) => {
    const exists = selectedGroups.find((g) => g._id === group._id);
    if (exists) {
      setSelectedGroups(selectedGroups.filter((g) => g._id !== group._id));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  // const handleDeleteExercise = async () => {
  //   setDeleteLoader(true);

  //   try {
  //     const token = localStorageService.getItem("accessToken");

  //     const resExe = await axiosInstance.delete(`/exercise/${state?._id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     toast.success(resExe.data.message);
  //   } catch (error: any) {
  //     const message = error?.response?.data?.error || "Internal Server Error.";
  //     toast.error(message);
  //   } finally {
  //     setDeleteExercise(false);
  //     setDeleteLoader(false);
  //   }
  // };

  const handlePinWorkout = async () => {
    try {
      const token = localStorageService.getItem("accessToken");
      const resExe = await axiosInstance.put(
        `/workout/pin/${workoutId}`,
        {
          is_pinned: !workoutDetails?.is_pinned,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/user/profile", {
        replace: true,
      });
      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      // setFullLoader(false);
    }
  };

  const handleDeletePost = async () => {
    setLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const resExe = await axiosInstance.delete(`/workout/${workoutId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/user/profile", {
        replace: true,
      });
      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  const shareToGroups = async () => {
    if (selectedGroups.length === 0) return;
    // setLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const data = {
        groups: selectedGroups.map((g) => g._id),
        workout_id: workoutId.toString(),
      };
      const resExe = await axiosInstance.post(`/group/share-to-groups`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // navigate("/user/profile", {
      //   replace: true,
      // });
      setSelectedGroups([]);
      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      // setLoader(false);
    }
  };

  useEffect(() => {
    if (workoutDetails?.exercises?.length) {
      const weeksSet = Array.from(
        new Set(workoutDetails.exercises.map((item) => item.week))
      ).sort((a, b) => a - b);

      setOption1(
        weeksSet.map((weekNumber) => ({
          value: weekNumber,
          label: `Week ${weekNumber}`,
        }))
      );
    }
  }, [workoutDetails?.exercises, week]);

  useEffect(() => {
    if (workoutDetails?.exercises?.length && week != null) {
      const filteredDays = workoutDetails.exercises
        .filter((item) => item.week === week)
        .map((item) => item.day);

      const daysSet = Array.from(new Set(filteredDays)).sort((a, b) => a - b);

      setOption2(
        daysSet.map((dayNumber) => ({
          value: dayNumber,
          label: `Day ${dayNumber}`,
        }))
      );

      // Reset day to first available if current day doesn't belong to selected week
      if (!daysSet.includes(day)) {
        setDay(daysSet[0]);
      }
    }
  }, [week, workoutDetails?.exercises]);

  const selectedExerciseDay = workoutDetails?.exercises?.find(
    (item__) => item__.week === week && item__.day === day
  ) || { exercises: [] };

  return (
    <div className=" text-white my-6 mb-0 pb-9 px-1">
      {(deleteLoader || workoutLoader || workoutAccessLoader) && (
        <FullScreenLoader />
      )}
      {/* Workouts */}
      <div className="mt-0 sm:mt-8">
        <div className="grid grid-cols-0 md:grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="lg:col-span-8 xl:col-span-9 md:col-span-12">
            <div className="flex items-center gap-4 mb-3">
              <h2
                className="md:text-2xl text-md font-semibold flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <img
                  src={IMAGES.arrowLeft}
                  alt="arrowLeft"
                  className="w-6 h-6 cursor-pointer"
                />
                {/* <span className="text-white">Pre</span> */}
              </h2>

              {user._id == workoutDetails?.user_id && (
                <div className="flex items-center gap-3 ms-auto">
                  {!workoutDetails?.is_draft && (
                    <>
                      <Icon
                        onClick={handlePinWorkout}
                        icon="tabler:pin"
                        fontSize={25}
                        className={`${
                          workoutDetails?.is_pinned
                            ? "text-primary"
                            : "text-white"
                        } cursor-pointer hover:text-primary transition-all duration-300 ease-in-out`}
                      />
                      <SendIcon
                        onClick={() => {
                          setOpenShare(true);
                        }}
                        className="text-white cursor-pointer send-icon"
                        width={25}
                        height={25}
                      />
                    </>
                  )}

                  <Icon
                    icon="mage:edit-pen"
                    fontSize={25}
                    onClick={() => {
                      navigate("/user/edit-workout", {
                        state: workoutDetails,
                      });
                      // setMode("edit");
                      // setOpen(true);
                    }}
                    className="text-white cursor-pointer hover:text-primary transition-all duration-300 ease-in-out"
                  />
                  {workoutDetails?.totalParticipants == 0 && (
                    <Icon
                      onClick={() => {
                        setDeleteModal(true);
                      }}
                      icon="mynaui:trash"
                      fontSize={25}
                      className="text-white cursor-pointer hover:text-primary transition-all duration-300 ease-in-out"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="relative mb-4">
              <img
                src={workoutDetails?.thumbnail}
                alt="workout"
                className="w-full h-[400px] object-contain"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(179deg, rgba(0, 0, 0, 0.70) 4.16%, rgba(0, 0, 0, 0.00) 40.1%, rgba(0, 0, 0, 0.70) 90.09%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
                }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h4 className="font-semibold text-sm mb-1">
                  {workoutDetails?.title}
                </h4>
                <p className="text-sm text-gray-400 flex gap-1 items-center">
                  <img
                    src={IMAGES.calendar}
                    alt="Calendar"
                    className="w-4 h-4"
                  />
                  {getMaxWeek(workoutDetails?.exercises, "week")}
                  <img
                    src={IMAGES.clock}
                    alt="Calendar"
                    className="w-4 h-4 ml-2"
                  />{" "}
                  {workoutDetails?.exercises?.reduce(
                    (acc, curr) => acc + (curr.workout_duration || 0),
                    0
                  )}{" "}
                  min
                  <img
                    src={IMAGES.editiconimg}
                    alt="Calendar"
                    className="w-7 h-7 ml-2 mr-[-6px]"
                  />{" "}
                  {workoutDetails?.updated_at
                    ? moment(workoutDetails.updated_at).fromNow()
                    : moment(workoutDetails?.created_at).fromNow()}
                </p>
              </div>

              <CustomButton
                className="w-auto py-5 bg-primary text-black"
                text={`${
                  workoutDetails?.fees ? `$${workoutDetails.fees}` : "Free"
                }`}
                type="button"
                disableHover={true}
              />
            </div>

            <p className="text-sm text-white mt-4">{workoutDetails?.caption}</p>

            {/* Only show Participants and Compare Athletes sections to the workout creator */}
            {user._id === workoutDetails?.user_id && (
              <div className="flex items-center gap-2 justify-between w-full flex-1 mt-5 mb-3">
                <h4 className="font-semibold text-sm mb-1 text-left">
                  Participant ({progress.length})
                </h4>
                {progress.length > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        navigate("/user/athletes-comparison", {
                          state: {
                            workout_title: workoutDetails?.title,
                            workout_id: workoutId.toString(),
                            weeks: workoutDetails?.exercises,
                          },
                        });
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                      style={{ color: "#94eb00" }}
                    >
                      <img
                        src={IMAGES.compareAthletes}
                        alt="compareAthletes"
                        className="w-5 h-5"
                      />
                      Compare Athletes
                    </button>
                    {/* <Icon
                      icon="tabler:search"
                      fontSize={16}
                      className="text-white cursor-pointer hover:text-primary transition-all duration-300 ease-in-out"
                    /> */}
                  </div>
                )}
              </div>
            )}

            {user._id != workoutDetails?.user_id &&
              progress.find((item) => item.user._id === user._id) && (
                <div className="flex items-center gap-2 justify-between w-full flex-1 mt-5 mb-3">
                  <h4 className="font-semibold text-sm mb-1 text-left">
                    Your Progress
                  </h4>
                </div>
              )}

            {/* Only show participants grid to the workout creator */}
            {(user._id === workoutDetails?.user_id ||
              progress.find((item) => item.user._id === user._id)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {progress.map((item) => {
                  // Calculate progress percentage based on the formula: (completed_exercises / total_exercises) * 100
                  const calculatedProgress =
                    item.total_exercises === 0
                      ? 0
                      : Math.round(
                          (item.completed_exercises / item.total_exercises) *
                            100
                        );

                  // Ensure progress is between 0 and 100
                  const finalProgress = Math.min(
                    100,
                    Math.max(0, calculatedProgress)
                  );

                  return (
                    <div
                      key={item.user._id}
                      onClick={() => {
                        navigate("/user/chat/progress-details", {
                          state: {
                            ...item,
                            workout_title: workoutDetails?.title,
                            workout_id: workoutId.toString(),
                            exercises: workoutDetails?.exercises,
                          },
                        });
                      }}
                      className="bg-black text-white rounded-[10px] border border-white/10 p-3 flex items-center justify-between relative cursor-pointer"
                    >
                      {/* Avatar and Info */}
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.user.profile_picture ||
                            IMAGES.placeholderAvatar
                          } // Replace with actual avatar source
                          alt="avatar"
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="text-left">
                          <p className="text-md font-semibold mb-1">
                            {item.user.fullname}
                          </p>
                          <p
                            className={`${
                              finalProgress == 100
                                ? "text-primary"
                                : item.total_done_exercises > 0
                                ? "text-grey"
                                : "text-red"
                            } text-sm flex items-center gap-2`}
                          >
                            {finalProgress == 100 && (
                              <div
                                className={`w-4 h-4 rounded-full border-1 border-primary flex items-center justify-center`}
                              >
                                <Icon icon="tabler:check" fontSize={10} />
                              </div>
                            )}
                            {finalProgress == 100
                              ? "Completed"
                              : item.total_done_exercises > 0
                              ? "In Progress"
                              : "Not Started"}
                          </p>
                        </div>
                      </div>

                      {/* Circular Progress */}
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
                    </div>
                  );
                })}
              </div>
            )}

            {/* <div className="text-primary text-sm  mt-4 cursor-pointer hover:text-primary/80 transition-all duration-300 ease-in-out">
              View More
            </div> */}
          </div>

          {/* Sidebar - 4 columns */}
          <div className="col-span-0 md:col-span-12 lg:col-span-4 xl:col-span-3 pl-2">
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-1 scroll-hide">
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-semibold text-left">
                  <span className="text-white flex items-center gap-1">
                    Exercises (
                    {/* <img
                      src={IMAGES.exercise3}
                      alt="Sets"
                      className="w-3 h-3"
                    /> */}
                    {selectedExerciseDay.workout_duration} mins)
                  </span>
                </h2>

                <div className="flex items-center gap-1 ms-auto">
                  <div className="relative ">
                    <SelectComponent
                      value={week}
                      onChange={setWeek}
                      icon={IMAGES.calendar}
                      className="py-2 px-3 w-[140px] cursor-pointer"
                      options={option1}
                    />
                  </div>
                  <div className="relative ">
                    <SelectComponent
                      value={day}
                      onChange={setDay}
                      className="py-2 px-3 w-[90px] cursor-pointer"
                      options={option2}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xl font-semibold mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                {selectedExerciseDay.exercises.length > 0 ? (
                  selectedExerciseDay.exercises.map((exercise, index) => {
                    const isLocked =
                      workoutAccess.isPaidWorkout && !workoutAccess.isPurchased;
                    return (
                      <div key={exercise._id + index} className="relative">
                        <ExerciseComponent
                          image={exercise.exercise_info.thumbnail}
                          title={exercise.exercise_info.title}
                          sets={exercise.sets ? exercise.sets.length : 0}
                          reps={
                            exercise.sets
                              ? exercise.sets
                                  .slice(0, 5)
                                  .map((set: any) => set.reps)
                                  .join(", ")
                              : 0
                          }
                          rest={
                            exercise.sets
                              ? exercise.sets
                                  .slice(0, 4)
                                  .map((set: any) => `${set.rest} Sec`)
                                  .join(", ")
                              : 0
                          }
                          className={`mb-0 ${
                            isLocked
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer"
                          }`}
                          onClick={() => {
                            if (isLocked) {
                              setShowPurchaseModal(true);
                              return;
                            }
                            navigate("/user/chat/exercise-details", {
                              state: {
                                ...exercise,
                                workout_id: workoutId.toString(),
                                day,
                                week,
                              },
                            });
                          }}
                        />
                        {isLocked ? (
                          <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
                            <Icon
                              icon="material-symbols:lock"
                              fontSize={16}
                              className="text-primary"
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white text-sm">
                    No exercises available for this day.
                  </p>
                )}
              </div>
            </div>
            {/* End of scrollable content */}
          </div>
        </div>
      </div>
      <WorkoutComponentSidebar open={open} setOpen={setOpen} mode={mode} />

      {/* Modal */}
      <CustomModal
        disabled={loader}
        title="Delete Workout"
        submitText="Yes I'm Sure"
        open={deleteModal}
        setOpen={setDeleteModal}
        onCancel={() => {
          setSelectedGroups([]);
          setDeleteModal(false);
        }}
        onSubmit={() => handleDeletePost()}
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Delete Workout?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to delete this Workout?
            </p>
          </div>
        }
      />

      <DrawerSidebar
        title="Share"
        submitText="Share"
        cancelText="Cancel"
        onSubmit={() => {
          if (selectedGroups.length === 0) return;
          shareToGroups();
          setOpenShare(false);
        }}
        onCancel={() => {
          setSelectedGroups(selectedGroupsCopy);
          setOpenShare(false);
        }}
        open={openShare}
        setOpen={setOpenShare}
        showFooter={true}
        className="drawer-override"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h6 className="text-white text-m font-medium">
              Select Groups {groups.length > 0 && `(${groups.length})`}
            </h6>
            <button
              className={`text-primary text-sm transition-colors duration-200 rounded px-2 py-1 ${
                allSelected
                  ? "hover:bg-red-500/20 hover:text-red-400"
                  : "hover:bg-[#94eb00]/20 hover:text-[#94eb00]"
              }`}
              onClick={toggleSelectAll}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          <TextInput
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
            className="mb-3"
          />

          {isLoading ? (
            <p className="text-white text-center py-6">Loading groups...</p>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group._id}
                className="flex items-center justify-between gap-4 mb-0"
                onClick={() => toggleGroup(group)}
              >
                <img
                  src={group.group_picture_url || IMAGES.groupPlaceholder}
                  alt={group.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex items-center gap-3 justify-between w-full border-b border-gray-800 py-4">
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      {group.name}
                    </p>
                    <p className="text-gray-400 text-xs">{group.followers}</p>
                  </div>
                  <Checkbox
                    id={`group-${group._id}`}
                    className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                    checked={selectedGroups.some((g) => g._id === group._id)}
                    // onCheckedChange={() => toggleGroup(group)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </DrawerSidebar>

      {/* Purchase Modal */}
      <CustomModal
        disabled={false}
        title="Purchase Required"
        submitText="Download Mobile App"
        open={showPurchaseModal}
        setOpen={setShowPurchaseModal}
        onCancel={() => setShowPurchaseModal(false)}
        onSubmit={() => {
          // Redirect to mobile app download or app store
          window.open("https://apps.apple.com/app/muvello", "_blank");
          setShowPurchaseModal(false);
        }}
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <div className="mb-4">
              <Icon
                icon="material-symbols:lock"
                fontSize={48}
                className="text-primary mx-auto mb-2"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">Premium Workout</h3>
            <p className="text-grey text-sm mb-4">
              This workout requires a purchase. Please download our mobile app
              to purchase and access this premium workout.
            </p>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-300">
                <strong>Workout:</strong> {workoutDetails?.title}
              </p>
              <p className="text-sm text-gray-300">
                <strong>Price:</strong> ${workoutDetails?.fees}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Purchase and access all premium features through our mobile app
            </p>
          </div>
        }
      />
    </div>
  );
};

export default WorkoutDetails;
