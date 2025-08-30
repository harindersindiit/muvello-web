import { useEffect, useState } from "react";
import { CustomModal } from "@/components/customcomponents/CustomModal";
import ExerciseComponent from "@/components/customcomponents/ExerciseComponent";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate } from "react-router-dom";
import { IMAGES } from "@/contants/images";
import ExerciseCommonSidebar from "@/components/exercisecommonsidebar";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import NoDataPlaceholder from "@/components/ui/nodata";
import { useUser } from "@/context/UserContext";
import ExerciseComponentSkeleton from "@/components/skeletons/ExerciseComponentSkeleton";
import { useInView } from "react-intersection-observer";

const Exercise = () => {
  const navigate = useNavigate();
  const [preferences, setPrefernces] = useState([]);
  const [preferencesLoader, setPreferncesLoader] = useState(false);
  const [exersicesLoader, setExersicesLoader] = useState(false);
  const [exercises, setExercises] = useState([]);

  const [open, setOpen] = useState(false);
  const [deleteExercise, setDeleteExercise] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [editExercise, setEditExercise] = useState(null);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({ threshold: 1 });

  const limit = 20;
  const { user } = useUser();
  const [mode, setMode] = useState<"add" | "edit">("add");

  const getPreferences = async () => {
    setPreferncesLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get("/target-part/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrefernces(res.data.body.targetParts);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Internal Server Error.");
    } finally {
      setPreferncesLoader(false);
    }
  };

  const getExercises = async (currentPage = 1, tab_ = null) => {
    if (exersicesLoader) return; // ✅ Don't block if hasMore is false when fetching page 1
    if (currentPage !== 1 && !hasMore) return;

    setExersicesLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const tab = tab_ || selectedTab;
      const targetPartParam = tab !== "all" ? `&target_part=${tab}` : "";
      const res = await axiosInstance.get(
        `/exercise?limit=${limit}&page=${currentPage}${targetPartParam}&user_id=${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newExercises = res.data.body.exercises;

      setExercises((prev) =>
        currentPage === 1 ? newExercises : [...prev, ...newExercises]
      );
      setPage(currentPage);
      if (newExercises.length < limit) setHasMore(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Internal Server Error.");
    } finally {
      setExersicesLoader(false);
    }
  };

  const handleDeleteExercise = async () => {
    setDeleteLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.delete(`/exercise/${editExercise?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      setDeleteExercise(false);
      getExercises(1, selectedTab);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Internal Server Error.");
    } finally {
      setDeleteLoader(false);
    }
  };

  const handleTabChange = (id: string) => {
    setSelectedTab(id);
    setPage(1);
    setHasMore(true); // ✅ Reset hasMore
    setExercises([]); // ✅ Clear previous tab's data
    getExercises(1, id); // ✅ Now fetch new tab's data
  };

  useEffect(() => {
    getPreferences();
  }, []);

  useEffect(() => {
    if (user._id) {
      getExercises(1);
    }
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, [user]);

  useEffect(() => {
    if (inView && hasMore && !exersicesLoader) {
      getExercises(page + 1, selectedTab);
    }
  }, [inView]);

  return (
    <>
      <div className="text-white my-6 mb-0 pb-9 px-1">
        <div className="mt-0 sm:mt-8">
          <div className="flex justify-between items-center flex-wrap space-y-3 mb-3">
            <h3 className="text-xl font-semibold mb-3">Exercises</h3>

            <div className="flex gap-2 mr-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1a1a1a] hover:scrollbar-thumb-[#4a4a4a]">
              {[{ _id: "all", name: "All" }, ...preferences].map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTabChange(tag._id)}
                  className={`px-2 py-1 flex-shrink-0 rounded-full text-xs transition-all ${
                    selectedTab === tag._id
                      ? "bg-[#94eb00] text-black"
                      : "bg-[#2a2a2a] text-white"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            <Link
              to="#"
              onClick={() => {
                setEditExercise(null);
                setMode("add");
                setOpen(true);
              }}
              className="text-primary font-semibold hover:text-white transition-all duration-300 text-sm flex items-center gap-2"
            >
              <Icon
                icon="f7:plus-app"
                style={{ width: "25px", height: "25px" }}
              />
              Add Exercise
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exercises.map((exercise: any, index) => (
              <ExerciseComponent
                key={index}
                image={exercise.thumbnail}
                title={exercise.title}
                sets={exercise.sets.length}
                reps={exercise.sets.map((set: any) => set.reps).join(", ")}
                rest={exercise.sets
                  .map((set: any) => `${set.rest} Sec`)
                  .join(", ")}
                category={exercise.target_part.name}
                showEditDelete
                onClickEdit={() => {
                  setEditExercise(exercise);
                  setMode("edit");
                  setOpen(true);
                }}
                onClickDelete={() => {
                  setEditExercise(exercise);
                  setDeleteExercise(true);
                }}
                onClick={() =>
                  navigate("/user/chat/exercise-details", {
                    state: { ...exercise, exercise_info: exercise },
                  })
                }
              />
            ))}

            {exersicesLoader &&
              Array.from({ length: 16 }).map((_, index) => (
                <ExerciseComponentSkeleton key={index} />
              ))}
          </div>

          {/* Infinite Scroll Anchor */}
          <div ref={ref} className="h-10"></div>

          {!exersicesLoader && exercises.length === 0 && <NoDataPlaceholder />}
        </div>

        {/* Modal */}
        <CustomModal
          disabled={deleteLoader}
          title="Delete Exercise"
          submitText={deleteLoader ? "Deleting..." : "Yes I'm Sure"}
          open={deleteExercise}
          setOpen={setDeleteExercise}
          onCancel={() => setDeleteExercise(false)}
          onSubmit={handleDeleteExercise}
          customButtonClass="!py-6"
        >
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Delete Exercise?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white">{editExercise?.title}</span>{" "}
              exercise?
            </p>
          </div>
        </CustomModal>
      </div>

      <ExerciseCommonSidebar
        open={open}
        setOpen={setOpen}
        mode={mode}
        preferences={preferences}
        getExercises={() => getExercises(1, selectedTab)}
        editExercise={editExercise}
      />
    </>
  );
};

export default Exercise;
