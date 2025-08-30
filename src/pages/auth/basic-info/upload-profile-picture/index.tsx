import { useCallback, useState, useRef } from "react";
import { IMAGES } from "@/contants/images";
import CustomButton from "@/components/customcomponents/CustomButton";
import { Progress } from "@/components/ui/progress";
import UploadDropBox from "@/components/customcomponents/UploadDropBox";
import { useNavigate } from "react-router-dom";
import AuthHeader from "@/components/customcomponents/AuthHeader";

import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";

const UploadProfilePicture = () => {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser();

  const handleFileSelect = (file) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile); // 👈 Your backend should accept `image` field

    try {
      setLoading(true);
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.post("/s3/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { body } = res.data;
      if (body) {
        handleSubmit(body.fileUrl);
      }
    } catch (error) {
      setLoading(false);
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
    }
  };

  const handleSubmit = async (url) => {
    try {
      const reqData = {
        profile_picture: url,
      };

      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post("/user/update-user", reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { message, success, body } = res.data;

      if (message && success && body) {
        toast.success(message);
        updateUser(body.user);
        navigate("/profile/profile-setup-completed", { replace: true });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col bg-cover bg-center p-4 p-lg-8"
      style={{ backgroundImage: `url(${IMAGES.basicInfoBg})` }}
    >
      <AuthHeader />
      <div className="relative flex justify-center  overflow-hidden">
        <div className="max-w-[620px] w-full bg-black border border-primary/25 p-4 lg:p-8  rounded-[20px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full">
            <Progress value={100} />
          </div>
          <h1 className="text-2xl font-semibold mb-1 pt-3">
            Upload Your Profile Picture
          </h1>
          <p className="text-sm opacity-50 font-light mb-6">
            Help clients recognize you and build trust by uploading a clear
            photo.
          </p>
          {/* Gender Selection */}
          <UploadDropBox onFileSelect={handleFileSelect} preview={previewUrl} />
          <div className="flex justify-end mt-6">
            <CustomButton
              disabled={loading}
              text={loading ? "Finishing..." : "Finish"}
              onClick={handleUpload}
              type="submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicture;
