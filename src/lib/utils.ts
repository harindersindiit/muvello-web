import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getProfileStatus(user) {
  if (!user || Object.keys(user).length === 0) return "unauthenticated";
  if (user && user.role === "admin") return "unauthenticated";

  console.log(user);

  const isBasicInfoIncomplete =
    !user.dob ||
    !user.height_value ||
    !user.weight_value ||
    !user.gender ||
    !user.bio;

  if (isBasicInfoIncomplete) return "incomplete-basic-info";

  if (!user.experience_level) return "incomplete-experience";

  if (!user.profile_picture) return "incomplete-picture";

  if (!user.completed_profile) return "profile-setup-completed";

  return "complete";
}

export function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

export const totalWorkoutDuration = (exercises: any[]) => {
  if (!Array.isArray(exercises) || exercises.length === 0) return 0;

  // Total workout duration
  const totalDuration = exercises.reduce((total: number, item: any) => {
    return total + Number(item.workout_duration || 0);
  }, 0);

  // Count unique workout days using week + day combination
  const uniqueDays = new Set(
    exercises.map((item) => `${item.week}-${item.day}`)
  );

  const totalDays = uniqueDays.size || 1; // fallback to 1 to avoid divide-by-zero

  const avg = totalDuration / totalDays;

  return Math.round(avg);
};
