require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:vue/recommended',
    '@vue/typescript/recommended',
    '@vue/eslint-config-prettier',
    'prettier',
  ],
  plugins: ['sonarjs', 'vue', 'prettier'],
  rules: {
    // 强制数组方法的回调函数中有 return 语句
    'array-callback-return': 'error',
    // 限制函数圈复杂度不超过 10
    complexity: ['error', 10],
    // 限制函数认知复杂度不超过 15
    'sonarjs/cognitive-complexity': ['error', 15],
    // 要求函数使用一致的 return 语句【总是指定返回值或返回 undefined 无论是隐式或显式】
    'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],
    // 禁止在 else 前有 return
    'no-else-return': 'error',
    // 禁止使用不带 await 表达式的 async 函数
    'require-await': 'error',
    // 禁止在undefined值上使用可选链
    'no-unsafe-optional-chaining': 'error',
    // 在模块中强制执行排序的导入声明。
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
  },
}
