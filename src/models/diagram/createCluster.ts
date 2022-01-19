import { Cluster, ClusterOptions, DotOptions } from '../types';

let clusterId = 0;

export function createCluster(options?: ClusterOptions): Cluster {
  const id = ++clusterId;
  const opts: ClusterOptions = {
    label: '',
    fontsize: 32,
    fontcolor: '#333333',
    labelloc: 't',
    margin: 25,
    ...options,
  };

  let computedOptions = Object.keys(opts).map(key => `${key}=${JSON.stringify(opts[key as keyof DotOptions])}`).join(';');

  return {
    id,
    options: opts,
    content: [],

    add(content: string) {
      this.content.push(content);
    },

    render(): string {
      const computedContent = this.content.map((content) => {
        return `${content}`;
      }).join('\n');

      return `
        subgraph cluster_${this.id} {
          ${computedOptions};
          ${computedContent}
        }
      `;
    },
  };
}
