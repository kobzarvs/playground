import isPlainObject from 'lodash/isPlainObject';
import forEach from 'lodash/forEach';

export type TraversableKey = string | number;

export type Traversable = {
  [key in TraversableKey]: any;
};

export type Visitor = (value: any, key: TraversableKey, path: Array<TraversableKey>) => boolean | void;

export enum TraverseMode {
  BFS,
  DFS
}

export const strPath = (
  path: Array<TraversableKey>,
  key?: string,
): string => (key ? [...path, key] : path).join('.');

/**
 * Traverse the tree recursively
 *
 * @param root - is root node of the plain object or array
 * @param mode - BFS or DFS mode
 * @param callback - is visitor callback which given value, key and path parameters
 * @param path - is a private parameter for internal usage
 * @param visited
 */
export function traverse(
  root: Traversable,
  mode: TraverseMode,
  callback: Visitor,
  path: Array<TraversableKey> = [],
  visited: Map<Traversable, TraversableKey> = new Map(),
): Map<Traversable, TraversableKey> {
  if (typeof callback !== 'function') {
    return visited;
  }

  visited.set(root, strPath(path));
  if (callback(root, path.slice(-1)[0], path)) {
    return visited;
  }

  if (!isPlainObject(root) && !Array.isArray(root)) {
    return visited;
  }

  if (mode === TraverseMode.BFS) {
    forEach(root, (child, key) => {
      if (!visited.has(child)) {
        visited.set(child, strPath(path, key));
        if (callback(root, key, [...path, key])) {
          return visited;
        }
      }
    });
  }

  forEach(root, (child, key) => {
    traverse(child, mode, callback, [...path, key], visited);
  });

  return visited;
}
