import antfu from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import command from "eslint-plugin-command/config";

const eslintIgnore = [
  ".git/",
  ".next/",
  "node_modules/",
  "dist/",
  "build/",
  "coverage/",
  "*.d.ts",
];

export default antfu(
  {
    react: true,
    typescript: true,
    ignores: eslintIgnore,
  },

  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx}"],
    rules: {
      "antfu/if-newline": "off",
      "unused-imports/no-unused-vars": "off",
      "import/first": "error",
      "import/newline-after-import": "error",

      "import/no-duplicates": "error",
      "import/no-self-import": "error",

      "import/order": [
        "warn",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: [
            "object",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],
      "no-dupe-keys": "error",
      "no-else-return": ["error", { allowElseIf: false }],

      "no-lonely-if": "error",
      "node/prefer-global/buffer": "off",
      "node/prefer-global/process": "off",

      "object-shorthand": ["error", "always"],
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-named-exports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          fallbackSort: { type: "unsorted" },
          ignoreAlias: false,
          ignoreCase: true,
          specialCharacters: "keep",
          groupKind: "mixed",
          partitionByNewLine: false,
          partitionByComment: false,
        },
      ],
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: { object: true },
        },
      ],
      "prefer-object-has-own": "error",
      "style/arrow-parens": ["error", "always"],
      "style/quotes": ["error", "double"],
      "style/comma-dangle": "error",
      "style/no-multiple-empty-lines": "off",

      "style/semi": ["error", "always"],
      "ts/no-explicit-any": "off",
      "ts/no-inferrable-types": [
        "error",
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],
      "ts/no-non-null-assertion": "off",
      "ts/no-unused-vars": "error",
      "ts/prefer-for-of": "error",
    },
  },

  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          message: "`useMemo` with empty deps should use `useRef` instead.",
          selector:
            "CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]",
        },
      ],
      "react/no-array-index-key": "off",
      "react-dom/no-missing-button-type": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-refresh/only-export-components": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  {
    files: ["**/*.d.ts"],
    rules: {
      "no-var": "off",
    },
  },

  command(),
  eslintConfigPrettier,
);
