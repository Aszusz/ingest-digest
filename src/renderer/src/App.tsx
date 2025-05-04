import { FC, JSX, useState } from 'react'
import { Button } from './components/shadcn/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/shadcn/Card'

// Type for directory nodes
interface DirNode {
  name: string
  path: string
  isDirectory: boolean
  children?: DirNode[]
}

const App: FC = () => {
  const [dirTree, setDirTree] = useState<DirNode | null>(null)
  // Recursive tree renderer
  const renderTree = (node: DirNode): JSX.Element => (
    <ul key={node.path}>
      <li>
        {node.isDirectory ? '📁 ' : '📄 '}
        {node.name}
        {node.isDirectory && node.children && (
          <div className="ml-4">{node.children.map((child) => renderTree(child))}</div>
        )}
      </li>
    </ul>
  )

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
