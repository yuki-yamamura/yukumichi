/** @type {import('stylelint').Config} */
const stylelintConfig = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-config-recess-order",
    "@css-modules-kit/stylelint-plugin/recommended",
  ],
  plugins: [
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-use-logical",
    "stylelint-use-nesting",
  ],
  rules: {
    "selector-class-pattern": [
      "^[a-z][a-zA-Z0-9]*$",
      {
        message: "Expected class selector to be camelCase",
      },
    ],
    "custom-property-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: "Expected custom property name to be kebab-case",
      },
    ],
    "keyframes-name-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: "Expected keyframe name to be kebab-case",
      },
    ],
    "plugin/declaration-block-no-ignored-properties": true,
    "csstools/use-logical": [
      "always",
      { except: ["top", "right", "bottom", "left"] },
    ],
    "csstools/use-nesting": "always",
  },
};

export default stylelintConfig;
