import React from 'react';
// import * as  pathLibrary from '../lib/path.js';

 // pathLibrary = import('../lib/path.js');

// let modules: Record<string, any> = {
//   // path: pathLibrary,
// };

export let effectorBabelPlugin: any = undefined;

// @ts-ignore
window.require = path => {
  switch (path) {
    case 'symbol-observable':
      return (Symbol as any).observable || '@@observable';
    // case 'path':
      // return pathLibrary;
    case 'react':
      return React;
  }
};

export const loadEffectorBabelPlugin = async () => {
  if (effectorBabelPlugin) return;

  const effectorBabelPluginUrl = 'https://effector--canary.s3-eu-west-1.amazonaws.com/effector/babel-plugin.js';

  const req = await fetch(effectorBabelPluginUrl);
  let text = await req.text();
  text = text.replace(
    /\/\/# sourceMappingURL=.*$/m,
    `//# sourceMappingURL=${effectorBabelPluginUrl}.map`,
  );
  // @ts-ignore
  window.process ||= { env: { NODE_ENV: 'development' } };
  // @ts-ignore
  // window.module = {
  //   exports: {
  //     path: {pathLibrary},
  //     // @ts-ignore
  //     process: (...args) => {
  //       console.log('process', args);
  //     },
  //   },
  // };
  effectorBabelPlugin = eval(`'use strict';
  ${text}\n//# sourceMappingURL=${effectorBabelPluginUrl}`);
};

// loadEffectorBabelPlugin();
