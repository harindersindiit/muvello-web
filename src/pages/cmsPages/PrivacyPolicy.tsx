import FullScreenLoader from "@/components/ui/loader";
import { IMAGES } from "@/contants/images";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(false);

  const getCms = async (currentPage = 1) => {
    setLoader(true);

    try {
      const res = await axiosInstance.get(`cms/privacy-policy`);

      const cms = res.data.body;
      setData(cms);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to fetch posts.");
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getCms();
  }, []);
  if (loader) return <FullScreenLoader />;
  return (
    <div className="text-white my-6 mb-0 pb-9 px-1">
      <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-[auto] gap-4">
        <div className="flex items-center gap-4 mb-3">
          <h2
            className="md:text-2xl text-md font-semibold flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <img
              src={IMAGES.arrowLeft}
              alt="arrowLeft"
              className="w-6 h-6 cursor-pointer"
            />
            <span className="text-white">Privacy Policy</span>
          </h2>
        </div>
      </div>

      <div
        className="policy-content"
        dangerouslySetInnerHTML={{ __html: data?.content }}
      />
    </div>
  );
};

export default PrivacyPolicy;
