import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";

import { Card } from "@/components/ui/card";
import { IMAGES } from "@/contants/images";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useEffect } from "react";
import { capitalize } from "@/lib/utils";
import moment from "moment";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
interface PostCardProps {
  postImages?: string[];
  userName?: string;
  userAvatar?: string;
  timeAgo?: string;
  likes?: number;
  comments?: number;
  caption?: string;
  likedBy?: string;
  otherLikes?: number;
  item: any;
  posts: any[];
  // onFavourite?: () => void;
  // onUnfollow?: () => void;
  onViewProfile?: any;
  onReport?: any;
  setPosts?: any;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  // onFavourite = () => {},

  // onUnfollow = () => {},
  onViewProfile,
  onReport = () => {},
  setPosts = () => {},
  onImageLoad = () => {},
  onImageError = () => {},
  item,
  posts,
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // appendDots: (dots: React.ReactNode) => <ul className="list">{dots}</ul>,
  };

  useEffect(() => {
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);

  const [expanded, setExpanded] = useState(false);

  const isLong = item.caption.length > 100;
  const displayText = !isLong
    ? item.caption
    : expanded
    ? item.caption
    : item.caption.slice(0, 100) + "...";

  const likePost = async (id) => {
    setLoading(true);
    try {
      const updatedPosts = posts.map((p) => {
        if (p._id === id) {
          const hasLiked = p.meLiked;
          return {
            ...p,
            meLiked: !hasLiked,
            likesCount: hasLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      });

      setPosts(updatedPosts);

      const token = localStorageService.getItem("accessToken");
      const resExe = await axiosInstance.put(
        `/post/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state

      // toast.success(resExe.data.message);
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    setCommentLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.post(
        "/post/comment",
        {
          post_id: item._id,
          comment: commentInput.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Comment added");

      // Optionally update commentsCount locally
      const updatedPosts = posts.map((p) => {
        if (p._id === item._id) {
          return {
            ...p,
            commentsCount: (p.commentsCount || 0) + 1,
          };
        }
        return p;
      });

      setPosts(updatedPosts);
      setCommentInput("");
    } catch (err) {
      toast.error("Failed to post comment");
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.put(
        `/user/follow/${targetUserId}`,
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
      const updatedPosts = posts.map((post) =>
        post.user._id === targetUserId
          ? {
              ...post,
              user: {
                ...post.user,
                iFollow: status,
              },
            }
          : post
      );

      setPosts(updatedPosts);
    } catch (err) {
      console.error("Follow toggle error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="border-none pt-0 gap-2 text-white rounded-xl last:pb-0">
      {/* Header */}
      <div className=" relative">
        <div className="flex justify-between items-center absolute top-0 left-0 right-0 p-3 z-10">
          <Link
            to="/user/profile"
            state={{ id: item.user_id }}
            className="flex items-center gap-3"
          >
            <Avatar className=" w-[50px] h-[50px] overflow-hidden">
              <AvatarImage
                src={item.user.profile_picture || IMAGES.placeholderAvatar}
                className="rounded-full w-[50px] h-[50px] object-cover"
              />
              <AvatarFallback>{capitalize(item.user.fullname)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {capitalize(item.user.fullname)}
              </p>
              <span className="text-xs text-white">
                {moment(item.created_at).fromNow()}
              </span>
            </div>
          </Link>

          {item.user_id !== user._id && (
            <>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <MoreVertical className="text-gray-300" size={24} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="bg-black w-45 p-2 border-lightdark rounded-[12px]"
                    sideOffset={10}
                  >
                    <DropdownMenuItem className="text-white hover:text-primary mb-2">
                      <Link
                        to="#"
                        onClick={() => {
                          handleFollow(item.user._id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <img src={IMAGES.unfollow} alt="unfollow" />

                        {item.user.iFollow === "accept"
                          ? "Unfollow"
                          : item.user.iFollow === "pending"
                          ? "Cancel Request"
                          : "Follow"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-primary mb-2">
                      <button
                        onClick={() => onViewProfile(item.user._id)}
                        className="flex items-center gap-2"
                      >
                        <img src={IMAGES.viewprofile} alt="view profile" />
                        View Profile
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-primary mb-2">
                      <Link
                        to="#"
                        onClick={() => onReport(item.user)}
                        className="flex items-center gap-2"
                      >
                        <img src={IMAGES.flag} alt="flag" />
                        Report
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="rounded-t-xl overflow-hidden">
            <Slider {...settings}>
              {item.media.map((img, idx) => (
                <div key={idx} className="relative h-[350px]">
                  {img.type === "image" ? (
                    <img
                      src={img.url}
                      alt="Post"
                      className="w-full h-[350px] object-cover rounded-t-xl"
                      onLoad={onImageLoad}
                      onError={onImageError}
                    />
                  ) : (
                    <video
                      controls
                      className="w-full h-[350px] object-cover rounded-t-xl"
                      src={img.url}
                      controlsList="nodownload"
                      disablePictureInPicture
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-t-xl pointer-events-none" />
                </div>
              ))}
            </Slider>
          </div>
          {/* Comment Count */}
          <div className="absolute bottom-18 right-3 flex flex-col items-center gap-2 z-20">
            <div
              onClick={() =>
                navigate(
                  `/user/profile/${item.user._id}/post/${item.user._id}`,
                  { state: { ...item, tab_type: "comments" } }
                )
              }
              className="px-2 cursor-pointer py-1 flex-col justify-center items-center rounded-full flex  text-xs text-white"
            >
              <MessageCircle size={18} className="mb-2" /> {item.commentsCount}
            </div>

            {/* Like Count */}
            <div
              className="bg-[#94eb00] cursor-pointer flex flex-col justify-center items-center text-center text-black text-sm font-semibold px-2 py-4 rounded-[24px]"
              onClick={() => likePost(item._id)}
            >
              <Heart
                size={18}
                className={`inline mb-1 ${
                  item.meLiked ? "text-red-500 fill-red-500" : ""
                }`}
              />{" "}
              {item.likesCount}
            </div>
          </div>
        </div>
      </div>

      {/* Likes & Caption */}
      {/* <div className="text-xs text-gray-400 ">
        Liked by <b className="text-white font-normal">thekamraan</b> and{" "}
        <b className="text-white font-normal">2096 others</b>
      </div> */}

      <div className="text-xs text-gray-400">
        {item.meLiked && item.likesCount === 1 ? (
          <>You liked this</>
        ) : item.meLiked &&
          item.likesCount === 2 &&
          Object.keys(item.latestOtherLiker).length > 1 ? (
          <>
            You and{" "}
            <b className="text-white font-normal">
              {item.latestOtherLiker.fullname}
            </b>{" "}
            liked this
          </>
        ) : Object.keys(item.latestOtherLiker).length > 1 ? (
          <>
            Liked by{" "}
            <b className="text-white font-normal">
              {item.latestOtherLiker.fullname}
            </b>
            {item.likesCount > 1 && (
              <>
                {" "}
                and{" "}
                <b className="text-white font-normal">
                  {item.likesCount - 1}{" "}
                  {item.likesCount - 1 === 1 ? "other" : "others"}
                </b>
              </>
            )}
          </>
        ) : (
          <>Be the first to like this post</>
        )}
      </div>

      <p className="text-sm font-normal text-gray-300 leading-snug mb-2">
        {displayText}
        {item.caption.length > 100 && (
          <button
            className="text-blue cursor-pointer text-sm ml-1"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </p>

      {/* Comment Input */}
      {/* <div className="flex items-center bg-[#2a2a2a] px-3 py-2 rounded-full">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage src="https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg" />
          <AvatarFallback>JR</AvatarFallback>
        </Avatar>
        <input
          type="text"
          placeholder="Add a comment..."
          className="bg-transparent py-2 placeholder:text-sm placeholder:font-normal text-sm text-white placeholder:text-gray-400 w-full outline-none"
        />
      </div> */}

      <div className="flex items-center bg-[#2a2a2a] px-3 py-2 rounded-full">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage
            src={user?.profile_picture || IMAGES.placeholderAvatar}
          />
          <AvatarFallback>JR</AvatarFallback>
        </Avatar>
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddComment();
            }
          }}
          className="bg-transparent py-2 placeholder:text-sm placeholder:font-normal text-sm text-white placeholder:text-gray-400 w-full outline-none"
          disabled={commentLoading}
        />
        {commentLoading ? (
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
        ) : (
          <button
            className={`text-sm ml-2 transition-colors duration-200 rounded-full px-3 py-1
              ${
                commentInput.trim()
                  ? "text-primary hover:bg-[#94eb00]/10 hover:text-white cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }
            `}
            onClick={handleAddComment}
            disabled={!commentInput.trim()}
          >
            Post
          </button>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
