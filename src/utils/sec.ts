export const getMinutesFromSeconds = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

export const getMaxWeek = (arr, key = null) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const max = key
    ? Math.max(...arr.map((item) => item[key] ?? 0))
    : Math.max(...arr);

  return `${max} week${max !== 1 ? "s" : ""}`;
};
