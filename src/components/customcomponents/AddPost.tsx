import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import Lines from "@/components/svgcomponents/Lines";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import GroupInputTag from "@/components/customcomponents/GroupInputTag";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { addPostSchema } from "@/utils/validations";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import FullScreenLoader from "../ui/loader";

let formik: any;

const AddPost = ({
  //   preferences,
  postDrawer,
  setPostDrawer,
  postDetails,
  refreshPosts,
  onSuccess = null,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const [selectedgroups, setSelectedgroups] = useState<any[]>([]);

  // const [isShared, setIsShared] = useState(false);
  // const [selectGroupsOpen, setSelectGroupsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPrefernces] = useState([]);
  // const [preferencesLoader, setPreferncesLoader] = useState(false);

  const iniVal = {
    caption: "",
    workout_category: "",
    media: [],
  };

  // Prefill edit data
  useEffect(() => {
    if (postDetails && preferences.length > 0) {
      if (postDetails.caption) {
        setInitialValues((prev) => ({
          ...prev,
          caption: postDetails.caption,
          workout_category: postDetails.workout_category,
        }));
      }

      if (postDetails.media) {
        const mediaArray = postDetails.media.map((media: any) => ({
          file: null,
          url: media.url,
        }));
        setUploadedFiles(mediaArray);

        setInitialValues((prev) => ({
          ...prev,
          media: postDetails.media,
        }));
      }
    }
  }, [postDetails, preferences]);

  useEffect(() => {
    getPreferences();
  }, []);

  const onSelectGroups = (groups) => {
    setSelectedgroups(groups);
  };

  const getPreferences = async () => {
    // setPreferncesLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get("/admin/user-preferences/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPrefernces(res.data.body.workoutCategories);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      // setPreferncesLoader(false);
    }
  };

  const [initialValues, setInitialValues] = useState(iniVal);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ];

    const validFiles = Array.from(files).filter((file) =>
      validTypes.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast.error(
        "Some files were skipped because they are not valid images or videos."
      );
    }

    const fileArray = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...fileArray]);
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitFun = async (values) => {
    setLoading(true);

    try {
      const reqData = {
        ...values,
        groups: selectedgroups.map((group) => group._id),
      };

      const token = localStorageService.getItem("accessToken");
      const uploadedMediaUrls: object[] = [];

      if (!postDetails && uploadedFiles) {
        for (const mediaItem of uploadedFiles) {
          const file = mediaItem.file;
          const mediaFormData = new FormData();
          mediaFormData.append("file", file);

          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");

          if (!isImage && !isVideo) {
            toast.error("Unsupported media type.");
            continue;
          }

          const uploadType = isImage ? "upload-image" : "upload-video";

          const mediaResult = await axiosInstance.post(
            `s3/${uploadType}`,
            mediaFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const url =
            mediaResult.data.body.fileUrl || mediaResult.data.body.videoUrl;

          uploadedMediaUrls.push({ url, type: isImage ? "image" : "video" });
        }
        reqData.media = uploadedMediaUrls;
      }

      if (postDetails) {
        console.log("here 22");
        const exerciseResult = await axiosInstance.put(
          `post/${postDetails._id}`,
          {
            caption: reqData.caption,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { message, statusCode } = exerciseResult.data;

        if (statusCode === 200 && message) {
          toast.success(message);
          onSuccess(reqData.caption);
          setPostDrawer(false);
        }
        refreshPosts();
      } else {
        const exerciseResult = await axiosInstance.post("post", reqData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(exerciseResult);
        const { message, success } = exerciseResult.data;

        if (success && message) {
          setPostDrawer(false);
          setUploadedFiles([]);
          setSelectedgroups([]);

          toast.success(message);
        }
        refreshPosts();
      }

      //   setPostDrawer(false);
      //   setInitialVal(iniVal);
      //   setThumbnailPreview(null);
      //   setVideoPreview(null);
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.error || "Adding exercise failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    formik?.setFieldValue("media", uploadedFiles);
  }, [uploadedFiles]);

  return (
    <DrawerSidebar
      title={postDetails ? "Edit Post" : "Add Post"}
      submitText={postDetails ? "Update Post" : "Add Post"}
      cancelText="Cancel"
      onSubmit={() => document.getElementById("post-form-submit")?.click()}
      onCancel={() => {
        setPostDrawer(false);
        setUploadedFiles([]);
        setSelectedgroups([]);
      }}
      open={postDrawer}
      setOpen={setPostDrawer}
    >
      {loading && <FullScreenLoader />}

      <Formik
        innerRef={(ref) => (formik = ref)}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={addPostSchema}
        onSubmit={handleSubmitFun}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
          handleSubmit,
        }) => (
          <Form>
            <div className="p-4">
              <h3 className="text-white text-md font-semibold mb-2">
                Basic Info
              </h3>

              {/* Upload Box */}
              <div
                className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-40 flex flex-col justify-center items-center bg-[#1f1f1f]"
                onClick={() => !postDetails && fileInputRef.current?.click()}
              >
                <Icon
                  icon="solar:gallery-outline"
                  className="text-blue mb-2"
                  fontSize={34}
                />
                <p className="text-white text-sm">Upload Images or Videos</p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {errors.media && touched.media && (
                <p className="text-sm text-red-500 mt-1">{errors.media}</p>
              )}

              {/* Previews */}
              <div className="flex gap-4 mb-4 flex-wrap">
                {uploadedFiles.map((fileObj, idx) => (
                  <div
                    key={idx}
                    className="relative w-[110px] h-[110px] rounded-md overflow-hidden"
                  >
                    {fileObj.url.endsWith(".mp4") ||
                    fileObj.file?.type?.startsWith("video/") ? (
                      <video
                        src={fileObj.url}
                        className="w-full h-full object-cover rounded"
                        controls
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                      />
                    ) : (
                      <img
                        src={fileObj.url}
                        alt=""
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                    {!postDetails && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full"
                      >
                        <img
                          src={IMAGES.cross}
                          alt=""
                          className="w-full h-full"
                        />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Dropdown */}
              <SelectComponent
                placeholder="Select Workout Category"
                disabled={postDetails}
                value={values.workout_category}
                onChange={(val) => setFieldValue("workout_category", val)}
                icon={IMAGES.workout_category}
                className="mb-3"
                options={preferences.map((item) => ({
                  label: item.title,
                  value: item._id,
                }))}
              />
              {errors.workout_category && touched.workout_category && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.workout_category}
                </p>
              )}

              {/* Caption */}
              <CustomTextArea
                placeholder="Write caption..."
                value={values.caption}
                onChange={handleChange("caption")}
                icon={<Lines color="white" />}
                error={touched.caption && errors.caption ? errors.caption : ""}
                className="min-h-[120px] max-h-[120px]"
              />
            </div>

            {!postDetails && (
              <>
                <div className="w-full h-[7px] bg-lightdark"></div>
                <div className="p-4">
                  <GroupInputTag
                    onClickGroup={() => {}}
                    onSelectGroups={onSelectGroups}
                  />
                </div>
              </>
            )}

            {/* Submit Button (Hidden, DrawerFooter has a button) */}

            <button
              type="submit"
              className="hidden"
              id="post-form-submit"
              disabled={loading}
              //   onClick={() => {
              //     handleSubmit();
              //   }}
            >
              Submit
            </button>

            {/* <button type="submit" className="hidden" /> */}
          </Form>
        )}
      </Formik>
    </DrawerSidebar>
  );
};

export default AddPost;
