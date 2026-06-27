import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/lib/utils';

export interface AppPhoneFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function AppPhoneField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = '10-digit number',
  disabled,
  required,
  className,
}: AppPhoneFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none text-sm">
              +91
            </span>
            <FormControl>
              <Input
                type="tel"
                placeholder={placeholder}
                disabled={disabled}
                className="pl-10"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  field.onChange(val || null);
                }}
              />
            </FormControl>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
