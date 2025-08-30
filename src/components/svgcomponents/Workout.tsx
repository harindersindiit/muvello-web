const WorkoutIcon = ({
  color,
  width,
  height,
}: {
  color: string;
  width: number;
  height: number;
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <path
        d="M14.3167 15C16.3167 15 16.8167 13.875 16.8167 12.5V7.5C16.8167 6.125 16.3167 5 14.3167 5C12.3167 5 11.8167 6.125 11.8167 7.5V12.5C11.8167 13.875 12.3167 15 14.3167 15Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.68335 15C3.68335 15 3.18335 13.875 3.18335 12.5V7.5C3.18335 6.125 3.68335 5 5.68335 5C7.68335 5 8.18335 6.125 8.18335 7.5V12.5C8.18335 13.875 7.68335 15 5.68335 15Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.18335 10H11.8167"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 12.0837V7.91699"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.25 12.0837V7.91699"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WorkoutIcon;
