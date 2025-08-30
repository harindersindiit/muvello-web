import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import Lines from "@/components/svgcomponents/Lines";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import TextInput from "@/components/customcomponents/TextInput";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";
import CustomButton from "@/components/customcomponents/CustomButton";
import { Progress } from "@/components/ui/progress";
import AuthHeader from "@/components/customcomponents/AuthHeader";
import axiosInstance from "@/utils/axiosInstance";
import { basicInfoSchema } from "@/utils/validations";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { useRef } from "react";
const BasicInfo = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateUser } = useUser();
  const navigate = useNavigate();

  const today = new Date();
  const fourteenYearsAgo = new Date(
    today.getFullYear() - 14,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const initialValues = {
    gender: "Female",
    dob: "",
    height: "",
    heightUnit: "Cm",
    weight: "",
    weightUnit: "Kg",
    about: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const reqData = {
        height_unit: values.heightUnit,
        height_value: values.height,
        weight_unit: values.weightUnit,
        weight_value: values.weight,
        gender: values.gender,
        dob: new Date(values.dob).toUTCString(),
        bio: values.about,
      };

      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post("/user/update-user", reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { message, success, body } = res.data;

      if (message && success && body.user) {
        toast.success(message);
        updateUser(body.user);
        navigate("/profile/experience-level", { replace: true });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 2️⃣ Handler to open the picker
  const openDatePicker = () => {
    if (inputRef.current) {
      // Preferred: show the native date picker
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        // Fallback: focus the input
        inputRef.current.focus();
      }
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col bg-cover bg-center p-4 p-lg-8"
      style={{ backgroundImage: `url(${IMAGES.basicInfoBg})` }}
    >
      <AuthHeader />
      <div className="relative flex-1 flex justify-center overflow-hidden">
        <div className="max-w-[620px] w-full bg-black border border-primary/25 p-4 lg:p-8  rounded-[20px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full">
            <Progress value={33} />
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={basicInfoSchema}
          >
            {({
              values,
              handleChange,
              setFieldValue,
              isSubmitting,
              errors,
              touched,
            }) => (
              <Form>
                <h1 className="text-2xl font-semibold mb-0 pt-3">Basic Info</h1>
                <p className="text-sm opacity-50 font-light mb-6">
                  Help us personalize your fitness journey with a few quick
                  details.
                </p>

                {/* Gender Selection */}
                <div className="mb-5">
                  <label className="block font-semibold mb-2">
                    How do you identify?
                  </label>
                  <div className="flex gap-3 lg:gap-4 flex-wrap">
                    {["Female", "Male", "Other"].map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setFieldValue("gender", option)}
                        className={`flex w-[120px] lg:w-[150px] justify-center items-center gap-2 px-5 py-3 rounded-full ${
                          values.gender === option
                            ? "bg-[#94eb00] text-black"
                            : "bg-[#2a2a2a] text-white"
                        } font-normal`}
                      >
                        <Icon
                          fontSize={20}
                          icon={
                            option.toLowerCase() === "female"
                              ? "mage:female"
                              : option.toLowerCase() === "male"
                              ? "mage:male"
                              : "ion:male-female-outline"
                          }
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age (DOB) */}
                <div className="mb-5">
                  <label className="block font-semibold mb-2">
                    What’s your age?
                  </label>
                  <div
                    className="flex items-center bg-[#2a2a2a] rounded-full px-4 py-3"
                    onClick={openDatePicker}
                  >
                    <Icon
                      fontSize={22}
                      icon="icon-park-outline:birthday-cake"
                      className="mr-3"
                    />

                    <input
                      ref={inputRef}
                      max={fourteenYearsAgo}
                      type="date"
                      name="dob"
                      value={values.dob}
                      onChange={handleChange}
                      onKeyDown={(e) => e.preventDefault()} // Prevents typing
                      onPaste={(e) => e.preventDefault()} // Prevents paste
                      className="bg-transparent py-1 text-white placeholder-gray-400 w-full outline-none [&::-webkit-calendar-picker-indicator]:invert text-sm placeholder:text-sm placeholder:font-light cursor-pointer"
                      placeholder="Select date of birth"
                    />
                  </div>
                </div>

                {touched.dob && errors.dob && (
                  <div
                    className="text-red-500 text-sm mt-1"
                    style={{ marginTop: -10, paddingBottom: 10 }}
                  >
                    {errors.dob}
                  </div>
                )}

                {/* Height */}
                <div className="mb-5">
                  <label className="block font-semibold mb-2">
                    What’s your height?
                  </label>
                  <div className="flex gap-3 mb-3">
                    {["Cm", "Feet"].map((unit) => (
                      <button
                        type="button"
                        key={unit}
                        onClick={() => setFieldValue("heightUnit", unit)}
                        className={`px-3 py-1 cursor-pointer rounded-[10px] text-sm ${
                          values.heightUnit === unit
                            ? "bg-[#94eb00] text-black"
                            : "bg-[#2a2a2a] text-white/60"
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                  <TextInput
                    placeholder="Enter Height"
                    name="height"
                    // type="number"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={values.height}
                    onChange={handleChange}
                    icon={<Icon icon="mdi:human-male-height" fontSize={23} />}
                    error={touched.height && errors.height}
                  />
                </div>

                {/* Weight */}
                <div className="mb-5">
                  <label className="block font-semibold mb-2">
                    What’s your current weight?
                  </label>
                  <div className="flex gap-3 mb-3">
                    {["Kg", "Lbs"].map((unit) => (
                      <button
                        type="button"
                        key={unit}
                        onClick={() => setFieldValue("weightUnit", unit)}
                        className={`px-3 py-1 cursor-pointer rounded-[10px] text-sm ${
                          values.weightUnit === unit
                            ? "bg-[#94eb00] text-black"
                            : "bg-[#2a2a2a] text-white/60"
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                  <TextInput
                    placeholder="Enter Weight"
                    name="weight"
                    // type="number"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={values.weight}
                    onChange={handleChange}
                    icon={<img src={IMAGES.weight} alt="weight" />}
                    error={touched.weight && errors.weight}
                  />
                </div>

                {/* About Yourself */}
                <div>
                  <label className="block font-semibold mb-2">
                    Write about yourself
                  </label>
                  <CustomTextArea
                    maxLength={500}
                    placeholder="Write about yourself..."
                    name="about"
                    value={values.about}
                    onChange={handleChange}
                    icon={<Lines color="white" />}
                    className="min-h-[120px] max-h-[120px]"
                  />
                </div>

                {touched.about && errors.about && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.about}
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-end mt-6">
                  <CustomButton
                    text={isSubmitting ? "Submitting..." : "Continue"}
                    type="submit"
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
