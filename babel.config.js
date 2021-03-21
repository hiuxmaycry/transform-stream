module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          allExtensions: true
        }
      ],
      [
        '@babel/env',
        {
          targets: {
            browsers: 'last 2 versions',
          },
          useBuiltIns: 'entry',
          corejs: 3
        }
      ]
    ],
    plugins: [
      '@babel/proposal-class-properties',
      '@babel/transform-strict-mode',
      [
        '@babel/transform-runtime',
        {
          regenerator: true
        }
      ],
    ]
  };
};
