import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import React from "react";

interface ProfilePostCardProps {
  index?: number;
  to: string;
  item: any;
}

const ProfilePostCard: React.FC<ProfilePostCardProps> = ({
  index,
  item,
  to,
}) => {
  const image = item.media.find((item) => item.type === "image");

  const thumbnail = image || item?.media[0];

  return (
    <div
      key={index}
      className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg border border-gray-700"
    >
      {thumbnail.type === "image" ? (
        <img
          src={thumbnail.url}
          alt="Workout"
          className="object-cover w-full h-56"
        />
      ) : (
        <video
          autoPlay={false}
          controls
          className="w-full max-w-md rounded-lg mb-4 h-56 object-cover"
          src={thumbnail.url}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
        />
      )}

      {/* Gradient overlay */}
      <Link
        to={to}
        state={item}
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
      />

      {/* Text content */}
      <div className="absolute bottom-4 left-4 flex items-center gap-6 text-white">
        <div className="flex items-center gap-1">
          <Icon
            icon="line-md:heart"
            style={{ width: "18px", height: "18px" }}
          />

          <span>{item?.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon
            icon="pajamas:comment-dots"
            style={{ width: "15px", height: "15px" }}
          />

          <span>{item?.comments}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;
