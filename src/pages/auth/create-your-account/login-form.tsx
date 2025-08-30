import { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import TextInput from "@/components/customcomponents/TextInput";
import { Icon } from "@iconify/react";
import CustomButton from "@/components/customcomponents/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { signupSchema } from "@/utils/validations";
import localStorageService from "@/utils/localStorageService";
import axios from "axios";
import FullScreenLoader from "@/components/ui/loader";
import { useUser } from "@/context/UserContext";

export function LoginForm() {
  const navigate = useNavigate();
  const tokenClientRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { updateUser } = useUser();

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
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
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        fullname: values.fullName,
        email: values.email,
        password: values.password,
      });

      const { accessToken, refreshToken, user } = res.data.body;
      const { message } = res.data;

      if (accessToken && refreshToken && user) {
        localStorageService.setItem("accessToken", accessToken);
        localStorageService.setItem("refreshToken", refreshToken);
        localStorageService.setItem("user-temp", user);

        // updateUser(user);
        toast.success(message);
        navigate("/auth/otp-verification", {
          state: {
            name: user.fullname,
            email: values.email,
          },
          replace: true,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    /* Load Google script */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
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
          }/auth/apple-callback-signup`,
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
      updateUser(user);
    }
  };

  return (
    <div className="w-full max-w-md">
      {socialLoading && <FullScreenLoader />}
      <Formik
        initialValues={initialValues}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="space-y-2 gap-y-2 flex flex-col">
              <TextInput
                placeholder="Full Name"
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                icon={<Icon icon="solar:user-linear" fontSize={23} />}
                error={touched.fullName && errors.fullName}
              />

              <TextInput
                placeholder="Email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                icon={<Icon icon="mage:email" fontSize={23} />}
                error={touched.email && errors.email}
              />

              <div className="relative ">
                <TextInput
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  icon={
                    <Icon icon="solar:lock-password-outline" fontSize={23} />
                  }
                  style={{ paddingRight: "50px" }}
                  error={touched.password && errors.password}
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

              <div className="relative ">
                <TextInput
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  icon={
                    <Icon icon="solar:lock-password-outline" fontSize={23} />
                  }
                  style={{ paddingRight: "50px" }}
                  error={touched.confirmPassword && errors.confirmPassword}
                />
                <div
                  className="absolute inset-y-0 right-5 flex items-center cursor-pointer h-[59px]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              <div className="text-center text-sm mb-4">
                By tapping Sign Up, you agree to our{" "}
                <Link
                  to="/public/terms-and-conditions"
                  className="text-info hover:underline font-medium"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/public/privacy-policy"
                  className="text-info hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                .
              </div>

              <CustomButton
                text="Sign Up"
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">or Sign Up with</span>
          </div>
        </div>

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

      <div className="mt-8 text-center">
        <p className="text-grey text-sm">
          Have an account?{" "}
          <Link
            to="/auth/"
            className="text-primary hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
