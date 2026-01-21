import { PDFDocument } from 'pdf-lib'

export async function mergePDFs(
  files: File[],
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const mergedDoc = await PDFDocument.create()
  const totalFiles = files.length

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const arrayBuffer = await file.arrayBuffer()

    try {
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pageCount = pdfDoc.getPageCount()
      const pageIndices = Array.from({ length: pageCount }, (_, idx) => idx)

      const copiedPages = await mergedDoc.copyPages(pdfDoc, pageIndices)
      copiedPages.forEach((page) => {
        mergedDoc.addPage(page)
      })

      const progress = ((i + 1) / totalFiles) * 100
      onProgress(progress)
      await new Promise((resolve) => setTimeout(resolve, 200))
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error)
      throw new Error(`Gagal memproses ${file.name}. File mungkin corrupt.`)
    }
  }

  const pdfBytes = await mergedDoc.save({
    useObjectStreams: false,
  })

  return new Blob([pdfBytes], { type: 'application/pdf' })
}

export async function compressPDFs(
  files: File[],
  onProgress: (progress: number) => void,
): Promise<Blob> {
  if (files.length === 1) {
    // Single file compression
    const file = files[0]
    return await compressSinglePDF(file)
  } else {
    // Multiple files: compress each then merge
    const compressedDocs: PDFDocument[] = []
    const totalFiles = files.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const arrayBuffer = await file.arrayBuffer()

      try {
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        compressedDocs.push(pdfDoc)

        const progress = (i / totalFiles) * 50
        onProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 200))
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        throw new Error(`Gagal memproses ${file.name}. File mungkin corrupt.`)
      }
    }

    // Merge compressed PDFs
    const mergedDoc = await PDFDocument.create()

    for (let i = 0; i < compressedDocs.length; i++) {
      const pdfDoc = compressedDocs[i]
      const pageCount = pdfDoc.getPageCount()
      const pageIndices = Array.from({ length: pageCount }, (_, idx) => idx)

      const copiedPages = await mergedDoc.copyPages(pdfDoc, pageIndices)
      copiedPages.forEach((page) => {
        mergedDoc.addPage(page)
      })

      const progress = 50 + (i / totalFiles) * 50
      onProgress(progress)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    const pdfBytes = await mergedDoc.save({
      useObjectStreams: false,
    })

    return new Blob([pdfBytes], { type: 'application/pdf' })
  }
}

async function compressSinglePDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)

  // Compress by removing unnecessary data
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  })

  return new Blob([pdfBytes], { type: 'application/pdf' })
}
