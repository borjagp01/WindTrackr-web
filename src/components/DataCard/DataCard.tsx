interface DataCardProps {
  label: string;
  value: number;
  unit: string;
  subtitle?: string;
  color?: 'primary' | 'amber' | 'orange' | 'blue' | 'gray';
}

export function DataCard({
  label,
  value,
  unit,
  subtitle,
  color = 'gray',
}: DataCardProps) {
  const colorClasses = {
    primary: {
      border: 'border-primary-200/70 dark:border-primary-700/60',
      label: 'text-primary-600 dark:text-primary-300',
      value: 'text-primary-600 dark:text-primary-400',
      unit: 'text-primary-500 dark:text-primary-300/90',
      subtitle: 'text-gray-500 dark:text-gray-400',
    },
    amber: {
      border: 'border-amber-200/70 dark:border-amber-700/60',
      label: 'text-amber-600 dark:text-amber-300',
      value: 'text-amber-600 dark:text-amber-300',
      unit: 'text-amber-500 dark:text-amber-300/90',
      subtitle: 'text-gray-500 dark:text-gray-400',
    },
    orange: {
      border: 'border-orange-200/70 dark:border-orange-700/60',
      label: 'text-orange-600 dark:text-orange-300',
      value: 'text-orange-600 dark:text-orange-300',
      unit: 'text-orange-500 dark:text-orange-300/90',
      subtitle: 'text-gray-500 dark:text-gray-400',
    },
    blue: {
      border: 'border-blue-200/70 dark:border-blue-700/60',
      label: 'text-blue-600 dark:text-blue-300',
      value: 'text-blue-600 dark:text-blue-300',
      unit: 'text-blue-500 dark:text-blue-300/90',
      subtitle: 'text-gray-500 dark:text-gray-400',
    },
    gray: {
      border: 'border-gray-200/60 dark:border-gray-700/60',
      label: 'text-gray-500 dark:text-gray-400',
      value: 'text-primary-600 dark:text-primary-400',
      unit: 'text-gray-500 dark:text-gray-400',
      subtitle: 'text-gray-500 dark:text-gray-400',
    },
  };

  const styles = colorClasses[color];

  return (
    <div
      className={`bg-white/80 dark:bg-gray-900/60 rounded-xl px-4 py-3 flex flex-col items-center justify-center shadow-sm border ${styles.border}`}
    >
      <span
        className={`text-[11px] font-semibold uppercase tracking-wide ${styles.label}`}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-extrabold ${styles.value}`}>
          {Math.round(value)}
        </span>
        <span className={`text-sm font-medium ${styles.unit}`}>{unit}</span>
      </div>
      {subtitle && (
        <span className={`text-xs font-medium ${styles.subtitle}`}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
