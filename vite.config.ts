import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import babelPlugin from 'effector/babel-plugin';
// import babel from '@babel/core';
// import ts from '@babel/preset-typescript';
//
// export const effector = (config) => {
//   return {
//     name: 'effector-vite-plugin',
//     transform(src, id) {
//       if (!id.match(/\.(ts|tsx|js)$/)) return { code: src };
//       const result = babel.transformSync(src, {
//         presets: [ts],
//         plugins: config ? [[babelPlugin, config]] : [babelPlugin],
//         filename: id,
//       });
//
//       return {
//         code: result.code,
//         map: result.map,
//       };
//     },
//   };
// };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // effector(),
  ],
});
