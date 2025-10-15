import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";
import Lines from "@/components/svgcomponents/Lines";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import { reportUserSchema } from "@/utils/validations";

export type ReportType = "post" | "workout" | "user";

export interface ReportComponentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reportType: ReportType;
  reportedItemId: string;
  reportedItemTitle?: string;
  onReportSuccess?: () => void;
}

const reportOptions = [
  "Fake profile/spam",
  "Inappropriate content",
  "False Information",
  "Spam or Promotions",
  "Offline behavior",
  "Violates Community Guidelines",
  "Illegal or Dangerous Activities",
  "Misleading Purpose",
  "Other",
];

const ReportComponent: React.FC<ReportComponentProps> = ({
  open,
  setOpen,
  reportType,
  reportedItemId,
  reportedItemTitle,
  onReportSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    reportType: "",
    reason: "",
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "post":
        return "Report Post";
      case "workout":
        return "Report Workout";
      case "user":
        return "Report User";
      default:
        return "Report";
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case "post":
        return "We don't tell the post author about this report.";
      case "workout":
        return "We don't tell the workout creator about this report.";
      case "user":
        return "We don't tell the user about this report.";
      default:
        return "We don't tell the reported user about this report.";
    }
  };

  const handleReportSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setIsSubmitting(true);
      const token = localStorageService.getItem("accessToken");

      let payload: any = {
        reason:
          values.reportType === "Other" ? values.reason : values.reportType,
      };

      // Add specific fields based on report type
      switch (reportType) {
        case "post":
          payload.post_id = reportedItemId;
          break;
        case "workout":
          payload.workout_id = reportedItemId;
          break;
        case "user":
          payload.reported_user = reportedItemId;
          break;
      }

      // Use the appropriate API endpoint based on report type
      const endpoint = "/user-reports";

      await axiosInstance.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetForm();
      toast.success("Report submitted successfully.");
      setOpen(false);
      onReportSuccess?.();
    } catch (error: any) {
      const message = error?.response?.data?.error || "Reporting failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={reportUserSchema}
      onSubmit={handleReportSubmit}
    >
      {({ values, setFieldValue, isSubmitting, handleSubmit, resetForm }) => (
        <Form>
          <DrawerSidebar
            title={getReportTitle()}
            submitText={isSubmitting ? "Submitting..." : "Submit"}
            cancelText="Cancel"
            onSubmit={() =>
              document.getElementById("report-form-submit")?.click()
            }
            open={open}
            setOpen={setOpen}
            onCancel={() => {
              resetForm();
              setOpen(false);
            }}
          >
            <div className="p-4">
              <h3 className="text-white text-md font-semibold mb-3">
                {getReportDescription()}
              </h3>

              {reportedItemTitle && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-300 mb-1">
                    {reportType === "post"
                      ? "Post:"
                      : reportType === "workout"
                      ? "Workout:"
                      : "User:"}
                  </p>
                  <p className="text-white text-sm font-medium line-clamp-2 break-all">
                    {reportedItemTitle}
                  </p>
                </div>
              )}

              <div className="flex flex-col">
                <div className="space-y-6 mb-3">
                  {reportOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFieldValue("reportType", option)}
                      className="flex w-full cursor-pointer items-center justify-between text-left text-white text-sm font-normal focus:outline-none"
                    >
                      {option}
                      <div className="w-5 h-5 ml-4">
                        <Icon
                          icon="radix-icons:radiobutton"
                          fontSize={20}
                          color={
                            values.reportType === option ? "#94EB00" : "#666"
                          }
                        />
                      </div>
                    </button>
                  ))}
                </div>
                <ErrorMessage
                  name="reportType"
                  component="div"
                  className="text-red-500 text-xs mb-2"
                />
              </div>

              {values.reportType === "Other" && (
                <div className="mt-4">
                  <Field name="reason">
                    {({ field }: any) => (
                      <CustomTextArea
                        {...field}
                        placeholder="Write your reason here..."
                        icon={<Lines color="white" />}
                        error={null}
                        rows={1}
                        className="resize-none overflow-hidden"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              )}

              <button
                type="button"
                className="hidden"
                id="report-form-submit"
                disabled={isSubmitting}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </button>
            </div>
          </DrawerSidebar>
        </Form>
      )}
    </Formik>
  );
};

export default ReportComponent;
