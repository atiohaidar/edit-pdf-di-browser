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
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-sm border-2 border-dashed p-8 transition-all notebook-card',
          'flex flex-col items-center justify-center gap-3',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-primary bg-card',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Upload className="h-10 w-10 text-primary" />
        <div className="text-center">
          <p className="font-bold handwritten text-base text-primary">Drag & Drop File PDF</p>
          <p className="text-xs text-muted-foreground">atau klik tombol untuk memilih file</p>
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
              'mt-3 px-4 py-2 rounded-sm font-bold handwritten text-sm',
              'border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90',
              'transition-colors cursor-pointer',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            Pilih File PDF
          </button>
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-sm bg-destructive/10 border-2 border-destructive text-destructive text-xs font-medium">
          {error}
        </div>
      )}
    </div>
  )
}
