'use client'

interface ModeSelectorProps {
  mode: 'merge' | 'compress'
  onChange: (mode: 'merge' | 'compress') => void
  disabled?: boolean
}

export function ModeSelector({ mode, onChange, disabled = false }: ModeSelectorProps) {
  return (
    <div className="flex gap-3 p-3 rounded-sm border-2 border-primary bg-card notebook-card">
      <button
        onClick={() => onChange('merge')}
        disabled={disabled}
        className={`flex-1 px-4 py-2 rounded-sm font-bold handwritten text-base transition-colors border-2 ${
          mode === 'merge'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-white text-foreground border-primary hover:bg-muted/30'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Merge PDF
      </button>
      <button
        onClick={() => onChange('compress')}
        disabled={disabled}
        className={`flex-1 px-4 py-2 rounded-sm font-bold handwritten text-base transition-colors border-2 ${
          mode === 'compress'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-white text-foreground border-primary hover:bg-muted/30'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Compress PDF
      </button>
    </div>
  )
}
