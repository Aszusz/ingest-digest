import { FC } from 'react'

import { Button } from './shadcn/Button'
import { FsNode } from 'src/types'

export interface LoadButtonProps {
  /**
   * Callback invoked with the root FsNode when a directory is selected
   */
  onLoad: (tree: FsNode) => void
}

export const LoadButton: FC<LoadButtonProps> = ({ onLoad }) => (
  <Button
    onClick={async () => {
      const tree = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
      if (tree) {
        onLoad(tree as FsNode)
      }
    }}
  >
    Load
  </Button>
)
