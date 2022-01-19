import { Node } from 'effector';
import { nodeBgColors, nodeFgColors, NodeShapes } from '../const';
import { renderTableNode } from './renderTableNode';
import { FragmentOptions } from './renderFragment';
import { getShapeType } from '../helpers';
import { LabelModes } from '../types';

export function renderNode(node: Node, opts: FragmentOptions): string {
  let label;
  switch (opts.labels) {
    case LabelModes.ID:
      label = node.id;
      break;
    case LabelModes.OP:
      label = node.meta.op || '-';
      break;
    case LabelModes.NAME:
      label = node.meta.name || '-';
      break;
    case LabelModes.NAMED:
      label = node.meta.named || '-';
      break;
    case LabelModes.TYPE:
      label = node.family.type;
      break;

    case LabelModes.TABLE:
      return renderTableNode(node, {
        op: node.meta.op || '-',
        type: node.family.type || '-',
        name: node.meta.name || '-',
        named: node.meta.named || '-',
        links: `<b><font color="#707070">${node.family.owners.length}</font>&nbsp;&nbsp;<font color="blue">${node.family.links.length}</font>&nbsp;&nbsp;<font color="red">${node.next.length}</font></b>`,
      }, opts.prefix, opts.shapes?.colored);

    case LabelModes.AUTO_NAME:
      label = node.meta?.named || node.meta?.name || node.meta.op || node.family.type;
      break;

    default:
      label = `${(node.meta?.named || node.meta?.name || node.meta.op || node.family.type)} [${node.id}]`;
  }

  const shapeType = getShapeType(node);
  const bgcolor = nodeBgColors[shapeType];
  const fgcolor = nodeFgColors[shapeType];

  label = `<<font color="${opts.shapes?.colored ? fgcolor : 'black'}"><b>${label}</b></font>>`;
  const colors = opts.shapes?.colored ? `style=filled fillcolor="${bgcolor}"` : '';
  const shape = opts.shapes?.styled ? NodeShapes[shapeType] : 'rect';

  return `"${opts.prefix}${node.id}" [shape="${shape}" label=${label} ${colors}]`;
}
