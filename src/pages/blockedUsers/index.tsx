import { Link, useNavigate } from "react-router-dom";

import { IMAGES } from "@/contants/images";
import userList from "./dummyData/userList";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CustomModal } from "@/components/customcomponents/CustomModal";
import NoDataPlaceholder from "@/components/ui/nodata";
import FullScreenLoader from "@/components/ui/loader";
const BlockedUsers = () => {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockUserPopup, setBlockUserPopup] = useState(false);
  const [blockedUserId, setBlockedUserId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getGroupChat = async () => {
    setIsLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(`user/blocked-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlockedUsers(res.data.body.blocked);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async () => {
    setEditLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post(
        `/user/unblock`,
        {
          blocked_user_id: blockedUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      getGroupChat();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to block user");
    } finally {
      setEditLoading(false);
      setBlockUserPopup(false);
    }
  };

  useEffect(() => {
    getGroupChat();
  }, []);

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
            <span className="text-white">Blocked Users</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {blockedUsers?.map((item) => (
          <div
            key={item.user?._id}
            className="border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center bg-[#1a1a1a]"
          >
            <Link
              to={`/user/profile`}
              state={{ id: item.user?._id }}
              className="mb-3"
            >
              <img
                src={item.user?.profile_picture || IMAGES.placeholderAvatar}
                alt={item.user?.fullname}
                className="w-16 h-16 rounded-full object-cover"
              />
            </Link>

            <Link
              to={`/user/profile`}
              state={{ id: item.user?._id }}
              className="mb-2"
            >
              <p className="text-white text-sm font-semibold">
                {item.user?.fullname}
              </p>
              <p className="text-gray-400 text-xs">
                {item.user?.followerCount}{" "}
                {item.user?.followerCount === 1 ? "Follower" : "Followers"}
              </p>
            </Link>

            <button
              className="mt-3 text-xs font-semibold py-2 px-4 rounded-full transition-all cursor-pointer bg-primary text-black hover:bg-primary/80"
              onClick={() => {
                setBlockedUserId(item.user?._id);
                setBlockUserPopup(true);
              }}
            >
              Unblock
            </button>
          </div>
        ))}
      </div>

      {/* Block User Modal */}
      <CustomModal
        title="UnBlock User"
        open={blockUserPopup}
        setOpen={setBlockUserPopup}
        onCancel={() => {
          !editLoading && setBlockUserPopup(false);
        }}
        onSubmit={() => {
          !editLoading && handleBlockUser();
        }}
        submitText={editLoading ? "Unblocking..." : "Yes I'm Sure"}
        cancelText="Cancel"
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">UnBlock User?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to UnBlock this user
              {/* <span className="text-white">Hustlers</span> group? */}
            </p>
          </div>
        }
      />

      {!isLoading && blockedUsers.length === 0 && <NoDataPlaceholder />}
      {isLoading && <FullScreenLoader />}
    </div>
  );
};

export default BlockedUsers;
