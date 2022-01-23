import {
  Node as EffectorNode,
  Unit as EffectorUnit
} from 'effector';

declare interface Node extends EffectorNode {
}

declare interface Unit<T> extends EffectorUnit<T> {
  defaultConfig: any;
  graphite: Node;
  shortName: string;
}

declare global {
  function log(...args: any[][]): any;
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    title: React.CSSProperties;
    'tree-group'?: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
    'tree-group'?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
    'tree-group': true;
  }
}
