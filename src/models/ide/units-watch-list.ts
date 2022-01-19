import { createEvent, createStore, sample, Unit } from 'effector';
import { createIndex, requestCreateIndex } from '../graphite';

export const Groups = {
  events: 'Events',
  domains: 'Domains',
  stores: 'Stores',
  effects: 'Effects',
};

export type UnitsWatchList = Record<string, Unit<any>[]>;

export const $unitsWatchList = createStore<UnitsWatchList>({
  events: [],
  domains: [],
  stores: [],
  effects: [],
});

export const addUnit = createEvent<{ group: string, unit: Unit<any> }>();

export const removeUnit = createEvent<{ group: string, unit: Unit<any> }>();

export const reset = createEvent();

export const units: Record<'domains' | 'events' | 'stores' | 'effects', Record<'push' | 'remove', (unit: Unit<any>) => void>> = {
  domains: {
    push: unit => addUnit({ group: 'domains', unit }),
    remove: unit => removeUnit({ group: 'domains', unit }),
  },
  events: {
    push: unit => addUnit({ group: 'events', unit }),
    remove: unit => removeUnit({ group: 'events', unit }),
  },
  stores: {
    push: unit => addUnit({ group: 'stores', unit }),
    remove: unit => removeUnit({ group: 'stores', unit }),
  },
  effects: {
    push: unit => addUnit({ group: 'effects', unit }),
    remove: unit => removeUnit({ group: 'effects', unit }),
  },
};

$unitsWatchList
  .on(addUnit, (state, { group, unit }) => ({
    ...state,
    [group]: [...state[group], unit],
  }))
  .on(removeUnit, (state, { group, unit }) => ({
    ...state,
    [group]: state[group].filter(u => {
      // @ts-ignore
      return u.id !== unit.id
    }),
  }))
  .reset(reset);

sample({
  source: $unitsWatchList,
  clock: requestCreateIndex,
  fn: (watchList) => watchList,
  target: createIndex,
});
