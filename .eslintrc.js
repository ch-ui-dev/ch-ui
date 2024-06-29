// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

module.exports = {
  ignorePatterns: [
    'coverage',
    'dist',
    'node_modules',
    'out',
    'tmp',
    'pnpm-lock.yaml',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'react-hooks',
    'react-refresh',
    'jsx-a11y',
    'astro',
    'notice',
  ],
  extends: ['prettier', 'plugin:storybook/recommended'],
  rules: {
    'notice/notice': [
      'error',
      {
        mustMatch:
          'Required notice: Copyright \\(c\\) [0-9]{0,4}, Will Shown <ch-ui@willshown.com>',
        template:
          '// Required notice: Copyright (c) <%= YEAR %>, Will Shown <ch-ui@willshown.com>\n\n',
      },
    ],
  },
  overrides: [
    {
      // Rules for .astro files generally
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      extends: [
        'prettier',
        'plugin:astro/recommended',
        'plugin:astro/jsx-a11y-recommended',
      ],
      rules: {
        'notice/notice': [
          'error',
          {
            mustMatch:
              '---\n// Required notice: Copyright \\(c\\) [0-9]{0,4}, Will Shown <ch-ui@willshown.com>',
            template:
              '---\n// Required notice: Copyright (c) <%= YEAR %>, Will Shown <ch-ui@willshown.com>\n',
            onNonMatchingHeader: 'report',
          },
        ],
      },
    },
    {
      // Rules for `<script/>` tags within .astro files
      files: ['**/*.astro/*.js', '*.astro/*.js'],
      env: {
        browser: true,
        es2020: true,
      },
      parserOptions: {
        sourceType: 'module',
      },
      extends: [
        'prettier',
        'plugin:astro/recommended',
        'plugin:astro/jsx-a11y-recommended',
      ],
      rules: {
        'notice/notice': 'off',
      },
    },
  ],
};
