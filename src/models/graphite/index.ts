import { createEffect, createEvent, createStore, sample } from 'effector';
import { GraphiteIndex } from '../types';
import { renderDot } from '../diagram/renderDot';
import { renderFragment } from '../diagram/renderFragment';
import { UnitsWatchList } from '../ide/units-watch-list';
import { $mode, ViewSettings } from '../ide/view-settings';
import { buildIndex } from './buildIndex';

export const requestCreateIndex = createEvent<void>();

export const createIndex = createEffect({
  handler: (watchList: UnitsWatchList) => {
    const graph = buildIndex(Object.values(watchList).reduce((acc, list) => [...acc, ...list], []));
    if (process.env.NODE_ENV === 'development') {
      console.log('graph', graph);
    }
    return graph;
  },
});

export const createDiagram = createEffect({
  handler: ({ graph, mode }: { graph: GraphiteIndex, mode: ViewSettings }) => {
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
