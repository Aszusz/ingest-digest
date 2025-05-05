import { FC } from 'react'
import { LoadButton } from './components/LoadButton'
import { FilePreview } from './components/FilePreview'
import { useFsTree } from './hooks/useFsTree'
import { useFilePreview } from './hooks/useFilePreview'
import { Card, CardContent } from './components/shadcn/Card'
import { ScrollArea } from './components/shadcn/ScrollArea'
import { FileTree } from './components/FileExplorer/FileTree'

const App: FC = () => {
  const { dirTree, loadTree, toggleNode, toggleSelect } = useFsTree()
  const { previewText } = useFilePreview(dirTree)

  return (
    <div className="p-4 h-screen flex flex-col overflow-hidden">
      <LoadButton onLoad={loadTree} />
      <div className="flex flex-1 gap-4 mt-4 min-h-0">
        <Card className="flex flex-col h-full w-1/4 min-h-0">
          <CardContent className="flex-1 p-0 min-h-0">
            <ScrollArea className="h-full">
              <FileTree tree={dirTree} onToggle={toggleNode} onSelect={toggleSelect} />
            </ScrollArea>
          </CardContent>
        </Card>
        <FilePreview text={previewText} />
      </div>
    </div>
  )
}

export default App
