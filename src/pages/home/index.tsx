import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import CustomButton from "@/components/customcomponents/CustomButton";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import ExerciseComponent from "@/components/customcomponents/ExerciseComponent";

import { Icon } from "@iconify/react/dist/iconify.js";
import Lines from "@/components/svgcomponents/Lines";
import PostCard from "@/components/customcomponents/PostComponent";

import WorkoutComponent from "@/components/customcomponents/WorkoutComponent";
import WorkoutComponentSidebar from "@/components/workoutcommponentsidebar";
import ExerciseCommonSidebar from "@/components/exercisecommonsidebar";

import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import localStorageService from "@/utils/localStorageService";
import { useUser } from "@/context/UserContext";

import NoDataPlaceholder from "@/components/ui/nodata";
import { getMaxWeek } from "@/utils/sec";
import { capitalize, totalWorkoutDuration } from "@/lib/utils";

import "react-loading-skeleton/dist/skeleton.css";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import ExerciseComponentSkeleton from "@/components/skeletons/ExerciseComponentSkeleton";
import WorkoutComponentSkeleton from "@/components/skeletons/WorkoutComponentSkeleton";

import AddPost from "@/components/customcomponents/AddPost";
import { useInView } from "react-intersection-observer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { reportUserSchema } from "@/utils/validations";

const reportOptions = [
  "Fake profile/spam",
  "Inappropriate profile photos",
  "False Information",
  "Spam or Promotions",
  "Offline behavior",
  "Violates Community Guidelines",
  "Illegal or Dangerous Activities",
  "Misleading Purpose",
  "Other",
];

const Home = () => {
  const postContainerRef = useRef(null);
  const [intersectionRoot, setIntersectionRoot] = useState(null);

  const initialValues = {
    reportType: "",
    reason: "",
  };

  useEffect(() => {
    if (postContainerRef.current) {
      setIntersectionRoot(postContainerRef.current);
    }
  }, []);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    root: intersectionRoot,
    rootMargin: "100px",
  });

  const navigate = useNavigate();
  const { updateUser, user } = useUser();

  const [open, setOpen] = useState(false);
  const [postDrawer, setPostDrawer] = useState(false);
  const [openExercise, setOpenExercise] = useState(false);

  const [caption, setCaption] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [isReport, setIsReport] = useState(false);

  const [reportType, setReportType] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /////

  const [posts, setPosts] = useState<any[]>([]);
  const limit = 6;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);

  const [workoutLoader, setWorkoutLoader] = useState(false);

  const [preferences, setPrefernces] = useState<any[]>([]);
  const [preferencesLoader, setPreferncesLoader] = useState(false);
  const [workoutCategories, setWorkoutCategories] = useState<any[]>([]);
  const [exersicesLoader, setExersicesLoader] = useState(false);
  const [exercises, setExercises] = useState<any[]>([]);

  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedCat, setSelectedCat] = useState("all");

  /// add post ////
  // const [postDetails, setPostDetails] = useState();
  const [selectGroupsOpen, setSelectGroupsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...fileArray]);
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    console.log(caption, selectedTab);
    if (!uploadedFiles.length) return alert("Please upload a file");
    const formData = new FormData();

    uploadedFiles.forEach(({ file }) => formData.append("files", file));
    formData.append("caption", caption);
    formData.append("category", selectedTab);
    formData.append("shareOnGroups", isShared.toString());

    // Call your backend API here
    fetch("/api/posts/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Upload success:", res);
        setPostDrawer(false);
        // Reset form
        setUploadedFiles([]);
        // setCaption("");
        setSelectedTab("");
        setIsShared(false);
      })
      .catch((err) => {
        console.error("Upload error:", err);
      });
  };

  // add post ////
  const getPostsList = useCallback(
    async (currentPage = 1) => {
      if (!hasMore || isFetchingMore) return;

      setIsFetchingMore(true);
      setPostsError(null);

      try {
        const token = localStorageService.getItem("accessToken");
        const res = await axiosInstance.get(
          `post?limit=${limit}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newPosts = res.data.body.posts;

        if (currentPage === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }
        setPage(currentPage);

        if (newPosts.length < limit) {
          setHasMore(false);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error || "Failed to fetch posts.";
        setPostsError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsFetchingMore(false);
      }
    },
    [hasMore, isFetchingMore, limit]
  );

  useEffect(() => {
    if (inView && hasMore && !isFetchingMore) {
      getPostsList(page + 1);
    }
  }, [inView, hasMore, isFetchingMore, page, getPostsList]);

  const refreshPosts = async () => {
    setPostsError(null);
    setPage(1);
    setHasMore(true);
    await getPostsList(1);
  };

  const getWorkouts = async (id = null) => {
    setWorkoutLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      let workoutCat = "";
      if (id && id !== "all") workoutCat = `&category=${id}`;
      const res2 = await axiosInstance.get(
        `workout?limit=${limit}&page=${1}&user_id=${
          user._id
        }${workoutCat}&type=NoDraft`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkouts(res2.data.body.workouts);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Login failed.";
      toast.error(message);
    } finally {
      setWorkoutLoader(false);
    }
  };

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

      const res1 = await axiosInstance.get("/admin/user-preferences/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkoutCategories(res1.data.body.workoutCategories);

      // setWorkoutCategories(res.data.body.workoutCategories);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setPreferncesLoader(false);
    }
  };

  const getExercises = async (tab_ = null) => {
    setExersicesLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const tab = tab_ || selectedTab;
      const targetPartParam = tab !== "all" ? `&target_part=${tab}` : "";
      const resExe = await axiosInstance.get(
        `/exercise?limit=${limit}&page=1${targetPartParam}&user_id=${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExercises(resExe.data.body.exercises);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setExersicesLoader(false);
    }
  };

  useEffect(() => {
    if (user._id) {
      getWorkouts();
      getPostsList();
      getPreferences();
      getExercises();
    }

    document.body.classList.add("custom-override");
    document.body.style.overflow = "hidden"; // ⛔ stop body scroll
    return () => {
      document.body.classList.remove("custom-override");
      document.body.style.overflow = ""; // ✅ reset on unmount
    };
  }, [user]);

  /////

  const handleReportSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const payload = {
        reported_user: reportedUser._id,
        reason:
          values.reportType === "Other" ? values.caption : values.reportType,
      };

      await axiosInstance.post("/user-reports", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetForm();

      toast.success("Report submitted successfully.");
      setIsReport(false);
      setReportType("");
      setCaption("");
    } catch (error) {
      const message = error?.response?.data?.error || "Reporting user failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const [reportedUser, setReportedUser] = useState(null);

  const onViewProfile = (id) => {
    navigate("/user/profile", {
      ...(id !== user._id && {
        state: { id },
      }),
    });
  };

  return (
    <div className=" text-white my-6 mb-0 pb-9 px-1">
      {/* <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 grid-rows-[auto] gap-4"> */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-80px)]">
        {/* <div className="col-span-1 md:col-span-2 xl:col-span-3"> */}
        <div className="col-span-1 md:col-span-2 xl:col-span-3 overflow-y-auto pr-2 scroll-hide">
          <div className="sticky top-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-[#1a1a1a] p-4 rounded-lg">
              <div>
                <p className="text-sm text-white font-light opacity-70 mb-1">
                  👋 Welcome back, {capitalize(user?.fullname)}!
                </p>
                <h2 className="text-lg font-semibold">
                  Let's build something awesome today.
                </h2>
              </div>
              <div className="flex gap-2">
                <CustomButton
                  className="w-auto py-5 bg-[transparent] border-primary text-primary"
                  text="Create Workout"
                  type="button"
                  onClick={() => {
                    navigate("/user/create-workout");
                  }}
                  icon={
                    <Icon
                      icon="f7:plus-app"
                      style={{
                        width: "21px",
                        height: "21px",
                      }}
                    />
                  }
                />
                <CustomButton
                  className="w-auto py-5"
                  text="Add Exercise"
                  type="button"
                  onClick={() => {
                    setMode("add");
                    setOpenExercise(true);
                  }}
                  icon={
                    <Icon
                      icon="f7:plus-app"
                      style={{
                        width: "21px",
                        height: "21px",
                      }}
                    />
                  }
                />
              </div>
            </div>

            {/* Categories */}
            <div className="overflow-x-auto mt-6">
              <h3 className="text-xl font-semibold mb-3">Categories</h3>
              <div className="flex gap-2 flex-wrap scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1a1a1a] hover:scrollbar-thumb-[#4a4a4a]">
                {[{ _id: "all", title: "All" }, ...workoutCategories].map(
                  (cat) => (
                    <button
                      key={cat._id}
                      className={`px-3 cursor-pointer flex items-center gap-2 py-2 border   rounded-full text-sm font-regular text-black hover:bg-[#3a3a3a] flex-shrink-0 ${
                        selectedCat === cat._id
                          ? "border-[#94eb00] text-primary"
                          : "border-[#2a2a2a] text-white"
                      }`}
                      onClick={() => {
                        setSelectedCat(cat._id);
                        getWorkouts(cat._id);
                      }}
                    >
                      {/* <Icon icon={cat.icon} color="#94eb00" fontSize={23} /> */}
                      {cat._id !== "all" && (
                        <img
                          src={cat.icon}
                          alt="favourite"
                          width={25}
                          className="h-[25px]"
                        />
                      )}
                      {cat.title}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Workouts */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">Workouts</h3>
                {!workoutLoader && workouts.length > 0 && (
                  <Link
                    to="/user/workouts"
                    className="text-[#94eb00] hover:text-white transition-all duration-300 text-sm font-semibold"
                  >
                    View more
                  </Link>
                )}
              </div>
              <div
                className={`grid gap-4 md:grid-cols-2  ${
                  !workoutLoader && workouts.length === 0
                    ? "xl:grid-cols-1"
                    : "xl:grid-cols-3"
                }`}
              >
                {workoutLoader ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <WorkoutComponentSkeleton key={index} />
                  ))
                ) : (
                  <>
                    {workouts.map((workout, index) => (
                      <WorkoutComponent
                        visibility={workout.visibility}
                        is_draft={workout.is_draft}
                        key={index}
                        image={workout.thumbnail}
                        title={workout.title}
                        price={workout.fees > 0 ? `$${workout.fees}` : ""}
                        duration={totalWorkoutDuration(workout.exercises)}
                        weeks={
                          getMaxWeek(workout?.exercises, "week") || "0 weeks"
                        }
                        onViewClick={() =>
                          navigate(`/user/workouts/workout-details`, {
                            state: workout,
                          })
                        }
                      />
                    ))}

                    {!workoutLoader && workouts.length === 0 && (
                      <NoDataPlaceholder />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Exercises */}

            <div className="mt-8">
              <div className="flex items-center flex-wrap md:space-y-0 space-y-4 mb-5">
                <h3 className="text-xl font-semibold mb-3 md:mb-0 mr-3">
                  Exercises
                </h3>
                <div className="flex gap-1 mr-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                  {[{ _id: "all", name: "All" }, ...preferences].map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => {
                        getExercises(tag._id);
                        setSelectedTab(tag._id);
                      }}
                      className={`mt-1 mb-3 px-4 py-1 cursor-pointer flex-shrink-0 border rounded-full text-xs transition-all ${
                        selectedTab === tag._id
                          ? "border-[#94eb00] text-primary hover:bg-[#94eb00]/10"
                          : "border-[#2a2a2a] text-white hover:bg-[#2a2a2a]/50 hover:border-[#3a3a3a]"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>

                {!exersicesLoader && exercises.length > 0 && (
                  <Link
                    to="/user/exercises"
                    className="text-[#94eb00] hover:text-white transition-all duration-300 text-sm ms-auto font-semibold"
                  >
                    View more
                  </Link>
                )}
              </div>
              {preferencesLoader || exersicesLoader ? (
                // <Loader2 className="animate-spin text-white w-12 h-12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ExerciseComponentSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div
                  className={`grid pb-15 gap-4 md:grid-cols-2  ${
                    !exersicesLoader && exercises.length === 0
                      ? "xl:grid-cols-1"
                      : "xl:grid-cols-3"
                  }`}
                >
                  {exercises.map((exercise: any, index) => (
                    <ExerciseComponent
                      key={index}
                      image={exercise.thumbnail}
                      title={exercise.title}
                      sets={exercise.sets.length}
                      reps={exercise.sets
                        .slice(0, 5)
                        .map((set: any) => set.reps)
                        .join(", ")}
                      rest={exercise.sets
                        .slice(0, 4)
                        .map((set: any) => `${set.rest} Sec`)
                        .join(", ")}
                      category={exercise.target_part.name}
                      onClick={() =>
                        navigate("/user/chat/exercise-details", {
                          state: { ...exercise, exercise_info: exercise },
                        })
                      }
                    />
                  ))}
                  {!exersicesLoader && exercises.length === 0 && (
                    <NoDataPlaceholder />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className="col-span-1 md:col-span-2 xl:col-span-1 md:mt-5 xl:mt-0"> */}
        <div
          ref={postContainerRef}
          className="col-span-1 md:col-span-2 xl:col-span-1 overflow-y-auto pl-2 scroll-hide"
        >
          {/* Sidebar */}
          <div className=" xl:block">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Recent Posts</h4>
              <Link
                onClick={() => setPostDrawer(true)}
                to="#"
                className="text-primary hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-1"
              >
                <Icon
                  icon="f7:plus-app"
                  style={{ width: "21px", height: "21px" }}
                />
                Create Post
              </Link>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
              {loader ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))
              ) : (
                <>
                  {posts.map((item, index) => (
                    <PostCard
                      key={item._id || index}
                      item={item}
                      posts={posts}
                      setPosts={setPosts}
                      onReport={(user) => {
                        setReportedUser(user);
                        setIsReport(true);
                      }}
                      onViewProfile={onViewProfile}
                    />
                  ))}

                  {isFetchingMore &&
                    Array.from({ length: 2 }).map((_, index) => (
                      <PostCardSkeleton key={index} />
                    ))}

                  {/* Intersection Observer Anchor */}
                  <div ref={inViewRef} className="h-10"></div>

                  {/* End of posts message */}
                  {!hasMore && posts.length > 0 && !isFetchingMore && (
                    <div className="col-span-full flex flex-col items-center justify-center px-4 text-center mb-16">
                      <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
                        <Icon
                          icon="material-symbols:check-circle-outline"
                          className="text-[#94eb00]"
                          style={{ width: "32px", height: "32px" }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        You're all caught up!
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm">
                        You've seen all the recent posts. Check back later for
                        new content or create your own post to share with the
                        community.
                      </p>
                    </div>
                  )}

                  {!isFetchingMore && posts.length === 0 && !postsError && (
                    <NoDataPlaceholder />
                  )}

                  {postsError && (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 text-center">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <Icon
                          icon="material-symbols:error-outline"
                          className="text-red-500"
                          style={{ width: "32px", height: "32px" }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Failed to load posts
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm mb-4">
                        {postsError}
                      </p>
                      <button
                        onClick={refreshPosts}
                        className="px-4 py-2 bg-[#94eb00] text-black rounded-lg hover:bg-[#7bc700] transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Drawer */}
      <AddPost
        setPostDrawer={setPostDrawer}
        postDrawer={postDrawer}
        postDetails={null}
        refreshPosts={refreshPosts}
      />
      {/* Create Post Drawer */}

      {/* Report Drawer */}
      <Formik
        initialValues={initialValues}
        validationSchema={reportUserSchema}
        onSubmit={handleReportSubmit}
      >
        {({ values, setFieldValue, isSubmitting, handleSubmit, resetForm }) => (
          <Form>
            <DrawerSidebar
              title="Report"
              submitText={isSubmitting ? "Submitting..." : "Submit"}
              cancelText="Cancel"
              onSubmit={() =>
                document.getElementById("report-form-submit")?.click()
              }
              open={isReport}
              setOpen={setIsReport}
              onCancel={() => {
                resetForm();
                setIsReport(false);
              }}
            >
              <div className="p-4">
                <h3 className="text-white text-md font-semibold mb-3">
                  We don’t tell {reportedUser?.fullname}.
                </h3>

                <div className="flex flex-col">
                  <div className="space-y-6 mb-3">
                    {reportOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFieldValue("reportType", option)}
                        className="flex w-full cursor-pointer items-center justify-between text-left text-white text-sm font-normal focus:outline-none"
                      >
                        {option}
                        <div className="w-5 h-5 ml-4">
                          <Icon
                            icon="radix-icons:radiobutton"
                            fontSize={20}
                            color={
                              values.reportType === option ? "#94EB00" : "#666"
                            }
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="reportType"
                    component="div"
                    className="text-red-500 text-xs mb-2"
                  />
                </div>

                {values.reportType === "Other" && (
                  <div className="mt-4">
                    <Field name="reason">
                      {({ field }) => (
                        <CustomTextArea
                          {...field}
                          // onChange={(e) =>
                          //   setFieldValue("caption", e.target.value)
                          // }
                          placeholder="Write your reason here..."
                          icon={<Lines color="white" />}
                          error={null}
                          rows={1}
                          className="resize-none overflow-hidden"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="reason"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="hidden"
                  id="report-form-submit"
                  disabled={isSubmitting}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Submit
                </button>
              </div>
            </DrawerSidebar>
          </Form>
        )}
      </Formik>

      <WorkoutComponentSidebar mode={mode} open={open} setOpen={setOpen} />
      <ExerciseCommonSidebar
        open={openExercise}
        setOpen={setOpenExercise}
        mode={mode}
        preferences={preferences}
        getExercises={() => {
          getExercises();
        }}
      />
    </div>
  );
};

export default Home;
