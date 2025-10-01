import { IMAGES } from "@/contants/images";
import { Checkbox } from "../ui/checkbox";
import { Icon } from "@iconify/react";
interface ExerciseComponentProps {
  image: string;
  title: string;
  sets?: number;
  reps?: string | number;
  rest?: string | number;
  category?: string;
  modified?: boolean;
  className?: string;
  checkbox?: boolean;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  showEditDelete?: boolean;
  progress?: number; // e.g. 0 to 100
  label?: string; // e.g. "Completed", "In progress"
  progressShow?: boolean;
  total?: number; // e.g. 100
  onClick?: () => void;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

const ExerciseComponent = ({
  image,
  title,
  sets,
  reps,
  rest,
  category,
  modified,
  className,
  checkbox,
  progress,
  label,
  progressShow,
  total,
  onClick,
  onImageLoad = () => {},
  onImageError = () => {},
}: ExerciseComponentProps) => {
  const progPercentage = progress && total ? (progress / total) * 100 : 0;

  const getColorClass = () => {
    if (progPercentage === 100) return "bg-lime-400";
    if (progPercentage === 0) return "bg-red-500";
    return "bg-yellow-400";
  };

  const getTextColor = () => {
    if (progPercentage === 100) return "text-lime-400";
    if (progPercentage === 0) return "text-red-500";
    return "text-gray-300";
  };

  return (
    <div
      className={`bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 ${className}`}
    >
      <div className={`text-white items-center flex gap-4`}>
        <div
          className="w-2/5 relative overflow-hidden hover:scale-105 transition-all duration-300 hover:cursor-pointer"
          onClick={onClick}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-[140px] rounded-lg object-cover"
            onLoad={onImageLoad}
            onError={onImageError}
          />
          {category && (
            <span className="absolute bottom-0 left-0 bg-white text-[#33a100] text-xs font-semibold px-2 py-1 rounded-tr-xl rounded-bl-xl">
              {category}
            </span>
          )}
          {modified && (
            <span className="absolute text-center bottom-0 rounded-b-lg right-0 left-0 w-full bg-white text-green text-xs font-semibold px-2 py-1">
              Modified
            </span>
          )}
        </div>

        <div className="w-3/5 flex flex-col gap-3 hover:cursor-pointer">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-lg truncate whitespace-nowrap overflow-hidden w-full text-left">
              {title}
            </h4>
            {checkbox && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  className="cursor-pointer text-black border-grey"
                />
                <label htmlFor="terms"></label>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                <Icon
                  icon="material-symbols:stacked-line-chart"
                  className="w-3 h-3"
                />
              </div>
              <span className="text-sm">Sets: {sets}</span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold">10</span>
              </div>
              <span className="text-sm">Reps: {reps}</span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <img src={IMAGES.clock} alt="Clock" className="w-4 h-4" />
              <span className="text-sm">Rest/Set: {rest}</span>
            </div>
          </div>
        </div>
      </div>

      {progressShow && (
        <div className="flex items-center w-full mt-2">
          {/* Play icon */}
          {/* <Icon
            icon="ph:play-fill" // any play icon you like
            fontSize={18}
            className="mr-2 flex-shrink-0 text-white/80"
          /> */}

          {/* Progress bar */}
          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`${getColorClass()} h-full rounded-full transition-all duration-500`}
              style={{ width: `${progPercentage}%` }}
            />
          </div>

          {/* Status text */}
          <span
            className={`ml-3 flex-shrink-0 text-xs font-medium ${getTextColor()}`}
          >
            {label || `${progPercentage}%`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ExerciseComponent;
