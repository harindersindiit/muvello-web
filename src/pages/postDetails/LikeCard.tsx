import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { IMAGES } from "@/contants/images";

const LikeCard = ({ details }: { details: any }) => {
  const { user } = useUser();
  const iFollow = details?.iFollow;

  const followStatus =
    iFollow === "accept"
      ? "Following"
      : iFollow === "pending"
      ? "Request Pending"
      : "Follow";

  return (
    <div
      key={details?.id}
      className="flex items-center justify-between gap-4 mb-0"
    >
      <Link
        to="/user/profile"
        {...(details?._id !== user._id && {
          state: { id: details._id },
        })}
      >
        <img
          src={details?.profile_picture || IMAGES.placeholderAvatar}
          alt={details?.fullname}
          className="max-w-10 min-w-10 h-10 rounded-full object-cover"
        />
      </Link>

      {/* Left side: Image + Info */}
      <div className="flex items-center gap-3 justify-between w-full border-b border-gray-800 py-4">
        <Link
          to="/user/profile"
          {...(details?._id !== user._id && {
            state: { id: details._id },
          })}
        >
          <p className="text-white text-sm font-medium mb-1">
            {details?.fullname}
          </p>
          <p className="text-gray-400 text-xs">
            {details?.followerCount} Followers
          </p>
        </Link>

        {user._id !== details?._id && followStatus !== "Follow" && (
          <button
            className={`text-xs font-semibold py-2 mr-5 rounded-full transition-all cursor-pointer 
              ${
                iFollow === "accept"
                  ? "bg-primary text-black px-6 hover:bg-primary/80"
                  : "border border-primary px-4 text-primary hover:bg-primary/10"
              }`}
          >
            {followStatus}
          </button>
        )}
      </div>
    </div>
  );
};

export default LikeCard;
