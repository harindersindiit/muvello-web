const MessagesIcon = ({
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
        d="M14.9834 8.99167V12.325C14.9834 12.5417 14.9751 12.75 14.9501 12.95C14.7584 15.2 13.4334 16.3167 10.9918 16.3167H10.6584C10.4501 16.3167 10.2501 16.4167 10.1251 16.5833L9.12509 17.9167C8.68343 18.5083 7.96675 18.5083 7.52508 17.9167L6.52507 16.5833C6.41674 16.4417 6.17508 16.3167 5.99175 16.3167H5.65842C3.00009 16.3167 1.66675 15.6583 1.66675 12.325V8.99167C1.66675 6.55001 2.79176 5.22501 5.03342 5.03334C5.23342 5.00834 5.44176 5 5.65842 5H10.9918C13.6501 5 14.9834 6.33334 14.9834 8.99167Z"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3168 5.65867V8.992C18.3168 11.442 17.1918 12.7587 14.9501 12.9503C14.9751 12.7503 14.9834 12.542 14.9834 12.3253V8.992C14.9834 6.33367 13.6501 5.00033 10.9918 5.00033H5.65845C5.44178 5.00033 5.23345 5.00867 5.03345 5.03367C5.22511 2.792 6.55011 1.66699 8.99178 1.66699H14.3251C16.9834 1.66699 18.3168 3.00033 18.3168 5.65867Z"
        stroke={color}
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2462 11.0417H11.2537"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.32966 11.0417H8.33716"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.41292 11.0417H5.42042"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MessagesIcon;
