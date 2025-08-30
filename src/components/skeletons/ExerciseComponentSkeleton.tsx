import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ExerciseComponentSkeleton = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <div className={`bg-lightdark rounded-xl p-3 ${className}`}>
      <div className="flex gap-3 items-center text-white">
        {/* Image skeleton with label areas */}
        <div className="w-1/3 relative">
          <Skeleton height={130} className="rounded-[10px]" />

          {/* Category label skeleton */}
          <div className="absolute bottom-0 left-0">
            <Skeleton width={60} height={20} />
          </div>

          {/* Modified label skeleton */}
          <div className="absolute bottom-0 left-0 right-0 text-center">
            <Skeleton width={"100%"} height={20} />
          </div>
        </div>

        {/* Right side */}
        <div className="w-2/3 flex flex-col gap-3">
          <div className="flex justify-between items-center gap-2">
            <Skeleton width={"60%"} height={16} />
            <Skeleton circle width={20} height={20} />
          </div>

          <div className="flex gap-2 items-center text-xs">
            <Skeleton circle width={16} height={16} />
            <Skeleton width={100} height={10} />
          </div>
          <div className="flex gap-2 items-center text-xs">
            <Skeleton circle width={16} height={16} />
            <Skeleton width={100} height={10} />
          </div>
          <div className="flex gap-2 items-center text-xs">
            <Skeleton circle width={16} height={16} />
            <Skeleton width={100} height={10} />
          </div>
        </div>
      </div>

      {/* Progress section */}
      <div className="mt-3 flex items-center justify-between">
        <Skeleton height={8} width="85%" borderRadius={999} />
        <Skeleton width={40} height={10} />
      </div>
    </div>
  );
};

export default ExerciseComponentSkeleton;
