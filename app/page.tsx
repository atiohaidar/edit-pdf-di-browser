import { PDFMerger } from '@/components/pdf-merger'

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold handwritten text-primary">
            Catatan Tio Haidar
          </h1>
          <p className="text-base text-foreground max-w-2xl mx-auto">
            Aplikasi untuk Merge & Compress PDF dengan mudah
          </p>
        </div>

        {/* Main App */}
        <div className="p-6 sm:p-8 rounded-sm bg-card border-2 border-primary notebook-card">
          <div className="mb-6 pb-3 border-b-2 border-primary">
            <p className="text-xs handwritten text-muted-foreground">[Option Q] Hari: Senin | Tgl: {new Date().toLocaleDateString('id-ID')}</p>
          </div>
          <PDFMerger />
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t-2 border-primary">
          <p className="text-xs text-muted-foreground">
            Semua pemrosesan PDF terjadi di browser Anda. Data tidak disimpan di server.
          </p>
        </div>
      </div>
    </main>
  )
}
