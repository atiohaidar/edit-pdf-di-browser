import { PDFMerger } from '@/components/pdf-merger'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-14 w-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
              📄
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            PDF Merger
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gabungkan beberapa file PDF menjadi satu dokumen dengan mudah. Semua pemrosesan
            dilakukan di browser Anda—aman dan cepat.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="text-2xl mb-2">🚀</div>
            <p className="font-medium text-foreground mb-1">Cepat & Aman</p>
            <p className="text-sm text-muted-foreground">Tanpa upload ke server. Semua proses terjadi di browser Anda.</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="text-2xl mb-2">✨</div>
            <p className="font-medium text-foreground mb-1">Mudah Digunakan</p>
            <p className="text-sm text-muted-foreground">Drag & drop atau klik tombol. Interface yang intuitif dan sederhana.</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="text-2xl mb-2">🔒</div>
            <p className="font-medium text-foreground mb-1">Gratis & Unlimited</p>
            <p className="text-sm text-muted-foreground">Tidak ada batasan jumlah file atau ukuran (max 50MB per file).</p>
          </div>
        </div>

        {/* Main App */}
        <div className="p-6 sm:p-8 rounded-lg bg-card border border-border shadow-sm">
          <PDFMerger />
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Aplikasi ini menggunakan{' '}
            <a
              href="https://pdf-lib.js.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              pdf-lib
            </a>
            {' '}untuk pemrosesan PDF. Data Anda tidak disimpan di server.
          </p>
        </div>
      </div>
    </main>
  )
}
