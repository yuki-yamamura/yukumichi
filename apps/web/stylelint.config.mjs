/** @type {import('stylelint').Config} */
const stylelintConfig = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-config-recess-order",
    "@css-modules-kit/stylelint-plugin/recommended",
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
  },
};

export default stylelintConfig;
