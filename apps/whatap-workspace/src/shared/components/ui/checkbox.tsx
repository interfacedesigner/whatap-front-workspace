import { cn } from '@/shared/lib/utils';
import * as React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, indeterminate, ...props }, ref) => {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate, resolvedRef]);

  return (
    <input
      type='checkbox'
      ref={resolvedRef}
      className={cn(
        'h-4 w-4 shrink-0 rounded border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:text-primary-foreground',
        className,
      )}
      {...props}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
