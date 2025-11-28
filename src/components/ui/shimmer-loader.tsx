import { cn } from '@/lib/utils';

interface ShimmerLoaderProps {
  className?: string;
  lines?: number;
}

export function ShimmerLoader({ className, lines = 3 }: ShimmerLoaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer h-4 rounded-lg"
          style={{
            width: `${100 - i * 15}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ShimmerCard({ className }: { className?: string }) {
  return (
    <div className={cn('card-glass p-6 space-y-4', className)}>
      <div className="shimmer h-6 w-1/3 rounded-lg" />
      <div className="space-y-2">
        <div className="shimmer h-4 w-full rounded-lg" />
        <div className="shimmer h-4 w-4/5 rounded-lg" />
        <div className="shimmer h-4 w-3/5 rounded-lg" />
      </div>
    </div>
  );
}
