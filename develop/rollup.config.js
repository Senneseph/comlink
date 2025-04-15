import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const packageJson = require('./package.json');

export default [
  // ESM and UMD builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: '../dist/comlink.esm.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: '../dist/comlink.esm.min.js',
        format: 'esm',
        plugins: [terser()],
        sourcemap: true
      },
      {
        file: '../dist/comlink.js',
        format: 'umd',
        name: 'Comlink',
        sourcemap: true
      },
      {
        file: '../dist/comlink.min.js',
        format: 'umd',
        name: 'Comlink',
        plugins: [terser()],
        sourcemap: true
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  // Type definitions
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: '../dist/index.d.ts', format: 'es' }],
    plugins: [dts()]
  }
];
