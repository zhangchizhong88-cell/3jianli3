/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        lime: "#d4ff5b",
        canvas: "#f8f8f8",
      },
      fontFamily: {
        /* 与 index.css @font-face 的 font-family 标识符完全一致（勿加空格） */
        monumentUltra: ["MonumentExtendedUltra", "sans-serif"],
        monument: ["MonumentExtended", "sans-serif"],
        display: ["MonumentExtendedUltra", "ui-sans-serif", "sans-serif"],
        sans: [
          "Inter",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      maxWidth: {
        figma: "1920px",
      },
    },
  },
  plugins: [],
};
