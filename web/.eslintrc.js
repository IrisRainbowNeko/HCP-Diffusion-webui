module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 关闭严格模式
    strict: 'off',
    // 允许if语句中return语句之后还有else
    'no-else-return': 'off',
    'array-bracket-spacing': 'off',
    // 允许空函数
    'no-empty-function': 'off',
    // 不允许使用eval
    'no-eval': 'error',
    // 不允许使用==
    'no-eq-null': 0,
    // 不允许出现未使用变量
    'no-unused-vars': 'error',
    // 不允许出现无法执行的代码
    'no-unreachable': 'error',
    // 禁止修改const声明的变量
    'no-const-assign': 'error',
    // 禁止不必要的分号
    'no-extra-semi': 'error',
    // 要求箭头函数的参数使用括号，不允许 _ => {}这样子
    'arrow-parens': 'error',
    // 强制把变量的使用限制在其定义的作用域范围内
    'block-scoped-var': 'error',
    // 不允许使用alert
    'no-alert': 'error',
    // 不允许使用caller
    'no-caller': 'error',
    // 不允许使用labels
    'no-labels': 'error',
    // 不允许使用var
    'no-var': 'error',
    // 未改变过的变量强制使用const
    'prefer-const': 'error',
    // 禁止空格和 tab 的混合缩进
    'no-mixed-spaces-and-tabs': 'error',
    // 要求文件末尾存在空行
    'eol-last': ['error', 'always'],
    // 强制使用unix的换行风格
    // 'linebreak-style': ['error', 'unix'],
    // 禁止在圆括号内使用空格， 不要这样foo( 'bar' )
    'space-in-parens': ['error', 'never'],
    // 禁止在逗号前使用空格，逗号后要有空格
    'comma-spacing': ['error', { before: false, after: true }],
    // 强制使用分号
    semi: ['error', 'always'],
    // 强制使用单引号
    quotes: ['error', 'single'],
    // 强制space缩进
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 'first',
        MemberExpression: 1,
        ArrayExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false
      }
    ],
    // 函数体前空格， 具名函数和匿名函数不需要
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    // 强制block之前使用一致的空格
    'space-before-blocks': [
      'error',
      {
        keywords: 'always'
      }
    ],
    // 禁止不规则空白
    'no-irregular-whitespace': [
      'error',
      {
        skipComments: true
      }
    ]
  }
};
