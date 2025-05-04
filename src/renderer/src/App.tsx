import { FC, ReactNode, useState } from 'react'
import { Button } from './components/shadcn/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/shadcn/Card'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from './components/shadcn/Collapsible'

// Type for directory nodes
interface DirNode {
  name: string
  path: string
  isDirectory: boolean
  children?: DirNode[]
}

const App: FC = () => {
  const [dirTree, setDirTree] = useState<DirNode | null>(null)
  // Recursive tree renderer using Collapsible
  const renderTree = (node: DirNode): ReactNode => {
    if (node.isDirectory) {
      return (
        <Collapsible key={node.path} defaultOpen className="mb-1">
          <CollapsibleTrigger className="flex items-center gap-1">
            📁 {node.name}
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-4">
            {node.children?.map((child) => renderTree(child))}
          </CollapsibleContent>
        </Collapsible>
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
          if (tree) setDirTree(tree as DirNode)
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
