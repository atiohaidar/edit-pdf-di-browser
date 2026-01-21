'use client'

import React from "react"

import { useState } from 'react'
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react'

interface PDFFile {
  file: File
  id: string
}

interface FileReorderProps {
  files: PDFFile[]
  onReorder: (files: PDFFile[]) => void
  onRemove: (id: string) => void
}

export function FileReorder({ files, onReorder, onRemove }: FileReorderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newFiles = [...files]
    ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
    onReorder(newFiles)
  }

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return
    const newFiles = [...files]
    ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
    onReorder(newFiles)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newFiles = [...files]
    const draggedFile = newFiles[draggedIndex]
    newFiles.splice(draggedIndex, 1)
    newFiles.splice(index, 0, draggedFile)
    setDraggedIndex(index)
    onReorder(newFiles)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium handwritten text-primary">Urutan File (Drag atau gunakan tombol):</h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={file.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 p-3 rounded-sm border-2 border-primary bg-card transition-all cursor-move hover:bg-muted/30 ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{file.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.file.size)}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="p-1 rounded hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Pindah ke atas"
              >
                <ChevronUp className="h-4 w-4 text-primary" />
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                disabled={index === files.length - 1}
                className="p-1 rounded hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Pindah ke bawah"
              >
                <ChevronDown className="h-4 w-4 text-primary" />
              </button>
            </div>

            <button
              onClick={() => onRemove(file.id)}
              className="px-2 py-1 rounded text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors flex-shrink-0"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
