import { createEvent, restore } from 'effector';
import { LabelModes, LayoutSubMode } from '../types';

export const LS_MODE_KEY = 'effector-graphite-mode';

export type ViewSettings = {
  clasterization: boolean;
  prefix?: string;

  labels: LabelModes;
  owners: LayoutSubMode;
  links: LayoutSubMode;
  next: LayoutSubMode;
  styled: boolean,
  colored: boolean,
  domains: boolean,
  internals: boolean,
  autorun: boolean,
}
export const setMode = createEvent<ViewSettings>();

export const FRAGMENT_OPTIONS_KEYS = [
  'labels',
  'owners',
  'links',
  'next',
  'styled',
  'colored',
  'domains',
  'internals',
  'autorun',
];

let defaultMode: ViewSettings = {
  labels: LabelModes.AUTO_NAME,
  owners: 'removed',
  links: 'removed',
  next: 'visible',
  styled: true,
  colored: true,
  domains: true,
  internals: false,
  autorun: true,
};

let savedRawMode = localStorage.getItem(LS_MODE_KEY);

let currentMode: ViewSettings;

try {
  currentMode = JSON.parse(savedRawMode || 'null') || defaultMode;

} catch (e) {
  console.error(e);
  console.log('mode condig:', savedRawMode);
  // @ts-ignore
  console.log('mode condig:', currentMode);
}

currentMode = FRAGMENT_OPTIONS_KEYS.reduce<ViewSettings>((acc, opt) => {
  // @ts-expect-error
  acc[opt] = typeof currentMode[opt] === 'undefined' ? defaultMode[opt] : currentMode[opt];
  return acc;
}, {});

export const $mode = restore<ViewSettings>(setMode, currentMode);

$mode.watch(mode => {
  localStorage.setItem(LS_MODE_KEY, JSON.stringify(mode));
});
