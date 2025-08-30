import { Route, Routes } from "react-router-dom";

import BlockedUsers from "@/pages/blockedUsers";
import EditProfile from "@/pages/editProfile";
import Exercise from "@/pages/exercises";
import ExerciseDetails from "@/pages/chat/exercise-details";
import GroupChatUI from "@/pages/chat";
import Home from "@/pages/home";
import PostDetails from "@/pages/postDetails";
import ProgressDetails from "@/pages/chat/progress-details";
import RequestsUser from "@/pages/chat/requests";
import UserProfile from "@/pages/userProfile";
import ViewProfile from "@/pages/userProfile";
import UserWallet from "@/pages/myWallet";
import WorkoutDetails from "@/pages/workouts/workout-details";
import Workouts from "@/pages/workouts";
import SavedCards from "@/pages/saved-cards";
import StripeSetup from "@/pages/stripe-setup";
import WorkoutParticipant from "@/pages/workouts/workout-participant";
import CreateWorkout from "@/pages/CreateWorkout";
import AthletesComparison from "@/pages/AthletesComparison/AthletesComparison";

function UserRoutes() {
  return (
    <>
      <div className="bg-black min-h-[calc(100vh-57px)] max-w-[1899px] mx-auto">
        <div className="px-3 lg:px-10 pt-7">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route
              path="/workouts/workout-details"
              element={<WorkoutDetails />}
            />
            <Route path="/exercises" element={<Exercise />} />
            <Route path="/chat" element={<GroupChatUI />} />
            {/* <Route path="/profile/:id" element={<UserProfile />} /> */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/view-profile" element={<ViewProfile />} />
            <Route path="/profile/:id/post/:id" element={<PostDetails />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/blocked-users" element={<BlockedUsers />} />
            <Route path="/my-wallet" element={<UserWallet />} />
            <Route path="/create-workout" element={<CreateWorkout />} />
            <Route path="/edit-workout" element={<CreateWorkout />} />
            <Route
              path="/athletes-comparison"
              element={<AthletesComparison />}
            />
            <Route
              path="/chat/progress-details"
              element={<ProgressDetails />}
            />
            <Route
              path="/chat/exercise-details"
              element={<ExerciseDetails />}
            />
            <Route path="/chat/requests" element={<RequestsUser />} />
            <Route path="/saved-cards" element={<SavedCards />} />
            <Route path="/stripe-setup" element={<StripeSetup />} />
            <Route
              path="/workouts/workout-participant"
              element={<WorkoutParticipant />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default UserRoutes;
