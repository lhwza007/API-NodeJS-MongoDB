import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // ตรวจจับตัวแปรที่ไม่ได้ใช้
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // ตรวจจับ import ที่ไม่ได้ใช้
      "@typescript-eslint/no-require-imports": "error",
      // ห้าม any แบบ explicit
      "@typescript-eslint/no-explicit-any": "warn",
      // ห้าม empty function
      "@typescript-eslint/no-empty-function": "warn",
      // บังคับใช้ return type บน function
      "@typescript-eslint/explicit-function-return-type": "off",
      // ห้าม floating promise
      "@typescript-eslint/no-floating-promises": "error",
      // ห้าม useless constructor
      "@typescript-eslint/no-useless-constructor": "error",
      // ทั่วไป
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
