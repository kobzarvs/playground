import { Node } from 'effector';
import { NodeDetails } from '../types';
import { getShapeType } from '../helpers';
import { nodeBgColors, nodeFgColors } from '../const';

export function renderTableNode(node: Node, data: NodeDetails, prefix: string = '', colored = true) {
  const label = node.meta?.named || node.meta?.name || node.meta?.op || node.family.type;
  const shapeType = getShapeType(node);
  const bgcolor = colored ? nodeBgColors[shapeType] : '#555555';
  const fgcolor = colored ? nodeFgColors[shapeType] : '#FFFFFF';

  return `"${prefix}${node.id}" [ 
  style=filled;
  penwidth=0;
  margin=0.02;
  fillcolor="white";
  fontsize=18;
  shape="Mrecord";
  label=<<table border="0" cellborder="1" cellpadding="0" cellspacing="0" bgcolor="white" width="1">
    <tr>
      <td bgcolor="${bgcolor}" align="center" colspan="2">
        <font color="${fgcolor}"><b>${label} [${node.id}]</b></font>
      </td>
    </tr>
    ${Object.keys(data).map((key) => `
      <tr>
        <td align="right" bgcolor="white">
            <font color="black">${key}</font>
        </td>
        <td align="left" bgcolor="white">
            <font color="black">${data[key as keyof NodeDetails]}</font>
        </td>
      </tr>
    `).join('')}
  </table>>]`;
}
