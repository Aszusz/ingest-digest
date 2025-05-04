import { FC, ReactNode, useState } from 'react'
import { Button } from './components/shadcn/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/shadcn/Card'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { ScrollArea } from './components/shadcn/ScrollArea'
import type { DirNode, FileNode, FsNode } from '../../types'

const App: FC = () => {
  const [dirTree, setDirTree] = useState<FsNode | null>(null)
  // Initialize tree nodes with closed state
  const initTree = (node: FsNode): FsNode => {
    if (node.type === 'directory') {
      return {
        ...node,
        isOpen: false,
        children: node.children?.map(initTree)
      } as DirNode
    }
    return node
  }
  // Toggle open/closed state by path
  const toggleNode = (path: string): void => {
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
    setDirTree((prev) => (prev ? (toggle(prev) as FsNode) : null))
  }
  // Toggle selection (checked/indeterminate) for nodes
  const toggleSelect = (path: string): void => {
    setDirTree((prev) => {
      if (!prev) return null
      let newState: 'checked' | 'unchecked'
      const applySubtree = (n: FsNode, state: 'checked' | 'unchecked'): FsNode =>
        n.type === 'directory'
          ? ({ ...n, state, children: n.children?.map((c) => applySubtree(c, state)) } as DirNode)
          : ({ ...n, state } as FileNode)
      const applyToggle = (n: FsNode): FsNode => {
        if (n.path === path) {
          newState = n.state === 'checked' ? 'unchecked' : 'checked'
          return applySubtree(n, newState)
        }
        if (n.type === 'directory' && n.children) {
          return { ...n, children: n.children.map(applyToggle) } as DirNode
        }
        return n
      }
      const toggled = applyToggle(prev)
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
      return recalc(toggled) as FsNode
    })
  }
  // Recursive tree renderer
  const renderTree = (node: FsNode): ReactNode => {
    if (node.type === 'directory') {
      return (
        <div key={node.path} className="mb-1">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node.path)
              }}
              className="p-0"
            >
              {node.isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <input
              type="checkbox"
              checked={node.state === 'checked'}
              ref={(el) => {
                if (el) {
                  el.indeterminate = node.state === 'partially-checked'
                }
              }}
              onChange={(e) => {
                e.stopPropagation()
                toggleSelect(node.path)
              }}
              className="h-4 w-4"
            />
            <span>📁</span>
            {node.name}
          </div>
          {node.isOpen && node.children && (
            <div className="ml-4">
              {[...node.children]
                .sort((a, b) => (a.type === b.type ? 0 : a.type === 'directory' ? -1 : 1))
                .map((child) => renderTree(child))}
            </div>
          )}
        </div>
      )
    }
    return (
      <div key={node.path} className="flex items-center gap-1">
        <span className="w-4 h-4 inline-block" />
        <input
          type="checkbox"
          checked={node.state === 'checked'}
          onChange={(e) => {
            e.stopPropagation()
            toggleSelect(node.path)
          }}
          className="h-4 w-4"
        />
        <span>📄</span>
        {node.name}
      </div>
    )
  }

  return (
    <div className="p-4 h-screen flex flex-col overflow-hidden">
      <Button
        onClick={async () => {
          const tree = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
          if (tree) setDirTree(initTree(tree as FsNode))
        }}
      >
        Load
      </Button>
      <div className="flex flex-1 gap-4 mt-4 min-h-0">
        <Card className="flex flex-col h-full w-1/4 min-h-0">
          <CardHeader>
            <CardTitle>File Explorer</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <ScrollArea className="h-full">
              {dirTree ? renderTree(dirTree) : 'No directory selected'}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="flex flex-col h-full flex-1 min-h-0">
          <CardHeader>
            <CardTitle>File Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <ScrollArea className="h-full">No file preview</ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
