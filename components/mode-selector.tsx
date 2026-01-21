'use client'

import { Combine, FileDown } from 'lucide-react'

interface ModeSelectorProps {
  mode: 'merge' | 'compress'
  onChange: (mode: 'merge' | 'compress') => void
  disabled?: boolean
}

export function ModeSelector({ mode, onChange, disabled = false }: ModeSelectorProps) {
  return (
    <div className="flex gap-3 bg-muted/50 rounded-xl p-1.5 border border-border">
      <button
        onClick={() => onChange('merge')}
        disabled={disabled}
        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${
          mode === 'merge'
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
            : 'text-muted-foreground hover:text-foreground hover:bg-card'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Combine className={`h-4 w-4 transition-transform ${mode === 'merge' ? '' : 'group-hover:scale-110'}`} />
        <span>Merge PDF</span>
      </button>
      <button
        onClick={() => onChange('compress')}
        disabled={disabled}
        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${
          mode === 'compress'
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
            : 'text-muted-foreground hover:text-foreground hover:bg-card'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <FileDown className={`h-4 w-4 transition-transform ${mode === 'compress' ? '' : 'group-hover:scale-110'}`} />
        <span>Compress PDF</span>
      </button>
    </div>
  )
}
