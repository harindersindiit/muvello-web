import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import TextInput from "@/components/customcomponents/TextInput";
import WorkoutIcon from "@/components/svgcomponents/Workout";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/contants/images";
import { DrawerSidebar } from "../customcomponents/DrawerSidebar";
import axiosInstance from "@/utils/axiosInstance"; // Your axios wrapper with auth
import { ExerciseSchema } from "@/utils/validations";

import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import FullScreenLoader from "@/components/ui/loader";

let formik: any;

const ExerciseCommonSidebar = ({
  mode,
  open,
  setOpen,
  preferences,
  getExercises,
  editExercise,
}: {
  mode: "add" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  preferences: [];
  getExercises: any;
  editExercise: any;
}) => {
  //   const [preferences, setPrefernces] = useState([]);
  const [preferencesLoader, setPreferncesLoader] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [videoFile, setFile] = useState<any>(null);

  const iniVal = {
    target_part: "",
    title: "",
    sets: [{ reps: "", rest: "", weight_value: "", weight_unit: "Kg" }],
    video: "",
    thumbnail: "",
  };

  const [initialVal, setInitialVal] = useState(iniVal);

  useEffect(() => {
    if (editExercise) {
      setInitialVal({
        target_part: editExercise.target_part._id,
        title: editExercise.title,
        sets: editExercise.sets.map((item: any) => {
          return {
            reps: item.reps,
            rest: item.rest,

            weight_unit: item.weight_unit,
            weight_value: item.weight_value,
          };
        }),
        video: editExercise.video,
        thumbnail: editExercise.thumbnail,
      });
      setThumbnailPreview(editExercise.thumbnail);
      setVideoPreview(editExercise.video);
    } else {
      setInitialVal(iniVal);
      setThumbnailPreview(null);
      setVideoPreview(null);
    }
  }, [editExercise]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      return toast.error(
        "Unsupported image format. Please select a PNG or JPG or WEBP image."
      );
    }

    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      formik.setFieldValue("thumbnail", file);
      setThumbnailFile(file);
      e.target.value = "";
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ["video/mp4", "video/webm", "video/ogg"];
      if (!allowed.includes(file.type)) {
        return toast.error(
          "Unsupported video format. Please upload an MP4, WebM, or Ogg file."
        );
      }

      setVideoPreview(URL.createObjectURL(file));
      formik.setFieldValue("video", file);
      setFile(file);
      e.target.value = "";
    }
  };

  const handleSubmitFun = async (values: any) => {
    setPreferncesLoader(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const reqData = {
        ...values,
        // thumbnail: thumbnailResult.data.body.fileUrl,
        // video: videoResult.data.body.videoUrl,
      };

      if (thumbnailFile) {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append("file", values.thumbnail); // 👈 Your backend should accept `image` field

        const thumbnailResult = await axiosInstance.post(
          "s3/upload-image",
          thumbnailFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multiplepart/form-data",
            },
          }
        );

        reqData.thumbnail = thumbnailResult.data.body.fileUrl;
      }

      if (videoFile) {
        const videoFormData = new FormData();
        videoFormData.append("file", values.video); // 👈 Your backend should accept `image` field

        const videoResult = await axiosInstance.post(
          "s3/upload-video",
          videoFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multiplepart/form-data",
            },
          }
        );
        reqData.video = videoResult.data.body.videoUrl;
      }

      if (editExercise) {
        const exerciseResult = await axiosInstance.put(
          `exercise/${editExercise._id}`,
          reqData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { message, statusCode } = exerciseResult.data;

        if (statusCode === 200 && message) {
          getExercises();
          toast.success(message);
        }
      } else {
        const exerciseResult = await axiosInstance.post(
          "exercise/add-exercise",
          reqData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { message, statusCode } = exerciseResult.data;

        if (statusCode === 200 && message) {
          getExercises();
          toast.success(message);
        }
      }

      setOpen(false);
      setInitialVal(iniVal);
      setThumbnailPreview(null);
      setVideoPreview(null);
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.error || "Adding exercise failed.";
      toast.error(message);
    } finally {
      setPreferncesLoader(false);
    }
  };
  return (
    <DrawerSidebar
      title={mode === "edit" ? "Edit Exercise" : "Add Exercise"}
      submitText="Save"
      cancelText="Cancel"
      onSubmit={() => document.getElementById("exercise-form-submit")?.click()}
      onCancel={() => {
        setOpen(false);
        setPreferncesLoader(false);
        setThumbnailPreview(null);
        setVideoPreview(null);
        setThumbnailFile(null);
        setFile(null);
      }}
      open={open}
      setOpen={setOpen}
    >
      {preferencesLoader && <FullScreenLoader />}
      <Formik
        innerRef={(ref) => (formik = ref)}
        initialValues={initialVal}
        validationSchema={ExerciseSchema}
        onSubmit={handleSubmitFun}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isSubmitting,
          handleSubmit,
        }) => (
          <Form id="exercise-form">
            {/* <>
              {Object.keys(errors).length > 0 && (
                <pre>{console.log(errors)}</pre>
              )}
            </> */}
            <div className="p-4">
              <h3 className="text-white text-md font-semibold mb-2">
                Basic Info
              </h3>

              <div className="p-4">
                <label htmlFor="thumbnail-upload">
                  <div className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-40 flex flex-col justify-center items-center bg-[#1f1f1f]">
                    <Icon
                      icon="solar:gallery-outline"
                      className="text-blue mb-2"
                      fontSize={34}
                    />
                    <p className="text-white text-sm">
                      Upload Exercise Thumbnail
                    </p>
                  </div>
                </label>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />

                {touched.thumbnail && errors.thumbnail && (
                  <p className="text-red-500 text-xs">{errors.thumbnail}</p>
                )}

                {thumbnailPreview && (
                  <div className="relative w-[110px] h-[110px] rounded-md overflow-hidden mb-4">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setFieldValue("thumbnail", "");
                      }}
                    >
                      <img
                        src={IMAGES.cross}
                        alt="Remove"
                        className="w-full h-full"
                      />
                    </Button>
                  </div>
                )}
              </div>

              {/* <div className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-40 flex flex-col justify-center items-center bg-[#1f1f1f]">
                <Icon
                  icon="solar:gallery-outline"
                  className="text-blue mb-2"
                  fontSize={34}
                />
                <p className="text-white text-sm">Upload Workout Thumbnail</p>
              </div> */}
              {/* 
              <div className="flex gap-4 mb-4">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative w-[110px] h-[110px] rounded-md overflow-hidden"
                  >
                    <img
                      src={file.url}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute cursor-pointer top-1 right-1 h-5 w-5 p-0 rounded-full"
                    >
                      <img
                        src={IMAGES.cross}
                        alt=""
                        className="w-full h-full"
                      />
                    </Button>
                  </div>
                ))}
              </div> */}

              <SelectComponent
                placeholder="Select Target Body Part"
                value={values.target_part}
                onChange={(value: any) => setFieldValue("target_part", value)}
                icon={IMAGES.speedometer}
                className="mb-3 cursor-pointer"
                options={[
                  ...preferences.map((item: any) => {
                    return { value: item._id, label: item.name };
                  }),
                ]}
              />

              {touched.target_part && errors.target_part && (
                <p className="text-red-500 text-xs mb-3">
                  {errors.target_part}
                </p>
              )}

              <TextInput
                name="title"
                placeholder="Exercise Name"
                value={values.title}
                onChange={handleChange}
                type="text"
                icon={<WorkoutIcon color="white" width={20} height={20} />}
                className="mb-3"
              />
              {touched.title && errors.title && (
                <p className="text-red-500 text-xs">{errors.title}</p>
              )}
            </div>

            <div className="w-full h-[7px] bg-lightdark"></div>

            <div className="mt-3 mb-3">
              {values.sets?.map((set, index) => (
                <>
                  <div className="flex flex-col gap-2 mb-4 px-4" key={index}>
                    <div className="flex gap-2 items-start">
                      {/* Set Badge */}
                      <div className="text-blue w-[170px] flex justify-center items-center bg-lightdark p-4 px-2 rounded-full text-center">
                        Set {index + 1}
                      </div>

                      {/* Reps Input */}
                      <div className="flex flex-col w-full">
                        <TextInput
                          name={`sets[${index}].reps`}
                          placeholder="Reps"
                          icon={
                            <img
                              src={IMAGES.reps}
                              alt="Reps Icon"
                              className="w-5 h-5"
                            />
                          }
                          value={set.reps}
                          onChange={(e) => {
                            // Only allow whole numbers (no decimals)
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue(`sets[${index}].reps`, value);
                          }}
                          type="text"
                          pattern="[0-9]*"
                          className="w-full"
                        />
                        {touched.sets?.[index]?.reps &&
                          errors.sets?.[index]?.reps && (
                            <p className="text-red-500 text-xs mt-1 mt-2">
                              {errors.sets[index].reps}
                            </p>
                          )}
                      </div>

                      {/* Rest Input */}
                      <div className="flex flex-col w-full">
                        <TextInput
                          name={`sets[${index}].rest`}
                          placeholder="Rest"
                          icon={
                            <img
                              src={IMAGES.rest}
                              alt="Rest Icon"
                              className="w-5 h-5"
                            />
                          }
                          value={set.rest}
                          onChange={(e) => {
                            // Only allow whole numbers (no decimals)
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue(`sets[${index}].rest`, value);
                          }}
                          type="text"
                          pattern="[0-9]*"
                          className="w-full"
                        />
                        {touched.sets?.[index]?.rest &&
                          errors.sets?.[index]?.rest && (
                            <p className="text-red-500 text-xs mt-1 mt-2">
                              {errors.sets[index].rest}
                            </p>
                          )}
                      </div>

                      {/* Delete Button */}
                      {values.sets.length !== 1 && values.sets.length !== 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-9 w-9 mt-1"
                          onClick={() => {
                            const updated = [...values.sets];
                            updated.splice(index, 1);
                            setFieldValue("sets", updated);
                          }}
                        >
                          <Icon icon="ph:x" className="text-white" />
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-white font-normal mb-2 block relative">
                      Set Weight
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`py-[5px] px-4 text-xs font-medium cursor-pointer  rounded-[10px] ${
                          set.weight_unit === "Kg"
                            ? "bg-primary text-black"
                            : "bg-lightdark text-white"
                        }`}
                        onClick={() =>
                          setFieldValue(`sets[${index}].weight_unit`, "Kg")
                        }
                      >
                        Kg
                      </span>
                      <span
                        className={`py-[5px] px-4 text-xs font-medium cursor-pointer   rounded-[10px] ${
                          set.weight_unit === "Lbs"
                            ? "bg-primary text-black"
                            : "bg-lightdark text-white"
                        }`}
                        onClick={() =>
                          setFieldValue(`sets[${index}].weight_unit`, "Lbs")
                        }
                      >
                        Lbs
                      </span>
                    </div>
                    <TextInput
                      name={`sets[${index}].weight_value`}
                      placeholder="Enter Weight"
                      value={set.weight_value}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numbers (including decimals)
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          handleChange(e);
                        }
                      }}
                      icon={
                        <img src={IMAGES.weight} alt="" className="w-5 h-5" />
                      }
                      type="text"
                      pattern="[0-9]*"
                      className="w-full"
                    />
                    {touched.sets?.[index]?.weight_value &&
                      errors.sets?.[index]?.weight_value && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.sets[index].weight_value}
                        </p>
                      )}
                  </div>
                  <div className="w-full h-[7px] bg-lightdark mb-5"></div>
                </>
              ))}

              {typeof errors.sets === "string" && touched.sets && (
                <p className="text-red-500 text-xs mb-2">{errors.sets}</p>
              )}
            </div>

            <Button
              style={{ paddingBottom: 25 }}
              type="button"
              variant="ghost"
              className="text-primary font-semibold hover:text-white hitransition-all duration-300 text-sm flex items-center gap-2 cursor-pointer"
              onClick={() =>
                setFieldValue("sets", [
                  ...values.sets,
                  { reps: "", rest: "", weight_value: "", weight_unit: "Kg" },
                ])
              }
            >
              <Icon
                icon="f7:plus-app"
                style={{ width: "25px", height: "25px" }}
              />
              Add Another Set
            </Button>

            <div className="w-full h-[7px] bg-lightdark"></div>

            {/* <div className="p-4">
              <div className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-40 flex flex-col justify-center items-center bg-[#1f1f1f]">
                <img src={IMAGES.videoadd} alt="" className="w-8 h-8 mb-2" />
                <p className="text-white text-sm">Upload Exercise Video</p>
              </div>
            </div> */}

            {/* Video Upload */}
            <div className="p-4">
              <label htmlFor="video-upload">
                <div className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-40 flex flex-col justify-center items-center bg-[#1f1f1f]">
                  <img
                    src={IMAGES.videoadd}
                    alt="Upload Icon"
                    className="w-8 h-8 mb-2"
                  />
                  <p className="text-white text-sm">Upload Exercise Video</p>
                </div>
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />

              {touched.video && errors.video && (
                <p className="text-red-500 text-xs">{errors.video}</p>
              )}

              {videoPreview && (
                <div className="relative">
                  <video
                    // autoPlay={true}
                    controls
                    className="w-full max-w-md rounded-lg mb-4"
                    src={videoPreview}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                    onClick={() => {
                      setVideoPreview(null);
                      setFieldValue("video", "");
                    }}
                  >
                    <Icon icon="ph:x" className="text-white" />
                  </Button>
                </div>
              )}
            </div>
            {/* Hidden submit for external button */}
            <button
              type="button"
              className="hidden"
              id="exercise-form-submit"
              disabled={isSubmitting}
              onClick={() => {
                console.log(errors);
                handleSubmit();
              }}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </DrawerSidebar>
  );
};

export default ExerciseCommonSidebar;
