import { combine, createDomain, createEffect, sample } from 'effector';
import { inspect } from 'effector-devtools';

export const counterDomain = createDomain('Counter domain');

// counterDomain.onCreateStore(console.log);

export const $counter = counterDomain.createStore<number>(0, { name: 'counter' });

export const inc = counterDomain.createEvent('inc');
export const dec = counterDomain.createEvent('dec');
export const reset = counterDomain.createEvent('reset');
export const fxTrigger = counterDomain.createEvent('fxTrigger');

type TEffectParams = {
  value: number;
  controller: AbortController;
  timeout?: number
}

export const effect = createEffect<(params: TEffectParams) => Promise<number>>({
  name: 'effect',
  handler: ({
    value,
    controller,
    timeout = 1000,
  }: TEffectParams): Promise<number> => {
    return new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout;
      const removeListeners = () => {
        clearTimeout(timer);
        reject();
      };
      controller.signal.addEventListener('abort', removeListeners);

      timer = setTimeout(() => {
        controller.signal.removeEventListener('abort', removeListeners);
        resolve && resolve(value);
        queueMicrotask(() => effect({ value: value + 1, controller, timeout }));
      }, timeout);
    });
  },
});

$counter
  .on(inc, state => state + 1)
  .on(dec, state => state - 1)
  // .on(effect.doneData, (state, value) => value)
  // .on(effect.failData, (state, value) => state)
  // .on(effect.finally, (state, value) => state)
  .reset(reset);

// effect.pending.watch(console.log);
// effect.inFlight.updates.watch(console.log);

// $counter.watch(console.log);
$counter.updates.watch((value) => {
  //console.log('counter', value)
});

export const $mappedStore1 = $counter.map(value => ({ value }));
// @ts-ignore
$mappedStore1.graphite.meta.name = 'mappedStore1';

export const $mappedStore2 = $counter.map(value => ({ value }));
// @ts-ignore
$mappedStore2.graphite.meta.name = 'mappedStore2';

export const $combinedStore = combine($mappedStore1, $mappedStore2, (store1, store2) => [store1, store2]);
// @ts-ignore
$combinedStore.graphite.meta.name = 'combinedStore';

$combinedStore.watch(() => {
});

sample({
  source: [$counter, $combinedStore],
  clock: fxTrigger,
  fn: () => {
    return {
      value: 0,
      controller: new AbortController(),
    };
  },
  // target: effect,
});

// inspect({
//   event: {
//     inc, dec, reset,
//   },
//   counter: $counter,
// });
//
// inc();
// reset();
// inc();
// inc();
// dec();
