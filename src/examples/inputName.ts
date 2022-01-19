import { createEvent, createStore, restore } from 'effector';
// import { inspect } from 'effector-devtools';

export const $store = createStore('', { name: 'name' });

export const change = createEvent<string>('change');
export const resetInput = createEvent();

$store.on(change, (_, value) => value);
$store.reset(resetInput);

// inspect({
//   events: {
//     change,
//     resetInput,
//   },
//   state: {
//     input: $store,
//   },
// }, 'Profile #2');
//
// inspect({
//   change,
//   resetInput,
//   $store,
// }, 'Profile #1');
