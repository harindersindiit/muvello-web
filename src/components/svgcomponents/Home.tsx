const HomeIcon = ({
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
        d="M8.74996 16.5837V3.41699C8.74996 2.16699 8.21663 1.66699 6.89163 1.66699H3.52496C2.19996 1.66699 1.66663 2.16699 1.66663 3.41699V16.5837C1.66663 17.8337 2.19996 18.3337 3.52496 18.3337H6.89163C8.21663 18.3337 8.74996 17.8337 8.74996 16.5837Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 9.08366V3.41699C18.3333 2.16699 17.8 1.66699 16.475 1.66699H13.1083C11.7833 1.66699 11.25 2.16699 11.25 3.41699V9.08366C11.25 10.3337 11.7833 10.8337 13.1083 10.8337H16.475C17.8 10.8337 18.3333 10.3337 18.3333 9.08366Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 16.583V15.083C18.3333 13.833 17.8 13.333 16.475 13.333H13.1083C11.7833 13.333 11.25 13.833 11.25 15.083V16.583C11.25 17.833 11.7833 18.333 13.1083 18.333H16.475C17.8 18.333 18.3333 17.833 18.3333 16.583Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HomeIcon;
