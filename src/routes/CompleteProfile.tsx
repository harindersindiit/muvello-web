import { useEffect } from "react";
import {
  useNavigate,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import BasicInfo from "@/pages/auth/basic-info";
import ExperienceLevel from "@/pages/auth/basic-info/experience-level";
import UploadProfilePicture from "@/pages/auth/basic-info/upload-profile-picture";
import ProfileSetupCompleted from "@/pages/auth/basic-info/profile-setup-completed";

function CompleteProfileRoutes({ profileStatus }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialRedirectPath = (status) => {
    switch (status) {
      case "incomplete-basic-info":
        return "/profile/basic-info";
      case "incomplete-experience":
        return "/profile/experience-level";
      case "incomplete-picture":
        return "/profile/upload-profile-picture";
      case "profile-setup-completed":
        return "/profile/profile-setup-completed";
      default:
        return "/profile/basic-info";
    }
  };

  // Redirect only if user hits /profile directly
  useEffect(() => {
    if (location.pathname === "/profile" || location.pathname === "/profile/") {
      const target = getInitialRedirectPath(profileStatus);
      console.log({ target });
      navigate(target, { replace: true });
    }
  }, [location.pathname, profileStatus, navigate]);

  // New useEffect to add and remove the class from body
  useEffect(() => {
    document.body.classList.add("bodyPadRemove");

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove("bodyPadRemove");
    };
  }, []);

  return (
    <div className="bodyPadRemove">
      <Routes>
        <Route path="basic-info" element={<BasicInfo />} />
        <Route path="experience-level" element={<ExperienceLevel />} />
        <Route
          path="upload-profile-picture"
          element={<UploadProfilePicture />}
        />
        <Route
          path="profile-setup-completed"
          element={<ProfileSetupCompleted />}
        />
        {/* Optional fallback if user lands on unknown sub-route */}
        <Route
          path="*"
          element={
            <Navigate to={getInitialRedirectPath(profileStatus)} replace />
          }
        />
      </Routes>
    </div>
  );
}

export default CompleteProfileRoutes;
