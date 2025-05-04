import { FC, ReactNode, useState } from 'react'
import { Button } from './components/shadcn/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/shadcn/Card'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { ScrollArea } from './components/shadcn/ScrollArea'

// Type for directory nodes
interface DirNode {
  name: string
  path: string
  isDirectory: boolean
  children?: DirNode[]
  isOpen?: boolean
  checked?: boolean
  indeterminate?: boolean
}

const App: FC = () => {
  const [dirTree, setDirTree] = useState<DirNode | null>(null)
  // Initialize tree nodes with closed state
  const initTree = (node: DirNode): DirNode => ({
    ...node,
    isOpen: false,
    checked: false,
    indeterminate: false,
    children: node.children?.map(initTree)
  })
  // Toggle open/closed state by path
  const toggleNode = (path: string): void => {
    const toggle = (n: DirNode): DirNode => {
      if (n.path === path) return { ...n, isOpen: !n.isOpen }
      if (n.children) return { ...n, children: n.children.map(toggle) }
      return n
    }
    setDirTree((prev) => (prev ? toggle(prev) : null))
  }
  // Toggle selection (checked/indeterminate) for nodes
  const toggleSelect = (path: string): void => {
    setDirTree((prev) => {
      if (!prev) return null
      let newChecked = false
      const applySubtree = (n: DirNode, checked: boolean): DirNode => ({
        ...n,
        checked,
        indeterminate: false,
        children: n.children?.map((child) => applySubtree(child, checked))
      })
      const applyToggle = (n: DirNode): DirNode => {
        if (n.path === path) {
          newChecked = !(n.checked ?? false)
          return applySubtree(n, newChecked)
        }
        if (n.children) return { ...n, children: n.children.map(applyToggle) }
        return n
      }
      const toggled = applyToggle(prev)
      const recalc = (n: DirNode): DirNode => {
        if (n.children && n.children.length > 0) {
          const children = n.children.map(recalc)
          const allChecked = children.every((c) => c.checked)
          const noneChecked = children.every((c) => !c.checked && !c.indeterminate)
          return {
            ...n,
            children,
            checked: allChecked,
            indeterminate: !allChecked && !noneChecked
          }
        }
        return n
      }
      return recalc(toggled)
    })
  }
  // Recursive tree renderer
  const renderTree = (node: DirNode): ReactNode => {
    if (node.isDirectory) {
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
              checked={node.checked}
              ref={(el) => {
                if (el) {
                  el.indeterminate = node.indeterminate ?? false
                }
              }}
              onChange={(e) => {
                e.stopPropagation()
                toggleSelect(node.path)
              }}
              className="h-4 w-4"
            />
            <span>📁 {node.name}</span>
          </div>
          {node.isOpen && node.children && (
            <div className="ml-4">{node.children.map((child) => renderTree(child))}</div>
          )}
        </div>
      )
    }
    return (
      <div key={node.path} className="flex items-center gap-1 ml-6">
        <span className="w-4 h-4 inline-block" />
        <input
          type="checkbox"
          checked={node.checked}
          onChange={(e) => {
            e.stopPropagation()
            toggleSelect(node.path)
          }}
          className="h-4 w-4"
        />
        <span>📄 {node.name}</span>
      </div>
    )
  }

  return (
    <div className="p-4 h-screen flex flex-col overflow-hidden">
      <Button
        onClick={async () => {
          const tree = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
          if (tree) setDirTree(initTree(tree as DirNode))
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
