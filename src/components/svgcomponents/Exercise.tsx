const ExerciseIcon = ({
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
      <g clipPath="url(#clip0_2242_9808)">
        <path
          d="M8.33337 2.50033C8.33337 2.72134 8.42117 2.9333 8.57745 3.08958C8.73373 3.24586 8.94569 3.33366 9.16671 3.33366C9.38772 3.33366 9.59968 3.24586 9.75596 3.08958C9.91224 2.9333 10 2.72134 10 2.50033C10 2.27931 9.91224 2.06735 9.75596 1.91107C9.59968 1.75479 9.38772 1.66699 9.16671 1.66699C8.94569 1.66699 8.73373 1.75479 8.57745 1.91107C8.42117 2.06735 8.33337 2.27931 8.33337 2.50033Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 11.667L5.83333 12.5003L6.25 12.0837"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 14.9997V12.4997L7.5 10.0638L8.125 5.83301"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 8.33301V6.66634L8.33333 5.83301L10.4167 7.91634L12.5 8.33301"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 18.3333C17.5 18.1123 17.4122 17.9004 17.2559 17.7441C17.0996 17.5878 16.8877 17.5 16.6667 17.5H3.33333C3.11232 17.5 2.90036 17.5878 2.74408 17.7441C2.5878 17.9004 2.5 18.1123 2.5 18.3333"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 17.5L15.8333 8.33333L17.5 7.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2242_9808">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ExerciseIcon;
