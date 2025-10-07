import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { CustomModal } from "./CustomModal";
import CustomTextArea from "./CustomTextArea";
import { DrawerSidebar } from "./DrawerSidebar";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import { Switch } from "@/components/ui/switch";
import TextInput from "./TextInput";
import { Formik, Form } from "formik";
import { changepasswordSchema, contactUsSchema } from "@/utils/validations";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { contactService } from "@/services/contactService";

const PanalLinks = ({ closePanel }: { closePanel: () => void }) => {
  const navigate = useNavigate();
  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);
  const toggleNotification = true; // Always open
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const { updateUser, user } = useUser();
  const [pushNotification, setPushNotification] = useState(false);

  // Contact form initial values
  const contactInitialValues = {
    fullname: "",
    email: "",
    message: "",
  };

  // Contact form submit handler
  const handleContactSubmit = async (
    values: typeof contactInitialValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      const res = await contactService.submitContactForm(values);
      toast.success(res.message);

      resetForm();
      setContactDrawerOpen(false);
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || "Failed to send message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  const [emailNotification, setEmailNotification] = useState(false);
  useEffect(() => {
    if (user) {
      setPushNotification(user.push_notifications);
      setEmailNotification(user.email_notifications);
    }
  }, [user]);
  const panelItems = [
    ...(user?.password
      ? [
          {
            label: "Change Password",
            onClick: () => {
              setPasswordDrawerOpen(true);
            },
            icon: "material-symbols-light:lock-outline",
          },
        ]
      : []),

    {
      label: "Blocked Users",
      onClick: () => {
        closePanel();
        navigate("/user/blocked-users");
      },
      icon: "icons8:remove-user",
    },
    {
      label: "My Wallet",
      onClick: () => {
        closePanel();
        navigate("/user/my-wallet");
      },
      icon: "solar:wallet-linear",
    },
    {
      label: "Saved Cards & Accounts",
      onClick: () => {
        closePanel();
        navigate("/user/saved-cards");
      },
      icon: "lineicons:credit-card-multiple",
    },
    {
      label: "Notification Settings",
      onClick: () => {
        // No action needed - always open
      },
      icon: "gravity-ui:gear",
    },
    {
      label: "About Us",
      onClick: () => {
        closePanel();
        navigate("/public/about-muvello");
      },
      icon: "si:info-line",
    },
    {
      label: "Contact Us",
      onClick: () => {
        setContactDrawerOpen(true);
      },
      icon: "flowbite:messages-outline",
    },
    {
      label: "Terms and Conditions",
      onClick: () => {
        closePanel();
        navigate("/public/terms-and-conditions");
      },
      icon: "solar:document-text-linear",
    },
    {
      label: "Privacy Policy",
      onClick: () => {
        closePanel();
        navigate("/public/privacy-policy");
      },
      icon: "mdi:shield-tick-outline",
    },
    {
      label: "Logout",
      onClick: () => {
        // closePanel();
        setLogoutModal(true);
        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("user");
        // window.location.href = "/login";
      },
      icon: "solar:logout-2-outline",
    },
  ];

  const submitChangePassword = async (
    values: {
      old_password: string;
      new_password: string;
      confirm_password: string;
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post(
        "/user/change-password",
        {
          oldPassword: values.old_password,
          password: values.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, success } = res.data;

      if (message && success) {
        setPasswordDrawerOpen(false);
        toast.success(message);
      }
    } catch (error) {
      const message = error?.response?.data?.error || "Change password failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      setPushNotification(user.push_notifications);
      setEmailNotification(user.email_notifications);
    }
  }, [user]);

  const updateInfo = async (type, status) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post(
        "/user/update-user",
        {
          push_notifications: type == "push" ? status : pushNotification,
          email_notifications: type == "email" ? status : emailNotification,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { body } = res.data;
      updateUser(body.user);
    } catch (error) {
      const message =
        error?.response?.data?.error || "Update notification settings failed.";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="px-4 pb-5 pt-2">
        {/* single link herer */}
        {panelItems.map((item, index) => (
          <div
            onClick={item.onClick}
            key={index}
            className={`flex justify-between gap-4 group cursor-pointer ${
              item.label === "Notification Settings" && toggleNotification
                ? "items-start"
                : "items-center"
            }`}
          >
            <span
              className={`bg-primary p-2 rounded-[7px] ${
                item.label === "Logout" ? "bg-red-500" : ""
              } ${
                toggleNotification && item.label === "Notification Settings"
                  ? "mt-2"
                  : ""
              }`}
            >
              <Icon
                icon={item.icon}
                color={item.label === "Logout" ? "white" : "black"}
                className="w-5 h-5"
              />
            </span>

            <div className="w-full border-b border-gray-800 py-4 group-hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3 justify-between ">
                <div>
                  <p className="text-white text-[15px] font-medium mb-0">
                    {item.label}
                  </p>
                </div>

                {item.label === "Logout" ||
                item.label === "Notification Settings" ? null : (
                  <Icon
                    icon="icon-park-outline:right"
                    color={"white"}
                    className="w-6 h-6"
                  />
                )}
              </div>

              {item.label === "Notification Settings" && toggleNotification && (
                <div className="bg-white/10 rounded-xl mt-6">
                  <div
                    onClick={() => {
                      setPushNotification(!pushNotification);
                      setTimeout(() => {
                        updateInfo("push", !pushNotification);
                      }, 0);
                    }}
                    className="flex items-center gap-3 justify-between w-full border-b border-gray-800 py-3 px-4"
                  >
                    <div>
                      <p className="text-white text-xs font-medium mb-1">
                        Push Notifications
                      </p>
                    </div>

                    <Switch
                      checked={pushNotification}
                      onCheckedChange={setPushNotification}
                      className="bg-gray-600 data-[state=checked]:bg-green-500
             [&>span]:bg-white 
             data-[state=checked]:[&>span]:bg-white cursor-pointer"
                    />
                  </div>
                  <div
                    onClick={() => {
                      setEmailNotification(!emailNotification);
                      updateInfo("email", !emailNotification);
                    }}
                    className="flex items-center gap-3 justify-between w-full py-3 px-4"
                  >
                    <div>
                      <p className="text-white text-xs font-medium mb-1">
                        Email Notifications
                      </p>
                    </div>

                    <Switch
                      checked={emailNotification}
                      onCheckedChange={setEmailNotification}
                      className="bg-gray-600 data-[state=checked]:bg-green-500
             [&>span]:bg-white 
             data-[state=checked]:[&>span]:bg-white cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* change password Drawer */}
      <DrawerSidebar
        title="Change Password"
        submitText="Submit"
        cancelText="Cancel"
        onSubmit={() => console.log("Notification Submitted")}
        open={passwordDrawerOpen}
        setOpen={setPasswordDrawerOpen}
        showFooter={false}
        className="drawer-override"
      >
        <div className="p-6">
          <p className="text-grey text-sm mb-5">
            Create a strong and easy to remember new password for your account.
          </p>

          <Formik
            initialValues={{
              old_password: "",
              new_password: "",
              confirm_password: "",
            }}
            validationSchema={changepasswordSchema}
            onSubmit={submitChangePassword}
          >
            {({ values, errors, touched, handleChange, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-1 gap-y-2 flex flex-col">
                  {/* Old Password */}
                  <div className="relative mb-4">
                    <TextInput
                      name="old_password"
                      placeholder="Old Password"
                      type={showOldPassword ? "text" : "password"}
                      value={values.old_password}
                      onChange={handleChange}
                      icon={
                        <Icon
                          icon="solar:lock-password-outline"
                          color="white"
                          fontSize={23}
                        />
                      }
                      style={{ paddingRight: "50px" }}
                      error={
                        touched.old_password && errors.old_password
                          ? String(errors.old_password)
                          : ""
                      }
                    />
                    <div
                      className="absolute inset-y-0 right-5 flex items-center cursor-pointer h-[59px]"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      )}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="relative mb-4">
                    <TextInput
                      name="new_password"
                      placeholder="New Password"
                      type={showPassword ? "text" : "password"}
                      value={values.new_password}
                      onChange={handleChange}
                      icon={
                        <Icon
                          icon="solar:lock-password-outline"
                          color="white"
                          fontSize={23}
                        />
                      }
                      style={{ paddingRight: "50px" }}
                      error={
                        touched.new_password && errors.new_password
                          ? String(errors.new_password)
                          : ""
                      }
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

                  {/* Confirm New Password */}
                  <div className="relative mb-8">
                    <TextInput
                      name="confirm_password"
                      placeholder="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirm_password}
                      onChange={handleChange}
                      icon={
                        <Icon
                          icon="solar:lock-password-outline"
                          color="white"
                          fontSize={23}
                        />
                      }
                      style={{ paddingRight: "50px" }}
                      error={
                        touched.confirm_password && errors.confirm_password
                          ? String(errors.confirm_password)
                          : ""
                      }
                    />
                    <div
                      className="absolute inset-y-0 right-5 flex items-center cursor-pointer h-[59px]"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      )}
                    </div>
                  </div>

                  <CustomButton
                    text="Update"
                    type="submit"
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DrawerSidebar>

      {/* contact us Drawer */}
      <DrawerSidebar
        title="Contact Us"
        submitText="Submit"
        cancelText="Cancel"
        onSubmit={() => console.log("Notification Submitted")}
        open={contactDrawerOpen}
        setOpen={setContactDrawerOpen}
        showFooter={false}
        className="drawer-override"
      >
        <div className="p-6">
          <Formik
            initialValues={contactInitialValues}
            validationSchema={contactUsSchema}
            onSubmit={handleContactSubmit}
          >
            {({ values, errors, touched, handleChange, isSubmitting }) => (
              <Form className="space-y-6">
                <img
                  src={IMAGES.contactPic}
                  alt="contact"
                  className="w-65 mx-auto"
                />

                <div className="gap-y-2 flex flex-col space-y-3">
                  <TextInput
                    placeholder="Full Name"
                    type="text"
                    name="fullname"
                    value={values.fullname}
                    onChange={handleChange}
                    icon={
                      <Icon
                        icon="solar:user-linear"
                        color="white"
                        fontSize={23}
                      />
                    }
                    error={
                      touched.fullname && errors.fullname
                        ? String(errors.fullname)
                        : ""
                    }
                  />

                  <TextInput
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    icon={
                      <Icon icon="mage:email" color="white" fontSize={23} />
                    }
                    error={
                      touched.email && errors.email ? String(errors.email) : ""
                    }
                  />

                  <CustomTextArea
                    placeholder="Write your message..."
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    rows={5}
                    className="h-[140px] rounded-xl resize-none"
                    icon={
                      <Icon
                        icon="si:align-justify-line"
                        color="white"
                        fontSize={23}
                      />
                    }
                    error={
                      touched.message && errors.message
                        ? String(errors.message)
                        : ""
                    }
                  />
                  <p className="text-white text-sm mb-5">
                    We always try our best to respond to each member within 48
                    business hours. We appreciate your patience.
                  </p>

                  <CustomButton
                    text={isSubmitting ? "Sending..." : "Submit"}
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {}}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DrawerSidebar>

      {/* Modal */}
      <CustomModal
        title="Logout"
        open={logoutModal}
        setOpen={setLogoutModal}
        onCancel={() => setLogoutModal(false)}
        onSubmit={() => {
          updateUser(null);
          setLogoutModal(false);
          localStorage.clear();
          window.location.href = "/auth";
        }}
        submitText="Yes I’m Sure"
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Logout?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to logout?
            </p>
          </div>
        }
      />
    </>
  );
};

export default PanalLinks;
