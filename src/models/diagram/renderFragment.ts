import { renderNode } from './renderNode';
import { renderLinks } from './renderLinks';
import { createCluster } from './createCluster';
import { GraphiteIndex, LabelModes, LayoutSubMode, Presets, Relations } from '../types';
import { getUserLinks } from '../graphite/getUserLinks';

export type FragmentOptions = {
  labels?: LabelModes;
  wrap?: string | boolean;
  prefix?: string;
  owners?: LayoutSubMode;
  links?: LayoutSubMode;
  next?: LayoutSubMode;
  shapes?: {
    styled?: boolean,
    colored?: boolean,
  },
  domains?: boolean,
  preset?: Presets,
  autorun: boolean,
}

/**
 * buildFragment
 * @param graph
 * @param options
 */
export function renderFragment(graph: GraphiteIndex, options?: FragmentOptions): string {
  const opts: FragmentOptions = {
    prefix: '',
    labels: LabelModes.NAME,
    owners: 'visible',
    links: 'transparent',
    next: 'visible',
    shapes: {
      styled: false,
      colored: true,
      ...options?.shapes,
    },
    domains: true,
    preset: 'show domains',
    autorun: true,
    ...options,
  };

  const cluster = opts.wrap ? createCluster({ label: opts.wrap === true ? '' : opts.wrap }) : undefined;
  opts.prefix = cluster?.id ? `${cluster.id}_` : opts.prefix;

  const nodes = Object.values(graph.nodes).map((node) => renderNode(node, opts)).join(';\n');

  let domainFragmet: string[] = [];
  if (opts.preset === 'show internals') {
    domainFragmet = [
      renderLinks(graph.domains.next, 'next', opts),
      renderLinks(graph.domains.links, 'links', opts),
      renderLinks(graph.domains.owners, 'owners', opts),
      Object.values(graph.domains.roots).map((node) => renderNode(node, opts)).join(';\n'),
      Object.values(graph.domains.nodes).map((node) => renderNode(node, opts)).join(';\n'),
    ];
  } else if (opts.preset === 'show domains') {
    const domains: Relations = {
      links: getUserLinks(graph.domains, 'links', graph.nodes),
      owners: getUserLinks(graph.domains, 'owners', graph.nodes),
      next: getUserLinks(graph.domains, 'next', graph.nodes),
    };
    domainFragmet = [
      renderLinks(domains.next, 'next', opts, true),
      renderLinks(domains.links, 'links', opts),
      renderLinks(domains.owners, 'owners', opts),
      Object.values(graph.domains.roots).map((node) => renderNode(node, opts)).join(';\n'),
    ];
  }

  const mainFragment = [
    ...domainFragmet,
    renderLinks(graph.next, 'next', opts, true),
    renderLinks(graph.links, 'links', opts),
    renderLinks(graph.owners, 'owners', opts),
    nodes,
  ];

  if (cluster) {
    cluster.add(mainFragment.join('\n'));
    return cluster.render();
  }

  return mainFragment.join('\n');
}
