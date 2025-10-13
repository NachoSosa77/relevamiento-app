import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extensiones base de Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Reglas personalizadas
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "off", // solo warning, no error
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // React
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // General
    "no-console": ["warn", { "allow": ["warn", "error"] }], // 👈 permite warn/error
    "no-debugger": "warn",
    },
  },
];

export default eslintConfig;
