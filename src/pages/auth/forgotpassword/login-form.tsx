import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import TextInput from "@/components/customcomponents/TextInput";
import CustomButton from "@/components/customcomponents/CustomButton";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import axiosInstance from "@/utils/axiosInstance";
import { forgetPasswordSchema } from "@/utils/validations";

export function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const res: any = await axiosInstance.post(
        "auth/forgot-password",
        JSON.stringify(values)
      );

      const { message, statusCode } = res.data;

      if (statusCode === 200 && message) {
        toast.success(message);
        navigate("/auth/otp-verification", {
          state: { email: values.email },
        });
      }
    } catch (error: any) {
      if (error.response?.data?.error) toast.error(error.response.data.error);
      else toast.error("Forget password failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          isSubmitting,
          setFieldTouched,
        }) => (
          <Form className="space-y-6">
            <div className="space-y-1 gap-y-2 flex flex-col">
              <TextInput
                name="email"
                placeholder="Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={() => setFieldTouched("email", true)}
                icon={<Icon icon="mage:email" color="white" fontSize={23} />}
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}

              <CustomButton
                text="Get OTP"
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-8 text-center">
        <p className="text-grey text-sm">
          <a
            href="/auth/"
            className="text-primary hover:underline font-semibold"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
