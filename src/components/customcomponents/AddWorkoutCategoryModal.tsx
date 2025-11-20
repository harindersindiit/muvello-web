import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TextInput from "./TextInput";
import { CustomModal } from "./CustomModal";
import axiosInstance from "@/utils/axiosInstance";
import UploadDropBox from "./UploadDropBox";
import localStorageService from "@/utils/localStorageService";

interface WorkoutCategory {
  _id: string;
  title: string;
  icon: string;
  isCustom?: boolean;
}

interface AddWorkoutCategoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCategoryCreated?: (category: WorkoutCategory) => void;
}

interface AddCategoryResponse {
  success?: boolean;
  message?: string;
  body?: {
    data?: WorkoutCategory;
  };
}

const DEFAULT_CATEGORY_ICON = "https://picsum.photos/id/1/200/300";

const createFallbackCategory = (
  title: string,
  icon: string
): WorkoutCategory => ({
  _id: `custom_${Date.now()}`,
  title,
  icon,
  isCustom: true,
});

const AddWorkoutCategoryModal = ({
  open,
  setOpen,
  onCategoryCreated,
}: AddWorkoutCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [iconError, setIconError] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");

  useEffect(() => {
    return () => {
      if (iconPreview) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  const modalTitle = useMemo(
    () => (loading ? "Adding Workout Category..." : "Add Workout Category"),
    [loading]
  );

  const resetState = () => {
    setCategoryName("");
    setError("");
    setIconError("");
    setIconFile(null);
    if (iconPreview) {
      URL.revokeObjectURL(iconPreview);
      setIconPreview("");
    }
  };

  const handleClose = () => {
    if (loading) return;

    resetState();
    setOpen(false);
  };

  const handleIconSelect = (file: File) => {
    if (iconPreview) {
      URL.revokeObjectURL(iconPreview);
    }
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    setIconError("");
  };

  const handleSubmit = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError("");
    setIconError("");

    let iconUrl = DEFAULT_CATEGORY_ICON;

    if (iconFile) {
      try {
        const token = localStorageService.getItem("accessToken");
        const uploadData = new FormData();
        uploadData.append("file", iconFile);

        const uploadResponse = await axiosInstance.post(
          "/s3/upload-image",
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        iconUrl =
          uploadResponse?.data?.body?.fileUrl ||
          uploadResponse?.data?.body?.videoUrl ||
          DEFAULT_CATEGORY_ICON;
      } catch {
        setIconError("Failed to upload icon. Using default image instead.");
        toast.error(
          "Unable to upload icon. The category will use the default icon."
        );
        iconUrl = DEFAULT_CATEGORY_ICON;
      }
    }

    const payload = {
      title: trimmedName,
      icon: iconUrl,
    };

    let categoryToUse: WorkoutCategory | null = null;

    try {
      const response = await axiosInstance.post<AddCategoryResponse>(
        "/admin/add-category",
        payload
      );
      const data = response?.data;

      if (data?.success) {
        const receivedCategory = data?.body?.data;
        if (receivedCategory) {
          categoryToUse = {
            ...receivedCategory,
            icon: receivedCategory.icon || iconUrl,
          };
        } else {
          categoryToUse = createFallbackCategory(trimmedName, iconUrl);
        }

        if (data?.message) {
          toast.success(data.message);
        } else {
          toast.success("Workout category added successfully.");
        }
      } else {
        categoryToUse = createFallbackCategory(trimmedName, iconUrl);

        if (data?.message) {
          toast.warn(data.message);
        }
      }
    } catch (error) {
      const err =
        (error as { response?: { data?: { error?: string } } }) || undefined;
      const message =
        err?.response?.data?.error ||
        "Unable to add category right now. Added locally instead.";

      toast.error(message);
      categoryToUse = createFallbackCategory(trimmedName, iconUrl);
    } finally {
      setLoading(false);
    }

    if (categoryToUse) {
      onCategoryCreated?.(categoryToUse);
      resetState();
      setOpen(false);
    }
  };

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title={modalTitle}
      dialogHeader
      submitText="Add Category"
      onSubmit={handleSubmit}
      onCancel={handleClose}
      customButtonClass="rounded-full"
      disabled={loading}
    >
      <div className="space-y-4">
        <UploadDropBox
          disabled={loading}
          onFileSelect={handleIconSelect}
          preview={iconPreview || undefined}
        />
        {iconError && <p className="text-red-500 text-sm">{iconError}</p>}
        <TextInput
          placeholder="Enter category name"
          type="text"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          className="mt-4"
          error={error}
        />
      </div>
    </CustomModal>
  );
};

export default AddWorkoutCategoryModal;
