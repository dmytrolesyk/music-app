import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have the shadcn utils

interface SpinnerProps {
  children: ReactNode;
  spinning: boolean;
  size?: number;
  className?: string;
  spinnerClassName?: string;
}

export function Spinner({
  children,
  spinning,
  size = 24,
  className,
  spinnerClassName,
}: SpinnerProps) {
  return (
    <div className={cn('relative', className)}>
      {children}

      {spinning && (
        <>
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-md">
            <Loader2 className={cn('animate-spin text-primary', spinnerClassName)} size={size} />
          </div>
        </>
      )}
    </div>
  );
}
