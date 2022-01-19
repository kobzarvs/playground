import React, { memo } from 'react';
import Graphviz from 'graphviz-react';

export const GraphViz = memo(({ dot }: { dot: string }) => (
  <Graphviz
    key={Math.random().toString(36)}
    options={{
      zoom: true,
      fit: false,
      width: '20000',
      height: '20000',
      scale: 1.0,
      engine: 'dot',
      useWorker: false
    }}
    dot={dot}
  />
));
