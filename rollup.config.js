export default [
  {
    input: 'src/main.js',
    output: {
      file: 'build/main.js',
      format: 'iife',
    },
  },
  {
    input: 'src/inject.js',
    output: {
      file: 'build/inject.js',
      format: 'iife',
    },
  },
  {
    input: 'src/injectception.js',
    output: {
      file: 'build/injectception.js',
      format: 'iife',
    },
  },
];
