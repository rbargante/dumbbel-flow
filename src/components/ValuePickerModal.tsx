import { Minus, Plus } from 'lucide-react';

interface ValuePickerModalProps {
  title: string;
  subtitle?: string;
  value: number;
  onChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function ValuePickerModal({
  title,
  subtitle,
  value,
  onChange,
  onConfirm,
  onCancel,
  min = 1,
  max = 999,
  step = 1,
  suffix,
}: ValuePickerModalProps) {
  const decrement = () => {
    const next = Math.max(min, value - step);
    onChange(Math.round(next / step) * step);
  };

  const increment = () => {
    const next = Math.min(max, value + step);
    onChange(Math.round(next / step) * step);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
      onClick={onCancel}
    >
      <div
        className="bg-card rounded-2xl p-6 w-72 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="text-center">
          <h3 className="text-lg font-black text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Value with +/- */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={decrement}
            className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center active:bg-primary/30 transition-colors"
          >
            <Minus size={20} />
          </button>
          <div className="min-w-[80px] text-center">
            <span className="text-4xl font-black text-foreground tabular-nums">
              {value}
            </span>
            {suffix && (
              <span className="text-sm text-muted-foreground ml-1">
                {suffix}
              </span>
            )}
          </div>
          <button
            onClick={increment}
            className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center active:bg-primary/30 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Bottom row: Cancel + Confirm */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground font-medium px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-xl text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
