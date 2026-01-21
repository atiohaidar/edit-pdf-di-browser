'use client'

import { X, FileText, GripVertical } from 'lucide-react'

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
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          File yang diupload ({files.length})
        </p>
      </div>
      <div className="space-y-2">
        {files.map((item, index) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.file.name}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(item.file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              disabled={disabled}
              className="ml-2 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 group/btn"
              aria-label="Hapus file"
            >
              <X className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
