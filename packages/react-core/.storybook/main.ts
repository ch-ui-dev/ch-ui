import type { StorybookConfig } from "@storybook/react-vite";
import {ThemePlugin} from "@ch-ui/theme/plugin";
import { mergeConfig } from "vite";
import { resolve } from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [
        ThemePlugin({
          root: __dirname,
          content: [resolve(__dirname, "../src") + "/**/*.{ts,tsx,js,jsx}"],
        }),
      ],
    }),
  docs: {
    autodocs: "tag",
  },
};
export default config;
