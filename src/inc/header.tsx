import {
  Activity,
  Bell,
  Dumbbell,
  LayoutDashboard,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/customcomponents/CustomButton";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import ExerciseIcon from "@/components/svgcomponents/Exercise";
import HomeIcon from "@/components/svgcomponents/Home";
import { IMAGES } from "@/contants/images";
import MessagesIcon from "@/components/svgcomponents/Messages";
import PanalLinks from "@/components/customcomponents/PanalLinks";
import WorkoutIcon from "@/components/svgcomponents/Workout";
import { useCallback, useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { capitalize } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import FullScreenLoader from "@/components/ui/loader";
import NoDataPlaceholder from "@/components/ui/nodata";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userPanelOpen, setUserPanelOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  // const [user, setUser] = useState({});
  const [keyword, setKeyword] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchNotifications();
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   const data = localStorageService.getItem("user");
  //   setUser(data);
  // }, []); // 👈 empty dependency array = runs only once on mount

  const getRecentSearch = async () => {
    if (!user._id) return;
    setEditLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get(`/user/recently-searched`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = res.data.body.users || [];
      setRecentUsers(users);
      return users;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to fetch recent searches"
      );
      return [];
    } finally {
      setEditLoading(false);
    }
  };

  const searchUsers = async () => {
    setEditLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(`/user/profile?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserList(res.data.body.user);
      setIsSearch(true);
      setShowDropdown(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to search");
    } finally {
      setEditLoading(false);
    }
  };

  const removeSearch = async (id, idx) => {
    const newRecentUsers = recentUsers.filter((_, index) => index !== idx);
    setRecentUsers(newRecentUsers);
    setUserList(newRecentUsers);
    setEditLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.delete(`recent-search/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to search");
    } finally {
      setEditLoading(false);
    }
  };

  const clearSearch = async () => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.delete(`recent-search/delete-all/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecentUsers([]);
      setUserList([]);
      setShowDropdown(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to search");
    } finally {
      setEditLoading(false);
    }
  };

  const saveSearch = async (id) => {
    setEditLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const reqData = {
        entity_type: "user",
        entity_id: id,
      };
      const res = await axiosInstance.post(`recent-search`, reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKeyword("");
      setShowDropdown(false);
      navigate("/user/profile", { state: { id: id } });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to search");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    getRecentSearch();
  }, []);

  //// =====  notifications  ===== ////
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const fetchNotifications = useCallback(async (pageNum = 1) => {
    if (!user._id) return;
    setLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get(
        `/notifications?page=${pageNum}&limit=${LIMIT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newList = res.data.body.notifications || [];
      setUnread(res.data.body.unreadCount);
      setNotifications((prev) =>
        pageNum === 1 ? newList : [...prev, ...newList]
      );
      setTotal(res.data.body?.pagination?.total || 0);
    } catch (error) {
      const message =
        error?.response?.data?.error || "Failed to load notifications";
      toast.error(message);
    } finally {
      setLoading(false);
    }

    // try {
    //   setLoading(true);
    //   const res = await getCall(ApiEndpoint.NOTIFICATIONS, {
    //     page: pageNum,
    //     limit: LIMIT,
    //   });

    //   if (res?.success) {
    //     const newList = res.body?.notifications || [];
    //     setNotifications(prev =>
    //       pageNum === 1 ? newList : [...prev, ...newList]
    //     );
    //     setTotal(res.body?.pagination?.total || 0);
    //   } else {
    //     toast.error(message);
    //     toastService("error", res?.message || "Failed to load notifications");
    //   }
    // } catch (err) {
    //   console.error("Notification fetch error", err);
    // } finally {
    //   setLoading(false);
    // }
  }, []);

  useEffect(() => {
    if (open) {
      fetchNotifications(1);
    }
  }, [open, fetchNotifications]);

  // const handleFollowAction = async (notif, actionType) => {

  //   if (res) {
  //     setNotifications((prev) =>
  //       prev.map((n) =>
  //         n._id === notif._id
  //           ? {
  //               ...n,
  //               type:
  //                 actionType === "accept" ? "follow_accept" : "follow_reject",
  //             }
  //           : n
  //       )
  //     );
  //   }
  // };

  const loadMore = () => {
    if (notifications.length < total && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  const handleFollowRequest = async (id, status) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const resExe = await axiosInstance.put(
        `/user/follow-action/${id}/${status}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPage(1);
      fetchNotifications(1);
      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black text-white px-3 lg:px-10 py-5 shadow border-b border-lightdark transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <img
          src={IMAGES.logoHome}
          alt="Muvello Logo"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/user/home")}
        />

        {Object.keys(user).length > 0 && (
          <>
            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-8 items-center text-sm">
              <Link
                to="/user/home"
                className={`flex items-center gap-2 ${
                  location.pathname === "/user/home"
                    ? "text-[#94eb00] font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <HomeIcon
                  color={
                    location.pathname === "/user/home" ? "#94eb00" : "#686D76"
                  }
                  width={18}
                  height={18}
                />{" "}
                Home
              </Link>
              <Link
                to="/user/workouts"
                className={`flex items-center gap-2 ${
                  location.pathname === "/user/workouts"
                    ? "text-[#94eb00] font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <WorkoutIcon
                  color={
                    location.pathname === "/user/workouts"
                      ? "#94eb00"
                      : "#686D76"
                  }
                  width={22}
                  height={22}
                />{" "}
                Workouts
              </Link>
              <Link
                to="/user/exercises"
                className={`flex items-center gap-2 ${
                  location.pathname === "/user/exercises"
                    ? "text-[#94eb00] font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ExerciseIcon
                  color={
                    location.pathname === "/user/exercises"
                      ? "#94eb00"
                      : "#686D76"
                  }
                  width={18}
                  height={18}
                />{" "}
                Exercises
              </Link>
            </nav>

            {/* Right: Search + Icons */}
            <div className="hidden lg:flex items-center gap-4" ref={searchRef}>
              {/* Search */}
              <div className="relative w-60">
                {/* Search Input */}
                <div className="flex items-center bg-[#2a2a2a] rounded-full px-4 py-2 w-full">
                  <Search className="text-gray-400 mr-2" size={16} />
                  <input
                    value={keyword}
                    type="text"
                    placeholder="Search users..."
                    className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-400"
                    onChange={(e) => {
                      const val = e.target.value;
                      setKeyword(val); // always set keyword
                      if (!val) {
                        setUserList([]);
                        setShowDropdown(false);
                        setIsSearch(false);
                      }
                    }}
                    onFocus={async () => {
                      setIsSearch(false);
                      const users = await getRecentSearch();
                      setUserList(users);
                      setShowDropdown(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (keyword) searchUsers();
                      }
                    }}
                    onClick={() => {
                      if (!isSearch && recentUsers.length > 0) {
                        setUserList(recentUsers);
                        setShowDropdown(true);
                      }
                    }}
                  />
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute top-12 w-full bg-[#1a1a1a] rounded-xl p-4 shadow-lg z-50">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white font-semibold text-sm">Recent</p>
                      {userList.length > 0 && (
                        <button
                          onClick={() => clearSearch()}
                          className="text-xs text-blue-500 hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto cursor-pointer">
                      <ul className="space-y-3 pr-2">
                        {userList.map((user, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between hover:bg-white/10 p-2 rounded-lg"
                          >
                            <div
                              className="flex items-center gap-3 w-full mr-1"
                              onClick={() =>
                                saveSearch(user.user_id || user._id)
                              }
                            >
                              <img
                                src={
                                  user.profile_picture ||
                                  IMAGES.placeholderAvatar
                                }
                                alt={user.fullname}
                                className="max-w-9 w-full h-9 rounded-full object-cover"
                              />
                              <div className="w-fit">
                                <p className="text-white text-xs font-medium">
                                  {user.fullname}
                                </p>
                                <p className="text-gray-400 text-[11px]">
                                  {user.followerCount}{" "}
                                  {user.followerCount === 1
                                    ? "Follower"
                                    : "Followers"}
                                </p>
                              </div>
                            </div>

                            {!isSearch && (
                              <button
                                onClick={() => removeSearch(user._id, idx)}
                                className="cursor-pointer"
                              >
                                <Icon
                                  icon="solar:close-circle-linear"
                                  className="text-grey hover:text-white transition-all duration-300 ease-in-out"
                                  fontSize={18}
                                />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                      {userList.length === 0 && <NoDataPlaceholder />}
                    </div>
                  </div>
                )}
              </div>

              {/* Icons */}
              <Button
                className="rounded-full cursor-pointer w-[40px] h-[40px] bg-[#2a2a2a]"
                onClick={() => navigate("/user/chat")}
              >
                <MessagesIcon color="white" width={27} height={27} />
              </Button>
              <Button
                onClick={() => setOpen(true)}
                className="relative rounded-full cursor-pointer w-[40px] h-[40px] bg-[#2a2a2a]"
              >
                <Bell size={18} className="text-white" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] px-1 h-[18px] bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </Button>

              {/* Avatar */}
              <Avatar
                onClick={() => setUserPanelOpen(true)}
                className="cursor-pointer w-[40px] h-[40px]"
              >
                <AvatarImage
                  src={user?.profile_picture || IMAGES.placeholderAvatar}
                  alt="@user"
                />
              </Avatar>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Avatar */}
              <Avatar
                onClick={() => setUserPanelOpen(true)}
                className="cursor-pointer lg:hidden w-[40px] h-[40px]"
              >
                <AvatarImage
                  src={user?.profile_picture || IMAGES.placeholderAvatar}
                  alt="@user"
                />
              </Avatar>
              <button
                className=" p-2 rounded-full bg-[#2a2a2a]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>

      {Object.keys(user).length > 0 && (
        <>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 space-y-3">
              <nav className="flex flex-col gap-3 text-sm">
                <Link
                  to="/user/home"
                  className="flex items-center gap-2 text-[#94eb00] font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={16} /> Home
                </Link>
                <Link
                  to="/user/workouts"
                  className="flex items-center gap-2 text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Dumbbell size={16} /> Workouts
                </Link>
                <Link
                  to="/user/exercises"
                  className="flex items-center gap-2 text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Activity size={16} /> Exercises
                </Link>
                <Link
                  to="/user/chat"
                  className="flex items-center gap-2 text-gray-300"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                >
                  <MessagesIcon color="white" width={17} height={17} />
                  Chat
                </Link>
                <Link
                  to="javascript:void(0)"
                  className="flex items-center gap-2 text-gray-300"
                  onClick={() => {
                    setOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Bell size={17} />
                  Notifications
                </Link>
              </nav>

              {/* Mobile Search */}
              <div className="flex items-center bg-[#2a2a2a] rounded-full px-4 py-2">
                <Search className="text-gray-400 mr-2" size={16} />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
                  onChange={setKeyword}
                />
              </div>
            </div>
          )}

          {/* Notification Drawer */}
          <DrawerSidebar
            title="Notifications"
            submitText="Submit"
            cancelText="Cancel"
            onSubmit={() => console.log("Notification Submitted")}
            open={open}
            setOpen={setOpen}
            showFooter={false}
            className="drawer-override"
          >
            {loading && notifications.length === 0 ? (
              <div className="flex justify-center items-center h-[60vh]">
                <FullScreenLoader />
              </div>
            ) : (
              <div className="p-4 h-full overflow-y-auto overflow-x-hidden">
                {notifications.length === 0 && !loading && (
                  <div className="text-center text-white py-10">
                    No notifications found.
                  </div>
                )}

                <div className="h-[calc(100vh-145px)] overflow-y-auto">
                  {notifications.map((notif, index) => (
                    <div
                      key={notif._id || index}
                      className={`flex items-start gap-3 mb-4 w-full ${
                        notif.type === "follow_reject" ? "opacity-50" : ""
                      } cursor-pointer hover:opacity-70 transition-all duration-300 ease-in-out`}
                    >
                      <img
                        src={
                          notif?.sender_id?.profile_picture ||
                          IMAGES.placeholderAvatar
                        }
                        alt="Notification"
                        className="w-12 h-12 rounded-full shrink-0 hover:scale-105 transition-all duration-300 ease-in-out"
                        onClick={() => {
                          if (notif?.sender_id) {
                            navigate(`/user/profile`, {
                              state: { id: notif.sender_id._id },
                            });
                            setOpen(false);
                          }
                        }}
                      />
                      <div className="border-b border-gray-600 pb-4 w-full overflow-hidden">
                        <p className="text-white text-sm leading-snug break-words line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {moment(notif.created_at).fromNow()}
                        </p>

                        {notif.type === "follow_request" && (
                          <div className="flex items-center gap-2 mt-3 justify-end">
                            <CustomButton
                              type="button"
                              text="Decline"
                              onClick={() =>
                                handleFollowRequest(
                                  notif.data.request_id,
                                  "reject"
                                )
                              }
                              className="w-[90px] h-[35px] font-medium rounded-[10px] text-red p-0 bg-transparent border border-transparent"
                            />
                            <CustomButton
                              type="button"
                              text="Accept"
                              onClick={() =>
                                handleFollowRequest(
                                  notif.data.request_id,
                                  "accept"
                                )
                              }
                              className="w-[90px] h-[35px] font-medium rounded-[10px] bg-primary text-black border-none p-0"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {notifications.length < total && (
                  <div className="text-center mt-4">
                    <CustomButton
                      type="button"
                      text="Load More"
                      onClick={loadMore}
                      className="text-white h-[50px] border border-gray-500 px-4 py-1 rounded-md"
                    />
                  </div>
                )}

                {loading && (
                  <div className="text-center mt-6">{/* <Spinner /> */}</div>
                )}
              </div>
            )}
          </DrawerSidebar>

          {/* User Panel Drawer */}
          <DrawerSidebar
            title="Profile"
            submitText="Submit"
            cancelText="Cancel"
            onSubmit={() => console.log("Notification Submitted")}
            open={userPanelOpen}
            setOpen={setUserPanelOpen}
            showFooter={false}
            className="drawer-override"
          >
            <div>
              <div className="flex items-center justify-between py-5 px-4 border-b-5 border-white/10">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-16 h-16 rounded-full">
                    <AvatarImage
                      src={user?.profile_picture || IMAGES.placeholderAvatar}
                      alt="@user"
                    />
                  </Avatar>
                  <div>
                    <p className="truncate max-w-[200px] whitespace-nowrap overflow-hidden text-white text-sm">
                      {capitalize(user?.fullname)}
                    </p>
                    <p className="truncate max-w-[200px] whitespace-nowrap overflow-hidden text-white text-sm">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="">
                  <CustomButton
                    onClick={() => {
                      setUserPanelOpen(false);
                      navigate("/user/profile");
                    }}
                    text="View Profile"
                    type="button"
                    className="py-4 w-[110px] font-medium rounded-full border-none p-0 bg-primary text-black"
                  />
                </div>
              </div>

              <PanalLinks closePanel={() => setUserPanelOpen(false)} />
            </div>
          </DrawerSidebar>
        </>
      )}
    </header>
  );
}
