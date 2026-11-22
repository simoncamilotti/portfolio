import type { Tree } from '@nx/devkit';

/**
 * Replaces every occurrence of each pattern in a file. A pattern that matches nothing is an error:
 * the file drifted from what the generator expects, and silently skipping would leave it half done.
 */
export function replaceInFile(
  tree: Tree,
  path: string,
  replacements: ReadonlyArray<readonly [pattern: string | RegExp, replacement: string]>,
): void {
  let content = tree.read(path, 'utf-8');
  if (content === null) {
    throw new Error(`${path} not found.`);
  }
  for (const [pattern, replacement] of replacements) {
    const regex =
      typeof pattern === 'string'
        ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        : pattern;
    if (!regex.test(content)) {
      throw new Error(`${path}: "${String(pattern)}" not found.`);
    }
    regex.lastIndex = 0;
    content = content.replace(regex, replacement);
  }
  tree.write(path, content);
}
