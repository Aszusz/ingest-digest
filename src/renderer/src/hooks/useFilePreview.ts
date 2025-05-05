import { useState, useEffect } from 'react'
import { FsNode } from 'src/types'
import { collectPaths, buildDirTree, printTree } from '../lib/treeUtils'

/**
 * Hook to generate preview text (directory structure + file contents)
 * based on the current FsNode tree.
 */
export interface UseFilePreview {
  previewText: string
}

export function useFilePreview(dirTree: FsNode | null): UseFilePreview {
  const [previewText, setPreviewText] = useState<string>('No file preview')

  useEffect(() => {
    if (!dirTree) {
      setPreviewText('No file preview')
      return
    }

    const paths = collectPaths(dirTree)
    if (paths.length === 0) {
      setPreviewText('No file selected')
      return
    }

    ;(async () => {
      // Read selected files via Electron IPC
      const results = (await window.electron.ipcRenderer.invoke('file:readFiles', paths)) as {
        path: string
        content: string
      }[]

      // Combine file contents with separators
      const combined = results
        .map((r) => {
          const name = r.path.split(/[/\\]/).pop() || r.path
          return (
            '================================================\n' +
            `FILE: ${name}\n` +
            '================================================\n' +
            r.content
          )
        })
        .join('\n\n')

      // Build relative segments list for directory structure
      const rootDepth = dirTree.path.split(/[/\\]/).length
      const relSegmentsList = paths.map((p) => p.split(/[/\\]/).slice(rootDepth))

      // Generate ASCII tree
      const structureRoot = buildDirTree(relSegmentsList)
      const lines = [
        'Directory structure:',
        `└── ${dirTree.name}/`,
        ...printTree(structureRoot.children, '    ')
      ]
      const treeText = lines.join('\n')

      setPreviewText(treeText + '\n\n' + combined)
    })()
  }, [dirTree])

  return { previewText }
}
