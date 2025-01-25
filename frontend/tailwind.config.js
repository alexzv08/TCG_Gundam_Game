/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      rotate: {
        "x-45": "45deg",
        "-x-45": "-45deg",
        "y-15": "15deg",
        "-y-15": "-15deg",
      },
    },
  },
  plugins: [
    require("@xpd/tailwind-3dtransforms")
  ],
}

