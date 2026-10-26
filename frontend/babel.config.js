module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@navigation': './src/navigation',
          '@types': './src/types',
          '@styles': './src/styles',
          '@utils': './src/utils',
        },
      }],
      ['nativewind/babel'],
    ],
  };
};
