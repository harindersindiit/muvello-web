import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import TextInput from "@/components/customcomponents/TextInput";
import { Icon } from "@iconify/react";
import CustomButton from "@/components/customcomponents/CustomButton";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";

import { resetPasswordSchema } from "@/utils/validations";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email: string } | null;

  useEffect(() => {
    if (!state?.email) {
      toast.error("Access denied. Please send the OTP first.");
      navigate("/auth/forgot-password");
    }
  }, [state, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        email: state?.email,
        password: values.password,
      });

      const { message, statusCode } = res.data;

      if (statusCode === 200 && message) {
        toast.success(message);
        navigate("/auth/", { replace: true });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="space-y-1 gap-y-2 flex flex-col">
              <div className="relative mb-2">
                <TextInput
                  placeholder="New Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                  icon={
                    <Icon icon="solar:lock-password-outline" fontSize={23} />
                  }
                  style={{ paddingRight: "50px" }}
                />
                <div
                  className="absolute top-1/2 right-5 -translate-y-1/2 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              {touched.password && errors.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}

              <div className="relative mb-2">
                <TextInput
                  placeholder="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  icon={
                    <Icon icon="solar:lock-password-outline" fontSize={23} />
                  }
                  style={{ paddingRight: "50px" }}
                />
                <div
                  className="absolute top-1/2 right-5 -translate-y-1/2 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              {touched.confirmPassword && errors.confirmPassword && (
                <div className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </div>
              )}

              <CustomButton text="Save" type="submit" disabled={isSubmitting} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
