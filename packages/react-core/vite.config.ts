import { defineConfig } from "vite";
// import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
// import { ThemePlugin } from "@ch-ui/theme/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // ThemePlugin({
    //   root: __dirname,
    //   content: [
    //     resolve(__dirname, "./index.html"),
    //     resolve(__dirname, "./src/**/*.{js,ts,jsx,tsx}"),
    //   ],
    // }),
  ],
});
