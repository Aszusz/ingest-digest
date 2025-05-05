import { FC, ReactNode } from 'react'
import type { FsNode, DirNode, FileNode as FileNodeType } from 'src/types'
import { DirectoryNode } from './DirectoryNode'
import { FileNode } from './FileNode'

export interface FileTreeProps {
  /**
   * Root of the file system tree to render
   */
  tree: FsNode | null
  /**
   * Toggle open/closed state for a directory node
   */
  onToggle: (path: string) => void
  /**
   * Toggle selection for a file or directory node
   */
  onSelect: (path: string) => void
}

/**
 * Component that renders an FsNode directory/file tree with nested DirectoryNode and FileNode components.
 */
export const FileTree: FC<FileTreeProps> = ({ tree, onToggle, onSelect }) => {
  const renderNode = (node: FsNode): ReactNode => {
    if (node.type === 'directory') {
      const dir = node as DirNode
      // Sort directories before files, then alphabetically by name
      const sortedChildren = [...(dir.children || [])].sort((a, b) =>
        a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'directory' ? -1 : 1
      )

      return (
        <div key={dir.path} className="mb-1">
          <DirectoryNode
            node={dir}
            onToggle={() => onToggle(dir.path)}
            onSelect={() => onSelect(dir.path)}
          />
          {dir.isOpen && (
            <div className="ml-4">{sortedChildren.map((child) => renderNode(child))}</div>
          )}
        </div>
      )
    }

    // File node
    const file = node as FileNodeType
    return (
      <div key={file.path} className="flex items-center gap-1">
        <span className="w-4 h-4 inline-block" />
        <FileNode node={file} onSelect={() => onSelect(file.path)} />
      </div>
    )
  }

  // If no tree loaded, show placeholder text
  if (!tree) {
    return <div className="p-2 text-sm text-muted-foreground">No directory selected</div>
  }

  return <>{renderNode(tree)}</>
}
