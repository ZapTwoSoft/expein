import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(undefined);
  };

  return (
    <div className={cn('flex gap-2 items-center', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            size="sm"
            className={cn(
              'w-fit justify-start text-left font-normal text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                'Pick a date range'
              )}
            </span>
            <span className="sm:hidden">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'MMM dd')} - {format(date.to, 'MMM dd')}
                  </>
                ) : (
                  format(date.from, 'MMM dd, y')
                )
              ) : (
                'Date range'
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={isMobile ? 1 : 2}
            className="p-2 sm:p-3 pointer-events-auto"
          />
          {date?.from && (
            <div className="border-t p-2 sm:p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full text-xs sm:text-sm h-8 sm:h-9"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Reset Filter
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {date?.from && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          title="Clear date filter"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
