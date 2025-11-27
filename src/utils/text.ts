export const truncateText = (
  value: string | null | undefined,
  maxLength = 33,
  suffix = "..."
) => {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength) + suffix;
};
