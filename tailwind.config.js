/** Конфігурація Tailwind CSS (ЛР №12): дизайн-токени з ЛР №2.
 *  Збірка: npx tailwindcss@3.4.17 -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify
 */
module.exports = {
  content: ["./index.html", "./assets/js/*.js"],

  theme: {
    extend: {
      colors: {
        primary: "#347f00",
        "primary-hover": "#2d7500",
        accent: "#38b000",
        dark: "#1e3a2b",
        darkest: "#0c1f14",
        focus: "#528b3d",
        ink: "#1c3026",
        "ink-strong": "#10271c",
        "ink-muted": "#68736c",
        "ink-subtle": "#617067",
        placeholder: "#68736c",
        "ink-on-dark-muted": "rgb(255 255 255 / 72%)",
        "surface-tint": "#edf4ed",
        "surface-control": "#f8faf8",
        "line-control": "#cbd5cd",
        "ink-secondary": "#526157",
        "surface-soft": "#f5f8f3",
        line: "#dce4dd",
        "line-strong": "#bcc8bf",
        "line-subtle": "#e2e7e2",
        "accent-strong": "#27543a",
        "overlay-subtle": "rgb(255 255 255 / 15%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        btn: "7px",
        card: "12px",
      },
      maxWidth: {
        site: "1310px",
      },
      boxShadow: {
        card: "0 3px 14px rgb(19 48 31 / 7%)",
        header: "0 1px 8px rgba(0, 0, 0, 0.07)",
      },
    },
  },
};
