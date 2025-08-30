import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";

import TextInput from "@/components/customcomponents/TextInput";
import CustomButton from "@/components/customcomponents/CustomButton";
import axiosInstance from "@/utils/axiosInstance";
import { loginSchema } from "@/utils/validations";
import localStorageService from "@/utils/localStorageService";
import axios from "axios";
import FullScreenLoader from "@/components/ui/loader";
import { useUser } from "@/context/UserContext";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface LoginValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const tokenClientRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const { updateUser } = useUser();

  useEffect(() => {
    console.log(location.pathname);
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      appleLogin(token);
    }
  }, []);

  const appleLogin = async (token) => {
    setSocialLoading(true);
    try {
      const res = await axiosInstance.get("auth/apple-login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleRedirect(res.data.body);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Apple login failed.";
      toast.error(message);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const res = await axiosInstance.post(
        "auth/login",
        JSON.stringify(values)
      );

      handleRedirect(res.data.body);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Login failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocalLogin = async (data: any) => {
    try {
      const res = await axiosInstance.post(
        "auth/social-login",
        JSON.stringify(data)
      );
      handleRedirect(res.data.body);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Login failed.";
      toast.error(message);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleRedirect = async (data) => {
    const { accessToken, refreshToken, user } = data;

    if (accessToken && refreshToken && user) {
      localStorageService.setItem("accessToken", accessToken);
      localStorageService.setItem("refreshToken", refreshToken);
      if (!user.email_verification && user.password) {
        localStorageService.setItem("user-temp", user);

        navigate("/auth/otp-verification", {
          state: {
            name: user.fullname,
            email: user.email,
          },
          replace: true,
        });
      } else {
        updateUser(user);
      }
    }
  };

  useEffect(() => {
    /* Load Google script */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (tokenResponse) => {
          try {
            setSocialLoading(true);
            const res = await axios.get(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              }
            );
            const reqData = {
              email: res.data.email,
              google_id: res.data.sub,
              fullname: res.data.name,
            };
            if (res.data.picture) reqData.profile_picture = res.data.picture;
            handleSocalLogin(reqData);
          } catch (error: any) {
            setSocialLoading(false);
            const message = error?.response?.data?.error || "Login failed.";
            toast.error(message);
          } finally {
          }

          // send token to backend for verification
        },
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = () => {
    console.log(tokenClientRef);
    if (tokenClientRef) {
      tokenClientRef.current.requestAccessToken();
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
          scope: "name email",
          redirectURI: `${
            import.meta.env.VITE_API_BASE_URL
          }/auth/apple-callback`,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAppleLogin = async () => {
    try {
      await window.AppleID.auth.signIn();
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
      alert("Apple Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {socialLoading && <FullScreenLoader />}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Email Field */}

            <div>
              <TextInput
                name="email"
                placeholder="Email"
                type="text"
                value={values.email}
                onChange={handleChange}
                icon={<Icon icon="mage:email" fontSize={23} />}
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-sm mt-2">{errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative mb-2">
              <TextInput
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                icon={<Icon icon="solar:lock-password-outline" fontSize={23} />}
                style={{ paddingRight: "50px" }}
              />
              <div
                className="absolute inset-y-0 right-5 flex items-center cursor-pointer h-[59px]"
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

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-4">
              <Link
                to="/auth/forgot-password"
                className="text-sm hover:text-primary font-regular transition-colors underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <CustomButton text="Login" type="submit" disabled={isSubmitting} />
          </Form>
        )}
      </Formik>

      {/* Divider */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">or login with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="mt-6 flex space-x-4 justify-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-lightdark hover:bg-lightdark/80 transition-colors"
            aria-label="Login with Google"
          >
            <Icon icon="flat-color-icons:google" fontSize={23} />
          </button>
          <button
            onClick={handleAppleLogin}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-lightdark hover:bg-lightdark/80 transition-colors"
            aria-label="Login with Apple"
          >
            <Icon icon="ic:baseline-apple" fontSize={26} color="#fff" />
          </button>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-grey text-sm">
          Don't have an account?{" "}
          <Link
            to="/auth/create-your-account"
            className="text-primary hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
