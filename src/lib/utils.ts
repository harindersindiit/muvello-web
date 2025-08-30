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

  return "complete";
}

export function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}
