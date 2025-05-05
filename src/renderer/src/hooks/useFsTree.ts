import { useState, useCallback } from 'react'
import { DirNode, FileNode, FsNode } from 'src/types'

/**
 * Hook to manage file system tree state: loading, expanding/collapsing directories,
 * and selecting/deselecting files and directories.
 */

export interface UseFsTree {
  dirTree: FsNode | null
  loadTree: (tree: FsNode) => void
  toggleNode: (path: string) => void
  toggleSelect: (path: string) => void
}

export function useFsTree(): UseFsTree {
  const [dirTree, setDirTree] = useState<FsNode | null>(null)

  /**
   * Initialize a tree by setting all directories to closed (isOpen = false).
   */
  const initTree = useCallback((node: FsNode): FsNode => {
    if (node.type === 'directory') {
      return {
        ...node,
        isOpen: false,
        children: node.children?.map(initTree)
      } as DirNode
    }
    return node
  }, [])

  /**
   * Load a fresh tree structure (e.g. from IPC) and initialize it.
   */
  const loadTree = useCallback(
    (tree: FsNode) => {
      setDirTree(initTree(tree))
    },
    [initTree]
  )

  /**
   * Toggle the open/closed state of a directory by its path.
   */
  const toggleNode = useCallback((path: string) => {
    const toggle = (n: FsNode): FsNode => {
      if (n.type === 'directory') {
        if (n.path === path) {
          return { ...n, isOpen: !n.isOpen } as DirNode
        }
        if (n.children) {
          return { ...n, children: n.children.map(toggle) } as DirNode
        }
      }
      return n
    }
    setDirTree((prev) => (prev ? toggle(prev) : null))
  }, [])

  /**
   * Toggle the checked state of a node (file or directory),
   * propagating the change downwards and recalculating parent states.
   */
  const toggleSelect = useCallback((path: string) => {
    setDirTree((prev) => {
      if (!prev) return null
      let newState: 'checked' | 'unchecked'

      // Apply a state to a subtree
      const applySubtree = (n: FsNode, state: 'checked' | 'unchecked'): FsNode =>
        n.type === 'directory'
          ? ({ ...n, state, children: n.children?.map((c) => applySubtree(c, state)) } as DirNode)
          : ({ ...n, state } as FileNode)

      // Toggle a specific node, computing newState
      const applyToggle = (n: FsNode): FsNode => {
        if (n.path === path) {
          newState = n.state === 'checked' ? 'unchecked' : 'checked'
          return applySubtree(n, newState!)
        }
        if (n.type === 'directory' && n.children) {
          return { ...n, children: n.children.map(applyToggle) } as DirNode
        }
        return n
      }

      const toggled = applyToggle(prev)

      // Recalculate parent states based on their children
      const recalc = (n: FsNode): FsNode => {
        if (n.type === 'directory' && n.children && n.children.length > 0) {
          const children = n.children.map(recalc)
          const allChecked = children.every((c) => c.state === 'checked')
          const noneChecked = children.every((c) => c.state === 'unchecked')
          const state: DirNode['state'] = allChecked
            ? 'checked'
            : noneChecked
              ? 'unchecked'
              : 'partially-checked'
          return { ...n, children, state } as DirNode
        }
        return n
      }

      return recalc(toggled)
    })
  }, [])

  return { dirTree, loadTree, toggleNode, toggleSelect }
}
