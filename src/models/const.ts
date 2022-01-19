import { EdgeTypes, LabelModes, ShapeTypes } from './types';

export const MAX_NAME_LENGTH = 20;

export const NodeShapes: { [key in ShapeTypes]: string } = {
  default: 'default',
  forward: 'default',
  filterMap: 'default',
  combine: 'default',
  map: 'diamond',
  on: 'ellipse',
  combined: 'ellipse',
  sample: 'diamond',
  store: 'cylinder',
  event: 'rect',
  watch: 'ellipse',
  // effect: 'doubleoctagon',
  effect: 'ellipse',
  fxstore: 'cylinder',
  fxdone: 'rect',
  fxfail: 'rect',
  fxfinally: 'rect',
  domain: 'rect',
  guard: 'doublerect',
  prepend: 'rect',
  split: 'rect'
};

export const nodeBgColors: { [key in ShapeTypes]: string } = {
  default: '#FFFFFF',
  filterMap: '#dbdbdb',
  map: '#dbdbdb',
  on: '#dbdbdb',
  forward: '#dbdbdb',
  combine: '#196392',
  combined: '#d8f0ff',
  sample: '#faaffa',
  store: '#d8f0ff',
  event: '#FFFFFF',
  watch: '#ffff006b',
  effect: '#ff8c00',
  fxstore: '#ff8c0050',
  fxdone: 'palegreen',
  fxfail: 'tomato',
  fxfinally: 'palegreen',
  domain: 'brown',
  guard: '#555',
  prepend: '#dbdbdb',
  split: '#dbdbdb',
};

export const nodeFgColors: { [key in ShapeTypes]: string } = {
  default: 'black',
  filterMap: 'black',
  map: 'black',
  on: 'black',
  forward: 'black',
  combine: 'white',
  combined: 'black',
  sample: 'black',
  store: 'black',
  event: 'black',
  watch: 'black',
  effect: 'white',
  fxstore: 'black',
  fxdone: 'black',
  fxfail: 'white',
  fxfinally: 'black',
  domain: 'white',
  guard: 'white',
  prepend: 'black',
  split: 'black',
};

export const LabelModesMap: Record<LabelModes, string> = {
  [LabelModes.AUTO_NAME]: 'auto name',
  [LabelModes.AUTO_NAME_ID]: 'auto name + id',
  [LabelModes.OP]: 'meta.op',
  [LabelModes.TABLE]: 'table',
  [LabelModes.NAME]: 'meta.name',
  [LabelModes.NAMED]: 'meta.named',
  [LabelModes.TYPE]: 'family.type',
  [LabelModes.ID]: 'id',
};

export const EdgeColors: { [key in EdgeTypes]: string } = {
  links: '#0000FF20',
  owners: '#33333330',
  next: '#333333',
};
