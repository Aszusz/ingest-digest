import { FC } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './shadcn/Card'
import { ScrollArea } from './shadcn/ScrollArea'

export interface FilePreviewProps {
  /**
   * The text content to display in the preview pane
   */
  text: string
}

export const FilePreview: FC<FilePreviewProps> = ({ text }) => (
  <Card className="flex flex-col h-full flex-1 min-h-0">
    <CardHeader>
      <CardTitle>File Preview</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 p-0 min-h-0">
      <ScrollArea className="h-full">
        <pre className="p-2 font-mono text-sm whitespace-pre-wrap">{text}</pre>
      </ScrollArea>
    </CardContent>
  </Card>
)
