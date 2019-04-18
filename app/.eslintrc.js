module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: 'airbnb',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true,
            modules: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        indent: ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "no-underscore-dangle": ["error", { "allow": ["foo_", "_bar"] }],
        "react/destructuring-assignment": 0,
        "prefer-destructuring": 0,
        "react/prop-types": 0,
        "object-shorthand": 0,
        "max-len": 0,
        "no-console": 0
    },
};
