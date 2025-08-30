import { useEffect, useState } from "react";

import CommunityIcon from "./svgComponents/CommunityIcon";
import HomeHeader from "./components/HomeHeader";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import JourneyIcon from "./svgComponents/journeyIcon";
import { LANDING_IMAGES } from "@/pages/LandingPage/landingimages";
import { Link } from "react-router-dom";
import ManageClientIcon from "./svgComponents/ManageClientIcon";
import MotivationChatIcon from "./svgComponents/MotivationChatIcon";
import RopeTooltipSection from "./components/RopeTooltipSection";
import WorkoutIcon from "./svgComponents/WorkoutIcon";
import faqList from "./faqList";

const LandingPage = () => {
  const [selectedFaq, setSelectedFaq] = useState(0);
  useEffect(() => {
    document.body.classList.add('landing-page');


    return () => {
      document.body.classList.remove('landing-page');

    };
  }, []);
  return (
    <div className="h-full bg-black max-w-[1880px] mx-auto">
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 md:opacity-50 lg:opacity-50 xl:opacity-100"
          style={{
            backgroundImage: `url(${LANDING_IMAGES.heroBanner})`,
            zIndex: 0,
          }}
        />
        <div
          className="py-5 md:py-20 lg:py-40 md:pb-20 bg-cover bg-center bg-no-repeat relative"

        >
          <HomeHeader />

          <div className="pt-5 md:pt-10 lg:pt-10 xl:pt-20 px-5 lg:px-14 xl:px-20  flex flex-col justify-center">
            <div className="w-full lg:w-2/3 xl:w-1/2">
              <img
                src={LANDING_IMAGES.bannerRating}
                alt="bannerRating"
                className="w-80 mb-4"
              />
              <h1
                className="text-white sm:text-7xl text-3xl bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.1em",
                }}
              >
                Train Smarter. Connect Better. Achieve More.
              </h1>
              <p className="text-white/40 text-m pr-30 mt-2">
                Your all-in-one fitness companion — workouts, coaching, progress
                tracking, and a fitness community in your pocket.
              </p>

              <div className="flex gap-4 mt-12">
                <img
                  src={LANDING_IMAGES.playStore}
                  alt="bannerRating"
                  className="w-30 md:w-45  object-contain cursor-pointer hover:scale-105 transition-all duration-300"
                />
                <img
                  src={LANDING_IMAGES.appStore}
                  alt="bannerRating"
                  className="w-30 md:w-45  object-contain cursor-pointer hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 px-5 lg:px-14 xl:px-20">
        <div className="relative">
          <img
            src={LANDING_IMAGES.showCaseMobile}
            alt="showCaseMobile"
            className="object-contain w-full h-full"
          />
          <div className="flex justify-between items-center absolute bottom-0 left-0 w-full">
            <img
              src={LANDING_IMAGES.showCaseDownload}
              alt="showCaseMobile"
              className="object-contain w-15 h-15 sm:w-35 sm:h-35 cursor-pointer"
            />
            <img
              src={LANDING_IMAGES.showCaseWatch}
              alt="showCaseMobile"
              className="object-contain w-15 h-15 sm:w-35 sm:h-35 cursor-pointer"
            />
          </div>
        </div>
      </section>

      <section className="py-5 px-5 lg:px-14 xl:px-20" id="why-us">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="w-full">
            <p className="text-m text-primary">Why Choose MUVELLO?</p>
            <h6
              className="text-white xl:text-banner-heading lg:text-7xl md:text-7xl sm:text-7xl text-3xl bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1.1em",
              }}
            >
              Take Charge of Your Fitness Goals!
            </h6>
          </div>

          <div className="w-full">
            <div className="flex gap-4 svgHover items-center border border-white/10 p-4 rounded-2xl bg-[#0B0B0B] group hover:bg-[#212121] transition-all duration-300 cursor-pointer">
              <span className="text-primary group-hover:bg-[linear-gradient(204deg,#94EB00_15.33%,#548500_75.64%)] min-w-16 min-h-16 w-16 h-16 transition-all duration-300 bg-white/10 rounded-full flex items-center justify-center">
                <WorkoutIcon color="white" />
              </span>

              <div>
                <h6 className="text-white text-l font-semibold">
                  Workout Plans
                </h6>
                <p className="text-white/40 text-xs mt-1 sm:text-sm">
                  Stay on track with professionally crafted training routines
                  that evolve with you.
                </p>
              </div>
            </div>

            <div className="flex gap-4 svgHover items-center border border-white/10 p-4 rounded-2xl bg-[#0B0B0B] group hover:bg-[#212121] transition-all duration-300 my-6 cursor-pointer">
              <span className="text-primary group-hover:bg-[linear-gradient(204deg,#94EB00_15.33%,#548500_75.64%)] min-w-16 min-h-16 w-16 h-16 transition-all duration-300 bg-white/10 rounded-full flex items-center justify-center">
                <CommunityIcon color="#93e901" />
              </span>

              <div>
                <h6 className="text-white text-l font-semibold">
                  Community & Coaches
                </h6>
                <p className="text-white/40 text-xs mt-1 sm:text-sm">
                  Connect with trainers and fitness peers for support who keep
                  you motivated and inspired.
                </p>
              </div>
            </div>

            <div className="flex gap-4 svgHover items-center border border-white/10 p-4 rounded-2xl bg-[#0B0B0B] group hover:bg-[#212121] transition-all duration-300 cursor-pointer">
              <span className="text-primary group-hover:bg-[linear-gradient(204deg,#94EB00_15.33%,#548500_75.64%)] min-w-16 min-h-16 w-16 h-16 transition-all duration-300 bg-white/10 rounded-full flex items-center justify-center">
                <JourneyIcon color="white" />
              </span>

              <div>
                <h6 className="text-white text-l font-semibold">
                  Share Your Journey
                </h6>
                <p className="text-white/40 text-xs mt-1 sm:text-sm">
                  Broadcast your reels, witness your evolution, and become a
                  beacon of inspiration!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 px-5 lg:px-14 xl:px-20"
        style={{
          backgroundImage: `url(${LANDING_IMAGES.chartSectionBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="grid grid-cols-1 sm:gap-10 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 items-center">
          {/* Left Card */}
          <div className=" relative">
            <div className="bg-black p-0 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <img src={LANDING_IMAGES.trackChart} alt="trackChart" />

              <p
                className="text-white text-2xl sm:text-4xl md:text-2xl lg:text-2xl xl:text-3xl bg-clip-text text-transparent text-center font-bold mt-3"
                style={{
                  backgroundImage:
                    "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.1em",
                }}
              >
                See Every Reps, Set & Victory
              </p>
            </div>
          </div>

          {/* Middle Card */}
          <div className="relative rounded-2xl h-[390px] sm:h-[520px] md:h-[420px] xl:h-[387px]">
            <div
              style={{
                backgroundImage: `url(${LANDING_IMAGES.weightChart})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100%",
                width: "100%",
              }}
            >
              {/* <div className="absolute bottom-25 sm:bottom-42 md:bottom-26 lg:bottom-17 xl:bottom-17 left-[50%] translate-x-[-50%] w-[54%] bg-black/50 overflow-hidden">
                <p
                  className="text-white  text-lg sm:text-1xl md:text-1xl lg:text-2xl xl:text-3xl bg-clip-text text-transparent text-center font-bold"
                  style={{
                    backgroundImage:
                      "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: "1.3em"
                  }}
                >
                  Track how you're  progressing

                </p>
              </div> */}
            </div>
          </div>

          {/* Right Card */}
          <div className="relative">
            <div className="bg-black p-0 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <img src={LANDING_IMAGES.barChart} alt="trackChart" />

              <p
                className="text-white text-2xl sm:text-4xl md:text-2xl lg:text-2xl xl:text-3xl bg-clip-text text-transparent text-center font-bold mt-3"
                style={{
                  backgroundImage:
                    "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.1em",
                }}
              >
                Drop Weight Tells Your Story
              </p>
            </div>
          </div>
        </div>
      </section>

      <RopeTooltipSection />

      <section className="py-0 md:py-5 px-5 lg:px-14 xl:px-20">
        <div
          className="bg-gradient-to-br text-black px-4 rounded-[40px] py-10 sm:py-0"
          style={{
            backgroundImage: `url(${LANDING_IMAGES.buildSectionBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-0 sm:py-10 sm:px-10 relative h-full lg:h-[500px]">
            {/* Left Side - Text */}
            <div className="text-center md:text-left max-w-xl">
              <h1 className="text-4xl md:text-7xl  mb-4">
                Build a Fitter, <br /> Stronger You
              </h1>
              <p className="text-sm md:text-base mb-6">
                Join thousands transforming their workouts—track progress, stay
                motivated, and crush your goals. Download the app now!
              </p>

              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                {[
                  "Goal-Focused",
                  "Intuitive",
                  "Fast",
                  "Trackable",
                  "Smart",
                  "Flexible",
                ].map((text) => (
                  <span
                    key={text}
                    className="bg-white/50 text-black text-sm font-semibold px-4 py-2 rounded-full   cursor-pointer flex items-center gap-1"
                  >
                    <Icon
                      icon="heroicons-solid:badge-check"
                      className="text-black w-6 h-6"
                    />{" "}
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <img
              src={LANDING_IMAGES.buildSectionMobile}
              alt="buildSectionMobile"
              className=" h-[600px] absolute bottom-0  left-[67%] translate-x-[-60%] object-contain hidden xl:block"
            />

            {/* Right Side - Phone Image & Store Links */}
            <div className="flex flex-col items-center w-full lg:w-[250px]">
              <img
                src={LANDING_IMAGES.buildSectionHolmark}
                alt="Workout App"
                className="w-40 mb-10 sm:mb-20"
              />
              <p className="text-center font-medium mb-2 px-4 py-2 w-full">
                Download app to get started
              </p>

              <div className="flex lg:flex-col flex-row gap-2">
                <img
                  src={LANDING_IMAGES.playStore}
                  alt="Google Play"
                  className="w-36 cursor-pointer bg-black rounded-full"
                />
                <img
                  src={LANDING_IMAGES.appStore}
                  alt="App Store"
                  className="w-36 cursor-pointer bg-black rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16 xl:py-24 lg:py-10 md:py-5 px-5 lg:px-14 xl:px-20 flex items-center addPosClass lg:bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${LANDING_IMAGES.trainingSectionBG})`,
          backgroundSize: "cover",

        }}
        id="trainer"
      >
        <div className="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-2 gap-10 ">
          <div className="col-start-1 sm:col-start-2">
            <p className="text-primary text-sm bg-clip-text mb-2">
              Trainer / Coach
            </p>
            <h6
              className="text-white text-4xl sm:text-6xl bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1.1em",
              }}
            >
              Tools Designed for Fitness Professionals
            </h6>
            <div className="flex gap-4 svgHover items-center border border-white/10 p-4 rounded-2xl bg-[#0B0B0B] group hover:bg-[#212121] transition-all duration-300 cursor-pointer mt-10">
              <span className="text-primary group-hover:bg-[linear-gradient(204deg,#94EB00_15.33%,#548500_75.64%)] min-w-16 min-h-16 w-16 h-16 transition-all duration-300 bg-white/10 rounded-full flex items-center justify-center">
                <WorkoutIcon color="white" />
              </span>

              <div>
                <h6 className="text-white text-l font-semibold">
                  Build & sell custom workout plans
                </h6>
                <p className="text-white/40 text-xs mt-1 sm:text-sm">
                  Create personalized fitness programs and earn by selling them
                  to your audience.
                </p>
              </div>
            </div>

            <div className="flex gap-4 svgHover items-center border border-white/10 p-4 rounded-2xl bg-[#0B0B0B] group hover:bg-[#212121] transition-all duration-300 my-6 cursor-pointer">
              <span className="text-primary group-hover:bg-[linear-gradient(204deg,#94EB00_15.33%,#548500_75.64%)] min-w-16 min-h-16 w-16 h-16 transition-all duration-300 bg-white/10 rounded-full flex items-center justify-center">
                <ManageClientIcon color="white" />
              </span>

              <div>
                <h6 className="text-white text-l font-semibold">
                  Manage clients and track their progress
                </h6>
                <p className="text-white/40 text-xs mt-1 sm:text-sm">
                  Keep tabs on client activity, performance, and milestones—all
                  in one place.
                </p>
              </div>
            </div>

            <div className="flex gap-4 svgHover items-center border border-white/10 p-4 rounded-2xl bg-[#0B0B0B] group hover:bg-[#212121] transition-all duration-300 cursor-pointer">
              <span className="text-primary group-hover:bg-[linear-gradient(204deg,#94EB00_15.33%,#548500_75.64%)] min-w-16 min-h-16 w-16 h-16 transition-all duration-300 bg-white/10 rounded-full flex items-center justify-center">
                <MotivationChatIcon color="white" />
              </span>

              <div>
                <h6 className="text-white text-l font-semibold">
                  Chat and send motivational nudges
                </h6>
                <p className="text-white/40 text-xs mt-1 sm:text-sm">
                  Stay connected with clients through real-time messaging and
                  encouragement tools.
                </p>
              </div>
            </div>

            <button className="bg-primary py-3 px-6 rounded-full mt-10 cursor-pointer hover:bg-primary/80 transition-all duration-300">
              Become a Coach on the App
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-10 px-5 lg:px-14 xl:px-20 ">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url(${LANDING_IMAGES.downloadCTABG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center p-6 sm:p-10">
            {/* Text Content & Store Buttons */}
            <div>
              <h6
                className="text-white text-3xl sm:text-5xl lg:text-6xl font-semibold text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.2em",
                }}
              >
                Start Your Fitness Journey with Muvello.
              </h6>

              <div className="flex  sm:flex-nowrap gap-4 mt-6">
                <img
                  src={LANDING_IMAGES.playStore}
                  alt="Google Play"
                  className="w-30 sm:w-40 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300"
                />
                <img
                  src={LANDING_IMAGES.appStore}
                  alt="App Store"
                  className="w-30 sm:w-40 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>

            {/* App Preview Image */}
            <div className="flex justify-center sm:justify-end">
              <img
                src={LANDING_IMAGES.downloadCTAMobile}
                alt="Mobile Preview"
                className="w-160 relative right-[-40px] bottom-[-40px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-0 md:py-10 px-5 lg:px-14 xl:px-20" id="testimonial">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-10 items-start">
          {/* Testimonials */}
          <div className="md:col-span-12 lg:col-span-4">
            <p className="text-primary text-sm mb-2">Testimonials</p>

            <h6
              className="text-white text-3xl sm:text-4xl lg:text-6xl text-transparent bg-clip-text pb-6"
              style={{
                backgroundImage:
                  "linear-gradient(103deg, #FFF 11.11%, #686D76 91.8%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1.2em",
              }}
            >
              What Our Users Are Saying
            </h6>

            <div className="relative">
              {/* Main Testimonial Card */}
              <div className="border border-white/10 rounded-2xl p-2 md:p-2 lg:p-6 bg-black relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://randomuser.me/api/portraits/women/12.jpg"
                      alt="userAvatar"
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <p className="text-white font-bold text-base">
                        Oliva Mac
                      </p>
                      <p className="text-white/70 text-xs mt-1">
                        Gym Enthusiast
                      </p>
                    </div>
                  </div>
                  <Icon
                    icon="iconoir:quote-solid"
                    className="text-primary w-10 h-10"
                  />
                </div>

                <p className="text-white/80 text-sm mt-4">
                  Muvello changed the way I train. I track everything, connect
                  with my coach, and stay accountable — all in one app.
                </p>

                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((_, idx) => (
                    <Icon
                      key={idx}
                      icon="material-symbols-light:star-rounded"
                      className="text-[#FFBD00] w-6 h-6"
                    />
                  ))}
                </div>
              </div>

              {/* Layered Card Shadows */}
              <div className="absolute bottom-[-36px] left-1/2 translate-x-[-50%] rounded-2xl border border-white/10 w-[60%] h-full z-0 bg-black"></div>
              <div className="absolute bottom-[-18px] left-1/2 translate-x-[-50%] rounded-2xl border border-white/10 w-[80%] h-full z-0 bg-black"></div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="md:col-span-12 lg:col-span-4">
            <div className="bg-white/5 rounded-2xl p-0 md:p-0 lg:p-6 mt-0 lg:mt-10 md:mt-0">
              <h6 className="text-white text-2xl font-medium mb-6">
                Frequently Asked Questions.
              </h6>

              {faqList?.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 mb-4 transition-all ${selectedFaq === index
                    ? "bg-white/9 rounded-2xl"
                    : "border-b border-white/10 last:border-b-0"
                    }`}
                >
                  <div
                    className="flex justify-between items-center py-2 cursor-pointer"
                    onClick={() => setSelectedFaq(index)}
                  >
                    <p className="text-white font-medium text-sm hover:text-primary transition-all duration-300 ">
                      {item.question}
                    </p>
                    {selectedFaq === index ? (
                      <Icon
                        icon="zondicons:minus-solid"
                        className="text-primary w-5 h-5"
                      />
                    ) : (
                      <Icon
                        icon="icons8:plus"
                        className="text-primary w-6 h-6"
                      />
                    )}
                  </div>

                  {selectedFaq === index && (
                    <p className="text-white/70 text-sm mt-2">
                      {item.answer ??
                        "Muvello is an all-in-one fitness app designed to connect people, help you train smarter, and track your progress — whether you're working out solo or with a coach."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer
        className="pt-5 sm:pt-30 items-center"
        style={{
          backgroundImage: `url(${LANDING_IMAGES.footerBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-5 lg:px-14 xl:px-20 relative pb-6 md:pb-16">
          {/* Logo & Store Buttons */}
          <div className="w-full bg-black rounded-3xl p-3 md:ps-5 flex flex-col sm:flex-row justify-between items-center border-t border-white/10 gap-4">
            <img src={IMAGES.logoHome} alt="logo" className="w-40 sm:w-56" />

            <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
              <img
                src={LANDING_IMAGES.playStore}
                alt="Google Play"
                className="w-36 cursor-pointer hover:scale-105 transition-all duration-300"
              />
              <img
                src={LANDING_IMAGES.appStore}
                alt="App Store"
                className="w-36 cursor-pointer hover:scale-105 transition-all duration-300"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="w-full text-center sm:text-right">
            <p className="text-white text-sm sm:text-3xl font-medium">
              +1 954 525 1254
            </p>
            <p className="text-white text-sm sm:text-3xl font-medium">
              muvello@support.com
            </p>
          </div>

          {/* Bottom Border Line */}
          <div className="border-b border-white/10 absolute bottom-0 left-1/2 w-[90%] -translate-x-1/2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-5 lg:px-14 xl:px-20 py-10 items-center">
          {/* Left Side - Copyright */}
          <div className=" text-center sm:text-left">
            <p className="text-white/70 text-xs">
              Muvello © Copyrights 2025. All rights reserved.
            </p>
          </div>

          {/* Right Side - Links & Socials */}
          <div className="w-full flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center sm:justify-end items-center gap-4 ">
            {/* Policy Links */}
            <div className="flex gap-4">
              <Link
                to="/public/privacy-policy"
                className="text-primary  text-xs underline hover:text-white transition-all duration-300"
              >
                Privacy & Policy
              </Link>
              <Link
                to="/public/terms-and-conditions"
                className="text-primary  text-xs underline hover:text-white transition-all duration-300"
              >
                Terms & Conditions
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                "jam:facebook",
                "ri:twitter-x-fill",
                "hugeicons:instagram",
                "jam:pinterest",
              ].map((icon, index) => (
                <Link
                  to="#"
                  key={index}
                  className="border border-white/10 rounded-full p-2 hover:bg-white/10 transition"
                >
                  <Icon icon={icon} className="text-white w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <img
          src={LANDING_IMAGES.watermark}
          alt="watermark"
          className="w-full px-5 mt-20 hidden sm:block"
        />
      </footer>
    </div>
  );
};

export default LandingPage;
