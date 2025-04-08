// This file is a wrapper to run the TypeScript extension reloader
// It compiles and runs the TypeScript version on the fly

// Import esbuild-register
const esbuildRegister = require('esbuild-register/dist/node');

// Register esbuild for .ts files
esbuildRegister({
  target: 'node16',
});

// Run the TypeScript version
require('./extension-reloader.ts');
