import { scanGraph } from '../models/model-to-model/scanGraph';
import { counterDomain, effect } from './counter';
import { renderDot } from '../models/diagram/renderDot';
import { setDiagram } from '../models';

export function scanGraphPlay() {
  const { links, shapes, domains } = scanGraph([
    counterDomain,
    // domain3,
    effect,
  ]);

  const list = [...domains.values()];
  const rootDomains = list.filter(i => i.parents.length === 0);

  function buildDomainGraph(acc: string, d: { children: Set<string>; parents: string[]; subgraph: string }) {
    d.children.forEach(c => {
      acc = acc.replaceAll(`/*domain_${c}*/`, domains.get(c)?.subgraph || '/* ERROR */');
      const instance = domains.get(c);
      if (instance && instance.children.size !== 0) {
        acc = buildDomainGraph(acc, instance);
      }
    });
    return acc;
  }

  const result = rootDomains.reduce((acc, d) => {
    acc = `${acc}\n/*- root domain -*/\n${d.subgraph}`;
    return buildDomainGraph(acc, d);
  }, '');

  // console.log(result);
  const strGraph = [
    '\n/*** domains ***/\n',
    result,
    '\n/*** links ***/\n',
    ...Object.values(links),
    '\n/*** shapes ***/\n',
    ...Object.values(shapes),
  ].join('\n');

  setDiagram(renderDot(strGraph));
}
