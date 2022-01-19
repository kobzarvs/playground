import { Node } from 'effector';
import { Edges, IndexOptions, GraphiteIndex, NodeUnit } from '../types';
import { isDomain, isDomainInternals, isDomainOrInternals } from '../is';
import { getLinkId, getRoots } from '../helpers';

/**
 *
 * @param root
 * @param options
 * @param graph
 */
export function buildIndex(
  root: NodeUnit | NodeUnit[] | Node | Node[] | Set<Node>,
  options: IndexOptions = {},
  graph: GraphiteIndex = {
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
  },
): GraphiteIndex {
  if (!root) return graph;

  if ('graphite' in root) {
    root = root.graphite as Node;
  } else if (Array.isArray(root) || root instanceof Set) {
    options.root ||= [...root].map(r => 'graphite' in r ? r.graphite as Node : r);
    for (const node of [...root]) {
      buildIndex(node, options, graph);
    }
    return graph;
  } else {
    root = root as Node;
    options.root ||= root;
  }

  if (graph.visited.has(root)) {
    return graph;
  }

  graph.visited.add(root);

  function createEdge(edges: Edges, source: Node, target: Node): void {
    edges[getLinkId(source, target)] = { source, target };
  }

  switch (true) {
    case isDomain(root):
      graph.domains.roots[root.id] = root;
      break;
    case isDomainInternals(root):
      graph.domains.nodes[root.id] = root;
      break;
    default:
      graph.nodes[root.id] = root;
  }

  for (const owner of root.family.owners) {
    if (isDomainInternals(root)) {
      if (!graph.internals[owner.id] && graph.visited.has(owner)) {
        graph.visited.delete(owner);
      }
      graph.internals[owner.id] = owner;
    }
    if (isDomainOrInternals([root, owner])) {
      createEdge(graph.domains.owners, owner, root);
    } else {
      createEdge(graph.owners, root, owner);
    }
  }

  for (const link of root.family.links) {
    if (isDomainInternals(root)) {
      if (!graph.internals[link.id] && graph.visited.has(link)) {
        graph.visited.delete(link);
      }
      graph.internals[link.id] = link;
    }
    if (isDomainOrInternals([root, link])) {
      createEdge(graph.domains.links, root, link);
    } else {
      createEdge(graph.links, root, link);
    }
  }

  for (const next of root.next) {
    if (isDomainInternals(root)) {
      if (!graph.internals[next.id] && graph.visited.has(next)) {
        graph.visited.delete(next);
      }
      graph.internals[next.id] = next;
    }
    if (isDomainOrInternals([root, next])) {
      createEdge(graph.domains.next, root, next);
    } else {
      createEdge(graph.next, root, next);
    }
  }

  buildIndex(root.family.owners, options, graph);
  buildIndex(root.family.links, options, graph);
  buildIndex(root.next, options, graph);

  const cleanInternals = () => {
    Object.values(graph.internals).forEach(i => {
      graph.domains.nodes[i.id] = i;
      delete graph.nodes[i.id];
    });
  };

  if (options.root === root) {
    graph.roots = getRoots(graph.visited);
    cleanInternals();
  } else if (Array.isArray(options.root)) {
    options.root = options.root.filter(i => i !== root);
    if (options.root.length === 0) {
      graph.roots = getRoots(graph.visited);
      cleanInternals();
    }
  }

  return graph;
}
