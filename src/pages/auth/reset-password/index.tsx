import { IMAGES } from "@/contants/images";
import { LoginForm } from "./login-form";

const ResetPassword = () => {
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
          style={{
            width: "600px",
            height: "600px",
          }}
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

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden mb-8">
            <img src={IMAGES.logo} alt="Logo" />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-medium mb-2 text-center">
              Reset Your Password
            </h2>
            <p className="text-grey text-sm font-light text-center">
              Create a strong and easy to remember new{" "}
              <br className="hidden lg:block" />
              password for your account.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
