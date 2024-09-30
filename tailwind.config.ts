import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-custom': 'pulse-custom 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-custom': {
          '0%, 100%': { transform: 'scale(1)' }, // Bắt đầu và kết thúc ở kích thước bình thường
          '50%': { transform: 'scale(1.2)' }, // Giữa quá trình sẽ phóng to lên 1.2 lần
        },
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(315deg, #f5df2e 0%, #f07654 74%)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FFF9E4",  
        secondary: "#FFC508",  
        tertiary: "#EEEEEE",
      },
    },
    
  },
  plugins: [],
};

export default config;
