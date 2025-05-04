import { FC, useState } from 'react'
import { Button } from './components/shadcn/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/shadcn/Card'

const App: FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null)

  return (
    <div className="p-4">
      <Button
        onClick={async () => {
          const content = await window.electron.ipcRenderer.invoke('dialog:openFile')
          if (content) setFileContent(content)
        }}
      >
        Load
      </Button>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>File Explorer</CardTitle>
          </CardHeader>
          <CardContent>{/* TODO: render file tree explorer here */}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>File Preview</CardTitle>
          </CardHeader>
          <CardContent>{fileContent ? <pre className="whitespace-pre-wrap">{fileContent}</pre> : 'No file selected'}</CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
