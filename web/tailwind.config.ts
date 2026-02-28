import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'serif'],
        body: ['Poppins', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'sans-serif'],
        script: ['Dancing Script', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'cursive'],
      },
      colors: {
        clay: {
          dark: 'hsl(var(--clay-dark))',
          light: 'hsl(var(--clay-light))',
        },
        terracotta: {
          DEFAULT: 'hsl(var(--primary))',
          glow: 'hsl(var(--terracotta-glow))',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slow-zoom": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pot-form": {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)" },
          "25%": { transform: "scaleY(1.05) scaleX(0.98)" },
          "50%": { transform: "scaleY(0.98) scaleX(1.02)" },
          "75%": { transform: "scaleY(1.02) scaleX(0.99)" },
        },
        "pot-bulge": {
          "0%, 100%": { transform: "translateX(-50%) scaleX(1)" },
          "50%": { transform: "translateX(-50%) scaleX(1.05)" },
        },
        "hands-shape": {
          "0%, 100%": { transform: "translateX(-50%) scaleX(1)" },
          "30%": { transform: "translateX(-50%) scaleX(0.9)" },
          "60%": { transform: "translateX(-50%) scaleX(1.05)" },
        },
        "clay-splash": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.3" },
          "50%": { transform: "translateY(-15px) scale(1.2)", opacity: "0.5" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "0.3" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 8s linear infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "slow-zoom": "slow-zoom 20s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "pot-form": "pot-form 3s ease-in-out infinite",
        "pot-bulge": "pot-bulge 2s ease-in-out infinite",
        "hands-shape": "hands-shape 2.5s ease-in-out infinite",
        "clay-splash": "clay-splash 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
