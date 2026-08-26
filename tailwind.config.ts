import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // 360px — межа малих телефонів (iPhone SE, старі Android).
      // Нижче неї великий текст і горизонтальні пари кнопок не влазять.
      screens: { xs: "360px" },
      colors: {
        ink: "#0E0E10",
        lime: "#DEFF3C",
        pink: { DEFAULT: "#F4A8F2", soft: "#FBE0FA", deep: "#D96FD6" },
        cream: "#F4F2F0",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.75rem" },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        rise: "rise .7s cubic-bezier(.2,.7,.3,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
