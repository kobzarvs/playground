import { Node } from 'effector';
import { getOp, getType } from './helpers';

export const isDomain = (g: Node | Node[]) => {
  if (Array.isArray(g)) return g.some(isDomain);
  return getType(g) === 'domain';
};

export const isDomainInternals = (g: Node | Node[]) => {
  if (Array.isArray(g)) return g.some(isDomainInternals);
  return (getOp(g) === 'event' && ['onEvent', 'onDomain', 'onStore', 'onEffect'].includes(g?.meta?.named));
};

export const isDomainOrInternals = (g: Node | Node[]) => {
  if (Array.isArray(g)) return g.some(isDomainOrInternals);
  return isDomain(g) || isDomainInternals(g);
};

const isEffectInternals = (g: Node) => {
  let named = g.meta?.named;
  if (!named) return false;
  if (getOp(g) === 'store' && ['inFlight', 'pending'].includes(named)) return true;
  return getOp(g) === 'event' && ['finally', 'done', 'doneData', 'fail', 'failData'].includes(named);
};
