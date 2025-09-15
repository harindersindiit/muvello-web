import WorkoutComponent from "@/components/customcomponents/WorkoutComponent";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WorkoutComponentSidebar from "@/components/workoutcommponentsidebar";

import { IMAGES } from "@/contants/images";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import WorkoutComponentSkeleton from "@/components/skeletons/WorkoutComponentSkeleton";
import { getMaxWeek } from "@/utils/sec";
import NoDataPlaceholder from "@/components/ui/nodata";
import { CustomModal } from "@/components/customcomponents/CustomModal";
import { useInView } from "react-intersection-observer";

const Workouts = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 1 });

  const { user } = useUser();
  const [workouts, setWorkouts] = useState([]);
  const [workoutLoader, setWorkoutLoader] = useState(false);

  const [deleteExercise, setDeleteExercise] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [editExercise, setEditExercise] = useState(null);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const limit = 16;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);

  useEffect(() => {
    if (inView && hasMore && !workoutLoader) {
      getWorkouts(page + 1);
    }
  }, [inView, hasMore, workoutLoader]);

  useEffect(() => {
    let filtered = workouts;

    switch (selectedFilter) {
      case "Free":
        filtered = workouts.filter((w) => w.access === "Free");
        break;
      case "Paid":
        filtered = workouts.filter((w) => w.access !== "Free"); // or use w.access === "Paid" if defined
        break;
      case "Private":
        filtered = workouts.filter((w) => w.visibility === "Private");
        break;
      case "Draft":
        filtered = workouts.filter((w) => w.is_draft === true);
        break;
      default:
        filtered = workouts;
    }

    setFilteredWorkouts(filtered);
  }, [selectedFilter, workouts]);

  useEffect(() => {
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  const getWorkouts = async (currentPage = 1) => {
    if (!hasMore || workoutLoader) return;

    setWorkoutLoader(true);

    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get(
        `workout?limit=${limit}&page=${currentPage}&user_id=${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newPosts = res.data.body.workouts;

      setWorkouts((prev) => [...prev, ...newPosts]); // <== Set the source list
      setFilteredWorkouts((prev) => [...prev, ...newPosts]); // Keep this for immediate rendering

      setPage(currentPage);

      if (newPosts.length < limit) {
        setHasMore(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to fetch posts.");
    } finally {
      setWorkoutLoader(false);
    }
  };

  useEffect(() => {
    getWorkouts(1);
  }, []);

  const handleDeleteExercise = async () => {
    setDeleteLoader(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const resExe = await axiosInstance.delete(
        `/workout/${editExercise._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted workout from both workouts and filteredWorkouts arrays
      setWorkouts((prev) =>
        prev.filter((workout) => workout._id !== editExercise._id)
      );
      setFilteredWorkouts((prev) =>
        prev.filter((workout) => workout._id !== editExercise._id)
      );

      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setDeleteExercise(false);
      setDeleteLoader(false);
      setEditExercise(null);
    }
  };

  return (
    <div className=" text-white my-6 mb-0 pb-9 px-1">
      {/* Workouts */}
      <div className="mt-0 sm:mt-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">Workouts</h3>

          <div className="relative ms-auto mr-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Link
                  to="#"
                  className="text-white font-semibold ms-auto mr-5  hover:text-primary transition-all duration-300 text-sm  flex items-center gap-2"
                >
                  <Icon
                    icon="lets-icons:filter-big"
                    style={{ width: "25px", height: "25px" }}
                  />
                  Filter
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                className="bg-lightdark w-30 p-2 border-lightdark rounded-[12px]"
                sideOffset={10}
              >
                <DropdownMenuItem
                  className="text-white hover:text-primary mb-2"
                  onClick={() => setSelectedFilter("All")}
                >
                  <span className="flex items-center gap-2">All</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-white hover:text-primary mb-2"
                  onClick={() => setSelectedFilter("Free")}
                >
                  <span className="flex items-center gap-2">Free</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-white hover:text-primary mb-2"
                  onClick={() => setSelectedFilter("Paid")}
                >
                  <span className="flex items-center gap-2">Paid</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-white hover:text-primary mb-2"
                  onClick={() => setSelectedFilter("Private")}
                >
                  <span className="flex items-center gap-2">Private</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-white hover:text-primary"
                  onClick={() => setSelectedFilter("Draft")}
                >
                  <span className="flex items-center gap-2">Draft</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link
            to="/user/create-workout"
            className="text-primary font-semibold hover:text-white transition-all duration-300 text-xs sm:text-sm  flex items-center gap-2"
          >
            <Icon
              icon="f7:plus-app"
              style={{ width: "25px", height: "25px" }}
            />
            Create Workout
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {workoutLoader ? (
            Array.from({ length: 16 }).map((_, index) => (
              <WorkoutComponentSkeleton key={index} />
            ))
          ) : (
            <>
              {filteredWorkouts.map((workout, index) => (
                <WorkoutComponent
                  visibility={workout.visibility}
                  is_draft={workout.is_draft}
                  onClickEdit={() => {
                    navigate("/user/edit-workout", {
                      state: workout,
                    });
                  }}
                  showEditDelete={true}
                  onClickDelete={() => {
                    setEditExercise(workout);
                    setDeleteExercise(true);
                  }}
                  key={index}
                  image={workout.thumbnail}
                  title={workout.title}
                  price={workout.fees > 0 ? `$${workout.fees}` : ""}
                  duration={workout?.exercises.reduce(
                    (acc, curr) => acc + (curr.workout_duration || 0),
                    0
                  )}
                  weeks={getMaxWeek(workout?.exercises, "week")}
                  onViewClick={() =>
                    navigate(`/user/workouts/workout-details`, {
                      state: workout,
                    })
                  }
                />
              ))}

              {workoutLoader &&
                Array.from({ length: 16 }).map((_, index) => (
                  <WorkoutComponentSkeleton key={index} />
                ))}

              {/* Intersection Observer Anchor */}
              <div ref={ref} className="h-10"></div>

              {/* {!workoutLoader && filteredWorkouts.length === 0 && (
                <NoDataPlaceholder />
              )} */}
            </>
          )}
        </div>
      </div>
      <WorkoutComponentSidebar mode={mode} open={open} setOpen={setOpen} />

      {/* Modal */}
      <CustomModal
        title=""
        submitText={deleteLoader ? "Deleting..." : "Yes I’m Sure"}
        open={deleteExercise}
        setOpen={setDeleteExercise}
        onCancel={() => !deleteLoader && setDeleteExercise(false)}
        onSubmit={() => !deleteLoader && handleDeleteExercise()}
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Delete Workout?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white">{editExercise?.title}</span> workout?
            </p>
          </div>
        }
      />
      {!workoutLoader && filteredWorkouts.length === 0 && <NoDataPlaceholder />}
    </div>
  );
};

export default Workouts;
