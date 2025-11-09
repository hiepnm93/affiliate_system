import { Card } from '@/ui/card';
import { Iconify } from '@/components/icon';
import { cn } from '@/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  colorClass = 'bg-primary-100 text-primary-600',
}: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <Iconify
                icon={
                  trend.isPositive
                    ? 'solar:arrow-up-bold'
                    : 'solar:arrow-down-bold'
                }
                className={cn(
                  'h-4 w-4',
                  trend.isPositive ? 'text-green-600' : 'text-red-600',
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600',
                )}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', colorClass)}>
          <Iconify icon={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
