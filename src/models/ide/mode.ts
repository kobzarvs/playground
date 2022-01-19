import { createEvent, restore } from 'effector';
import { FragmentOptions } from '../diagram/renderFragment';
import { LabelModes } from '../types';

export const LS_MODE_KEY = 'effector-graphite-mode';

export const setMode = createEvent<FragmentOptions>();

const defaultMode: FragmentOptions = JSON.parse(localStorage.getItem(LS_MODE_KEY) || 'null') || {
  labels: LabelModes.AUTO_NAME,
  owners: 'removed',
  links: 'removed',
  next: 'visible',
  shapes: {
    styled: true,
    colored: true,
  },
  domains: true,
  preset: 'show domains',
  autorun: true,
};

export const $mode = restore<FragmentOptions>(setMode, defaultMode);

$mode.updates.watch(mode => {
  localStorage.setItem('effector-graphite-mode', JSON.stringify(mode));
})
