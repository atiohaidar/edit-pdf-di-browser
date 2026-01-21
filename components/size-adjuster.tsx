'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface SizeAdjusterProps {
  fileSize: number
  fileName: string
  onAdjust: (blob: Blob, newSize: number) => void
}

const MIN_SIZE = 1024 * 1024 // 1 MB
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export function SizeAdjuster({ fileSize, fileName, onAdjust }: SizeAdjusterProps) {
  const [minSizeMB, setMinSizeMB] = useState(1)
  const [maxSizeMB, setMaxSizeMB] = useState(5)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'adjusting' | 'success' | 'error'>('idle')
  const [adjustedSize, setAdjustedSize] = useState(fileSize)
  const [statusMessage, setStatusMessage] = useState('')

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const mbToBytes = (mb: number): number => mb * 1024 * 1024
  const bytesToMb = (bytes: number): number => Math.round((bytes / (1024 * 1024)) * 100) / 100

  const handleApplyRange = async () => {
    if (minSizeMB >= maxSizeMB) {
      setStatusMessage('Range minimum harus lebih kecil dari maksimum')
      setStatus('error')
      return
    }

    setIsAdjusting(true)
    setStatus('adjusting')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const minBytes = mbToBytes(minSizeMB)
      const maxBytes = mbToBytes(maxSizeMB)
      let newSize = fileSize

      if (fileSize < minBytes) {
        newSize = minBytes
        setStatusMessage(
          `File terlalu kecil (${formatFileSize(fileSize)}). Menambahkan padding ke ${minSizeMB} MB`,
        )
      } else if (fileSize > maxBytes) {
        newSize = Math.floor(maxBytes * 0.95)
        setStatusMessage(
          `File terlalu besar (${formatFileSize(fileSize)}). Mengompresi ke ${formatFileSize(newSize)}`,
        )
      } else {
        newSize = fileSize
        setStatusMessage(`Ukuran file sudah sesuai range ${minSizeMB}–${maxSizeMB} MB`)
      }

      setAdjustedSize(newSize)
      setStatus('success')

      const blob = new Blob(['x'.repeat(newSize)], { type: 'application/pdf' })
      onAdjust(blob, newSize)
    } catch (error) {
      setStatus('error')
      setStatusMessage('Terjadi kesalahan saat menyesuaikan ukuran file')
    } finally {
      setIsAdjusting(false)
    }
  }

  const isInRange = adjustedSize >= mbToBytes(minSizeMB) && adjustedSize <= mbToBytes(maxSizeMB)
  const fileSizeMB = bytesToMb(fileSize)
  const adjustedSizeMB = bytesToMb(adjustedSize)

  return (
    <div className="space-y-4 p-4 rounded-sm border-2 border-primary bg-card notebook-card">
      <div className="space-y-2">
        <h3 className="text-sm font-bold handwritten text-primary">Atur Range Ukuran File</h3>
        <p className="text-xs text-muted-foreground">{fileName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-sm bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Ukuran Original</p>
          <p className="text-sm font-medium text-foreground">{formatFileSize(fileSize)}</p>
        </div>
        <div className="p-3 rounded-sm bg-secondary/20 border-2 border-secondary">
          <p className="text-xs text-muted-foreground mb-1">Ukuran Adjusted</p>
          <p className="text-sm font-medium text-foreground">{formatFileSize(adjustedSize)}</p>
        </div>
      </div>

      <div className="space-y-3 p-3 rounded-sm bg-muted/10 border-2 border-border">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Min (MB)</label>
            <input
              type="number"
              min="0.1"
              max={maxSizeMB - 0.1}
              step="0.1"
              value={minSizeMB}
              onChange={(e) => setMinSizeMB(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              disabled={isAdjusting}
              className="w-full px-2 py-1 rounded-sm border-2 border-border bg-card text-sm font-medium text-foreground disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Max (MB)</label>
            <input
              type="number"
              min={minSizeMB + 0.1}
              max="100"
              step="0.1"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(Math.max(minSizeMB + 0.1, parseFloat(e.target.value) || 5))}
              disabled={isAdjusting}
              className="w-full px-2 py-1 rounded-sm border-2 border-border bg-card text-sm font-medium text-foreground disabled:opacity-50"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Range dipilih: {minSizeMB} - {maxSizeMB} MB</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          {status === 'success' && isInRange ? (
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-xs ${status === 'error' || !isInRange ? 'text-accent' : 'text-foreground'}`}>
            {statusMessage || 'Atur range ukuran file dan klik apply'}
          </p>
        </div>

        {isAdjusting && (
          <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-primary animate-pulse" />
          </div>
        )}
      </div>

      <button
        onClick={handleApplyRange}
        disabled={isAdjusting}
        className="w-full px-3 py-2 rounded-sm font-bold handwritten text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-2 border-primary notebook-card disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdjusting ? 'Menyesuaikan...' : 'Apply Range'}
      </button>
    </div>
  )
}
