import { FC, ReactNode, useState } from 'react'
import { Button } from './components/shadcn/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/shadcn/Card'
import { ChevronRight, ChevronDown } from 'lucide-react'

// Type for directory nodes
interface DirNode {
  name: string
  path: string
  isDirectory: boolean
  children?: DirNode[]
  isOpen?: boolean
}

const App: FC = () => {
  const [dirTree, setDirTree] = useState<DirNode | null>(null)
  // Initialize tree nodes with closed state
  const initTree = (node: DirNode): DirNode => ({
    ...node,
    isOpen: false,
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
        📄 {node.name}
      </div>
    )
  }

  return (
    <div className="p-4">
      <Button
        onClick={async () => {
          const tree = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
          if (tree) setDirTree(initTree(tree as DirNode))
        }}
      >
        Load
      </Button>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>File Explorer</CardTitle>
          </CardHeader>
          <CardContent>{dirTree ? renderTree(dirTree) : 'No directory selected'}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>File Preview</CardTitle>
          </CardHeader>
          <CardContent>No file preview</CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
