'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { PDFUploadArea } from './pdf-upload-area'
import { FileList } from './file-list'
import { MergeProgress } from './merge-progress'
import { MergeResult } from './merge-result'
import { ModeSelector } from './mode-selector'
import { mergePDFs, compressPDFs } from './pdf-utils'
import { PDFDocument as PdfDoc } from 'pdf-lib'

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
    resultPDFRef.current = null
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

      <FileList files={uploadedFiles} onRemove={handleRemoveFile} disabled={isDisabled} />

      {uploadedFiles.length > 0 && !resultPDF && (
        <button
          onClick={handleProcess}
          disabled={isProcessing || uploadedFiles.length < minFilesRequired}
          className="w-full px-6 py-3 rounded-md font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processButtonText}
        </button>
      )}

      <MergeProgress isVisible={isProcessing} progress={processProgress} />

      <MergeResult
        isVisible={resultPDF !== null}
        fileName={resultPDF?.fileName || ''}
        fileSize={resultPDFRef.current?.size || 0}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        mode={mode}
      />

      {resultPDF && (
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 rounded-md font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
        >
          {resetButtonText}
        </button>
      )}
    </div>
  )
}
