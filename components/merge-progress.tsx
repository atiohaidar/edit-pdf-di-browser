'use client'

import { Loader2 } from 'lucide-react'

interface MergeProgressProps {
  isVisible: boolean
  progress: number
}

export function MergeProgress({ isVisible, progress }: MergeProgressProps) {
  if (!isVisible) return null

  return (
    <div className="space-y-4 p-5 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
          <p className="text-sm font-semibold text-foreground">Sedang memproses PDF...</p>
        </div>
        <p className="text-sm font-bold text-primary tabular-nums">{Math.round(progress)}%</p>
      </div>
      <div className="relative w-full bg-primary/10 rounded-full h-2.5 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
      </div>
    </div>
  )
}
