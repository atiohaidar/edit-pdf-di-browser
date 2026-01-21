'use client'

interface MergeProgressProps {
  isVisible: boolean
  progress: number
}

export function MergeProgress({ isVisible, progress }: MergeProgressProps) {
  if (!isVisible) return null

  return (
    <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">⏳ Sedang menggabungkan PDF...</p>
        <p className="text-xs font-medium text-primary">{Math.round(progress)}%</p>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
