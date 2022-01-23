import { createEvent, createStore, guard, sample } from 'effector';
import { debouncedTransformCode } from './transformer';
import { $mode } from './view-settings';
import { inspect } from 'effector-devtools';

export const LS_CODE_KEY = 'effector-graphite-code';

export const save = createEvent<string>('saving code');
export const $raw = createStore('', { name: 'editor code' });

$raw.on(save, (_, payload) => payload);

$raw.updates.watch((value) => {
  localStorage.setItem(LS_CODE_KEY, JSON.stringify(value));
});

const isAutoRun = guard({
  source: $mode,
  clock: $raw.updates,
  filter: (mode) => mode.autorun,
});

const startTransform = sample({
  source: $raw,
  clock: isAutoRun,
});

startTransform.watch(raw => debouncedTransformCode(raw));

// inspect({
//   $raw,
//   event: {
//     save
//   }
// });
