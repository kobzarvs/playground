import { Edges, EdgeTypes, GraphIndex, Nodes } from '../types';
import { isDomain } from '../is';

export function getUserLinks(graph: GraphIndex, type: EdgeTypes, nodes: Nodes): Edges {
  return Object.values(graph[type])
    .filter(link => (isDomain(link.source) || link.source.id in nodes) && (isDomain(link.target) || link.target.id in nodes))
    .reduce((acc, link, i) => Object.assign(acc, { [String(i)]: link }), {});
}
