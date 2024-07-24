const restricted = [
  {
    name: '@vueuse/core',
    importNames: ['isIOS', 'hasOwn', 'hyphenate', 'camelize', 'createReusableTemplate', 'toRef', 'toRefs'],
  },
  {
    name: 'vue',
    importNames: ['MaybeRefOrGetter', 'toValue'],
  },
];

module.exports = {
  root: true,
  extends: 'h21',
  rules: {
    'no-restricted-imports': [2, { paths: restricted }],
  },
  overrides: [
    {
      files: ['src/utils/**/*'],
      rules: {
        'no-restricted-imports': 0,
        'vue/prefer-import-from-vue': 0,
      },
    },
  ],
};
