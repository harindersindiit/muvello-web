import { IMAGES } from "@/contants/images";
import CustomButton from "@/components/customcomponents/CustomButton";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import AuthHeader from "@/components/customcomponents/AuthHeader";
const ProfileSetupCompleted = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser();

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);
      const reqData = {
        completed_profile: true,
      };

      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post("/user/update-user", reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { message, success, body } = res.data;

      if (message && success && body) {
        toast.success("Welcome to the Muvello Family!");
        updateUser(body.user);
        navigate("/user/home", { replace: true });
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      toast.error("Failed to complete profile. Please try again.");
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
      <div className="relative flex-1 flex justify-center items-center overflow-hidden">
        <div className="max-w-[620px] w-full bg-black border border-primary/25 p-4 lg:p-8  rounded-[20px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full">
            <img src={IMAGES.poper} className="w-full" alt="Poper" />
          </div>
          <div className="flex justify-center items-center">
            <img src={IMAGES.profileCompleted} alt="Profile Created" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 text-center">
            Welcome to the Muvello User Panel!
          </h1>
          <p className="text-sm text-grey font-light mb-6 text-center">
            You're all set to start your fitness journey, connect with others,
            and explore powerful features made just for you.
          </p>
          <div className="flex justify-end mt-6 z-2 relative">
            <CustomButton
              text={
                loading ? "Completing..." : "Let's Build Your First Workout"
              }
              onClick={handleCompleteProfile}
              disabled={loading}
              type="submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupCompleted;
