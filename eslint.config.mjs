import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

// Helper: convert all rule levels to "warn"
function warnOnly(config) {
  if (!config.rules) return config;
  const newRules = {};
  for (const [key, value] of Object.entries(config.rules)) {
    if (Array.isArray(value)) {
      newRules[key] = ['warn', ...value.slice(1)];
    } else {
      newRules[key] = 'warn';
    }
  }
  return { ...config, rules: newRules };
}

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  warnOnly(tseslint.configs.recommended),
  warnOnly(pluginReact.configs.flat.recommended),
]);
