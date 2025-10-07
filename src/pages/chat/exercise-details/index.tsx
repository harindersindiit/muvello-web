import { IMAGES } from "@/contants/images";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import NoDataPlaceholder from "@/components/ui/nodata";

const ExerciseDetails = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [media, setMedia] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchMedia();
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);

  const fetchMedia = async () => {
    if (!state.workout_id) return;
    setLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get(
        `workout/workout-media-by-day/${user._id}/${state.workout_id}/${state.week}/${state.day}`,
        // `workout/workout-media-by-day/684960ca3ee4a27824942d4e/684fed8d79e55eea19594345/1/1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.body;
      if (data.data.length > 0) {
        setMedia(data.data[0].workout_media || []);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || "Fetching Media failed.";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className=" text-white my-6 mb-0 pb-9 px-1">
      {/* Workouts */}
      <div className="mt-0 sm:mt-8">
        <div className="grid grid-cols-0 md:grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="lg:col-span-8 col-span-12 xl:col-span-9 md:col-span-12">
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
                {/* <span className="text-white">{state.exercise_info.title}</span> */}
              </h2>
            </div>
            <div className="relative mb-4">
              <video
                autoPlay={true}
                controls
                className="w-full  rounded-lg mb-4 w-full h-[590px] object-contain rounded-xl cursor-pointer"
                src={state.exercise_info.video}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
              />
            </div>
            {/* <h4 className="font-semibold text-sm mb-2">Bench Press</h4> */}

            <p className="text-lg text-white">{state.exercise_info.title}</p>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="xl:h-[110dvh] scrollCustom overflow-y-auto  space-y-4">
              {/* Set Preferences */}
              <div>
                <h2 className="text-white text-base font-medium mb-2">
                  Set Preferences
                </h2>
                <div className="rounded-xl overflow-hidden ">
                  <table className="w-full text-sm text-white font-normal text-center">
                    <thead className="bg-lime-400 text-black text-center">
                      <tr>
                        <th className="p-2 font-normal">Set</th>
                        <th className="p-2 font-normal">Reps</th>
                        <th className="p-2 font-normal">Weight</th>
                        <th className="p-2 font-normal">Rest</th>
                      </tr>
                    </thead>
                    <tbody className="bg-lightdark">
                      {state?.sets?.map((item: any, index) => {
                        return (
                          <tr className="border-b border-gray-700">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{item.reps}</td>
                            <td className="p-2">
                              {item.weight_value} {item.weight_unit}
                            </td>
                            <td className="p-2 font-semibold text-white">
                              {item.rest} Sec
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modified Set Preferences */}
              {state?.custom_sets?.length !== 0 && (
                <div>
                  <h2 className="text-white text-base font-medium mb-2">
                    Modified Set Preferences
                  </h2>
                  <div className="rounded-xl overflow-hidden ">
                    <table className="w-full text-sm text-white text-center">
                      <thead className="bg-yellow-300 text-black">
                        <tr>
                          <th className="p-2 font-normal">Set</th>
                          <th className="p-2 font-normal">Reps</th>
                          <th className="p-2 font-normal">Weight (kg)</th>
                          <th className="p-2 font-normal">Rest</th>
                        </tr>
                      </thead>
                      <tbody className="bg-lightdark">
                        {state?.custom_sets?.map((item: any, index) => {
                          return (
                            <tr className="border-b border-gray-700">
                              <td className="p-2">{index + 1}</td>
                              <td className="p-2">{item.reps}</td>
                              <td className="p-2">
                                {item.weight_value} {item.weight_unit}
                              </td>
                              <td className="p-2 font-semibold text-white">
                                {item.rest} Sec
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {state.workout_id && (
                <div>
                  <h2 className="text-white text-base font-medium mb-2">
                    Videos/Images
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {media.map((item: any, index) => {
                      return item.type === "image" ? (
                        <img
                          src={item.url}
                          alt="Workout"
                          className="rounded-xl object-cover w-full h-32"
                        />
                      ) : (
                        <video
                          autoPlay={true}
                          controls
                          className="rounded-xl object-cover w-full h-32"
                          src={item.url}
                          controlsList="nodownload nofullscreen noremoteplayback"
                          disablePictureInPicture
                        />
                      );
                    })}
                  </div>
                  {!loader && media.length === 0 && (
                    <NoDataPlaceholder message="No videos/images uploaded" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;
