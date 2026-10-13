import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  {
    ignores: [
      '**/dist',
      '**/build',
      '**/coverage',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}', '**/*.vue'],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }],
        },
      ],

      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/newline-after-import': ['error', { count: 1 }],

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'no-unused-vars': 'off',

      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-debugger': 'error',
      'no-console': 'error',
      'no-shadow': 'off',
    },
  },

  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-var-requires': 'error',

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
        },
      ],

      '@typescript-eslint/explicit-module-boundary-types': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'off',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      '@typescript-eslint/no-shadow': 'error',
    },
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      ...vuePlugin.configs['flat/recommended'].rules,
      'vue/multi-word-component-names': 'error',
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never',
            normal: 'always',
            component: 'always',
          },
        },
      ],
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 1 },
          multiline: { max: 1 },
        },
      ],
    },
  },
  prettierConfig,
];
