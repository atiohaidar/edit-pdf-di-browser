'use client'

interface ModeSelectorProps {
  mode: 'merge' | 'compress'
  onChange: (mode: 'merge' | 'compress') => void
  disabled?: boolean
}

export function ModeSelector({ mode, onChange, disabled = false }: ModeSelectorProps) {
  return (
    <div className="flex gap-3 bg-secondary rounded-lg p-1">
      <button
        onClick={() => onChange('merge')}
        disabled={disabled}
        className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
          mode === 'merge'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Merge PDF
      </button>
      <button
        onClick={() => onChange('compress')}
        disabled={disabled}
        className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
          mode === 'compress'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Compress PDF
      </button>
    </div>
  )
}
