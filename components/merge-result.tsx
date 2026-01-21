'use client'

import { Download, CheckCircle2, FileCheck } from 'lucide-react'

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
    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{successMessage}</p>
          <p className="text-xs text-muted-foreground">Siap untuk diunduh</p>
        </div>
      </div>

      <div className="space-y-3 p-4 rounded-lg bg-card/50 border border-accent/10">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <FileCheck className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Nama file:</p>
            <p className="text-sm font-medium text-foreground break-all">{fileName}</p>
            <p className="text-xs text-muted-foreground mt-2">Ukuran:</p>
            <p className="text-sm font-semibold text-accent">{formatFileSize(fileSize)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
      >
        <Download className="h-5 w-5 group-hover:animate-bounce" />
        {isDownloading ? 'Mengunduh...' : downloadLabel}
      </button>
    </div>
  )
}
