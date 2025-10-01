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
  const [visibleCount, setVisibleCount] = useState(5);
  const [replyInput, setReplyInput] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );

  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
    if (!showReplies) setVisibleCount(5);
  };

  const loadMoreReplies = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleReplySubmit = async () => {
    if (!replyInput.trim()) return;
    setIsReplySubmitting(true);
    await onAddReply(details._id, replyInput.trim());
    setReplyInput("");
    setShowReplyBox(false);
    setIsReplySubmitting(false);
  };

  const toggleCommentExpansion = () => {
    setIsCommentExpanded((prev) => !prev);
  };

  const toggleReplyExpansion = (replyId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  const COMMENT_LIMIT = 150;
  const isCommentLong = details.comment.length > COMMENT_LIMIT;
  const displayComment =
    isCommentLong && !isCommentExpanded
      ? details.comment.substring(0, COMMENT_LIMIT) + "..."
      : details.comment;

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

        <div className="mt-1">
          <p className="text-xs text-white/90 leading-snug break-all">
            {displayComment}
          </p>
          {isCommentLong && (
            <button
              onClick={toggleCommentExpansion}
              className="text-xs text-blue-400 cursor-pointer hover:text-primary transition mt-1"
            >
              {isCommentExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>

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
              className={`ml-2 text-xs px-3 py-1 rounded transition-all duration-200 ${
                isReplySubmitting || !replyInput.trim()
                  ? "text-gray-500 cursor-not-allowed opacity-50"
                  : "text-blue-400 hover:text-primary hover:bg-blue-400/10 cursor-pointer"
              }`}
            >
              {isReplySubmitting ? "Sending..." : "Send"}
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
                      <div className="mt-1">
                        <p className="text-xs text-white/90 leading-snug break-all">
                          {reply.comment.length > COMMENT_LIMIT &&
                          !expandedReplies.has(reply._id)
                            ? reply.comment.substring(0, COMMENT_LIMIT) + "..."
                            : reply.comment}
                        </p>
                        {reply.comment.length > COMMENT_LIMIT && (
                          <button
                            onClick={() => toggleReplyExpansion(reply._id)}
                            className="text-xs text-blue-400 cursor-pointer hover:text-primary transition mt-1"
                          >
                            {expandedReplies.has(reply._id)
                              ? "See less"
                              : "See more"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {details.replies.length > 5 &&
                  visibleCount < details.replies.length && (
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
