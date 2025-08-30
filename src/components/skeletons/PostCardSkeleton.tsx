import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PostCardSkeleton = () => {
  return (
    <div className="bg-black text-white p-3 rounded-xl space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Skeleton circle height={50} width={50} />
          <div className="space-y-1">
            <Skeleton width={100} height={14} />
            <Skeleton width={60} height={12} />
          </div>
        </div>
        <Skeleton width={20} height={20} />
      </div>

      {/* Image Slider Area */}
      <Skeleton height={230} className="rounded-xl" />

      {/* Dots */}
      <div className="flex gap-2 justify-start pl-2 mt-1">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} circle width={8} height={8} />
        ))}
      </div>

      {/* Like & Comment Count */}
      {/* <div className="flex justify-end items-end gap-2 pr-2">
        <Skeleton circle width={32} height={32} />
        <Skeleton circle width={50} height={50} />
      </div> */}

      {/* Liked by & Caption */}
      <Skeleton width={200} height={12} />
      <Skeleton count={1} />

      {/* Show More button */}
      <Skeleton width={80} height={12} />

      {/* Comment input */}
      <div className="flex items-center bg-[#2a2a2a] px-3 py-2 rounded-full gap-2">
        <Skeleton circle height={24} width={24} />
        <Skeleton height={28} width={"100%"} />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
