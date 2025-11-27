import { IMAGES } from "@/contants/images";
import CustomButton from "./CustomButton";
import { truncateText } from "@/utils/text";

interface WorkoutComponentProps {
  image: string;
  title: string;
  price: string;
  duration: number;
  weeks: number;
  showEditDelete: boolean;
  visibility: string;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onViewClick?: () => void;
  is_draft?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
  canDelete: boolean | null | undefined;
  deleted: boolean;
}

const WorkoutComponent = ({
  image,
  title,
  price,
  duration,
  weeks,
  showEditDelete,
  canDelete,
  is_draft,
  visibility,
  deleted = false,
  onViewClick,
  onClickDelete,
  onClickEdit,
  onImageLoad = () => {},
  onImageError = () => {},
}: WorkoutComponentProps) => {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="relative mb-3">
        <img
          src={image}
          alt="Workout"
          className={`w-full h-48 object-cover rounded-t-[15px] cursor-pointer ${
            deleted ? "blur-sm" : ""
          }`}
          onLoad={onImageLoad}
          onError={onImageError}
        />

        {deleted && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-[15px]">
            <div className="bg-black rounded-lg px-4 py-3">
              <p className="text-white font-medium text-sm">
                This workout has been deleted
              </p>
            </div>
          </div>
        )}

        {!deleted && showEditDelete && (
          <div className="flex items-center space-x-2 absolute top-3 right-3 z-2">
            <img
              src={IMAGES.edit}
              onClick={onClickEdit}
              alt="Edit"
              className="w-5 h-5 cursor-pointer"
            />
            {canDelete && (
              <img
                src={IMAGES.trash}
                alt="Trash"
                className="w-5 h-5 cursor-pointer"
                onClick={onClickDelete}
              />
            )}
          </div>
        )}

        {!deleted && (
          <div
            onClick={onViewClick}
            className="absolute cursor-pointer top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center"
          ></div>
        )}

        {!deleted && is_draft && (
          <div className="absolute top-0 left-0 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-br-md z-10">
            Draft
          </div>
        )}

        {!deleted && price && (
          <div className="font-medium text-sm rounded-b-none absolute bottom-0 text-[#38B100] left-0 bg-white px-2 py-1 rounded-r-[10px]">
            {price}
          </div>
        )}
      </div>

      <div
        className={`flex justify-between items-center ${
          deleted ? "opacity-50" : ""
        }`}
      >
        <div>
          <h4 className="font-semibold text-sm mb-1 truncate" title={title}>
            {truncateText(title, 30)}
          </h4>

          <p className="text-sm text-gray-400 flex gap-1 items-center">
            <img src={IMAGES.calendar} alt="Calendar" className="w-4 h-4" />
            {weeks}
            <img
              src={IMAGES.clock}
              alt="Calendar"
              className="w-4 h-4 ml-2"
            />{" "}
            {duration} min/day ({visibility})
          </p>
        </div>
        {!deleted && (
          <CustomButton
            className="w-auto py-5 bg-primary text-black"
            text="View"
            type="button"
            onClick={onViewClick}
          />
        )}
      </div>
    </div>
  );
};

export default WorkoutComponent;
