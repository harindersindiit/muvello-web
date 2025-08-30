// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#94eb00",
        lightdark: "#212121",
        grey: "#6f6f6f",
        "green-primary": "#94eb00",
      },
      fontFamily: {
        primary: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
