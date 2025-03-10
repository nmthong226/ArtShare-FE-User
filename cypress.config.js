import { defineConfig } from "cypress";
import coverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      coverageTask(on, config)
      return config
    },
  },
});
