import { Node } from 'effector';
import { ShapeTypes } from './types';
import { MAX_NAME_LENGTH, NodeShapes } from './const';

export const getType = (g: Node) => g.family.type;
export const getOp = (g: Node) => g.meta?.op;

const getName = (g: Node) => {
  // const name = [g?.meta?.name || g?.meta?.op, g?.id].filter(Boolean).join('.') || '';
  const name = [g?.meta?.name || g?.meta?.op].filter(Boolean).join('.') || '';
  return name.replace(/[^a-z 0-9]+/gi, '_') || 'NONAME';
};

export const getLabel = (g: Node): string => {
  if (g?.meta?.named) {
    return g?.meta?.named?.length > MAX_NAME_LENGTH ? g?.meta?.named.slice(0, MAX_NAME_LENGTH) + '...' : g?.meta?.named;
  }
  const name = ([g?.meta?.name || g?.meta?.op].filter(Boolean).join('.') || '')
  .replace(/[^a-z 0-9]+/gi, '_').slice(0, 25);

  return name.length > MAX_NAME_LENGTH ? name.slice(0, MAX_NAME_LENGTH) + '...' : name || 'NONAME';
};

export const getShapeType = (g: Node, parent?: Node): ShapeTypes => {
  let op = getOp(g);
  let name = g.meta?.name || '';
  let named = g.meta?.named || '';

  switch (true) {
    case named === 'finally':
      return 'fxfinally';
    case ['done', 'doneData'].includes(named):
      return 'fxdone';
    case ['fail', 'failData'].includes(named):
      return 'fxfail';
    case ['inFlight', 'pending'].includes(named):
      return 'fxstore';
    case name.startsWith('combine('):
      return 'combined';
  }

  return op || 'default';
};

export const getShape = (g: Node, parent?: Node): string => NodeShapes[getShapeType(g, parent)];

export const getLinks = (g: Node, excludeId: string = g.id) => g.family.links.filter(i => i.id !== excludeId);

export const getOwners = (g: Node, excludeId: string = g.id): Node[] => g.family.owners.filter(i => i.id !== excludeId);

export function detectOperator(source: Node, target: Node, next: Node): string {
  if (getOp(target)) return getOp(target);
  if (getOp(source) === 'store' || getOp(source) === 'event') {
    if (getOp(next) === 'store') {
      return 'restore';
    }
  }
  return 'UNKNOWN';
}

export const getRoots = (nodes: Set<Node> | Node[]) => [...nodes].filter(node => node.family.owners.length === 0);

export const getLinkId = (source: Node, target: Node, prefix = ''): string => `"${prefix}${source.id}" -> "${prefix}${target.id}"`;
