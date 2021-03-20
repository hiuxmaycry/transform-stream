module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "max-len": ["error", { "code": 80, "tabWidth": 2 }],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["error"]
  }
};
