/**
 * What it does: Provides the optional Tailwind config file mapping all design tokens to CSS variables in `frontend/src/index.css`.
 * Who uses it: Referenced by Tailwind tooling and developers inspecting the design system.
 * What it talks to: Reads CSS variables defined in `frontend/src/index.css`.
 *
 * HOW TO CHANGE A COLOR:
 * Edit the hex values inside `:root` in `frontend/src/index.css`.
 */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
        dark: "var(--color-dark)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        white: "var(--color-white)",
        "series-thermal": "var(--color-series-thermal)",
        "series-gas": "var(--color-series-gas)",
        "series-solar": "var(--color-series-solar)",
        "status-online": "var(--color-status-online)",
        "status-warning": "var(--color-status-warning)",
        "status-critical": "var(--color-status-critical)",
        "status-offline": "var(--color-status-offline)",
        "status-stale": "var(--color-status-stale)",
        "status-info": "var(--color-status-info)",
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
};

