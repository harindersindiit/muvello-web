import { useLocation, useNavigate, useParams } from "react-router-dom";

import CustomButton from "@/components/customcomponents/CustomButton";
import { CustomModal } from "@/components/customcomponents/CustomModal";
import { CustomTab } from "@/components/customcomponents/CustomTab";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import ProfilePostCard from "@/components/customcomponents/ProfilePostCard";
import TextInput from "@/components/customcomponents/TextInput";
import WorkoutComponent from "@/components/customcomponents/WorkoutComponent";
import likeList from "../postDetails/dummyData/likeList";
import { useEffect, useState } from "react";
import localStorageService from "@/utils/localStorageService";
import { calculateAge } from "@/utils/age";

import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import FullScreenLoader from "@/components/ui/loader";
import NoDataPlaceholder from "@/components/ui/nodata";
import { Loader2 } from "lucide-react";
import { getMaxWeek } from "@/utils/sec";
import { capitalize, totalWorkoutDuration } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const UserProfile = () => {
  const { user: loggedUser } = useUser();
  const navigate = useNavigate();

  const { state } = useLocation();

  console.log({ state });

  const userId = state?.id;

  const [openDrawer, setOpenDrawer] = useState(false);

  const [activeTab, setActiveTab] = useState("followers");
  const [blockUserModal, setBlockUserModal] = useState(false);
  const [profileStats, setProfileStats] = useState([]);

  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [pinnedWorkouts, setPinnedWorkouts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState({});

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!openDrawer) {
      setSearchText("");
    }
  }, [openDrawer]);

  useEffect(() => {
    const init = async () => {
      const token = localStorageService.getItem("accessToken");
      setLoader(true); // ✅ Start full screen loader
      setFollowLoader(true);
      try {
        let userData;

        const res = await axiosInstance.get(
          `/user/profile?id=${userId || loggedUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        userData = res.data.body.user;

        setUser(userData);
        getData(userData._id);
        prepareStats(userData);
        getFollowers(userData._id);
      } catch (error) {
        toast.error("Failed to fetch user profile");
      } finally {
        setLoader(false); // ✅ Stop full screen loader
      }
    };

    init();
  }, [userId, loggedUser._id]);

  const [activeProfileTab, setActiveProfileTab] = useState("Feed");
  useEffect(() => {
    const savedTab = localStorage.getItem("profile_active_tab");

    if (savedTab) {
      setActiveProfileTab(JSON.parse(savedTab));
      localStorage.removeItem("profile_active_tab");
    }
  }, []);

  const prepareStats = (data) => {
    const stats = [
      {
        id: 1,
        label: data.gender,
        icon: "material-symbols-light:wc",
      },
      {
        id: 2,
        label: `${data.height_value} ${data.height_unit}`,
        icon: "mdi:human-male-height",
      },
      {
        id: 3,
        label: `${data.weight_value} ${data.weight_unit}`,
        icon: "healthicons:weight-outline",
      },
      {
        id: 4,
        label: `${calculateAge(data.dob)}`,
        icon: "icon-park-outline:birthday-cake",
      },
    ];
    setProfileStats(stats);
  };

  const getData = async (userId) => {
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get(
        `post?limit=${100}&page=${1}&user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(res.data.body.posts);

      const res1 = await axiosInstance.get(`post/pinned?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPinnedPosts(res1.data.body.pinned);

      const res2 = await axiosInstance.get(
        // `workout?limit=${100}&page=${1}&user_id=${userId}`,
        `workout?limit=100&user_id=${userId}&type=NoDraft`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkouts(res2.data.body.workouts);

      const res3 = await axiosInstance.get(`workout/pinned?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPinnedWorkouts(res3.data.body.workouts);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Login failed.";
      toast.error(message);
    } finally {
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.put(
        `/user/follow/${user._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message); // assuming response returns a message like "Followed" or "Unfollowed"
      const status = res.data.body.status;

      // Optional: update local UI state (like user.iFollow)
      setUser((prevUser) => ({ ...prevUser, iFollow: status }));
    } catch (err) {
      console.error("Follow toggle error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleFollowList = async (id) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.put(
        `/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = res.data.body.status;
      if (status) {
        getFollowers();
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const [removeIndex, setRemoveIndex] = useState(null);
  const removeFollower = async (id, index) => {
    try {
      setRemoveIndex(index);
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.put(
        `/user/remove-follower/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = res.data.success;

      if (status) {
        getFollowers();
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRemoveIndex(null);
    }
  };

  const unfollowUser = async (id, index) => {
    try {
      setRemoveIndex(index);
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.put(
        `/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = res.data.body.status;
      if (status) {
        getFollowers();
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRemoveIndex(null);
    }
  };

  const [blockedUser, setBlockedUser] = useState(null);
  const [blockLoader, setBlockLoader] = useState(false);

  const handleBlockUser = async () => {
    try {
      setBlockLoader(true);
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post(
        `/user/block`,
        {
          blocked_user_id: blockedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getFollowers();

      toast.success(res.data.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to block user");
    } finally {
      setBlockLoader(false);
      setBlockedUser(null);
      setBlockUserModal(false);
    }
  };

  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followLoader, setFollowLoader] = useState(false);

  const getFollowers = async (id = null) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(
        `user/follow-list/followers?user_id=${
          id || user._id || loggedUser._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFollowerList(res.data.body.list);

      const res1 = await axiosInstance.get(
        `user/follow-list/following?user_id=${
          id || user._id || loggedUser._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFollowingList(res1.data.body.list);
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.error || "Login failed.";
      toast.error(message);
    } finally {
      setFollowLoader(false);
    }
  };

  if (loader || followLoader) return <FullScreenLoader />;

  return (
    <div className="text-white my-6 mb-0 pb-9 px-1">
      <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-[auto] gap-4">
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
            {/* <span className="text-white truncate max-w-[190px] whitespace-nowrap overflow-hidden text-white text-sm">
              {capitalize(user?.fullname)}
              
            </span> */}
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:gap-10 gap-6 w-full flex-wrap mb-10">
        <div className="flex gap-10 items-center">
          <img
            src={user?.profile_picture || IMAGES.placeholderAvatar}
            alt="Profile"
            className="w-25 h-25 md:w-60 md:h-60 rounded-full object-cover bg-gray-900"
          />
          {/* Name and Followers for mobile device */}
          <div className="flex-col gap-2 min-w-[150px] flex sm:hidden">
            <div className="flex  gap-5">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setActiveTab("followers");
                  setOpenDrawer(true);
                }}
              >
                <p className="text-white text-xl font-bold">
                  {followerList.length}
                </p>
                <p className="text-xs text-grey">
                  {" "}
                  {followerList.length === 1 ? "Follower" : "Followers"}
                </p>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setActiveTab("following");
                  setOpenDrawer(true);
                }}
              >
                <p className="text-white text-xl font-bold">
                  {followingList.length}
                </p>
                <p className="text-xs text-grey">Following</p>
              </div>
            </div>
            {/* Buttons */}

            <div className="flex items-center gap-4 mt-2 flex sm:hidden">
              {!userId ? (
                <CustomButton
                  onClick={() => navigate(`/user/profile/edit`)}
                  className="w-auto py-3 px-5"
                  text="Edit Profile"
                  type="button"
                />
              ) : (
                <>
                  <CustomButton
                    className="w-auto py-0"
                    text=""
                    type="button"
                    style={{ width: 42, height: 42, borderRadius: 42 }}
                    icon={
                      <Icon
                        icon="token:chat"
                        style={{ width: "21px", height: "21px" }}
                      />
                    }
                  />

                  <CustomButton
                    className="w-auto py-2 px-5"
                    text={
                      user?.iFollow === "accept"
                        ? "Following"
                        : user?.iFollow === "pending"
                        ? "Request Pending"
                        : "Follow"
                    }
                    type="button"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full mt-3 sm:mt-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 flex-wrap w-full justify-between">
            {/* Name and Followers */}
            <div className=" hidden sm:flex flex-col gap-2 min-w-[150px]">
              <h5 className="text-lg font-semibold  max-w-[250px] whitespace-nowrap  text-white text-sm">
                {/* {state?.name || "Mariana Castro"} */}
                {capitalize(user?.fullname || "")?.length > 70
                  ? `${capitalize(user?.fullname || "").substring(0, 70)}...`
                  : capitalize(user?.fullname || "")}
              </h5>
              <div className="flex gap-10">
                <div
                  className="cursor-pointer "
                  onClick={() => {
                    setActiveTab("followers");
                    setOpenDrawer(true);
                    getFollowers();
                  }}
                >
                  <p className="text-white text-xl font-bold">
                    {followerList.length}
                  </p>

                  <p className="text-xs text-grey">
                    {" "}
                    {followerList.length === 1 ? "Follower" : "Followers"}
                  </p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setActiveTab("following");
                    setOpenDrawer(true);
                    getFollowers();
                  }}
                >
                  <p className="text-white text-xl font-bold">
                    {" "}
                    {followingList.length}
                  </p>
                  <p className="text-xs text-grey">Following</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center flex-wrap">
              {profileStats?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between border-r border-gray-900 last:border-none px-4 lg:px-13 md:px-8 sm:px-8"
                >
                  <span className="w-8 h-8">
                    <Icon
                      fontSize={28}
                      icon={item?.icon}
                      className="text-primary"
                    />
                  </span>
                  <p className="text-sm text-white mt-1">{item?.label}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="hidden sm:flex items-center gap-4 mt-2">
              {!userId ? (
                <CustomButton
                  onClick={() => navigate(`/user/profile/edit`)}
                  className="w-auto py-2 px-5"
                  text="Edit Profile"
                  type="button"
                />
              ) : (
                <>
                  <CustomButton
                    className="w-auto py-0"
                    onClick={() => {
                      localStorage.setItem(
                        "init_chat",
                        JSON.stringify(user._id)
                      );
                      navigate(`/user/chat`);
                    }}
                    text=""
                    type="button"
                    style={{ width: 42, height: 42, borderRadius: 42 }}
                    icon={
                      <Icon
                        icon="token:chat"
                        style={{ width: "21px", height: "21px" }}
                      />
                    }
                  />
                  <CustomButton
                    className="w-auto py-2 px-5"
                    text={
                      user?.iFollow === "accept"
                        ? "Unfollow"
                        : user?.iFollow === "pending"
                        ? "Cancel Request"
                        : "Follow"
                    }
                    type="button"
                    onClick={() => {
                      handleFollow();
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-[#1a1a1a] py-4 px-4 mt-6 rounded-lg w-full">
            <p className="text-base font-semibold text-grey">About</p>
            <p className="text-sm text-white mt-2">{user?.bio}</p>
          </div>
        </div>
      </div>

      <CustomTab
        activeTab={activeProfileTab}
        defaultValue="Feed"
        tabs={[
          {
            value: "Feed",
            label: `Feed (${posts.length})`,
            content: (
              <div>
                {!loader && pinnedPosts.length > 0 && (
                  <>
                    <h6 className="flex text-white text-l font-bold items-center gap-2 mb-3">
                      <Icon
                        icon="tabler:pin"
                        style={{ width: "21px", height: "21px" }}
                      />{" "}
                      Pinned Posts
                    </h6>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 border-b-5 border-gray-900 pb-10 mb-5">
                      {loader ? (
                        <Loader2 className="animate-spin text-white w-12 h-12" />
                      ) : (
                        <>
                          {pinnedPosts?.slice(0, 5).map((item, index) => {
                            return (
                              <ProfilePostCard
                                key={index}
                                item={{
                                  ...item,
                                  likes: item.likesCount,
                                  comments: item.commentsCount,
                                }}
                                to={`/user/profile/${item._id}/post/${item?._id}`}
                              />
                            );
                          })}
                          {!loader && pinnedPosts.length === 0 && (
                            <NoDataPlaceholder />
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}

                <h6 className="text-white text-l font-bold mb-4">Posts</h6>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {loader ? (
                    <Loader2 className="animate-spin text-white w-12 h-12" />
                  ) : (
                    <>
                      {posts?.map((item, index) => {
                        return (
                          <ProfilePostCard
                            key={index}
                            item={{
                              ...item,
                              likes: item.likesCount,
                              comments: item.commentsCount,
                            }}
                            to={`/user/profile/${item?._id}/post/${item?._id}`}
                          />
                        );
                      })}
                      {!loader && posts.length === 0 && <NoDataPlaceholder />}
                    </>
                  )}
                </div>
              </div>
            ),
          },
          {
            value: "Workouts",
            label: `Workouts (${workouts.length})`,
            content: (
              <div>
                {/* Pinned Workouts */}
                {!loader && pinnedWorkouts.length > 0 && (
                  <>
                    <h6 className="flex text-white text-l font-bold items-center gap-2 mb-3">
                      <Icon icon="tabler:pin" className="w-5 h-5" />
                      Pinned Workouts
                    </h6>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 border-b border-gray-900 pb-6 mb-6">
                      {pinnedWorkouts.slice(0, 5).map((workout, index) => (
                        <WorkoutComponent
                          visibility={workout.visibility}
                          is_draft={workout.is_draft}
                          key={index}
                          image={workout.thumbnail}
                          title={workout.title}
                          price={workout.fees > 0 ? `$${workout.fees}` : ""}
                          duration={totalWorkoutDuration(workout.exercises)}
                          weeks={getMaxWeek(workout?.exercises, "week")}
                          onViewClick={() => {
                            localStorageService.setItem(
                              "profile_active_tab",
                              "Workouts"
                            );
                            navigate(`/user/workouts/workout-details`, {
                              state: workout,
                            });
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* All Workouts */}
                <div className="mb-4">
                  <h6 className="text-white text-l font-bold">Workouts</h6>
                </div>

                <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {loader ? (
                    <Loader2 className="animate-spin text-white w-12 h-12" />
                  ) : (
                    <>
                      {workouts.map((workout, index) => (
                        <WorkoutComponent
                          visibility={workout.visibility}
                          is_draft={workout.is_draft}
                          key={index}
                          image={workout.thumbnail}
                          title={workout.title}
                          price={workout.fees > 0 ? `$${workout.fees}` : ""}
                          duration={totalWorkoutDuration(workout.exercises)}
                          weeks={getMaxWeek(workout?.exercises, "week")}
                          onViewClick={() => {
                            localStorageService.setItem(
                              "profile_active_tab",
                              "Workouts"
                            );
                            navigate(`/user/workouts/workout-details`, {
                              state: workout,
                            });
                          }}
                        />
                      ))}

                      {!loader && workouts.length === 0 && (
                        <NoDataPlaceholder />
                      )}
                    </>
                  )}
                </div>
              </div>
            ),
          },
        ]}
        customClass="customTab"
      />

      {/* follower/following Drawer */}
      <DrawerSidebar
        title={user.fullname}
        submitText="Done"
        cancelText="Cancel"
        onSubmit={() => console.log("Notification Submitted")}
        open={openDrawer}
        setOpen={setOpenDrawer}
        showFooter={false}
        className="drawer-override"
      >
        <div className="p-4">
          <TextInput
            placeholder="Search by name..."
            value={searchText}
            onChange={(e: any) => {
              setSearchText(e.target.value);
            }}
            type="text"
            icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
            className="mb-3"
          />

          {!followLoader && (
            <>
              <div className="flex items-center justify-between border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("followers")}
                  className={`text-sm font-semibold py-4 w-1/2 cursor-pointer border-b-2  ${
                    activeTab === "followers"
                      ? "border-primary text-primary"
                      : "border-transparent text-white/60"
                  }`}
                >
                  {followerList.length} Followers
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`text-sm font-semibold py-4 w-1/2 cursor-pointer border-b-2  ${
                    activeTab === "following"
                      ? "border-primary text-primary"
                      : "border-transparent text-white/60"
                  }`}
                >
                  {followingList.length} Following
                </button>
              </div>

              <div>
                {(activeTab === "followers"
                  ? followerList.filter((item) =>
                      item.fullname
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    )
                  : followingList.filter((item) =>
                      item.fullname
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    )
                ).map((follower_, index) => (
                  <div
                    key={follower_._id}
                    className="flex items-center justify-between gap-4 border-b border-gray-800 py-4"
                  >
                    {/* Avatar */}
                    <img
                      src={
                        follower_.profile_picture || IMAGES.placeholderAvatar
                      } // ← replace with actual image if available
                      alt={follower_.fullname}
                      className="max-w-10 min-w-10 h-10  rounded-full object-cover cursor-pointer transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-primary/50"
                      onClick={() => {
                        setOpenDrawer(false);
                        navigate("/user/profile/", {
                          ...(follower_._id !== loggedUser._id && {
                            state: { id: follower_._id },
                          }),
                        });
                      }}
                    />

                    {/* Info & Buttons */}
                    <div className="flex items-center justify-between w-full gap-3">
                      {/* Name & Follower Count */}
                      <div>
                        <p
                          className="text-white text-sm font-medium mb-1 cursor-pointer transition-all duration-200 hover:text-primary"
                          onClick={() => {
                            setOpenDrawer(false);
                            navigate("/user/profile/", {
                              ...(follower_._id !== loggedUser._id && {
                                state: { id: follower_._id },
                              }),
                            });
                          }}
                        >
                          {follower_.fullname}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {follower_.followerCount} followers
                        </p>
                      </div>

                      {/* Buttons */}

                      {loggedUser._id == user._id &&
                        (activeTab === "following" ? (
                          <div className="flex items-center gap-2">
                            <button
                              className="text-xs font-semibold py-2 rounded-full transition-all cursor-pointer bg-primary text-black px-4 hover:bg-primary/80"
                              onClick={() => {
                                removeIndex != index &&
                                  unfollowUser(follower_._id, `${index}-un`);
                              }}
                            >
                              {removeIndex === `${index}-un`
                                ? "Unfollowing"
                                : "Unfollow"}
                            </button>
                            <button
                              onClick={() => {
                                setBlockedUser(follower_);
                                setBlockUserModal(true);
                              }}
                              className="text-xs font-semibold w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer bg-primary text-black hover:bg-primary/80"
                            >
                              <Icon
                                icon="icons8:remove-user"
                                color="black"
                                className="w-5 h-5"
                              />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              removeIndex != index &&
                              removeFollower(follower_._id, `${index}-rm`)
                            }
                            className="text-xs font-semibold py-2 rounded-full transition-all cursor-pointer bg-primary text-black px-4 hover:bg-primary/80"
                          >
                            {removeIndex === `${index}-rm`
                              ? "removing"
                              : "Remove"}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {followLoader && (
          <Loader2 className="animate-spin text-white w-12 h-12" />
        )}
      </DrawerSidebar>

      {/* Modal */}
      <CustomModal
        title="Block User"
        open={blockUserModal}
        setOpen={setBlockUserModal}
        onCancel={() => {
          !blockLoader && setBlockUserModal(false);
        }}
        onSubmit={() => {
          !blockLoader && handleBlockUser();
        }}
        submitText={blockLoader ? "Blocking" : "Yes I’m Sure"}
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Block User?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to block user ?
            </p>
          </div>
        }
      />
    </div>
  );
};

export default UserProfile;
