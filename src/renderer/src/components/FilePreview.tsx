import { FC, useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardContent } from './shadcn/Card'
import { ScrollArea } from './shadcn/ScrollArea'
import { Button } from './shadcn/Button'
import { Copy } from 'lucide-react'

export interface FilePreviewProps {
  /**
   * The text content to display in the preview pane
   */
  text: string
}

export const FilePreview: FC<FilePreviewProps> = ({ text }) => {
  const [copied, setCopied] = useState<boolean>(false)

  // Compute number of lines in text
  const lineCount: number = useMemo((): number => {
    return text.split(/\r\n|\r|\n/).length
  }, [text])

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
  }

  useEffect((): void | (() => void) => {
    if (!copied) return
    const timer: number = window.setTimeout((): void => {
      setCopied(false)
    }, 2000)
    return (): void => {
      clearTimeout(timer)
    }
  }, [copied])

  return (
    <Card className="relative flex flex-col h-full flex-1 min-h-0">
      {/* Floating copy button with feedback including line count */}
      <CardHeader className="absolute top-2 right-2 flex flex-row items-center gap-2 p-0 z-10">
        {copied && (
          <span className="text-sm text-gray-900 transition-opacity duration-200">
            Copied {lineCount} {lineCount === 1 ? 'line' : 'lines'}!
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Copy preview text"
          onClick={handleCopy}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <pre className="p-2 font-mono text-sm whitespace-pre-wrap">{text}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
