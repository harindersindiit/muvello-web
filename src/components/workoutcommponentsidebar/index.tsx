import { Icon } from "@iconify/react/dist/iconify.js";
import { DrawerSidebar } from "../customcomponents/DrawerSidebar";
import { useState } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { IMAGES } from "@/contants/images";
import TextInput from "../customcomponents/TextInput";
import CustomTextArea from "../customcomponents/CustomTextArea";
import Lines from "../svgcomponents/Lines";
import InputTag from "../customcomponents/InputTag";
import SelectComponent from "../customcomponents/SelectComponent";
import GroupInputTag from "../customcomponents/GroupInputTag";
import { Checkbox } from "../ui/checkbox";
import ExerciseComponent from "../customcomponents/ExerciseComponent";

const exerciseData = [
  {
    image: IMAGES.exercise4,
    title: "Chest Dips",
    sets: 4,
    reps: "20, 15, 10, 8",
    rest: "45 Sec",
    category: "Chest",
  },
  {
    image: IMAGES.exercise5,
    title: "Pull-Up",
    sets: 3,
    reps: "15, 12, 10",
    rest: "30 Sec",
    category: "Back",
  },
  {
    image: IMAGES.exercise6,
    title: "Cable Tricep",
    sets: 4,
    reps: "20, 15, 10",
    rest: "60 Sec",
    category: "Triceps",
  },
];

const groups = [
  {
    id: 1,
    name: "FitFam Unite",
    image: IMAGES.group1,
    members: "1.2K",
  },
  {
    id: 2,
    name: "Everyday Hustlers",
    image: IMAGES.group2,
    members: "526",
  },
  {
    id: 3,
    name: "Barbell Brotherhood",
    image: IMAGES.group3,
    members: "785",
  },
  {
    id: 4,
    name: "PR Chasers",
    image: IMAGES.group4,
    members: "1.5K",
  },
  {
    id: 5,
    name: "FitFam Unite",
    image: IMAGES.group1,
    members: "1.2K",
  },
];

const WorkoutComponentSidebar = ({
  open,
  setOpen,
  mode,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "add" | "edit";
}) => {
  const [workoutName, setWorkoutName] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [caption, setCaption] = useState("");
  const [week, setWeek] = useState("");
  const [day, setDay] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [uploadedFiles] = useState([]);
  const [selectExerciseOpen, setSelectExerciseOpen] = useState(false);
  const [selectGroupsOpen, setSelectGroupsOpen] = useState(false);
  const [searchExercise, setSearchExercise] = useState("");
  const [searchGroups, setSearchGroups] = useState("");
  const filteredExercises =
    selectedTab === "All"
      ? exerciseData
      : exerciseData.filter((item) => item.category === selectedTab);

  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const navigate = useNavigate();
  return (
    <>
      <DrawerSidebar
        title={mode === "add" ? "Create Workout" : "Edit Workout"}
        submitText="Preview"
        cancelText="Save as Draft"
        onSubmit={() => navigate("/user/workouts/workout-participant")}
        open={open}
        setOpen={setOpen}
      >
        <div className="p-4">
          <h3 className="text-white text-md font-semibold mb-2">Basic Info</h3>
          {/* Upload Box */}
          <div className="border-2 cursor-pointer mb-3 border-dashed border-blue-500 rounded-lg h-40 flex flex-col justify-center items-center bg-[#1f1f1f]">
            <Icon
              icon="solar:gallery-outline"
              className="text-blue mb-2"
              fontSize={34}
            />
            <p className="text-white text-sm">Upload Workout Thumbnail</p>
          </div>

          {/* Previews */}
          <div className="flex gap-4 mb-4">
            {uploadedFiles.map((file: any, idx: number) => (
              <div
                key={idx}
                className="relative w-[110px] h-[110px] rounded-md overflow-hidden"
              >
                <img
                  src={file.url}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute cursor-pointer top-1 right-1 h-5 w-5 p-0 rounded-full"
                >
                  <img src={IMAGES.cross} alt="" className="w-full h-full" />
                </Button>
              </div>
            ))}
          </div>

          <TextInput
            placeholder="Workout Title"
            value={workoutName}
            onChange={(value: string) => setWorkoutName(value)}
            type="text"
            icon={<img src={IMAGES.textBlock} alt="" className="w-5 h-5" />}
            className="mb-3"
          />

          {/* Dropdown */}
          <SelectComponent
            value={selectedTab}
            onChange={setSelectedTab}
            icon={IMAGES.category}
            className="mb-3 cursor-pointer"
            options={[
              { value: "All", label: "Select Workout Category" },
              { value: "Strength", label: "Strength" },
              { value: "Flexibility", label: "Flexibility" },
              { value: "Cardio", label: "Cardio" },
              { value: "Balance & Stability", label: "Balance & Stability" },
              { value: "Core Focus", label: "Core Focus" },
              { value: "Yoga & Mindfulness", label: "Yoga & Mindfulness" },
              { value: "Sports-Specific", label: "Sports-Specific" },
            ]}
          />

          <CustomTextArea
            placeholder="Write caption..."
            value={caption}
            onChange={(value) => setCaption(value)}
            icon={<Lines color="white" />}
            error=""
            className="min-h-[120px] max-h-[120px]"
          />
        </div>
        <div className="w-full h-[7px] bg-lightdark"></div>
        <div className="p-4">
          <div className="text-white">
            <span className="text-sm font-medium mb-2 block">
              Add Your Workout
            </span>
            <div className="bg-[#212121] rounded-lg p-3 mb-4">
              <div className="flex gap-2 mb-3">
                <TextInput
                  placeholder="Week 1"
                  value={week}
                  onChange={(value: string) => setWeek(value)}
                  type="text"
                  inputClassName="!bg-[#333333]"
                  icon={
                    <img src={IMAGES.calendar} alt="" className="w-5 h-5" />
                  }
                />
                <TextInput
                  placeholder="Day 1"
                  value={day}
                  onChange={(value: string) => setDay(value)}
                  type="text"
                  inputClassName="!bg-[#333333]"
                  icon={<img src={IMAGES.clock} alt="" className="w-5 h-5" />}
                />
              </div>
              <InputTag
                onClickRightIcon={() => {
                  setSelectExerciseOpen(true);
                }}
              />
            </div>

            <Link
              to="#"
              className="text-primary font-semibold hover:text-white transition-all duration-300 text-sm flex items-center gap-2"
            >
              <Icon
                icon="f7:plus-app"
                style={{ width: "21px", height: "21px" }}
              />
              Add More Week/Day Workout
            </Link>
          </div>
        </div>

        <div className="w-full h-[7px] bg-lightdark"></div>
        <div className="p-4">
          <div className="text-white">
            <span className="text-sm font-medium mb-2 block">
              Choose Your Workout Access
            </span>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`cursor-pointer rounded-full p-3 px-6 font-normal text-sm ${
                  !isPaid ? "bg-primary text-black" : "bg-lightdark text-white"
                }`}
                onClick={() => setIsPaid(false)}
              >
                Free
              </div>
              <div
                className={`cursor-pointer rounded-full p-3 px-6 font-normal text-sm ${
                  isPaid ? "bg-primary text-black" : "bg-lightdark text-white"
                }`}
                onClick={() => setIsPaid(true)}
              >
                Paid
              </div>
            </div>
            {isPaid && (
              <TextInput
                placeholder="Enter Amount"
                value={amount}
                onChange={(value: string) => setAmount(value)}
                type="text"
                icon={
                  <img src={IMAGES.dollarsquare} alt="" className="w-5 h-5" />
                }
                className="mb-3"
              />
            )}
          </div>
        </div>
        <div className="w-full h-[7px] bg-lightdark"></div>
        <div className="p-4">
          <div className="text-white">
            <span className="text-sm font-medium mb-2 block">
              Post Visibility
            </span>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`cursor-pointer rounded-full p-3 px-6 font-normal text-sm ${
                  isPublic ? "bg-primary text-black" : "bg-lightdark text-white"
                }`}
                onClick={() => setIsPublic(true)}
              >
                Public
              </div>
              <div
                className={`cursor-pointer rounded-full p-3 px-6 font-normal text-sm ${
                  !isPublic
                    ? "bg-primary text-black"
                    : "bg-lightdark text-white"
                }`}
                onClick={() => setIsPublic(false)}
              >
                Private
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[7px] bg-lightdark"></div>
        <div className="p-4">
          <GroupInputTag onClickGroup={() => setSelectGroupsOpen(true)} />
        </div>
      </DrawerSidebar>

      {/* Select Exercise Drawer */}
      <DrawerSidebar
        title="Select Exercise"
        submitText="Done"
        cancelText="Cancel"
        onSubmit={() => console.log("Post Submitted")}
        open={selectExerciseOpen}
        setOpen={setSelectExerciseOpen}
        className="customWidthDrawer"
      >
        <div className="p-4">
          <TextInput
            placeholder="Search exercise..."
            value={searchExercise}
            onChange={(value: string) => setSearchExercise(value)}
            type="text"
            icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
            className="mb-3"
          />
          <div className="flex gap-2 mr-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1a1a1a] hover:scrollbar-thumb-[#4a4a4a]">
            {["All", "Chest", "Back", "Biceps", "Legs", "Shoulders"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTab(tag)}
                  className={`px-2 py-1 cursor-pointer flex-shrink-0 rounded-full text-xs transition-all ${
                    selectedTab === tag
                      ? "bg-[#94eb00] text-black"
                      : "bg-[#2a2a2a] text-white"
                  }`}
                >
                  {tag}
                </button>
              )
            )}
          </div>
          <div className="mt-3">
            {filteredExercises.map((exercise, index) => (
              <ExerciseComponent
                key={index}
                image={exercise.image}
                title={exercise.title}
                sets={exercise.sets}
                reps={exercise.reps}
                rest={exercise.rest}
                category={exercise.category}
                className="mb-3"
                checkbox={true}
              />
            ))}
          </div>
        </div>
      </DrawerSidebar>

      {/* Select Groups Drawer */}
      <DrawerSidebar
        title="Select Groups"
        submitText="Done"
        cancelText="Cancel"
        onSubmit={() => console.log("Post Submitted")}
        open={selectGroupsOpen}
        setOpen={setSelectGroupsOpen}
        className="customWidthDrawer"
      >
        <div className="p-4">
          <TextInput
            placeholder="Search groups... "
            value={searchGroups}
            onChange={(value: string) => setSearchGroups(value)}
            type="text"
            icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
            className="mb-3"
          />

          <div className="mt-4 text-white">
            {groups.map((group) => (
              <label
                key={group.id}
                htmlFor={`group-${group.id}`}
                className="flex items-start gap-3 mb-4 w-full cursor-pointer relative"
              >
                <img
                  src={group.image || IMAGES.groupPlaceholder}
                  alt={group.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="border-b border-gray-600 pb-4 w-full">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-white text-base font-semibold">
                      {group.name}
                    </h3>
                    <Checkbox
                      id={`group-${group.id}`}
                      className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGroups([...selectedGroups, group.id]);
                        } else {
                          setSelectedGroups(
                            selectedGroups.filter((id) => id !== group.id)
                          );
                        }
                      }}
                    />
                  </div>
                  <span className="text-grey text-sm font-medium">
                    {group.members} Members
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </DrawerSidebar>
    </>
  );
};

export default WorkoutComponentSidebar;
