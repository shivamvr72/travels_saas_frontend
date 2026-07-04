'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DurationPicker({ form }: { form: any }) {
  const { watch, setValue, formState: { errors } } = form;
  const rawHours = watch('hours_occupied');
  const error = errors.hours_occupied;

  const [hoursVal, setHoursVal] = useState<string>('');
  const [minutesVal, setMinutesVal] = useState<string>('');

  useEffect(() => {
    if (rawHours !== undefined && rawHours !== null && rawHours !== '') {
      const totalHours = parseFloat(rawHours);
      if (!isNaN(totalHours)) {
        const h = Math.floor(totalHours);
        const m = Math.round((totalHours - h) * 60);
        setHoursVal(h > 0 || m > 0 ? String(h) : '');
        setMinutesVal(m > 0 ? String(m) : '');
      }
    } else {
      setHoursVal('');
      setMinutesVal('');
    }
  }, [rawHours]);

  const updateFormValue = (hStr: string, mStr: string) => {
    if (hStr === '' && mStr === '') {
      setValue('hours_occupied', null, { shouldValidate: true, shouldDirty: true });
      return;
    }
    const h = parseInt(hStr) || 0;
    const m = parseInt(mStr) || 0;
    const decimalVal = parseFloat((h + m / 60).toFixed(4));
    setValue('hours_occupied', decimalVal, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Est. Duration
      </Label>
      <div className="flex items-center gap-2 max-w-[260px]">
        <div className="flex items-center gap-1.5 flex-1">
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={hoursVal}
            onChange={(e) => {
              const val = e.target.value;
              setHoursVal(val);
              updateFormValue(val, minutesVal);
            }}
            className="w-full text-right"
          />
          <span className="text-xs text-muted-foreground shrink-0">hrs</span>
        </div>
        <div className="flex items-center gap-1.5 flex-1">
          <Input
            type="number"
            min={0}
            max={59}
            placeholder="0"
            value={minutesVal}
            onChange={(e) => {
              const val = e.target.value;
              setMinutesVal(val);
              updateFormValue(hoursVal, val);
            }}
            className="w-full text-right"
          />
          <span className="text-xs text-muted-foreground shrink-0">mins</span>
        </div>
      </div>
      {error && (
        <p className="text-xs font-medium text-destructive mt-1">
          {String(error.message)}
        </p>
      )}
      <p className="text-[11px] text-muted-foreground">
        Specify the estimated travel duration in hours and minutes.
      </p>
    </div>
  );
}
