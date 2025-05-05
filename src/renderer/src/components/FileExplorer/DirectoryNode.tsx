import { FC, useRef, useEffect } from 'react'

import { ChevronRight, ChevronDown } from 'lucide-react'
import type { DirNode as DirNodeType } from 'src/types'

export interface DirectoryNodeProps {
  /** The directory node to render */
  node: DirNodeType
  /** Called when the arrow is clicked */
  onToggle: () => void
  /** Called when the checkbox is toggled */
  onSelect: () => void
}

export const DirectoryNode: FC<DirectoryNodeProps> = ({ node, onToggle, onSelect }) => {
  const checkboxRef = useRef<HTMLInputElement>(null)

  // Keep the indeterminate state in sync
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = node.state === 'partially-checked'
    }
  }, [node.state])

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className="p-0"
      >
        {node.isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      <input
        type="checkbox"
        checked={node.state === 'checked'}
        ref={checkboxRef}
        onChange={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        className="h-4 w-4"
      />
      <span>📁</span>
      <span>{node.name}</span>
    </div>
  )
}
