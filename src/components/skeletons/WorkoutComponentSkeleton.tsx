const WorkoutComponentSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse bg-lightdark p-2">
      {/* Image skeleton */}
      <div className="relative mb-3">
        <div className="w-full h-48 bg-gray-700 rounded-t-[15px]" />

        {/* Overlay skeleton */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />

        {/* Price tag */}
        <div className="absolute bottom-0 left-0 px-2 py-1 bg-white rounded-r-[10px] w-16 h-6" />
      </div>

      {/* Text and button row */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-600 rounded w-28" />
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 bg-gray-500 rounded" />
            <div className="h-3 bg-gray-600 rounded w-12" />
            <div className="w-4 h-4 bg-gray-500 rounded ml-2" />
            <div className="h-3 bg-gray-600 rounded w-10" />
          </div>
        </div>
        <div className="bg-gray-700 rounded w-16 h-8" />
      </div>
    </div>
  );
};

export default WorkoutComponentSkeleton;
