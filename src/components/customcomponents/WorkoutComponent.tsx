import { IMAGES } from "@/contants/images";
import CustomButton from "./CustomButton";
import { getMinutesFromSeconds } from "@/utils/sec";

interface WorkoutComponentProps {
  image: string;
  title: string;
  price: string;
  duration: string;
  weeks: number;
  showEditDelete: boolean;
  visibility: string;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onViewClick?: () => void;
  is_draft?: boolean; // <-- new
}

const WorkoutComponent = ({
  image,
  title,
  price,
  duration,
  weeks,
  showEditDelete,
  is_draft,
  visibility,
  onViewClick,
  onClickDelete,
  onClickEdit,
}: WorkoutComponentProps) => {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="relative mb-3">
        <img
          src={image}
          alt="Workout"
          className="w-full h-48 object-cover rounded-t-[15px] cursor-pointer"
        />

        {showEditDelete && (
          <div className="flex items-center space-x-2 absolute top-3 right-3 z-2">
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

        <div
          onClick={onViewClick}
          className="absolute cursor-pointer top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center"
        ></div>

        {is_draft && (
          <div className="absolute top-0 left-0 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-br-md z-10">
            Draft
          </div>
        )}

        {price && (
          <div className="font-medium text-sm rounded-b-none absolute bottom-0 text-[#38B100] left-0 bg-white px-2 py-1 rounded-r-[10px]">
            {price}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-sm mb-1">{title}</h4>

          <p className="text-sm text-gray-400 flex gap-1 items-center">
            <img src={IMAGES.calendar} alt="Calendar" className="w-4 h-4" />
            {weeks}
            <img
              src={IMAGES.clock}
              alt="Calendar"
              className="w-4 h-4 ml-2"
            />{" "}
            {getMinutesFromSeconds(duration)} min ({visibility})
          </p>
        </div>
        <CustomButton
          className="w-auto py-5 bg-primary text-black"
          text="View"
          type="button"
          onClick={onViewClick}
        />
      </div>
    </div>
  );
};

export default WorkoutComponent;
