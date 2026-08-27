import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // 360px — межа малих телефонів (iPhone SE, старі Android).
      // Нижче неї великий текст і горизонтальні пари кнопок не влазять.
      screens: { xs: "360px" },
      // Палітра стилістики хіро: електричний синій + кислотний лайм.
      // Назви токенів лишились колишні — так уся сторінка перефарбувалась
      // без переписування 15 компонентів. Читати як ролі, не як кольори:
      //   ink   — основний темний (тепер синій, не чорний)
      //   pink  — вторинні поверхні (тепер відтінки синього)
      //   cream — фон сторінки (тепер майже білий)
      // Палітра стилістики хіро: електричний синій + кислотний лайм.
      // Токени лишились ті самі — так уся сторінка перефарбувалась без
      // переписування 15 компонентів. Читати як ролі, не як кольори:
      //   ink   — текст і темні поверхні (майже чорний, з синім підтоном)
      //   pink  — вторинні поверхні (тепер відтінки синього)
      //   cream — фон сторінки
      //   blue  — фірмовий синій зі зразка, для акцентів і темних секцій
      colors: {
        ink: "#0B1030",
        lime: "#CCFF00",
        pink: { DEFAULT: "#2F63FF", soft: "#DDE6FF", deep: "#0038FF" },
        cream: "#F8F9FA",
        blue: { DEFAULT: "#0038FF", deep: "#001A99" },
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
        // Трохи повільніше за дефолтний spin: різкий оберт на великому
        // кружку виглядає нервово.
        "spin-slow": "spin 900ms linear infinite",
        marquee: "marquee 28s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        rise: "rise .7s cubic-bezier(.2,.7,.3,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
