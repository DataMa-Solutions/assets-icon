module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Code style
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    
    // Best practices
    'no-console': 'off', // Allow console for build scripts
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-duplicate-keys': 'error',
    'no-unreachable': 'error',
    
    // ES6
    'prefer-const': 'error',
    'no-var': 'error',
    'arrow-spacing': 'error',
    
    // Node.js specific
    'no-process-exit': 'off' // Allow process.exit in build scripts
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '*.min.js'
  ]
}; 