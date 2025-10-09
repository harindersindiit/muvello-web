import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OTPInput from "@/components/customcomponents/OTPInput";
import CustomButton from "@/components/customcomponents/CustomButton";
import { IMAGES } from "@/contants/images";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import localStorageService from "@/utils/localStorageService";
import { useUser } from "@/context/UserContext";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email: string; name?: string } | null;
  const { updateUser } = useUser();
  useEffect(() => {
    if (!state?.email) {
      toast.error("Access denied. Please send the OTP first.");
      navigate("/auth/forgot-password");
    }
  }, [state, navigate]);

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(3);
  const [otpError, setOtpError] = useState("");

  const handleOtpComplete = (value: string) => {
    setOtp(value);
    setOtpError("");
  };

  const handleOtpOnchange = (value: string) => {
    setOtp(value);
    if (otp.length == 0) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpError("");

    setIsSubmitting(true);
    try {
      const res: any = await axiosInstance.post("/auth/verify-otp", {
        email: state?.email,
        otp,
        type: state?.name ? "email_verification" : "otp_verification",
      });

      const { success, statusCode, message } = res.data;

      if (success && statusCode == 200 && message) {
        toast.success(message);
        if (state?.name) {
          const temp_user = localStorageService.getItem("user-temp");
          updateUser(temp_user);
          navigate("/profile/basic-info", {
            state: { email: state?.email },
            replace: true,
          });
        } else {
          navigate("/auth/reset-password", {
            state: { email: state?.email },
            replace: true,
          });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axiosInstance.post("/auth/resend-otp", {
        email: state?.email,
        type: "otp_verification",
      });

      const { success, statusCode, message } = res.data;

      toast.success(message);
      setResendTimer(4);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    }
  };

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Left Side - Image & Logo */}
      <div className="relative flex-1 hidden lg:block overflow-hidden">
        <div
          className="absolute inset-0 z-5"
          style={{ background: "var(--gradient-primary)" }}
        ></div>
        <img
          src={IMAGES.greenOverlay}
          alt="Logo"
          style={{ width: "600px", height: "600px" }}
          className="object-cover absolute -top-50 -right-0 z-20"
        />
        <img
          src={IMAGES.loginBg}
          alt="Fitness trainers"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <img src={IMAGES.logo} alt="Logo" />
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden mb-8">
            <img src={IMAGES.logo} alt="Logo" />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-medium mb-2 text-center">
              Verify Your Email
            </h2>
            <p className="text-grey text-sm font-light text-center">
              We’ve sent a 6-digit OTP to your registered email ID:
              <br className="hidden lg:block" />
              {state?.email || "your email"}.
            </p>

            <div>
              <OTPInput
                length={6}
                onComplete={handleOtpComplete}
                onChange={handleOtpOnchange}
              />
              {otpError && (
                <div
                  className="text-red-500 text-sm pb-5"
                  style={{ marginTop: -10 }}
                >
                  {otpError}
                </div>
              )}
            </div>

            {resendTimer > 0 ? (
              <p className="text-white text-sm font-light text-center mb-6">
                You can request a new OTP in 00:
                {resendTimer.toString().padStart(2, "0")}.
              </p>
            ) : (
              <p
                className="text-primary text-sm text-center mb-6 cursor-pointer hover:underline"
                onClick={handleResend}
              >
                Resend OTP
              </p>
            )}

            <CustomButton
              text="Verify OTP"
              onClick={handleVerify}
              type="button"
              disabled={isSubmitting}
            />

            <div className="mt-5 text-center">
              <p className="text-grey text-sm">
                <Link
                  to="/auth/"
                  className="text-primary hover:underline font-semibold"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
