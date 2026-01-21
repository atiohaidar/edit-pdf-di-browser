'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { PDFUploadArea } from './pdf-upload-area'
import { FileList } from './file-list'
import { MergeProgress } from './merge-progress'
import { MergeResult } from './merge-result'
import { ModeSelector } from './mode-selector'
import { FileReorder } from './file-reorder'
import { SizeAdjuster } from './size-adjuster'
import { mergePDFs, compressPDFs } from './pdf-utils'

interface PDFFile {
  file: File
  id: string
}

const PDFDocument =
  typeof window !== 'undefined'
    ? dynamic(() => import('pdfjs-dist').then(() => null), { ssr: false })
    : null

export function PDFMerger() {
  const [mode, setMode] = useState<'merge' | 'compress'>('merge')
  const [uploadedFiles, setUploadedFiles] = useState<PDFFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [resultPDF, setResultPDF] = useState<{
    blob: Blob
    fileName: string
  } | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showSizeAdjuster, setShowSizeAdjuster] = useState(false)
  const resultPDFRef = useRef<Blob | null>(null)

  const handleFilesAdded = (newFiles: PDFFile[]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles])
    setResultPDF(null)
    resultPDFRef.current = null
  }

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleModeChange = (newMode: 'merge' | 'compress') => {
    setMode(newMode)
    setUploadedFiles([])
    resultPDFRef.current = null
    setProcessProgress(0)
    setResultPDF(null)
  }

  const handleProcess = async () => {
    const minFiles = mode === 'merge' ? 2 : 1
    if (uploadedFiles.length < minFiles) {
      const message =
        mode === 'merge'
          ? 'Harap upload minimal 2 file PDF untuk menggabungkan.'
          : 'Harap upload minimal 1 file PDF untuk dikompres.'
      alert(`⚠️ ${message}`)
      return
    }

    setIsProcessing(true)
    setProcessProgress(0)

    try {
      const files = uploadedFiles.map((f) => f.file)
      let blob: Blob

      if (mode === 'merge') {
        blob = await mergePDFs(files, setProcessProgress)
      } else {
        blob = await compressPDFs(files, setProcessProgress)
      }

      resultPDFRef.current = blob

      const prefix = mode === 'merge' ? 'merged' : 'compressed'
      const fileName = `${prefix}-${Date.now()}.pdf`
      setResultPDF({
        blob,
        fileName,
      })

      setProcessProgress(100)
      setIsProcessing(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memproses PDF'
      alert(`❌ ${errorMessage}`)
      setIsProcessing(false)
      setProcessProgress(0)
    }
  }

  const handleDownload = () => {
    if (!resultPDF || !resultPDFRef.current) return

    setIsDownloading(true)

    try {
      const url = URL.createObjectURL(resultPDFRef.current)
      const link = document.createElement('a')
      link.href = url
      link.download = resultPDF.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => URL.revokeObjectURL(url), 100)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleReset = () => {
    setUploadedFiles([])
    setResultPDF(null)
    setProcessProgress(0)
    setShowSizeAdjuster(false)
    resultPDFRef.current = null
  }

  const handleReorder = (newFiles: PDFFile[]) => {
    setUploadedFiles(newFiles)
  }

  const handleSizeAdjusted = (adjustedBlob: Blob, newSize: number) => {
    if (resultPDFRef.current) {
      resultPDFRef.current = adjustedBlob
      if (resultPDF) {
        setResultPDF({
          ...resultPDF,
          blob: adjustedBlob,
        })
      }
    }
  }

  const isDisabled = isProcessing || resultPDF !== null

  const minFilesRequired = mode === 'merge' ? 2 : 1
  const processButtonText =
    mode === 'merge'
      ? isProcessing
        ? 'Menggabungkan...'
        : 'Merge PDF'
      : isProcessing
        ? 'Mengompres...'
        : 'Compress PDF'
  const resetButtonText = mode === 'merge' ? 'Merge PDF Lagi' : 'Compress PDF Lagi'

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <ModeSelector mode={mode} onChange={handleModeChange} disabled={isDisabled} />

      <PDFUploadArea onFilesAdded={handleFilesAdded} disabled={isDisabled} />

      {uploadedFiles.length > 0 && !resultPDF && mode === 'merge' && (
        <FileReorder files={uploadedFiles} onReorder={handleReorder} onRemove={handleRemoveFile} />
      )}

      {uploadedFiles.length > 0 && !resultPDF && mode === 'compress' && (
        <FileList files={uploadedFiles} onRemove={handleRemoveFile} disabled={isDisabled} />
      )}

      {uploadedFiles.length > 0 && !resultPDF && (
        <button
          onClick={handleProcess}
          disabled={isProcessing || uploadedFiles.length < minFilesRequired}
          className="w-full px-4 py-2 rounded-sm font-bold handwritten text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-2 border-primary notebook-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processButtonText}
        </button>
      )}

      <MergeProgress isVisible={isProcessing} progress={processProgress} />

      {resultPDF && mode === 'compress' && showSizeAdjuster && (
        <SizeAdjuster
          fileSize={resultPDFRef.current?.size || 0}
          fileName={resultPDF.fileName}
          onAdjust={handleSizeAdjusted}
        />
      )}

      <MergeResult
        isVisible={resultPDF !== null}
        fileName={resultPDF?.fileName || ''}
        fileSize={resultPDFRef.current?.size || 0}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        mode={mode}
      />

      {resultPDF && !showSizeAdjuster && mode === 'compress' && (
        <button
          onClick={() => setShowSizeAdjuster(true)}
          className="w-full px-4 py-2 rounded-sm font-bold handwritten text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors border-2 border-accent notebook-card"
        >
          Atur Ukuran File (1-5 MB)
        </button>
      )}

      {resultPDF && (
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 rounded-sm font-bold handwritten text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors border-2 border-secondary notebook-card"
        >
          {resetButtonText}
        </button>
      )}
    </div>
  )
}
