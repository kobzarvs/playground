import { createEffect, createEvent, createStore, guard, sample } from 'effector';
import { GraphiteIndex } from '../types';
import { renderDot } from '../diagram/renderDot';
import { renderFragment, FragmentOptions } from '../diagram/renderFragment';
import { debouncedTransformCode } from '../ide/transformer';
import { $unitsWatchList, UnitsWatchList } from '../ide/units-watch-list';
import { $mode } from '../ide/mode';
import { $raw, LS_CODE_KEY, save } from '../ide/code';
import { buildIndex } from './buildIndex';

export const requestCreateIndex = createEvent<void>();

export const createIndex = createEffect({
  handler: (watchList: UnitsWatchList) => {
    const graph =  buildIndex(Object.values(watchList).reduce((acc, list) => [...acc, ...list], []));
    console.log('graph', graph);
    return graph;
  },
});

export const createDiagram = createEffect({
  handler: ({ graph, mode }: { graph: GraphiteIndex, mode: FragmentOptions }) => {
    const dot = renderDot(renderFragment(graph, mode));
    // console.log('dot', dot);
    return dot;
  },
});

export const $index = createStore<GraphiteIndex>({
  roots: [],
  links: {},
  owners: {},
  next: {},
  nodes: {},
  domains: {
    roots: {},
    nodes: {},
    links: {},
    owners: {},
    next: {},
  },
  internals: {},
  visited: new Set(),
});

$index
  .on(createIndex.doneData, (state, payload) => payload);

export const $diagram = createStore<string>(renderDot(''))
  .on(createDiagram.doneData, (state, payload) => payload);


sample({
  source: [$mode, $index],
  clock: [createIndex.doneData, $mode],
  fn: ([mode, graph]) => ({ graph, mode }),
  target: createDiagram,
});
