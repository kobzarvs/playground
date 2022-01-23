import { transform } from '@babel/standalone';
import { execute } from './execute';
import { debounce, throttle } from 'lodash';
import { requestCreateIndex } from '../graphite';
import { babelPlugin } from '../../lib/effector-babel-plugin';
import { LS_CODE_KEY } from './code';


export const transformCode = async (raw?: any, event?: any) => {
  if (!raw) {
    // @ts-ignore
    raw = JSON.parse(localStorage.getItem(LS_CODE_KEY)) || '';
  }
  const result = transform(raw, {
    ast: true,
    filename: 'playground',
    sourceFileName: 'playground',
    presets: [
      'env',
      'react',
      ['typescript', { isTSX: true, allExtensions: true }],
    ],
    parserOpts: {
      allowAwaitOutsideFunction: true,
      ranges: true,
      tokens: true,
    },
    generatorOpts: {
      shouldPrintComment: () => true,
    },
    sourceMaps: 'inline',

    plugins: [
      () => ({
        visitor: {
          ExportNamedDeclaration(path: any) {
            path.replaceWith(path.node.declaration);
          },
          ImportDeclaration(path: any) {
            path.remove();
          },
        },
      }),

      [babelPlugin, {
        addLoc: true,
      }],
    ],
  });
  // console.log(result.code);
  await execute(result);

  requestCreateIndex();
};

export const TRANSFORMATION_TIMEOUT = 1000;
export const debouncedTransformCode = debounce(transformCode, TRANSFORMATION_TIMEOUT);
export const run = throttle(transformCode, 500);

// @ts-ignore
window.r = run;
