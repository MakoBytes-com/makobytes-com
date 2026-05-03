import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // Bulldog brand-blue scale — primary navy palette mirrored from makobot.com
        brand: {
          50: "#e6f0f9",
          100: "#cce1f3",
          200: "#99c3e7",
          300: "#66a5db",
          400: "#3387cf",
          500: "#006fb9",
          600: "#0061aa",
          700: "#004d88",
          800: "#003966",
          900: "#002643",
          950: "#001321",
        },
        // Legacy `ink-*` scale repurposed for the light theme — values shift from
        // the old dark cinematic palette to a navy-greyscale that reads on white.
        ink: {
          50: "#f8f9fb",
          100: "#eef2f7",
          200: "#dbdbdb",
          300: "#c1c5cd",
          400: "#999999",
          500: "#777777",
          600: "#555555",
          700: "#406f7b",
          800: "#333333",
          900: "#1a1a1a",
          950: "#0d0d0d",
        },
        // Legacy `glow-*` keys retained for markup compatibility but recolored
        // into the navy palette so any leftover class references stay on-theme.
        glow: {
          cyan: "#0061aa",
          violet: "#0061aa",
          blue: "#0061aa",
          magenta: "#406f7b",
          lime: "#04bf6c",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "grid-flow": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(60px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "grid-flow": "grid-flow 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
