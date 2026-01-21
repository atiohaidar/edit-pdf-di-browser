'use client'

import React from "react"

import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PDFFile {
  file: File
  id: string
}

interface PDFUploadAreaProps {
  onFilesAdded: (files: PDFFile[]) => void
  disabled?: boolean
}

export function PDFUploadArea({ onFilesAdded, disabled }: PDFUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndProcessFiles = (files: FileList) => {
    setError(null)
    const validFiles: PDFFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (file.type !== 'application/pdf') {
        setError(`❌ "${file.name}" bukan file PDF. Hanya file PDF yang diizinkan.`)
        continue
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        setError(`❌ "${file.name}" terlalu besar (maks 50MB).`)
        continue
      }

      validFiles.push({
        file,
        id: `${Date.now()}-${Math.random()}`,
      })
    }

    if (validFiles.length > 0) {
      onFilesAdded(validFiles)
    }
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) setIsDragging(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const { files } = e.dataTransfer
      if (files) {
        validateAndProcessFiles(files)
      }
    },
    [disabled]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndProcessFiles(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-10 transition-all duration-300',
          'flex flex-col items-center justify-center gap-4',
          'group cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20'
            : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className={cn(
          "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300",
          isDragging ? 'scale-110 bg-primary/20' : 'group-hover:scale-105 group-hover:bg-primary/15'
        )}>
          <Upload className={cn(
            "h-8 w-8 text-primary transition-transform duration-300",
            isDragging && 'scale-110'
          )} />
        </div>
        <div className="text-center space-y-2">
          <p className="font-semibold text-foreground text-lg">Drag & Drop File PDF di sini</p>
          <p className="text-sm text-muted-foreground">atau klik tombol di bawah untuk memilih file</p>
          <p className="text-xs text-muted-foreground/70">Maksimal 50MB per file</p>
        </div>

        <label>
          <input
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
          />
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.parentElement?.querySelector('input')?.click()
            }}
            disabled={disabled}
            className={cn(
              'mt-2 px-6 py-2.5 rounded-lg font-medium shadow-sm',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'transition-all duration-200 hover:shadow-md hover:scale-105',
              'active:scale-95',
              disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
            )}
          >
            Pilih File PDF
          </button>
        </label>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2 animate-fade-in">
          <span className="text-base">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
