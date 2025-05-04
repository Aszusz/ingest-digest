export type DirNode = {
  type: 'directory'
  name: string
  path: string
  children?: FsNode[]
  isOpen?: boolean
  state: 'checked' | 'unchecked' | 'partially-checked'
}

export type FileNode = {
  type: 'file'
  name: string
  path: string
  state: 'checked' | 'unchecked'
}

export type FsNode = DirNode | FileNode
