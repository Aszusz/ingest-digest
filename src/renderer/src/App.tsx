import type { FC } from 'react'
import { Button } from './components/shadcn/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/shadcn/Card'

const App: FC = () => {
  return (
    <div className="p-4">
      <Button
        onClick={() => {
          /* TODO: handle load */
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
          <CardContent>{/* TODO: render file preview here */}</CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
