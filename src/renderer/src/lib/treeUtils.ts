import { FsNode } from 'src/types'

/**
 * Recursively collect all file paths from a tree where the file or directory state is "checked".
 */
export function collectPaths(node: FsNode): string[] {
  if (node.type === 'file') {
    return node.state === 'checked' ? [node.path] : []
  }

  // directory: traverse children
  let paths: string[] = []
  if (node.children) {
    for (const child of node.children) {
      paths = paths.concat(collectPaths(child))
    }
  }
  return paths
}

/**
 * Represents a simple directory tree built from path segments.
 */
export type DirTreeNode = {
  children: Map<string, DirTreeNode>
}

/**
 * Build a DirTreeNode structure from a list of path-segment arrays.
 * Each array represents the segments of one selected file under the root dir.
 */
export function buildDirTree(segmentsList: string[][]): DirTreeNode {
  const root: DirTreeNode = { children: new Map() }
  for (const segments of segmentsList) {
    let current = root
    for (const seg of segments) {
      if (!current.children.has(seg)) {
        current.children.set(seg, { children: new Map() })
      }
      current = current.children.get(seg)!
    }
  }
  return root
}

/**
 * Pretty-print the directory tree into an array of lines, using ASCII branches.
 * @param children Map of name → subtree
 * @param prefix  Leading whitespace/branch characters for this level
 */
export function printTree(children: Map<string, DirTreeNode>, prefix = ''): string[] {
  const lines: string[] = []
  // Sort directories first, then files
  const entries = Array.from(children.entries())
  const dirs = entries
    .filter(([, node]) => node.children.size > 0)
    .sort(([a], [b]) => a.localeCompare(b))
  const files = entries
    .filter(([, node]) => node.children.size === 0)
    .sort(([a], [b]) => a.localeCompare(b))

  const sorted = [...dirs, ...files]
  sorted.forEach(([name, node], idx) => {
    const isLast = idx === sorted.length - 1
    const branch = isLast ? '└── ' : '├── '
    // Append slash for directories
    lines.push(`${prefix}${branch}${name}${node.children.size > 0 ? '/' : ''}`)
    if (node.children.size > 0) {
      // Recurse with updated prefix
      const nextPrefix = prefix + (isLast ? '    ' : '│   ')
      lines.push(...printTree(node.children, nextPrefix))
    }
  })
  return lines
}
