import { EdgeColors } from '../const';
import { Edges, EdgeTypes, ShapeTypes } from '../types';
import { getOp, getShapeType } from '../helpers';
import { ViewSettings } from '../ide/view-settings';

export function renderLinks(edges: Edges, type: EdgeTypes, opts: ViewSettings, priority = false): string {
  if (opts[type] === 'removed') return '';
  let linkColor = opts[type] === 'visible' ? EdgeColors[type] : 'transparent';

  return Object.values(edges).map(link => {
    let weight = -100;
    let style = '';
    const sourceShape: ShapeTypes = getShapeType(link.source);
    const targetShape: ShapeTypes = getShapeType(link.target);

    if (priority) {
      switch (true) {
        case targetShape === 'watch':
          weight = 2;
          break;
        case getOp(link.source) === 'event':
        case getOp(link.target) === 'event':
          weight = 2;
          break;
        case sourceShape === 'combined':
          weight = 4;
          break;
        case targetShape === 'combined':
          weight = 4;
          style = 'dir=none';
          break;
        case getOp(link.source) === 'store' && getOp(link.target) === 'store':
          weight = 10;
          break;
        case sourceShape === 'on' && getOp(link.target) === 'store':
          weight = 1;
          break;

        default:
          weight = 1;
      }
    }
    // style && console.log(priority, weight, style);

    // const linkStyles = [
    //   `label="${edge}"`,
    //   `fontsize=10`,
    //   childShapeType === 'combined' ? 'dir=none' : null,
    //   `weight=${linkWeight}`,
    // ].filter(Boolean);

    return `"${opts.prefix}${link.source.id}" -> "${opts.prefix}${link.target.id}" [fontsize=10 color="${linkColor}" fillcolor="${linkColor}" weight=${weight} ${style}]`;
  }).join(';\n');
}
