import { FC } from 'react'
import type { FileNode as FileNodeType } from 'src/types'

export interface FileNodeProps {
  /** The file node to render */
  node: FileNodeType
  /** Called when the checkbox is toggled */
  onSelect: () => void
}

export const FileNode: FC<FileNodeProps> = ({ node, onSelect }) => (
  <div className="flex items-center gap-1">
    <span className="w-4 h-4 inline-block" />
    <input
      type="checkbox"
      checked={node.state === 'checked'}
      onChange={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      className="h-4 w-4"
    />
    <span>📄</span>
    <span>{node.name}</span>
  </div>
)
