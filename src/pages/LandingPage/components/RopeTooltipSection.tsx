
import { LANDING_IMAGES } from "../landingimages";


const RopeTooltipSection = () => {
  return (
    <section id="features" className="py-16  overflow-hidden  sm:py-10 px-5 lg:px-20 xl:h-[950px] lg:h-[665px] md:h-[600px]  relative ">
      <div className="relative z-2">
        <p className="text-primary text-sm bg-clip-text mb-2">Key Features</p>
        <h6
          className="text-white text-2xl lg:text-3xl xl:text-5xl  bg-clip-text text-transparent  w-full sm:w-1/2"
          style={{
            backgroundImage:
              "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: "1.1em",
          }}
        >
          Powerful Features That Make Fitness Effortless.
        </h6>
      </div>

      <div className="md:absolute  lg:top-38 md:top-33 xl:top-90 md:left-11 lg:left-12 top-5 relative xl:left-22  z-4">
        <div className="bg-[#1E1E1E] rounded-2xl p-5 w-[100%]  auto md:w-[40%]">
          <div className="relative z-2">
            <img
              src={LANDING_IMAGES.tooltipWorkout}
              alt="Workout Tracker"
              className="w-10 h-10 object-cover mb-2"
            />
            <p className="text-primary text-xl font-semibold mb-2">
              Workout Tracker
            </p>
            <p className="text-white text-sm text-transparent">
              Easily log your workouts, set fitness goals, and track every rep,
              set, and session for consistent progress.
            </p>
          </div>
          <div className="absolute bottom-[-17px] left-10 w-7 h-10 bg-[#1E1E1E] hidden md:block  rotate-64 z-0"></div>
        </div>
      </div>

      {/* Background Image */}
      <img
        src={LANDING_IMAGES.ropeimg} // Update this to your actual image path
        alt="Rope Battle Workout"
        className="w-full object-cover absolute bottom-20 left-0 z-0 hidden md:block"
      />
    </section>
  );
};

export default RopeTooltipSection;
