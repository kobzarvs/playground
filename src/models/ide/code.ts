import { createEvent, createStore, guard } from 'effector';
import { debouncedTransformCode } from './transformer';
import { $mode } from './mode';
import { inspect } from 'effector-devtools';

export const LS_CODE_KEY = 'effector-graphite-code';

export const $raw = createStore('');

export const save = createEvent<string>();

$raw.on(save, (_, payload) => payload);

$raw.updates.watch((value) => {
  localStorage.setItem(LS_CODE_KEY, JSON.stringify(value));
  debouncedTransformCode(value);
});

// guard({
//   source: $mode,
//   filter: (mode) => mode.autorun,
// })

// inspect({
//   $raw,
//   event: {
//     save
//   }
// });
