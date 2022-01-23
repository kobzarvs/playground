import { Node, Unit } from 'effector';

export type DotOptions = {
  fontname?: string,
  fontsize?: number,
  fontcolor?: string,
  labelloc?: string,
  label?: string,
  splines?: boolean,
  overlap?: boolean,
  rankdir?: string,
  margin?: number,
  penwidth?: number
}

export type NodeUnit = Node | (Unit<any> & {
  graphite: Node;
})

export type ShapeTypes = 'default'
  | 'forward'
  | 'prepend'
  | 'split'
  | 'filterMap'
  | 'combine'
  | 'map'
  | 'on'
  | 'combined'
  | 'sample'
  | 'store'
  | 'event'
  | 'watch'
  | 'effect'
  | 'fxstore'
  | 'fxdone'
  | 'fxfail'
  | 'fxfinally'
  | 'domain'
  | 'guard'

export type ScanGraphOptions = {
  links: { [key: string]: string };
  shapes: { [key: string]: string };
  visited: Set<string>;
  context: string;
  domains: Map<string, {
    children: Set<string>;
    parents: string[];
    subgraph: string;
  }>;
}

export type ScanGraphReturns = ScanGraphOptions;

export type Edges = Record<string, {
  source: Node,
  target: Node,
}>;

export type Nodes = Record<string, Node>;

export type Relations = Record<EdgeTypes, Edges>;

export type GraphIndex = Relations & {
  roots: Nodes,
  nodes: Nodes,
};

export type GraphiteIndex = Omit<GraphIndex, 'roots'> & {
  roots: Node[],
  domains: GraphIndex,
  internals: Nodes,
  visited: Set<Node>,
}

export type IndexOptions = {
  root?: NodeUnit | NodeUnit[] | Node | Node[] | Set<Node>;
}

export type ClusterOptions = DotOptions & {
  id?: string,
}

export type Cluster = {
  id: number,
  options: ClusterOptions,
  content: string[],
  add(content: string, tag?: string): void;
  render(): string;
}

export type LayoutSubMode = 'visible' | 'transparent' | 'removed';

export type NodeDetails = {
  links: string;
  op: string;
  named: any;
  name: any;
  type: 'regular' | 'crosslink' | 'domain' | string;
}

export type EdgeTypes = 'links' | 'owners' | 'next';

export enum LabelModes {
  AUTO_NAME_ID = 'AUTO_NAME_ID',
  TABLE = 'TABLE',
  AUTO_NAME = 'AUTO_NAME',
  ID = 'ID',
  NAME = 'NAME',
  TYPE = 'TYPE',
  OP = 'OP',
  NAMED = 'NAMED',
}
