import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import AuthRoutes from "./routes/AuthRoutes";
import BodyClassManager from "./components/customcomponents/BodyClassManager";
import Header from "./inc/header";
import LandingPage from "./pages/LandingPage";
import PublicRoutes from "./routes/PublicRoutes";
import ScrollToTop from "./components/customcomponents/ScrollToTop";
import UserRoutes from "./routes/UserRoutes";
import { ToastContainer } from "react-toastify";
import localStorageService from "@/utils/localStorageService";
import "react-toastify/dist/ReactToastify.css";
import CompleteProfileRoutes from "./routes/CompleteProfile";
import { useUser } from "@/context/UserContext";
import { getProfileStatus } from "./lib/utils";
import ProfileCompletionGuard from "./routes/ProfileCompletionGuard";
import NotFound from "@/pages/NotFound";

const LayoutWithHeader = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const App = () => {
  const base = import.meta.env.REACT_APP_BASENAME || "/";

  // const user = localStorageService.getItem("user");
  const { user } = useUser();
  const profileStatus = getProfileStatus(user);
  console.log(profileStatus);
  return (
    <BrowserRouter basename={base}>
      <ToastContainer
        style={{ zIndex: 9999 }}
        closeOnClick
        toastClassName="!pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      />
      <BodyClassManager />
      <ScrollToTop />
      <Routes>
        {/* Unauthenticated users */}
        {/* {profileStatus === "unauthenticated" && (
          <>
            <Route path="/auth/*" element={<AuthRoutes />} />

            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        )} */}

        {/* Authenticated users but profile incomplete */}
        {[
          "incomplete-basic-info",
          "incomplete-experience",
          "incomplete-picture",
        ].includes(profileStatus) && (
          <>
            <Route
              path="/profile/*"
              element={<CompleteProfileRoutes profileStatus={profileStatus} />}
            />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </>
        )}

        {/* Authenticated users with completed profile */}
        {profileStatus === "complete" && (
          <>
            <Route element={<LayoutWithHeader />}>
              <Route path="/user/*" element={<UserRoutes />} />
              <Route path="/" element={<Navigate to="/user/home" replace />} />
              <Route path="*" element={<Navigate to="/user/home" replace />} />
            </Route>
          </>
        )}

        <Route element={<LayoutWithHeader />}>
          <Route path="/public/*" element={<PublicRoutes />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
