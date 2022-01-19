import { DotOptions } from '../types';

export function renderDot(dot: string | string[], options: DotOptions = {}): string {
  const opts: DotOptions = {
    label: '',
    fontsize: 24,
    fontcolor: '#333333',
    labelloc: 't',
    splines: true,
    overlap: false,
    rankdir: 'TD',
    margin: 0.1,
    ...options,
  };

  let computedOptions = Object.keys(opts).map(key => `${key}=${JSON.stringify(opts[key as keyof DotOptions])}`).join(' ');
  const result: string = Array.isArray(dot) ? dot.join('') : dot;
  return `
    digraph "effector graphite" {
      graph [${computedOptions}];
      ${result}
    }
  `;
}
