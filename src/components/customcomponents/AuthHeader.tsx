import { IMAGES } from "@/contants/images";

const AuthHeader = () => {
  return (
    <div className="flex items-center justify-center mb-10">
      <img src={IMAGES.logo1} className="w-50" alt="Logo" />
    </div>
  );
};

export default AuthHeader;
