import { createEvent, createStore, sample } from 'effector';
import { createIndex, requestCreateIndex } from '../graphite';
import { Unit, Node } from '../../types';

export const Groups = {
  events: 'Events',
  domains: 'Domains',
  stores: 'Stores',
  effects: 'Effects',
};

export type UnitsWatchList = Record<keyof typeof Groups, Node[]>;

export const $unitsWatchList = createStore<UnitsWatchList>({
  events: [],
  domains: [],
  stores: [],
  effects: [],
});

export const addUnit = createEvent<{ group: keyof typeof Groups, unit: Unit<any> }>();

export const removeUnit = createEvent<{ group: keyof typeof Groups, unit: Unit<any> }>();

export const reset = createEvent();

export const units: Record<keyof typeof Groups, Record<'push' | 'remove', (unit: Unit<any>) => void>> = {
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
    [group]: [...state[group], unit.graphite],
  }))
  .on(removeUnit, (state, { group, unit }) => ({
    ...state,
    [group]: state[group].filter(u => {
      return u.id !== unit.graphite.id
    }),
  }))
  .on(createIndex.doneData, (state, data) => {
    return {
      ...state,
      stores: [
        ...state.stores,
        ...Object.values(data.nodes).filter(n => n.meta?.op === 'store' && !state.stores.some(s => s.meta?.name === n.meta?.name))
      ]
    }
  })
  .reset(reset);

sample({
  source: $unitsWatchList,
  clock: requestCreateIndex,
  fn: (watchList) => watchList,
  target: createIndex,
});
