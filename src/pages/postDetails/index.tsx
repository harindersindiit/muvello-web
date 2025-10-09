import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Checkbox } from "@/components/ui/checkbox";
import CommentCard from "./CommentCard";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import { Icon } from "@iconify/react";
import LikeCard from "./LikeCard";
import { MoreHorizontal } from "lucide-react";
import TextInput from "@/components/customcomponents/TextInput";
import { useEffect, useState } from "react";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance"; // Your axios wrapper with auth
import { toast } from "react-toastify";

import { CustomModal } from "@/components/customcomponents/CustomModal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import FullScreenLoader from "@/components/ui/loader";
import { useUser } from "@/context/UserContext";
import AddPost from "@/components/customcomponents/AddPost";
import NoDataPlaceholder from "@/components/ui/nodata";
import { IMAGES } from "@/contants/images";

const PostDetails = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [activeTab, setActiveTab] = useState("likes");

  useEffect(() => {
    if (state.tab_type && state.tab_type === "comments") {
      setActiveTab("comments");
    }
  }, [state]);
  const [openShare, setOpenShare] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [loader, setLoader] = useState(false);
  const [fullLoader, setFullLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [likes, setLikes] = useState([]);
  const [likesPage, setLikesPage] = useState(1);
  const [likesTotalPages, setLikesTotalPages] = useState(1);
  const [totalLikes, setTotalLikes] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentsTotalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const [commentInput, setCommentInput] = useState("");
  const [commentSubmitLoading, setCommentSubmitLoading] = useState(false);

  const [postDrawer, setPostDrawer] = useState(false);

  const [updatedCaption, setUpdatedCaption] = useState("");
  const [isLiked, setIsLiked] = useState(state?.meLiked || false);
  const [likeCount, setLikeCount] = useState(state?.likesCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("custom-override");
    getLikes();
    getComments();
    return () => document.body.classList.remove("custom-override");
  }, []);

  // useEffect(() => {
  //   if (activeTab === "comments") getComments(1);
  //   if (activeTab === "likes") getLikes(1);
  // }, [activeTab]);

  const settings = {
    dots: state.media.length > 1,
    infinite: state.media.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true, // enable auto loop
    //autoplaySpeed: 3000, // 3 seconds delay between slides
    pauseOnHover: false, // optional: pause on hover
  };
  const handleDeletePost = async () => {
    setLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const resExe = await axiosInstance.delete(`/post/${state?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/user/profile", {
        replace: true,
      });
      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  const getLikes = async (page = 1, limit = 10) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(
        `/post/likes/${state?._id}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { likes, pagination } = res.data.body;

      setTotalLikes(pagination.total);
      setLikes((prev) => (page === 1 ? likes : [...prev, ...likes]));
      setLikesPage(Number(pagination.page));
      setLikesTotalPages(pagination.totalPages);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    }
  };

  const getComments = async (page = 1) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(`/post/comments/${state?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10 }, // adjust limit if needed
      });

      const { comments, pagination } = res.data.body;

      setTotalComments(pagination.total);
      setComments((prev) => (page === 1 ? comments : [...prev, ...comments]));
      setCommentPage(Number(pagination.page));
      setTotalPages(pagination.totalPages);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  const handlePinPost = async () => {
    setFullLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const resExe = await axiosInstance.put(
        `/post/pin/${state?._id}`,
        {
          is_pinned: !state?.is_pinned,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/user/profile", {
        replace: true,
      });
      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setFullLoader(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    setCommentSubmitLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post(
        `/post/comment`,
        {
          post_id: state?._id,
          comment: commentInput,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message);

      const newComment = res.data.body.data[0];

      // Add new comment to top of comment list
      setComments((prev) => [newComment, ...prev]);
      setTotalComments((prev) => prev + 1);
      setCommentInput(""); // Clear input
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to add comment.";
      toast.error(message);
    } finally {
      setCommentSubmitLoading(false);
    }
  };

  const handleAddReply = async (parentCommentId: string, replyText: string) => {
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.post(
        `/post/comment`,
        {
          comment: replyText,
          post_id: state?._id,
          parent_id: parentCommentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedReplies = res.data.body.data[0].replies;

      console.group(updatedReplies);
      // return;
      setTotalComments((prev) => prev + 1);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === parentCommentId
            ? { ...comment, replies: updatedReplies }
            : comment
        )
      );
    } catch (err) {
      console.error("Failed to add reply", err);
    }
  };

  const handleLikePost = async () => {
    if (likeLoading) return;

    setLikeLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.put(
        `/post/like/${state?._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      setTotalLikes((prev) => (isLiked ? prev - 1 : prev + 1));

      // Refresh likes data to get updated list
      await getLikes(1);

      toast.success(res.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setLikeLoading(false);
    }
  };

  // const LikeCard = ({ comment }) => {
  //   return (
  //     <div className="flex items-center gap-4">
  //       <div className="w-10 h-10 rounded-full bg-gray-700" />
  //       <div>
  //         <p className="text-white text-sm font-medium">{comment.fullname}</p>
  //         <p className="text-gray-400 text-xs">
  //           {comment.followerCount} followers
  //         </p>
  //       </div>
  //     </div>
  //   );
  // };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      if (activeTab === "likes" && likesPage < likesTotalPages) {
        getLikes(likesPage + 1);
      }

      if (activeTab === "comments" && commentPage < commentsTotalPages) {
        getComments(commentPage + 1);
      }
    }
  };

  const shareToGroups = async () => {
    if (selectedGroups.length === 0) return;
    // setLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const data = {
        groups: selectedGroups.map((g) => g._id),
        post_id: state._id.toString(),
      };
      const resExe = await axiosInstance.post(`/group/share-to-groups`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // navigate("/user/profile", {
      //   replace: true,
      // });
      setSelectedGroups([]);
      toast.success(resExe.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      // setLoader(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const allSelected =
    selectedGroups.length === groups.length && groups.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups);
    }
  };

  const fetchGroups = async () => {
    // setIsLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get("group", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { body } = res.data;
      setGroups(body.groups || []);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Fetching groups failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups?.filter((group) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGroup = (group: any) => {
    const exists = selectedGroups.find((g) => g._id === group._id);
    if (exists) {
      setSelectedGroups(selectedGroups.filter((g) => g._id !== group._id));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  return (
    <div className="text-white my-6 mb-0 pb-9 px-1">
      {fullLoader && <FullScreenLoader />}

      <div className="grid grid-cols-1 md:grid-cols-auto lg:grid-cols-2 xl:grid-cols-3  gap-2 text-white">
        {/* Left side - Image */}
        <div className="md:col-span-12 lg:col-span-1 xl:col-span-2 relative overflow-hidden rounded-lg">
          <Slider {...settings}>
            {state.media.map((item) => {
              console.log("Media Items:", state.media);
              return item.type === "image" ? (
                <img
                  src={item.url}
                  alt="Workout"
                  className="w-full h-[380px] md:h-[680px] object-contain rounded-l"
                />
              ) : (
                <video
                  autoPlay={true}
                  controls
                  className="w-full max-w- h-[680px] rounded-lg mb-9 object-contain"
                  src={item.url}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                />
              );
            })}
          </Slider>

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-black/70 rounded-full p-2 cursor-pointer"
          >
            <Icon icon="mdi:arrow-left" className="text-white text-2xl" />
          </button>

          {user._id === state?.user_id && (
            <button className="absolute top-4 right-4 bg-black/70 rounded-full p-2">
              {/* <Icon icon="mdi:dots-horizontal" className="text-white text-2xl" /> */}
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <MoreHorizontal className="text-gray-300" size={24} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="bg-black w-45 p-2 border-lightdark rounded-[12px]"
                    sideOffset={10}
                  >
                    {/* <DropdownMenuItem className="text-white hover:text-primary mb-2">
                    <Link
                      to="javascript:void(0)"
                      onClick={() => {}}
                      className="flex items-center gap-2"
                    >
                      <Icon
                        icon="solar:bookmark-outline"
                        style={{ width: "18px", height: "18px" }}
                      />
                      Favourite
                    </Link>
                  </DropdownMenuItem> */}
                    <DropdownMenuItem className="text-white hover:text-primary mb-2">
                      <Link
                        to="javascript:void(0)"
                        onClick={() => handlePinPost()}
                        className="flex items-center gap-2"
                      >
                        <Icon
                          icon="tabler:pin"
                          style={{ width: "18px", height: "18px" }}
                        />{" "}
                        {state?.is_pinned ? "Unpin" : "Pin"} Post
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-primary mb-2">
                      <Link
                        to="javascript:void(0)"
                        onClick={() => setOpenShare(true)}
                        className="flex items-center gap-2"
                      >
                        <Icon
                          icon="ph:paper-plane-tilt-light"
                          style={{ width: "18px", height: "18px" }}
                        />{" "}
                        Share
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-primary mb-2">
                      <Link
                        to="javascript:void(0)"
                        onClick={() => {
                          setPostDrawer(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Icon
                          icon="mynaui:edit"
                          style={{ width: "18px", height: "18px" }}
                        />{" "}
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-primary mb-2">
                      <Link
                        to="javascript:void(0)"
                        onClick={() => {
                          setDeleteModal(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Icon
                          icon="hugeicons:delete-03"
                          style={{ width: "18px", height: "18px" }}
                        />{" "}
                        Delete
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </button>
          )}

          <div className="mt-4">
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">
                    Posted by{" "}
                    <span className="text-white font-medium">
                      {state.user?.fullname}
                    </span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(state.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Like Button */}
                <button
                  onClick={handleLikePost}
                  disabled={likeLoading}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-200 text-lg ${
                    isLiked
                      ? "bg-lime-500/20 text-black-400 hover:bg-lime-500/30"
                      : "bg-gray-700/50 text-black-300 hover:bg-gray-600/50"
                  } ${
                    likeLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <Icon
                    icon={isLiked ? "line-md:heart-filled" : "line-md:heart"}
                    className={`text-2xl ${
                      isLiked ? "text-lime-400" : "text-gray-400"
                    }`}
                  />
                  <span className="text-lg font-semibold">
                    {likeLoading ? "..." : likes.length}
                  </span>
                </button>
              </div>
            </div>
            <p className="text-white text-sm font-medium mb-1">
              {updatedCaption || state.caption}
            </p>
          </div>
        </div>

        {/* Right side - Comments */}
        <div className="bg-[#111] md:col-span-12 lg:col-span-1 xl:col-span-1 rounded-lg flex flex-col justify-between h-[680px]">
          {/* Tabs */}
          <div className="px-2 border-b border-gray-800 flex gap-6 text-sm justify-between">
            <button
              className={`text-gray-400 py-4 justify-center cursor-pointer text-xs px-2 font-medium border-b-2 w-1/2 flex items-center gap-1 ${
                activeTab === "likes"
                  ? "text-lime-400 border-lime-400"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("likes")}
            >
              <Icon
                icon="line-md:heart"
                style={{ width: "18px", height: "18px" }}
              />
              Likes ({totalLikes})
            </button>
            <button
              className={`text-gray-400 text-xs py-4 justify-center cursor-pointer px-2 font-medium border-b-2 w-1/2 flex items-center gap-1 ${
                activeTab === "comments"
                  ? "text-lime-400 border-lime-400"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("comments")}
            >
              <Icon
                icon="pajamas:comment-dots"
                style={{ width: "15px", height: "15px" }}
              />{" "}
              Comments ({totalComments})
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto scrollCustom scrollCustom1 px-4 space-y-4 mt-3 pb-6"
            onScroll={handleScroll}
          >
            {activeTab === "likes" &&
              likes.map((c, i) => <LikeCard key={i} details={c} />)}

            {activeTab === "likes" && likes.length === 0 && (
              <NoDataPlaceholder />
            )}

            {activeTab === "comments" &&
              comments.map((c, i) => (
                <CommentCard key={i} details={c} onAddReply={handleAddReply} />
              ))}

            {activeTab === "comments" && comments.length === 0 && (
              <NoDataPlaceholder />
            )}
          </div>

          {activeTab === "comments" && (
            <div className="border-t border-gray-800 p-3">
              <div className="flex items-center bg-[#222] rounded-full px-4 py-2">
                <img
                  src={user?.profile_picture || IMAGES.placeholderAvatar}
                  alt="You"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  placeholder="Add a comment..."
                  className="bg-transparent text-sm text-white outline-none flex-1 placeholder:text-gray-400"
                  disabled={commentSubmitLoading}
                />
                <button
                  disabled={commentSubmitLoading || !commentInput.trim()}
                  onClick={handleAddComment}
                  className={`ml-2 text-sm px-3 py-1 rounded transition-all duration-200 ${
                    commentSubmitLoading || !commentInput.trim()
                      ? "text-gray-500 cursor-not-allowed opacity-50"
                      : "text-primary hover:text-blue-400 hover:bg-primary/10 cursor-pointer"
                  }`}
                >
                  {commentSubmitLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CustomModal
        disabled={loader}
        title="Add Exercise"
        submitText="Yes I'm Sure"
        open={deleteModal}
        setOpen={setDeleteModal}
        onCancel={() => setDeleteModal(false)}
        onSubmit={() => handleDeletePost()}
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Delete Post?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to delete this Post?
            </p>
          </div>
        }
      />

      <DrawerSidebar
        title="Share"
        submitText="Share"
        cancelText="Cancel"
        onSubmit={() => {
          if (selectedGroups.length === 0) return;
          shareToGroups();
          setOpenShare(false);
        }}
        onCancel={() => {
          setOpenShare(false);
        }}
        open={openShare}
        setOpen={setOpenShare}
        showFooter={true}
        className="drawer-override"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h6 className="text-white text-m font-medium">
              Select Groups {groups.length > 0 && `(${groups.length})`}
            </h6>
            <button
              className={`text-primary text-sm transition-colors duration-200 rounded px-2 py-1 ${
                allSelected
                  ? "hover:bg-red-500/20 hover:text-red-400"
                  : "hover:bg-[#94eb00]/20 hover:text-[#94eb00]"
              }`}
              onClick={toggleSelectAll}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          <TextInput
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
            className="mb-3"
          />

          {isLoading ? (
            <p className="text-white text-center py-6">Loading groups...</p>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group._id}
                className="flex items-center justify-between gap-4 mb-0"
                onClick={() => toggleGroup(group)}
              >
                <img
                  src={group.group_picture_url || IMAGES.groupPlaceholder}
                  alt={group.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex items-center gap-3 justify-between w-full border-b border-gray-800 py-4">
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      {group.name}
                    </p>
                    <p className="text-gray-400 text-xs">{group.followers}</p>
                  </div>
                  <Checkbox
                    id={`group-${group._id}`}
                    className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                    checked={selectedGroups.some((g) => g._id === group._id)}
                    // onCheckedChange={() => toggleGroup(group)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </DrawerSidebar>

      <AddPost
        onSuccess={(val) => {
          setUpdatedCaption(val);
        }}
        setPostDrawer={setPostDrawer}
        postDrawer={postDrawer}
        refreshPosts={() => {
          // navigate(-1);
        }}
        postDetails={{ ...state, caption: updatedCaption || state.caption }}
      />
    </div>
  );
};

export default PostDetails;
