module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", 
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "plugins": [
    "@typescript-eslint",
    "jest",
    "import"
  ],
  "rules": {
    "max-len": ["error", { "code": 100, "tabWidth": 2 }],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["error"]
  }
};
