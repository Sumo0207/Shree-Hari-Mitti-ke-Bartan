module.exports = {
  extends: [
    'stylelint-config-recommended',
    // tailwind-specific rules
    'stylelint-config-tailwindcss'
  ],
  rules: {
    // Allow Tailwind directives and @apply
    'at-rule-no-unknown': null
  }
};
