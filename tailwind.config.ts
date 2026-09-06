import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Opacity-safe via <alpha-value> — enables bg-primary/80 with OKLCH fallback
        primary: "oklch(from var(--theme-primary) l c h / <alpha-value>)",
        "primary-hover": "oklch(from var(--theme-primary-hover) l c h / <alpha-value>)",
        accent: "oklch(from var(--theme-accent) l c h / <alpha-value>)",
        "accent-hover": "oklch(from var(--theme-accent-hover) l c h / <alpha-value>)",
        "bg-page": "var(--theme-bg-page)",
        "card-bg": "var(--theme-card-bg)",
        border: "var(--theme-border)",
        "border-strong": "var(--theme-border-strong)",
        "text-primary": "var(--theme-text-primary)",
        "text-secondary": "var(--theme-text-secondary)",
        "badge-bg": "var(--theme-badge-bg)",
        "badge-text": "var(--theme-badge-text)",
        "announcement-bg": "var(--theme-announcement-bg)",
        "announcement-text": "var(--theme-announcement-text)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        cairo: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
      container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
    },
  },
  plugins: [
    // Enable container queries: @container (Chrome 105+, Safari 16+)
    // If plugin is installed via @tailwindcss/container-queries, auto-enables; fallback to manual CSS in globals.css
  ],
};
export default config;
