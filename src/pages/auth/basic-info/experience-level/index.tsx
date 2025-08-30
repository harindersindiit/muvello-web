import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import CustomButton from "@/components/customcomponents/CustomButton";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import AuthHeader from "@/components/customcomponents/AuthHeader";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";

const ExperienceLevel = () => {
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [submitting, setSubmitting] = useState(false);
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const experiences = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Athlete / Professional",
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const reqData = {
        experience_level: experienceLevel,
      };

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
        navigate("/profile/upload-profile-picture", { replace: true });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col bg-cover bg-center p-4 p-lg-8"
      style={{ backgroundImage: `url(${IMAGES.basicInfoBg})` }}
    >
      <AuthHeader />
      <div className="relative  flex justify-center  overflow-hidden">
        <div className="max-w-[620px] w-full bg-black border border-primary/25 p-4 lg:p-8  rounded-[20px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full">
            <Progress value={66} />
          </div>
          <h1 className="text-2xl font-semibold mb-0 pt-3">Experience Level</h1>
          <p className="text-sm opacity-50 font-light mb-6">
            Tell us how comfortable you are with working out.
          </p>

          {/* Gender Selection */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              What's your fitness experience?
            </label>
            <div className="flex flex-col gap-3 lg:gap-4">
              {experiences.map((item) => {
                return (
                  <button
                    onClick={() => setExperienceLevel(item)}
                    className={`flex w-full cursor-pointer items-center gap-2 px-5 py-5 rounded-[30px] ${
                      experienceLevel === item
                        ? "bg-[#94eb00] text-black"
                        : "bg-[#2a2a2a] text-grey"
                    } font-normal`}
                  >
                    {item}
                    <div className="w-5 h-5 ml-auto">
                      <Icon
                        fontSize={20}
                        color={experienceLevel === item ? "black" : "white"}
                        icon="radix-icons:radiobutton"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <CustomButton
              disabled={submitting}
              text={submitting ? "Submitting..." : "Continue"}
              onClick={() => handleSubmit()}
              type="submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceLevel;
