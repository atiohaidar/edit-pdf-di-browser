import { PDFMerger } from '@/components/pdf-merger'
import { ThemeToggle } from '@/components/theme-toggle'
import { FileText, Zap, Shield, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <ThemeToggle />
      
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:scale-110 duration-300">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight bg-clip-text">
            PDF Merger
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Gabungkan beberapa file PDF menjadi satu dokumen dengan mudah. Semua pemrosesan
            dilakukan di browser Anda—aman dan cepat.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground mb-2">Cepat & Aman</p>
            <p className="text-sm text-muted-foreground leading-relaxed">Tanpa upload ke server. Semua proses terjadi di browser Anda.</p>
          </div>
          <div className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground mb-2">Mudah Digunakan</p>
            <p className="text-sm text-muted-foreground leading-relaxed">Drag & drop atau klik tombol. Interface yang intuitif dan sederhana.</p>
          </div>
          <div className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground mb-2">Gratis & Unlimited</p>
            <p className="text-sm text-muted-foreground leading-relaxed">Tidak ada batasan jumlah file atau ukuran (max 50MB per file).</p>
          </div>
        </div>

        {/* Main App */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <PDFMerger />
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Aplikasi ini menggunakan{' '}
            <a
              href="https://pdf-lib.js.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors underline decoration-primary/30 hover:decoration-primary/60"
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
