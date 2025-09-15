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
  onClickEdit,
  onClickDelete,
  showEditDelete,
  progress,
  label,
  progressShow,
  total,
  onClick,
  onImageLoad = () => {},
  onImageError = () => {},
}: ExerciseComponentProps) => {
  const progPercentage =
    progress && total ? ((progress / total) * 100).toFixed(2) : "0.00";

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
    <div className={`bg-lightdark rounded-xl p-3 ${className}`}>
      <div className={`text-white items-center flex gap-3 `}>
        <div className="w-1/3 relative overflow-hidden" onClick={onClick}>
          <img
            src={image}
            alt={title}
            className="w-full h-[130px] rounded-[10px] object-cover"
            onLoad={onImageLoad}
            onError={onImageError}
          />
          {category && (
            <span className="absolute bottom-0 left-0 bg-white text-[#33a100] text-xs font-semibold px-2 py-1 rounded-tr-xl rounded-bl-xl">
              {category}
            </span>
          )}
          {modified && (
            <span className="absolute text-center bottom-0 rounded-b-[10px] right-0 left-0 w-full bg-white text-green text-xs font-semibold px-2 py-1">
              Modified
            </span>
          )}
        </div>

        <div className="w-2/3 flex flex-col gap-3">
          <div className="flex justify-between">
            <h4 className="font-semibold text-base truncate whitespace-nowrap overflow-hidden w-full">
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
            {showEditDelete && (
              <div className="flex items-center space-x-2">
                <img
                  src={IMAGES.edit}
                  onClick={onClickEdit}
                  alt="Edit"
                  className="w-5 h-5 cursor-pointer"
                />
                <img
                  src={IMAGES.trash}
                  alt="Trash"
                  className="w-5 h-5 cursor-pointer"
                  onClick={onClickDelete}
                />
              </div>
            )}
          </div>
          <p className="text-xs text-white flex gap-1 items-center">
            <img src={IMAGES.exercise1} alt="Sets" className="w-4 h-4" /> Sets:{" "}
            {sets}
          </p>
          <p className="text-xs text-white flex gap-1 items-center">
            <img src={IMAGES.exercise2} alt="Sets" className="w-4 h-4" /> Reps:{" "}
            {reps}
          </p>
          <p className="text-xs text-white flex gap-1 items-center">
            <img src={IMAGES.exercise3} alt="Sets" className="w-4 h-4" />{" "}
            Rest/Set: {rest}
          </p>
        </div>
      </div>

      {progressShow && (
        <div className="flex items-center w-full mt-2">
          {/* Play icon */}
          <Icon
            icon="ph:play-fill" // any play icon you like
            fontSize={18}
            className="mr-2 flex-shrink-0 text-white/80"
          />

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
