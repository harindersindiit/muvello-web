import CustomButton from "@/components/customcomponents/CustomButton";
import ExerciseComponent from "@/components/customcomponents/ExerciseComponent";
import SelectComponent from "@/components/customcomponents/SelectComponent";
import WorkoutComponentSidebar from "@/components/workoutcommponentsidebar";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const exerciseData = [
  {
    image: IMAGES.workout1,
    title: "1. Pushups",
    sets: 3,
    reps: 10,
    rest: 10,
    modified: true,
  },
  {
    image: IMAGES.workout2,
    title: "2. Chest Dips",
    sets: 3,
    reps: 10,
    rest: 10,
    modified: false,
  },
  {
    image: IMAGES.workout3,
    title: "3. Pushups",
    sets: 3,
    reps: 10,
    rest: 10,
    modified: false,
  },
  {
    image: IMAGES.workout4,
    title: "4. Pushups",
    sets: 3,
    reps: 10,
    rest: 10,
    modified: false,
  },
];

const WorkoutParticipant = () => {
  const navigate = useNavigate();
  const [week, setWeek] = useState("Week 1");
  const [day, setDay] = useState("Day 1");
  useEffect(() => {
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);
  const [open, setOpen] = useState(false);

  return (
    <div className=" text-white my-6 mb-0 pb-9 px-1">
      {/* Workouts */}
      <div className="mt-0 sm:mt-8">
        <div className="grid grid-cols-0 md:grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="lg:col-span-8 xl:col-span-9 md:col-span-12">
            <div className="flex items-center gap-4 mb-3">
              <h2
                className="md:text-2xl text-md font-semibold flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <img
                  src={IMAGES.arrowLeft}
                  alt="arrowLeft"
                  className="w-6 h-6 cursor-pointer"
                />
              </h2>
            </div>
            <div className="relative mb-4">
              <img
                src={IMAGES.workout5}
                alt="workout"
                className="w-full h-[400px] object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(179deg, rgba(0, 0, 0, 0.70) 4.16%, rgba(0, 0, 0, 0.00) 40.1%, rgba(0, 0, 0, 0.70) 90.09%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
                }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  Simple Home Workout
                </h4>
                <p className="text-sm text-gray-400 flex gap-1 items-center">
                  <img
                    src={IMAGES.calendar}
                    alt="Calendar"
                    className="w-4 h-4"
                  />
                  4 weeks{" "}
                  <img
                    src={IMAGES.clock}
                    alt="Calendar"
                    className="w-4 h-4 ml-2"
                  />{" "}
                  30 min
                </p>
              </div>

              <CustomButton
                className="w-auto py-5 bg-primary text-black"
                text="$5.60"
                type="button"
              />
            </div>

            <p className="text-sm text-white mt-4">
              No gym? No problem. This quick and effective home workout uses
              just your bodyweight to help you stay fit, strong, and
              energized—anytime, anywhere. Perfect for all levels!
            </p>

            <div className="flex items-center gap-2 justify-between w-full flex-1 mt-5 mb-3">
              <h4 className="font-semibold text-sm mb-1">Participant (20)</h4>
              <Icon
                icon="tabler:search"
                fontSize={16}
                className="text-white cursor-pointer hover:text-primary transition-all duration-300 ease-in-out"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div
                onClick={() => navigate("/user/workouts")}
                className="bg-black cursor-pointer text-white rounded-[10px] border border-white/10 p-3 flex items-center justify-between"
              >
                {/* Avatar and Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={IMAGES.uimg1} // Replace with actual avatar source
                    alt="avatar"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="text-md font-semibold mb-1">Khalid Ahmad</p>
                    <p className="text-grey text-sm">Status</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg
                    className="absolute top-0 left-0"
                    width="56"
                    height="56"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      stroke="#333"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                  <span className="text-white text-sm font-semibold">0%</span>
                </div>
              </div>

              <div
                onClick={() => navigate("/user/workouts")}
                className="bg-black cursor-pointer text-white rounded-[10px] border border-white/10 p-3 flex items-center justify-between"
              >
                {/* Avatar and Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={IMAGES.uimg2} // Replace with actual avatar source
                    alt="avatar"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="text-md font-semibold mb-1">
                      Carlos Fernández
                    </p>
                    <p className="text-grey text-sm">Status</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg
                    className="absolute top-0 left-0"
                    width="56"
                    height="56"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      stroke="#333"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                  <span className="text-white text-sm font-semibold">0%</span>
                </div>
              </div>

              <div
                onClick={() => navigate("/user/workouts")}
                className="bg-black cursor-pointer text-white rounded-[10px] border border-white/10 p-3 flex items-center justify-between"
              >
                {/* Avatar and Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={IMAGES.uimg3} // Replace with actual avatar source
                    alt="avatar"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="text-md font-semibold mb-1">
                      Carlos Fernández
                    </p>
                    <p className="text-grey text-sm">Status</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg
                    className="absolute top-0 left-0"
                    width="56"
                    height="56"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      stroke="#333"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                  <span className="text-white text-sm font-semibold">0%</span>
                </div>
              </div>
            </div>

            <div className="text-primary text-sm  mt-4 cursor-pointer hover:text-primary/80 transition-all duration-300 ease-in-out">
              View More
            </div>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="col-span-0 md:col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-md font-semibold">
                <span className="text-white">Exercises</span>
              </h2>

              <div className="flex items-center gap-1 ms-auto">
                <div className="relative ">
                  <SelectComponent
                    value={week}
                    onChange={setWeek}
                    icon={IMAGES.calendar}
                    className="py-2 px-3 w-[120px] cursor-pointer"
                    options={[
                      { value: "Week 1", label: "Week 1" },
                      { value: "Week 2", label: "Week 2" },
                      { value: "Week 3", label: "Week 3" },
                      { value: "Week 4", label: "Week 4" },
                    ]}
                  />
                </div>
                <div className="relative ">
                  <SelectComponent
                    value={day}
                    onChange={setDay}
                    className="py-2 px-3 w-[90px] cursor-pointer"
                    options={[
                      { value: "Day 1", label: "Day 1" },
                      { value: "Day 2", label: "Day 2" },
                      { value: "Day 3", label: "Day 3" },
                      { value: "Day 4", label: "Day 4" },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="xl:h-[92dvh] scrollCustom overflow-y-auto ">
              <div className="text-xl font-semibold mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                {exerciseData.map((exercise, index) => (
                  <ExerciseComponent
                    key={index}
                    image={exercise.image}
                    title={exercise.title}
                    sets={exercise.sets}
                    reps={exercise.reps}
                    rest={exercise.rest}
                    modified={exercise.modified}
                    className="mb-0"
                  />
                ))}
              </div>
            </div>
            <CustomButton
              text="Publish Workout"
              type="button"
              onClick={() => navigate("/user/workouts")}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <WorkoutComponentSidebar open={open} setOpen={setOpen} />
    </div>
  );
};

export default WorkoutParticipant;
