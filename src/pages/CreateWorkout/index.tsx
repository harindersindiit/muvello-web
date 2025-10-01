import { useEffect, useState, useRef } from "react";

import { IMAGES } from "@/contants/images";
import TextInput from "@/components/customcomponents/TextInput";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import CustomButton from "@/components/customcomponents/CustomButton";
import { Icon } from "@iconify/react/dist/iconify.js";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";
import Lines from "@/components/svgcomponents/Lines";
import GroupInputTag from "@/components/customcomponents/GroupInputTag";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { addWorkoutSchema } from "@/utils/validations";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import FullScreenLoader from "@/components/ui/loader";

let formik;

const SelectExercisePopup = ({
  open,
  exercises = [],
  onSelect,
  currentEditingDay,
  weeks,
  searchText,
  setSearchText,
  onClose,
}) => {
  const filteredExercises = exercises.filter((exercise) =>
    exercise.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const isExerciseSelected = (exerciseId) => {
    if (!currentEditingDay) return false;
    const { weekIndex, dayIndex } = currentEditingDay;
    return weeks?.[weekIndex]?.days?.[dayIndex]?.exercises?.some(
      (ex) => ex._id === exerciseId
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2b2a2a] text-white border-transparent">
        <DialogHeader>
          <DialogTitle>Select Exercise</DialogTitle>
          <DialogDescription className="text-white/60">
            Choose from the list below
          </DialogDescription>
        </DialogHeader>

        <TextInput
          placeholder="Search exercises"
          type="text"
          icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-3"
        />

        <div className="h-64 overflow-y-auto space-y-2">
          {filteredExercises.map((exercise) => {
            const isChecked = isExerciseSelected(exercise._id);

            return (
              <div
                key={exercise._id}
                onClick={() => onSelect(exercise)}
                className="cursor-pointer flex items-start gap-3 p-3 rounded-md hover:bg-white/10 border border-white/10"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{exercise.title}</p>
                  <p className="text-sm text-gray-400">
                    {exercise.description}
                  </p>
                </div>
              </div>
            );
          })}

          {exercises.length === 0 && (
            <p className="text-gray-500 text-center py-6">
              No exercises found.
            </p>
          )}
        </div>

        <div className="mt-6 text-right">
          <CustomButton
            text="Save"
            type="button"
            className="bg-primary text-black px-6 py-7 rounded-full border-transparent"
            onClick={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CreateWorkout = () => {
  const location = useLocation();
  const editingWorkout = location.state || null;
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    if (editingWorkout) {
      setCanEdit(editingWorkout.totalParticipants == 0);
    }
    console.log({ canEdit });
  }, [editingWorkout]);

  const canSaveDraft = !editingWorkout?.once_published;

  const { user } = useUser();
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState("Private");

  const iniVal = {
    title: "",
    caption: "",
    fees: 0,
    workout_category: "",
    access: "Free", // ✅ ADD THIS
    is_draft: false, // ✅ Required by schema
    thumbnail: "",
  };

  const [, setPrefernces] = useState([]);
  const [workoutCategories, setWorkoutCategories] = useState([]);
  const [isSelectExerciseOpen, setSelectExerciseOpen] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [initialVal, setInitialVal] = useState(iniVal);
  const [currentEditingDay, setCurrentEditingDay] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedgroups, setSelectedgroups] = useState<unknown[]>([]);
  const [preferencesLoader, setPreferncesLoader] = useState(false);
  const [exerciseLoader, setExerciseLoader] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  // Refs for form fields to enable scrolling to errors
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const captionRef = useRef(null);
  const thumbnailRef = useRef(null);
  const feesRef = useRef(null);

  const closeSelectExercisePopup = () => {
    setSelectExerciseOpen(false);
    setSearchText("");
  };

  // Function to scroll to the first error field
  const scrollToFirstError = (errors, touched) => {
    const errorFields = [
      { field: "title", ref: titleRef },
      { field: "workout_category", ref: categoryRef },
      { field: "caption", ref: captionRef },
      { field: "thumbnail", ref: thumbnailRef },
      { field: "fees", ref: feesRef },
    ];

    // Find the first field with an error
    for (const { field, ref } of errorFields) {
      if (errors[field] && touched[field] && ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      }
    }

    // Check for workout day errors (exercises and duration)
    if (isSubmit) {
      for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
        const week = weeks[weekIndex];
        for (let dayIndex = 0; dayIndex < week.days.length; dayIndex++) {
          const day = week.days[dayIndex];
          if (
            !day.exercises ||
            day.exercises.length === 0 ||
            !day.duration ||
            day.duration === "0"
          ) {
            // Find the first day with errors and scroll to it
            const dayElement = document.querySelector(
              `[data-week="${weekIndex}"][data-day="${dayIndex}"]`
            );
            if (dayElement) {
              dayElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              break;
            }
          }
        }
      }
    }
  };

  const onSelectGroups = (groups: unknown[]) => {
    setSelectedgroups(groups);
  };

  const [weeks, setWeeks] = useState([
    {
      week: 1,
      days: [
        {
          day: 1,
          title: "",
          exercises: [],
          duration: "",
        },
      ],
    },
  ]);

  const [thumbnailFile, setThumbnailFile] = useState(null);

  const addWeek = () => {
    const newWeekNumber = weeks.length + 1;
    setWeeks((prev) => [
      ...prev,
      {
        week: newWeekNumber,
        days: [
          {
            day: 1,
            title: "",
            exercises: [],
            duration: "",
          },
        ],
      },
    ]);
  };

  const addDayToWeek = (weekIndex) => {
    setWeeks((prev) => {
      const updatedWeeks = [...prev];
      const currentDays = updatedWeeks[weekIndex].days;

      // Prevent adding more than 7 days
      if (currentDays.length >= 7) {
        toast.error("You can only add up to 7 days in a week");
        return prev; // Do not update state
      }

      updatedWeeks[weekIndex].days.push({
        day: currentDays.length + 1,
        title: "",
        exercises: [],
        duration: "",
      });

      return updatedWeeks;
    });
  };

  useEffect(() => {
    getPreferences();
    fetchExercises();

    if (editingWorkout) {
      setInitialVal({
        title: editingWorkout.title,
        caption: editingWorkout.caption,
        fees: editingWorkout.fees || 0,
        workout_category: editingWorkout.workout_category[0]._id,
        access: editingWorkout.access, // ✅ ADD
        is_draft: false,
        thumbnail: editingWorkout.thumbnail,
      });

      setVisibility(editingWorkout.visibility);

      setThumbnailFile(editingWorkout.thumbnail || null);

      // 🧩 Convert exercises into weeks/days format
      const transformedWeeks = [];
      editingWorkout.exercises?.forEach((item) => {
        let existingWeek = transformedWeeks.find((w) => w.week === item.week);
        if (!existingWeek) {
          existingWeek = { week: item.week, days: [] };
          transformedWeeks.push(existingWeek);
        }

        existingWeek.days.push({
          day: item.day,
          title: `Day ${item.day}`,
          duration: item.workout_duration,
          exercises:
            item.exercises?.map((ex) => ({
              _id: ex._id,
              title: ex.exercise_info?.title || "Exercise",
            })) || [],
        });
      });

      setWeeks(transformedWeeks.sort((a, b) => a.week - b.week));
    }
  }, []);

  const getPreferences = async () => {
    setPreferncesLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const [targetPartRes, userPrefsRes] = await Promise.all([
        axiosInstance.get("/target-part/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.get("/admin/user-preferences/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPrefernces(targetPartRes.data.body.targetParts);
      setWorkoutCategories(userPrefsRes.data.body.workoutCategories);
    } catch (error) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setPreferncesLoader(false);
    }
  };

  useEffect(() => {
    if (editingWorkout) {
      formik.setFieldValue(
        "workout_category",
        editingWorkout.workout_category[0]._id
      );
    }
  }, [workoutCategories]);

  const fetchExercises = async () => {
    try {
      setExerciseLoader(true);
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get(
        `/exercise?user_id=${user._id}&limit=1000`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExercises(res.data.body.exercises || []);
    } catch {
      toast.error("Failed to load exercises");
    } finally {
      setExerciseLoader(false);
    }
  };

  const handleSubmitFun = async (values) => {
    try {
      setSubmitting(true);

      // Validate all days have at least one exercise
      for (const week of weeks) {
        for (const day of week.days) {
          if (!day.exercises || day.exercises.length === 0) {
            return; // UI already shows error message
          }
          if (!day.duration || day.duration == "0") {
            return; // UI already shows error message
          }
        }
      }

      const token = localStorageService.getItem("accessToken");

      // 🧩 Map weeks/days/exercises into `workout_exercises` structure
      const workout_exercises = weeks.flatMap((week) =>
        week.days.map((day) => ({
          week: week.week,
          day: day.day,
          workout_duration: Number(day.duration) || 0,
          exercises: day.exercises.map((exercise, index) => ({
            index,
            _id: exercise._id,
          })),
        }))
      );

      const payload = {
        thumbnail: thumbnailFile,
        title: values.title,
        caption: values.caption,
        workout_category: values.workout_category,
        access: values.access,
        fees: values.access == "Free" ? 0 : Number(values.fees),
        visibility: visibility,
        is_draft: values.is_draft,
        workout_exercises,
        groups: values.is_draft
          ? []
          : selectedgroups.map((group: any) => group._id),
      };

      if (typeof thumbnailFile === "object") {
        const formData = new FormData();
        formData.append("file", thumbnailFile); // 👈 Your backend should accept `image` field

        const res = await axiosInstance.post("/s3/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const { body } = res.data;
        payload.thumbnail = body.fileUrl;
      }

      console.log(payload);

      if (editingWorkout) {
        const res = await axiosInstance.put(
          `/workout/${editingWorkout._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success(res.data.message);
        navigate("/user/workouts", { replace: true });
      } else {
        const res = await axiosInstance.post("/workout/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(res.data.message);
        navigate("/user/workouts");
      }

      setIsSubmit(false);
    } catch (error) {
      setIsSubmit(false);
      console.error(error);
      toast.error("Failed to create workout");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDurationChange = (weekIndex, dayIndex, value) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].days[dayIndex].duration = value;
    setWeeks(updatedWeeks);
  };

  const removeDayFromWeek = (weekIndex, dayIndex) => {
    setWeeks((prev) => {
      const updatedWeeks = [...prev];
      const currentDays = updatedWeeks[weekIndex].days;

      // Prevent removing the last day in the week
      if (currentDays.length <= 1) {
        toast.warning("Each week must have at least one day.");
        return prev;
      }

      // Remove the selected day
      currentDays.splice(dayIndex, 1);

      // Re-index day numbers (e.g. 1, 2, 3...)
      updatedWeeks[weekIndex].days = currentDays.map((day, idx) => ({
        ...day,
        day: idx + 1,
      }));

      return updatedWeeks;
    });
  };

  const removeWeek = (weekIndex) => {
    if (weeks.length <= 1) {
      toast.warning("At least one week is required.");
      return;
    }

    const updatedWeeks = weeks.filter((_, idx) => idx !== weekIndex);

    // Reindex weeks and days
    const reindexedWeeks = updatedWeeks.map((week, index) => ({
      week: index + 1,
      days: week.days.map((day, dayIndex) => ({
        ...day,
        day: dayIndex + 1, // optional reset day numbering as well
      })),
    }));

    setWeeks(reindexedWeeks);
  };
  return (
    <div className="bg-black min-h-screen text-white pb-12">
      <div className="px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 w-full md:w-auto cursor-pointer"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-lg font-semibold">
            {editingWorkout ? "Update" : "Create"} Workout
          </span>
        </button>
        <div className="flex gap-3 w-full md:w-auto justify-end">
          {canSaveDraft && (
            <CustomButton
              className="w-1/2 md:w-auto py-5 px-11 border-2 border-[#94eb00] text-[#94eb00] bg-transparent font-semibold rounded-full transition-all hover:bg-[#94eb00]/10"
              text="Save as Draft"
              type="button"
              onClick={() => {
                setIsSubmit(true);
                formik.setFieldValue("is_draft", true);
                // Scroll to first error after a short delay to allow form validation
                setTimeout(() => {
                  scrollToFirstError(formik.errors, formik.touched);
                }, 100);
                document.getElementById("workout-form-submit")?.click();
              }}
            />
          )}

          <CustomButton
            className="w-1/2 md:w-auto py-5 px-11 bg-[#94eb00] text-black font-semibold rounded-full transition-all hover:bg-[#94eb00]/90"
            text="Publish"
            type="button"
            onClick={() => {
              setIsSubmit(true);
              formik.setFieldValue("is_draft", false);
              // Scroll to first error after a short delay to allow form validation
              setTimeout(() => {
                scrollToFirstError(formik.errors, formik.touched);
              }, 100);
              document.getElementById("workout-form-submit")?.click();
            }}
          />
        </div>
      </div>

      {/* Warning Message */}
      {!canEdit && showWarning && (
        <div className="mx-4 mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 relative">
          <div className="flex items-start gap-3">
            <Icon
              icon="material-symbols:warning"
              className="text-yellow-500 mt-0.5 flex-shrink-0"
              fontSize={20}
            />
            <div className="flex-1">
              <p className="text-yellow-500 font-medium">
                Limited Editing Mode
              </p>
              <p className="text-yellow-400/80 text-sm mt-1">
                Some users have already started this workout, so you can only
                edit the title, thumbnail, and description.
              </p>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-yellow-500/60 hover:text-yellow-500 transition-colors"
            >
              <Icon icon="material-symbols:close" fontSize={20} />
            </button>
          </div>
        </div>
      )}

      <Formik
        enableReinitialize={true} // ✅ ADD THIS LINE
        innerRef={(ref) => {
          formik = ref;
        }}
        initialValues={initialVal}
        validationSchema={addWorkoutSchema}
        onSubmit={handleSubmitFun}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <div className="px-4 py-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* <div className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-65 flex flex-col justify-center items-center bg-[#1f1f1f]">
                    <Icon
                      icon="solar:gallery-outline"
                      className="text-blue mb-2"
                      fontSize={34}
                    />
                    <p className="text-white text-sm">
                      Upload Workout Thumbnail
                    </p>
                  </div> */}

                  <div
                    ref={thumbnailRef}
                    className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-85 flex flex-col justify-center items-center bg-[#1f1f1f] relative overflow-hidden"
                    onClick={() =>
                      document.getElementById("thumbnailInput")?.click()
                    }
                  >
                    {thumbnailFile ? (
                      // <img
                      //   src={URL.createObjectURL(thumbnailFile)}
                      //   alt="Thumbnail Preview"
                      //   className="w-full h-full object-cover"
                      // />
                      <img
                        src={
                          typeof thumbnailFile === "string"
                            ? thumbnailFile
                            : URL.createObjectURL(thumbnailFile)
                        }
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Icon
                          icon="solar:gallery-outline"
                          className="text-blue mb-2"
                          fontSize={34}
                        />
                        <p className="text-white text-sm">
                          Upload Workout Thumbnail
                        </p>
                      </>
                    )}
                    <input
                      id="thumbnailInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          formik.setFieldValue("thumbnail", file);
                          setThumbnailFile(file);
                        }
                      }}
                    />
                    {touched.thumbnail && errors.thumbnail && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.thumbnail)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div ref={titleRef}>
                      <TextInput
                        placeholder="Workout Title"
                        value={values.title}
                        onChange={handleChange("title")}
                        type="text"
                        error={
                          touched.title && errors.title
                            ? String(errors.title)
                            : ""
                        }
                        icon={
                          <img
                            src={IMAGES.textBlock}
                            alt=""
                            className="w-5 h-5"
                          />
                        }
                        className="mb-3"
                      />
                    </div>

                    <div ref={categoryRef}>
                      <SelectComponent
                        placeholder="Select Workout Category"
                        value={values.workout_category}
                        onChange={(value: string) =>
                          canEdit && setFieldValue("workout_category", value)
                        }
                        icon={IMAGES.category}
                        className={`mb-3 ${
                          canEdit
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-60"
                        }`}
                        disabled={!canEdit}
                        options={[
                          { label: "Select Workout Category", value: "" },
                          ...workoutCategories.map((item) => ({
                            label: item.title,
                            value: item._id,
                          })),
                        ]}
                      />
                    </div>

                    {touched.workout_category && errors.workout_category && (
                      <p className="text-red-500 text-sm col-span-2 mt-[-10px]">
                        {String(errors.workout_category)}
                      </p>
                    )}

                    <div ref={captionRef}>
                      <CustomTextArea
                        placeholder="Write caption..."
                        value={values.caption}
                        onChange={handleChange("caption")}
                        error={
                          touched.caption && errors.caption
                            ? String(errors.caption)
                            : ""
                        }
                        icon={<Lines color="white" />}
                        className="min-h-[120px] max-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={!canEdit ? "opacity-60" : ""}>
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="mb-4 bg-white/3 p-5 rounded-lg relative"
                  >
                    {weeks.length > 1 && canEdit && (
                      <div className="text-right absolute -top-1 -right-2">
                        <div
                          onClick={() => removeWeek(weekIndex)}
                          className="cursor-pointer p-2 w-[30px] h-[30px] rounded-full flex justify-center items-center bg-red"
                        >
                          <Icon
                            icon="bitcoin-icons:cross-outline"
                            className="text-white"
                            fontSize={34}
                          />
                        </div>
                      </div>
                    )}

                    <h2 className="text-lg font-semibold mb-4">
                      Week {week.week}
                    </h2>

                    {week.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        data-week={weekIndex}
                        data-day={dayIndex}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3"
                      >
                        <TextInput
                          placeholder={`Week ${week.week}`}
                          value={`Week ${week.week}`}
                          disabled
                          type="text"
                          inputClassName="!bg-[#333333]"
                          icon={
                            <img
                              src={IMAGES.calendar}
                              alt=""
                              className="w-5 h-5"
                            />
                          }
                        />
                        <TextInput
                          placeholder={`Day ${day.day}`}
                          value={`Day ${day.day}`}
                          disabled
                          type="text"
                          inputClassName="!bg-[#333333]"
                          icon={
                            <img
                              src={IMAGES.calendar}
                              alt=""
                              className="w-5 h-5"
                            />
                          }
                        />
                        {/* <InputTag showInput={false} /> */}

                        <div className="flex flex-row gap-10">
                          <div className="w-80">
                            <TextInput
                              type="text"
                              error={
                                isSubmit &&
                                (!day.duration || day.duration == "0") &&
                                " Please add duration"
                              }
                              placeholder="45 min"
                              value={day.duration}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Only allow numbers (no decimals)
                                if (/^\d*$/.test(value)) {
                                  if (canEdit) {
                                    handleDurationChange(
                                      weekIndex,
                                      dayIndex,
                                      value
                                    );
                                  }
                                }
                              }}
                              inputClassName="!bg-[#333333]"
                              disabled={!canEdit}
                              icon={
                                <img
                                  src={IMAGES.clock}
                                  alt=""
                                  className="w-5 h-5"
                                />
                              }
                            />
                          </div>
                          <div className="flex flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (canEdit) {
                                  setSelectExerciseOpen(true);
                                  setCurrentEditingDay({ weekIndex, dayIndex });
                                }
                              }}
                              className={`px-3 py-2 rounded-lg flex justify-center items-center bg-blue text-white font-semibold text-sm transition-all duration-200 ${
                                canEdit
                                  ? "cursor-pointer hover:bg-blue-700"
                                  : "cursor-not-allowed opacity-60"
                              }`}
                              disabled={!canEdit}
                            >
                              Select Exercises
                            </button>

                            <div
                              onClick={() => {
                                if (canEdit) {
                                  removeDayFromWeek(weekIndex, dayIndex);
                                }
                              }}
                              className={`p-2 w-[60px] h-[60px] rounded-full flex justify-center items-center bg-red ${
                                canEdit
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-60"
                              }`}
                            >
                              <Icon
                                icon="lsicon:minus-outline"
                                className="text-white"
                                fontSize={34}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Exercise List */}
                        {day.exercises.length > 0 && (
                          <div className="col-span-2 bg-white/5 p-3 rounded-lg">
                            <p className="text-sm font-semibold text-white mb-2">
                              Selected Exercises:
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {day.exercises.map((exercise, idx) => (
                                <span
                                  key={idx}
                                  className="bg-green-600/20 text-green-400 text-sm px-3 py-1 rounded-full"
                                >
                                  {exercise.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {isSubmit &&
                          (!day.exercises || day.exercises.length === 0) && (
                            <p className="text-red-500 text-sm col-span-2 mt-[-10px]">
                              Please add at least one exercise for Day {day.day}{" "}
                              of Week {week.week}
                            </p>
                          )}
                      </div>
                    ))}

                    {canEdit && (
                      <button
                        className="text-sm text-green-400 mb-2"
                        type="button"
                        onClick={() => addDayToWeek(weekIndex)}
                      >
                        + Add Day to Week {week.week}
                      </button>
                    )}
                  </div>
                ))}

                {canEdit && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-6">
                    <button
                      className="flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
                      // onClick={() => addExercise(1, 1)}
                      onClick={addWeek} // 👈 Fixed this line
                      type="button"
                    >
                      <img src={IMAGES.addsquare} alt="" className="w-5 h-5" />
                      <span>Add More Week/Day Workout</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                <div
                  className={`p-5 rounded-lg pl-0 ${
                    !canEdit ? "opacity-60" : ""
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-4 text-white">
                    Choose Your Workout Access
                  </h2>
                  <div className="flex items-center gap-2 custom-workout-access">
                    <div className="flex items-center gap-2 bg-white/3 p-2 rounded-full">
                      <span
                        onClick={() => {
                          if (canEdit) {
                            formik.setFieldValue("fees", ""); // 👈 ADD THIS
                            formik.setFieldValue("access", "Free"); // 👈 ADD THIS
                          }
                        }}
                        className={` px-6 py-3 rounded-full pl-10 pr-10 ${
                          canEdit ? "cursor-pointer" : "cursor-not-allowed"
                        } ${
                          values.access === "Free"
                            ? "bg-primary text-black"
                            : "bg-transparent text-white pl-10 pr-10"
                        }`}
                      >
                        Free
                      </span>
                      <span
                        onClick={() => {
                          if (canEdit) {
                            formik.setFieldValue("access", "Paid"); // 👈 ADD THIS
                          }
                        }}
                        className={`px-6 py-3 rounded-full pl-10 pr-10 ${
                          canEdit ? "cursor-pointer" : "cursor-not-allowed"
                        } ${
                          values.access === "Paid"
                            ? "bg-primary text-black"
                            : "bg-transparent text-white pl-10 pr-10"
                        }`}
                      >
                        Paid
                      </span>
                    </div>
                    {values.access === "Paid" && (
                      <div ref={feesRef} className="w-full">
                        <TextInput
                          type="number"
                          // pattern="[0-9]*"
                          placeholder="Enter Amount"
                          value={values.fees}
                          onChange={handleChange("fees")}
                          error={
                            touched.fees && errors.fees
                              ? String(errors.fees)
                              : ""
                          }
                          className="w-full"
                          disabled={!canEdit}
                          icon={
                            <img
                              src={IMAGES.dollarsquare}
                              alt=""
                              className="w-5 h-5"
                            />
                          }
                        />
                      </div>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold mb-4 text-white mt-4">
                    Workout Visibility
                  </h2>
                  <div className="flex items-center gap-2 bg-white/3 p-2 rounded-full">
                    <span
                      onClick={() => {
                        if (canEdit) {
                          setVisibility("Public");
                        }
                      }}
                      className={` px-6 py-3 w-[50%] text-center rounded-full ${
                        canEdit ? "cursor-pointer" : "cursor-not-allowed"
                      } ${
                        visibility === "Public"
                          ? "bg-primary text-black"
                          : "bg-transparent text-white"
                      }`}
                    >
                      Public
                    </span>
                    <span
                      onClick={() => {
                        if (canEdit) {
                          setVisibility("Private");
                        }
                      }}
                      className={`px-6 py-3 w-[50%] text-center rounded-full ${
                        canEdit ? "cursor-pointer" : "cursor-not-allowed"
                      } ${
                        visibility === "Private"
                          ? "bg-primary text-black"
                          : "bg-transparent text-white"
                      }`}
                    >
                      Private
                    </span>
                  </div>
                </div>
                <div
                  className={`p-5 rounded-lg ${!canEdit ? "opacity-60" : ""}`}
                >
                  <GroupInputTag
                    onClickGroup={() => {}}
                    onSelectGroups={
                      canEdit ? onSelectGroups : (groups: unknown[]) => {}
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="hidden"
              id="workout-form-submit"
              // onClick={() => {
              //   console.log(errors);
              //   handleSubmit();
              // }}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <SelectExercisePopup
        open={isSelectExerciseOpen}
        searchText={searchText}
        setSearchText={setSearchText}
        onClose={closeSelectExercisePopup}
        exercises={exercises}
        currentEditingDay={currentEditingDay}
        weeks={weeks}
        onSelect={(exercise) => {
          if (currentEditingDay) {
            const { weekIndex, dayIndex } = currentEditingDay;
            const updatedWeeks = [...weeks];
            const dayExercises =
              updatedWeeks[weekIndex].days[dayIndex].exercises;

            const existingIndex = dayExercises.findIndex(
              (ex) => ex._id === exercise._id
            );

            if (existingIndex !== -1) {
              // Remove the exercise
              dayExercises.splice(existingIndex, 1);
              setWeeks(updatedWeeks);
              // toast.info(`Removed "${exercise.title}"`);
            } else {
              // Add the exercise
              dayExercises.push(exercise);
              setWeeks(updatedWeeks);
              // toast.success(`Added "${exercise.title}"`);
            }
          }
        }}
      />

      {(submitting || exerciseLoader || preferencesLoader) && (
        <FullScreenLoader />
      )}
    </div>
  );
};

export default CreateWorkout;
