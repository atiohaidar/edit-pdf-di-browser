'use client'

import { Download, Check } from 'lucide-react'

interface MergeResultProps {
  isVisible: boolean
  fileName: string
  fileSize: number
  onDownload: () => void
  isDownloading?: boolean
  mode?: 'merge' | 'compress'
}

export function MergeResult({
  isVisible,
  fileName,
  fileSize,
  onDownload,
  isDownloading,
  mode = 'merge',
}: MergeResultProps) {
  if (!isVisible) return null

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const successMessage = mode === 'merge' ? 'PDF berhasil digabungkan!' : 'PDF berhasil dikompres!'
  const downloadLabel = mode === 'merge' ? 'Download PDF' : 'Download PDF Terkompres'

  return (
    <div className="space-y-3 p-4 rounded-sm border-2 border-accent bg-card notebook-card">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-accent/30">
        <Check className="h-5 w-5 text-accent flex-shrink-0" />
        <p className="text-sm font-bold handwritten text-accent">{successMessage}</p>
      </div>

      <div className="space-y-2 p-3 rounded-sm bg-secondary/20 border-2 border-secondary">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Nama file:</p>
          <p className="text-xs font-medium text-foreground break-all">{fileName}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Ukuran:</p>
          <p className="text-xs font-medium text-foreground">{formatFileSize(fileSize)}</p>
        </div>
      </div>

      <button
        onClick={onDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm font-bold handwritten text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors border-2 border-accent notebook-card disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        {isDownloading ? 'Mengunduh...' : downloadLabel}
      </button>
    </div>
  )
}
