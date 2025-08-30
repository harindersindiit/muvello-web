import { useLocation, useNavigate } from "react-router-dom";

import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import TextInput from "@/components/customcomponents/TextInput";
import experience from "./dummyData/experience";
import { useEffect, useState, useRef } from "react";
import { editProfileSchema } from "@/utils/validations";
import { Formik, Form } from "formik";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import FullScreenLoader from "@/components/ui/loader";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";

const EditProfile = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date();
  const fourteenYearsAgo = new Date(
    today.getFullYear() - 14,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const { state } = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const fileInputRef = useRef<any>(null);
  const [preview, setPreview] = useState();
  const [file, setFile] = useState(null);
  const [preferences, setPrefernces] = useState({});
  const [preferencesLoader, setPreferncesLoader] = useState(false);
  const { updateUser, user } = useUser();

  // const [user, setUser] = useState({});

  useEffect(() => {
    const data = localStorageService.getItem("user");
    console.log(data);
    const user = {
      fullname: data?.fullname,
      email: data?.email,
      gender: data?.gender,
      height_value: data?.height_value,
      weight_value: data?.weight_value,
      weight_unit: data?.weight_unit,
      height_unit: data?.height_unit,
      dob: new Date(data?.dob).toISOString().split("T")[0],
      profile_picture: data?.profile_picture,

      fitness_goal: data?.fitness_goal?._id || null,
      preferred_workouts:
        data?.preferred_workouts?.map((item: any) => item._id) || [],
      experience_level: data?.experience_level || experience[0],
      bio: data?.bio || "",
    };

    setUserInfo(user);
    getPreferences();
  }, []); // 👈 empty dependency array = runs only once on mount

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      return toast.error(
        "Unsupported image format. Please select a PNG or JPG or WEBP image."
      );
    }

    setFile(file);
    // Check if file type starts with "image/"

    const previewURL: any = URL.createObjectURL(file);
    setPreview(previewURL);
    e.target.value = "";
  };

  const updateInfo = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const submit = async (reqData: any) => {
      try {
        const token = localStorageService.getItem("accessToken");

        const res = await axiosInstance.post("/user/update-user", reqData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { message, success, body } = res.data;

        if (message && success && body.user) {
          updateUser(body.user);
          toast.success(message);

          navigate("/user/profile");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setSubmitting(false);
      }
    };

    if (file) {
      const formData = new FormData();
      formData.append("file", file); // 👈 Your backend should accept `image` field

      try {
        const token = localStorageService.getItem("accessToken");
        const res = await axiosInstance.post("/s3/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const { body } = res.data;
        if (body) {
          await submit({ ...values, profile_picture: body.fileUrl });
        }
      } catch (error) {
        setSubmitting(false);
        console.error("Upload failed", error);
        alert("Failed to upload image.");
      } finally {
      }
    } else {
      await submit(values);
    }
  };

  const getPreferences = async () => {
    setPreferncesLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get("admin/user-preferences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrefernces(res.data.body);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Login failed.";
      toast.error(message);
    } finally {
      setPreferncesLoader(false);
    }
  };

  // 2️⃣ Handler to open the picker
  const openDatePicker = () => {
    if (inputRef.current) {
      // Preferred: show the native date picker
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        // Fallback: focus the input
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="text-white my-6 mb-0 pb-9 px-1">
      {preferencesLoader && <FullScreenLoader />}
      <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-[auto] gap-4">
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
            <span className="text-white">Edit Profile</span>
          </h2>
        </div>
      </div>

      <Formik
        enableReinitialize
        initialValues={userInfo}
        validationSchema={editProfileSchema}
        onSubmit={updateInfo}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form>
            <div className="grid grid-cols-6 gap-4 mt-2 items-start md:items-center">
              <div className="col-span-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center flex-wrap gap-4">
                    <img
                      src={
                        preview || userInfo?.profile_picture || state?.userPic
                      }
                      alt={state?.userPic}
                      className="w-26 h-26 rounded-full border-2 border-white"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-m font-semibold mb-1">
                        Edit you profile picture
                      </span>
                      <span
                        className="text-sm text-blue-500 cursor-pointer"
                        onClick={handleImageClick}
                      >
                        Change profile picture
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 col-start-5">
                <button
                  disabled={isSubmitting}
                  className={`bg-primary text-black px-4 py-2 rounded-full font-normal   ml-auto block flex items-center gap-x-2 transition-opacity duration-200 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  type="submit"
                >
                  Update
                  {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="w-full  rounded-lg  mt-8">
              <h6 className="text-white text-m font-semibold mb-2">
                Basic Info
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
                <TextInput
                  name="fullname"
                  placeholder="Full Name"
                  type="text"
                  value={values.fullname}
                  onChange={handleChange}
                  icon={<Icon icon="solar:user-linear" fontSize={23} />}
                  error={touched.fullname && errors.fullname}
                />
                <TextInput
                  disabled={!user?.password}
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  icon={<Icon icon="line-md:email" fontSize={23} />}
                  error={touched.email && errors.email}
                />
              </div>

              {touched.password && errors.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold mb-3 block">
                    How do you identify?
                  </span>
                  <div className="flex gap-3 lg:gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFieldValue("gender", "Female")}
                      className={`flex w-[120px] lg:w-[150px] justify-center cursor-pointer items-center gap-2 px-5 py-3 rounded-full ${
                        values.gender === "Female"
                          ? "bg-[#94eb00] text-black"
                          : "bg-[#2a2a2a] text-white"
                      } font-normal`}
                    >
                      <div className="w-5 h-5">
                        <Icon fontSize={20} icon="mage:female" />
                      </div>
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setFieldValue("gender", "Male")}
                      className={`flex w-[120px] lg:w-[150px] justify-center cursor-pointer items-center gap-2 px-5 py-3 rounded-full ${
                        values.gender === "Male"
                          ? "bg-[#94eb00] text-black"
                          : "bg-[#2a2a2a] text-white"
                      } font-normal`}
                    >
                      <Icon fontSize={20} icon="mage:male" /> Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setFieldValue("gender", "Other")}
                      className={`flex w-[120px] lg:w-[150px] justify-center cursor-pointer items-center gap-2 px-5 py-3 rounded-full ${
                        values.gender === "Other"
                          ? "bg-[#94eb00] text-black"
                          : "bg-[#2a2a2a] text-white"
                      } font-normal`}
                    >
                      <Icon fontSize={20} icon="ion:male-female-outline" />{" "}
                      Other
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-white text-sm font-semibold mb-3 block">
                    What’s your age?
                  </span>
                  <div
                    className="flex items-center bg-[#2a2a2a] rounded-full px-4 py-3"
                    onClick={openDatePicker}
                  >
                    <Icon
                      fontSize={22}
                      icon="icon-park-outline:birthday-cake"
                      className="mr-3"
                    />

                    <input
                      ref={inputRef}
                      max={fourteenYearsAgo}
                      name="dob"
                      value={values?.dob}
                      type="date"
                      className="bg-transparent py-1 text-white placeholder-gray-400 w-full outline-none [&::-webkit-calendar-picker-indicator]:invert text-sm placeholder:text-sm placeholder:font-light"
                      placeholder="Select date of birth"
                      onChange={handleChange}
                      onKeyDown={(e) => e.preventDefault()} // Prevents typing
                      onPaste={(e) => e.preventDefault()} // Prevents paste
                    />
                  </div>
                  {touched.dob && errors.dob && (
                    <div className="text-red-500 text-sm">{errors.dob}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold mb-3 block">
                    What’s your height?
                  </span>
                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setFieldValue("height_unit", "Cm")}
                      className={`px-3 py-1 cursor-pointer rounded-full text-sm ${
                        values.height_unit === "Cm"
                          ? "bg-[#94eb00] text-black"
                          : "bg-[#2a2a2a] text-white/60"
                      }`}
                    >
                      Cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setFieldValue("height_unit", "Feet")}
                      className={`px-3 py-1 cursor-pointer rounded-full text-sm ${
                        values.height_unit === "Feet"
                          ? "bg-[#94eb00] text-black"
                          : "bg-[#2a2a2a] text-white/60"
                      }`}
                    >
                      Feet/Inches
                    </button>
                  </div>

                  <TextInput
                    name="height_value"
                    placeholder="Enter Height"
                    // type="number"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={values.height_value}
                    onChange={handleChange}
                    icon={<Icon icon="mdi:human-male-height" fontSize={23} />}
                    error={touched.height_value && errors.height_value}
                  />
                </div>
                <div>
                  <span className="text-white text-sm font-semibold mb-3 block">
                    What’s your current weight?
                  </span>

                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setFieldValue("weight_unit", "Kg")}
                      className={`px-3 py-1 cursor-pointer rounded-full text-sm ${
                        values.weight_unit === "Kg"
                          ? "bg-[#94eb00] text-black"
                          : "bg-[#2a2a2a] text-white/60"
                      }`}
                    >
                      Kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFieldValue("weight_unit", "Lbs")}
                      className={`px-3 py-1 cursor-pointer rounded-full text-sm ${
                        values.weight_unit === "Lbs"
                          ? "bg-[#94eb00] text-black"
                          : "bg-[#2a2a2a] text-white/60"
                      }`}
                    >
                      Lbs
                    </button>
                  </div>
                  <TextInput
                    name="weight_value"
                    value={values.weight_value}
                    onChange={handleChange}
                    error={touched.weight_value && errors.weight_value}
                    placeholder="Enter Weight"
                    // type="number"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    icon={
                      <Icon icon="healthicons:weight-outline" fontSize={23} />
                    }
                  />
                </div>
              </div>
            </div>

            <div className="w-full  rounded-lg mt-10">
              <h6 className="text-white text-m font-semibold mb-4">
                Fitness Goal
              </h6>
              <div className="flex gap-4 flex-wrap">
                {preferences?.fitnessGoalTypes?.map((item) => (
                  <button
                    type="button"
                    onClick={() => setFieldValue("fitness_goal", item._id)}
                    key={item._id}
                    className={`px-5 py-2 rounded-full text-sm cursor-pointer flex items-center gap-2 ${
                      values.fitness_goal === item._id
                        ? "bg-[#94eb00] text-black"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {item.title}
                    <Icon icon="fluent:cd-16-regular" fontSize={23} />
                  </button>
                ))}
              </div>
            </div>

            {touched.fitness_goal && errors.fitness_goal && (
              <div className="text-red-500 text-sm">{errors.fitness_goal}</div>
            )}

            <div className="w-full  rounded-lg mt-10">
              <h6 className="text-white text-m font-semibold mb-4">
                Preferred Workouts
              </h6>
              <div className="flex gap-4 flex-wrap">
                {preferences?.workoutCategories?.map((item) => (
                  <button
                    type="button"
                    onClick={() => {
                      const currentWorkouts = values.preferred_workouts || [];
                      const workoutId = item._id;

                      const updatedWorkouts = currentWorkouts.includes(
                        workoutId
                      )
                        ? currentWorkouts.filter((id) => id !== workoutId) // remove if exists
                        : [...currentWorkouts, workoutId]; // add if not exists

                      setFieldValue("preferred_workouts", updatedWorkouts);
                    }}
                    key={item._id}
                    className={`px-5 py-2 rounded-full text-sm cursor-pointer flex items-center gap-2 ${
                      values?.preferred_workouts?.includes(item._id)
                        ? "bg-[#94eb00] text-black"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {touched.preferred_workouts && errors.preferred_workouts && (
              <div className="text-red-500 text-sm">
                {errors.preferred_workouts}
              </div>
            )}

            <div className="w-full  rounded-lg mt-10 mb-10">
              <h6 className="text-white text-m font-semibold mb-4">
                Experience Level
              </h6>
              <div className="flex gap-4 flex-wrap">
                {experience?.map((item, index) => (
                  <button
                    type="button"
                    onClick={() => setFieldValue("experience_level", item)}
                    key={item + index}
                    className={`px-5 py-2 rounded-full text-sm cursor-pointer flex items-center gap-2 ${
                      values.experience_level === item
                        ? "bg-[#94eb00] text-black"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {item}
                    <Icon icon="fluent:cd-16-regular" fontSize={23} />
                  </button>
                ))}
              </div>
            </div>
            {touched.experience_level && errors.experience_level && (
              <div className="text-red-500 text-sm">
                {errors.experience_level}
              </div>
            )}

            <div className="w-full  rounded-lg  mt-8">
              <h6 className="text-white text-m font-semibold mb-2">
                Write about yourself
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
                <CustomTextArea
                  maxLength={500}
                  onChange={handleChange}
                  name="bio"
                  placeholder="Write about yourself..."
                  value={values.bio}
                  rows={5}
                  className="h-[140px] rounded-xl resize-none"
                  error={touched.bio && errors.bio}
                  icon={
                    <Icon
                      icon="si:align-justify-line"
                      color="white"
                      fontSize={23}
                    />
                  }
                />

                {/* <TextInput
                  name="fullname"
                  placeholder="Full Name"
                  type="text"
                
                  icon={<Icon icon="solar:user-linear" fontSize={23} />}
            
                /> */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;
