'use client'

import { X, FileText } from 'lucide-react'

interface FileItem {
  file: File
  id: string
}

interface FileListProps {
  files: FileItem[]
  onRemove: (id: string) => void
  disabled?: boolean
}

export function FileList({ files, onRemove, disabled }: FileListProps) {
  if (files.length === 0) return null

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        📄 File yang diupload ({files.length}):
      </p>
      <div className="space-y-2">
        {files.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {index + 1}. {item.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              disabled={disabled}
              className="ml-2 p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Hapus file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
