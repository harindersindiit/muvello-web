import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import Lines from "@/components/svgcomponents/Lines";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import GroupInputTag from "@/components/customcomponents/GroupInputTag";
import { Formik, Form, FormikProps } from "formik";
import { addPostSchema } from "@/utils/validations";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import FullScreenLoader from "../ui/loader";
import AddWorkoutCategoryModal from "./AddWorkoutCategoryModal";
import { useUser } from "@/context/UserContext";

type UploadedFile = {
  file: File | null;
  url: string;
};

type WorkoutCategory = {
  _id: string;
  title: string;
  icon?: string;
  added_by?: string | { _id: string };
  isCustom?: boolean;
};

type SelectedGroup = {
  _id: string;
  [key: string]: unknown;
};

type AddPostFormValues = {
  caption: string;
  workout_category: string;
  media: UploadedFile[];
};

const AddPost = ({
  //   preferences,
  postDrawer,
  setPostDrawer,
  postDetails,
  refreshPosts,
  onSuccess = null,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formikRef = useRef<FormikProps<AddPostFormValues> | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [selectedgroups, setSelectedgroups] = useState<SelectedGroup[]>([]);

  // const [isShared, setIsShared] = useState(false);
  // const [selectGroupsOpen, setSelectGroupsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPrefernces] = useState<WorkoutCategory[]>([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  // const [preferencesLoader, setPreferncesLoader] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );
  const { user } = useUser();

  const iniVal: AddPostFormValues = {
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
        const mediaArray = (postDetails.media as Array<{ url: string }>).map(
          (media) => ({
            file: null,
            url: media.url,
          })
        );
        setUploadedFiles(mediaArray);

        setInitialValues((prev) => ({
          ...prev,
          media: mediaArray,
        }));
      }
    }
  }, [postDetails, preferences]);

  useEffect(() => {
    getPreferences();
  }, []);

  const onSelectGroups = (groups: SelectedGroup[]) => {
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

      const categories =
        (res?.data?.body?.workoutCategories as WorkoutCategory[]) || [];
      setPrefernces(categories);
      return categories;
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Internal Server Error.";
      toast.error(message);
      return [];
    } finally {
      // setPreferncesLoader(false);
    }
  };

  const ensureCategoryInPreferences = (category: WorkoutCategory) => {
    if (!category?._id) return;

    setPrefernces((prev) => {
      const exists = prev.some((item) => item._id === category._id);
      if (exists) {
        return prev.map((item) =>
          item._id === category._id ? { ...item, ...category } : item
        );
      }

      return [category, ...prev];
    });
  };

  const handleWorkoutCategoryCreated = async (category: WorkoutCategory) => {
    ensureCategoryInPreferences(category);
    formikRef.current?.setFieldValue("workout_category", category?._id);

    if (!category?.isCustom) {
      const latestCategories = await getPreferences();

      const exists = latestCategories.some(
        (item: WorkoutCategory) => item._id === category._id
      );

      if (!exists) {
        ensureCategoryInPreferences(category);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    if (!id || deletingCategoryId === id) return;

    setDeletingCategoryId(id);
    try {
      const token = localStorageService.getItem("accessToken");
      const response = await axiosInstance.delete(
        `/admin/delete-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      if (data?.success) {
        setPrefernces((prev) => prev.filter((category) => category._id !== id));

        const formikInstance = formikRef.current;
        if (formikInstance?.values?.workout_category === id) {
          formikInstance.setFieldValue("workout_category", "");
        }

        toast.success(data?.message || "Category deleted successfully.");
      } else {
        toast.error(data?.message || "Failed to delete category.");
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to delete category.";
      toast.error(message);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const [initialValues, setInitialValues] = useState<AddPostFormValues>(iniVal);

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

    // Check if adding these valid files would exceed the limit of 6
    if (uploadedFiles.length + validFiles.length > 6) {
      const remainingSlots = 6 - uploadedFiles.length;
      if (remainingSlots > 0) {
        toast.warning(
          `You can only add ${remainingSlots} more file${
            remainingSlots === 1 ? "" : "s"
          }. You selected ${validFiles.length} file${
            validFiles.length === 1 ? "" : "s"
          }.`
        );
      } else {
        toast.error(
          "You have already reached the maximum limit of 6 media files."
        );
      }
      return;
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

  const handleSubmitFun = async (values: AddPostFormValues) => {
    setLoading(true);

    const groups = selectedgroups.map((group) => group._id);

    const payload: {
      caption: string;
      workout_category: string;
      media: Array<{ url: string; type: "image" | "video" }>;
      groups: string[];
    } = {
      caption: values.caption,
      workout_category: values.workout_category,
      media: [],
      groups,
    };

    try {
      const token = localStorageService.getItem("accessToken");
      if (!postDetails && uploadedFiles.length) {
        const uploadedMediaUrls: Array<{
          url: string;
          type: "image" | "video";
        }> = [];

        for (const mediaItem of uploadedFiles) {
          const file = mediaItem.file;
          if (!file) {
            continue;
          }
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
            mediaResult?.data?.body?.fileUrl ||
            mediaResult?.data?.body?.videoUrl;

          if (!url) {
            toast.error("Failed to upload media.");
            continue;
          }

          uploadedMediaUrls.push({ url, type: isImage ? "image" : "video" });
        }

        payload.media = uploadedMediaUrls;
      }

      if (postDetails) {
        const exerciseResult = await axiosInstance.put(
          `post/${postDetails._id}`,
          {
            caption: payload.caption,
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
          onSuccess?.(payload.caption);
          setPostDrawer(false);
        }
        refreshPosts();
      } else {
        const exerciseResult = await axiosInstance.post("post", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { message, success } = exerciseResult.data;

        if (success && message) {
          setPostDrawer(false);
          setUploadedFiles([]);
          setSelectedgroups([]);

          toast.success(message);
        }
        refreshPosts();
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Adding exercise failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    formikRef.current?.setFieldValue("media", uploadedFiles);
  }, [uploadedFiles]);

  return (
    <>
      <AddWorkoutCategoryModal
        open={isAddCategoryModalOpen}
        setOpen={setIsAddCategoryModalOpen}
        onCategoryCreated={handleWorkoutCategoryCreated}
      />

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
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={addPostSchema}
          onSubmit={handleSubmitFun}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => {
            const mediaError =
              touched.media && typeof errors.media === "string"
                ? errors.media
                : "";
            const workoutCategoryError =
              touched.workout_category &&
              typeof errors.workout_category === "string"
                ? errors.workout_category
                : "";
            const captionError =
              touched.caption && typeof errors.caption === "string"
                ? errors.caption
                : "";

            return (
              <Form>
                <div className="p-4">
                  <h3 className="text-white text-md font-semibold mb-2">
                    Basic Info
                  </h3>

                  {/* Upload Box */}
                  <div
                    className={`border-2 border-dashed rounded-lg h-40 flex flex-col justify-center items-center bg-[#1f1f1f] mb-3 ${
                      uploadedFiles.length >= 6 || postDetails
                        ? "border-gray-500 cursor-not-allowed opacity-50"
                        : "border-blue-500 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!postDetails && uploadedFiles.length < 6) {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <Icon
                      icon="solar:gallery-outline"
                      className={`mb-2 ${
                        uploadedFiles.length >= 6 || postDetails
                          ? "text-gray-500"
                          : "text-blue"
                      }`}
                      fontSize={34}
                    />
                    <p
                      className={`text-sm ${
                        uploadedFiles.length >= 6 || postDetails
                          ? "text-gray-500"
                          : "text-white"
                      }`}
                    >
                      {uploadedFiles.length >= 6
                        ? "Maximum 6 media files reached"
                        : "Upload Images or Videos"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {uploadedFiles.length}/6 files uploaded
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {mediaError && (
                    <p className="text-sm text-red-500 mt-1">{mediaError}</p>
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
                  {!postDetails && (
                    <Button
                      type="button"
                      onClick={() => setIsAddCategoryModalOpen(true)}
                      className="flex items-center gap-2 bg-primary text-black font-semibold px-5 py-2 rounded-full mb-3 hover:opacity-90 transition"
                    >
                      <Icon icon="solar:add-circle-linear" fontSize={18} />
                      Add New Category
                    </Button>
                  )}
                  <SelectComponent
                    fallbackValue={
                      postDetails?.workout_category_details?.[0]?.title
                    }
                    placeholder="Select Workout Category"
                    disabled={postDetails}
                    value={values.workout_category}
                    onChange={(val) => setFieldValue("workout_category", val)}
                    icon={IMAGES.category}
                    className="mb-3"
                    options={preferences.map((item) => ({
                      label: item.title,
                      value: item._id,
                      icon: item.icon,
                      iconAlt: item.title,
                      canDelete:
                        !postDetails &&
                        !!user?._id &&
                        (item.added_by === user._id ||
                          (typeof item.added_by === "object" &&
                            item.added_by?._id === user._id)),
                      onDelete: () => deleteCategory(item._id),
                      isDeleting: deletingCategoryId === item._id,
                    }))}
                  />
                  {workoutCategoryError && (
                    <p className="text-sm text-red-500 mt-1">
                      {workoutCategoryError}
                    </p>
                  )}

                  {/* Caption */}
                  <CustomTextArea
                    placeholder="Write caption..."
                    value={values.caption}
                    onChange={handleChange("caption")}
                    icon={<Lines color="white" />}
                    error={captionError}
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
            );
          }}
        </Formik>
      </DrawerSidebar>
    </>
  );
};

export default AddPost;
