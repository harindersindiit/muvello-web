import { IMAGES } from "@/contants/images";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const CommentCard = ({
  details,
  onAddReply,
}: {
  details: any;
  onAddReply: (commentId: string, replyText: string) => void;
}) => {
  const { user } = useUser();
  const [showReplies, setShowReplies] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const [replyInput, setReplyInput] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
    if (!showReplies) setVisibleCount(2);
  };

  const loadMoreReplies = () => {
    setVisibleCount((prev) => prev + 2);
  };

  const handleReplySubmit = async () => {
    if (!replyInput.trim()) return;
    setIsReplySubmitting(true);
    await onAddReply(details._id, replyInput.trim());
    setReplyInput("");
    setShowReplyBox(false);
    setIsReplySubmitting(false);
  };

  return (
    <div key={details._id} className="flex gap-3 mb-6">
      <Link
        to="/user/profile"
        {...(details.user._id !== user._id && {
          state: { id: details.user._id },
        })}
      >
        <img
          src={details.user.profile_picture || IMAGES.placeholderAvatar}
          className="w-9 h-9 rounded-full object-cover"
          alt={details.user.fullname}
        />
      </Link>

      <div className="w-full pr-5">
        <div className="flex items-center justify-between">
          <Link
            to="/user/profile"
            {...(details.user._id !== user._id && {
              state: { id: details.user._id },
            })}
          >
            <p className="font-semibold text-sm">{details.user.fullname}</p>
          </Link>
          <span className="text-xs text-gray-400">
            {moment(details.created_at).fromNow()}
          </span>
        </div>

        <p className="text-xs text-white/90 leading-snug mt-1 break-all">
          {details.comment}
        </p>

        {/* Toggle reply box */}
        <p
          className="text-xs text-gray-400 mt-1 cursor-pointer"
          onClick={() => setShowReplyBox((prev) => !prev)}
        >
          Reply
        </p>

        {showReplyBox && (
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleReplySubmit();
                }
              }}
              placeholder="Write a reply..."
              className="bg-transparent text-sm text-white outline-none border-b border-gray-600 flex-1"
              disabled={isReplySubmitting}
            />
            <button
              onClick={handleReplySubmit}
              disabled={isReplySubmitting || !replyInput.trim()}
              className="ml-2 text-xs text-blue-400 cursor-pointer hover:text-primary transition"
            >
              Send
            </button>
          </div>
        )}

        {/* Replies */}
        {details.replies?.length > 0 && (
          <>
            <p
              onClick={toggleReplies}
              className="text-xs text-grey mt-2 cursor-pointer"
            >
              {showReplies
                ? "---- Hide replies"
                : `---- View ${details.replies.length} ${
                    details.replies.length === 1 ? "reply" : "replies"
                  }`}
            </p>

            {showReplies && (
              <div className="mt-3 ml-6 space-y-4 ">
                {details.replies.slice(0, visibleCount).map((reply: any) => (
                  <div key={reply._id} className="flex gap-3 w-full">
                    <Link
                      to={`/user/profile`}
                      state={{
                        id: reply.user._id,
                      }}
                    >
                      <img
                        src={
                          reply.user.profile_picture || IMAGES.placeholderAvatar
                        }
                        className="w-7 h-7 rounded-full object-cover"
                        alt={reply.user.fullname}
                      />
                    </Link>

                    <div className="w-full">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to={`/user/profile`}
                          state={{
                            id: reply.user._id,
                          }}
                        >
                          <p className="text-sm font-semibold">
                            {reply.user.fullname}
                          </p>
                        </Link>
                        <span className="text-xs text-gray-400">
                          {moment(reply.created_at).fromNow()}
                        </span>
                      </div>
                      <p className="text-xs text-white/90 mt-1 leading-snug break-all">
                        {reply.comment}
                      </p>
                    </div>
                  </div>
                ))}

                {visibleCount < details.replies.length && (
                  <p
                    onClick={loadMoreReplies}
                    className="text-xs text-blue-400 cursor-pointer text-center underline"
                  >
                    Load more replies
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
