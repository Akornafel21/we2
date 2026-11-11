// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

const nodePlugin = require('eslint-plugin-node');

const securityPlugin = require('eslint-plugin-security');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // Base recommended rules
  eslint.configs.recommended,
  
  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      node: nodePlugin,
      security: securityPlugin,
    },
    rules: {
      // ============================================
      // TypeScript Specific Rules
      // ============================================
      // Set to 'warn' to allow implicit 'any' types, 'error' to disallow
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Unused variables: 'error' | 'warn' | 'off'
      // Variables starting with '_' are ignored
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      
      // Promises must be handled: 'error' | 'warn' | 'off'
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      
      // Type safety rules (adjust from 'warn' to 'error' for stricter checking)
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      
      // Code style suggestions (can be 'error' if you want stricter enforcement)
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      
      // Turn off if you don't want explicit return types everywhere
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // ============================================
      // General Code Quality Rules
      // ============================================
      // Console statements: 'error' | 'warn' | 'off'
      // Set to 'off' if you want to allow console.log in production
      'no-console': 'warn',
      
      // Debugger statements: 'error' | 'warn' | 'off'
      'no-debugger': 'error',
      
      // Code quality: 'error' | 'warn' | 'off'
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead

      // ============================================
      // Node.js Specific Rules
      // ============================================
      'node/no-missing-import': 'off', // TypeScript handles imports
      'node/no-unsupported-features/es-syntax': 'off', // TypeScript transpiles
      'node/no-extraneous-import': 'off', // Can be 'warn' to catch extra deps
      'node/no-unpublished-import': 'warn', // Warns about dev-only imports

      // ============================================
      // Security Rules
      // ============================================
      // Object injection: 'error' | 'warn' | 'off'
      'security/detect-object-injection': 'warn',
      
      // File system: 'error' | 'warn' | 'off'
      'security/detect-non-literal-fs-filename': 'warn',
      
      // Eval usage: 'error' | 'warn' | 'off'
      'security/detect-eval-with-expression': 'error',
      
      // Regex: 'error' | 'warn' | 'off'
      'security/detect-non-literal-regexp': 'warn',
      
      // Timing attacks: 'error' | 'warn' | 'off'
      'security/detect-possible-timing-attacks': 'warn',
      
      // CSRF protection: 'error' | 'warn' | 'off'
      'security/detect-no-csrf-before-method-override': 'warn',
    },
  },

  // JavaScript files configuration (for config files)
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      node: nodePlugin,
    },
    rules: {
      'node/no-unsupported-features/es-syntax': 'off',
    },
  },

  // Test files - more lenient rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'node/no-unpublished-import': 'off',
      'no-console': 'off', // Allow console statements in tests for debugging
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
    ],
  },

  // Prettier config (disables conflicting formatting rules)
  prettierConfig,
];
