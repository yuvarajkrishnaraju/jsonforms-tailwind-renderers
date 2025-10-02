import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        inlineDynamicImports: true,
        exports: 'named',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        inlineDynamicImports: true,
        exports: 'named',
        sourcemap: true,
      },
    ],
    onwarn(warning, warn) {
      // Ignore module-level directive warnings from external libraries (e.g., "use client")
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
      // Ignore circular dependency warnings
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
    plugins: [
      peerDepsExternal(),
      resolve({ browser: true, preferBuiltins: false }),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        minimize: true,
        inject: {
          insertAt: 'top',
        },
      }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
