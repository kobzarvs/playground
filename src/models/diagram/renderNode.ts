import { Node } from 'effector';
import { nodeBgColors, nodeFgColors, NodeShapes } from '../const';
import { renderTableNode } from './renderTableNode';
import { getShapeType } from '../helpers';
import { LabelModes } from '../types';
import { ViewSettings } from '../ide/view-settings';

export function renderNode(node: Node, opts: ViewSettings): string {
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
        links: `<b><font color="#707070">${node.family.owners.length}</font>&nbsp;<font color="blue">${node.family.links.length}</font>&nbsp;<font color="red">${node.next.length}</font></b>`,
      }, opts.prefix, opts.colored);

    case LabelModes.AUTO_NAME:
      label = node.meta?.named || node.meta?.name || node.meta.op || node.family.type;
      break;

    default:
      label = `${(node.meta?.named || node.meta?.name || node.meta.op || node.family.type)} [${node.id}]`;
  }

  const shapeType = getShapeType(node);
  const bgcolor = nodeBgColors[shapeType];
  const fgcolor = nodeFgColors[shapeType];

  label = `<<font color="${opts.colored ? fgcolor : 'black'}"><b>${label}</b></font>>`;
  const colors = opts.colored ? `style=filled fillcolor="${bgcolor}"` : '';
  const shape = opts.styled ? NodeShapes[shapeType] : 'rect';

  return `"${opts.prefix}${node.id}" [shape="${shape}" label=${label} ${colors}]`;
}
