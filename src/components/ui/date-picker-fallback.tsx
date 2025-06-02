import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DatePickerFallbackProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePickerFallback({
  date,
  onDateChange,
  placeholder = "Select date",
  className,
  disabled = false,
}: DatePickerFallbackProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      onDateChange(new Date(value));
    } else {
      onDateChange(undefined);
    }
  };

  const dateValue = date ? date.toISOString().split('T')[0] : '';

  return (
    <Input
      type="date"
      value={dateValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn('text-sm', className)}
      disabled={disabled}
    />
  );
} 