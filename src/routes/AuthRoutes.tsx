import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/login";
import ForgotPassword from "@/pages/auth/forgotpassword";
import OtpVerification from "@/pages/auth/otp-verification";
import ResetPassword from "@/pages/auth/reset-password";
import CreateYourAccount from "@/pages/auth/create-your-account";
function AuthRoutes() {
  return (
    <div className="hideBodyPadding">
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="otp-verification" element={<OtpVerification />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="create-your-account" element={<CreateYourAccount />} />
      </Routes>
    </div>
  );
}

export default AuthRoutes;
