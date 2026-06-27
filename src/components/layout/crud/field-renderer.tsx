'use client';

import { UseFormReturn, useWatch, Controller, FieldValues } from 'react-hook-form';
import { FormFieldConfig } from './metadata-types';
import {
  AppTextField,
  AppTextareaField,
  AppNumberField,
  AppEmailField,
  AppPhoneField,
  AppSelectField,
  AppDateField,
  AppCheckboxField,
  AppSwitchField,
} from '@/components/form-fields';
import { AppImageUpload, AppFileUpload } from '@/components/shared';
import { AppLookup } from '@/components/shared/app-lookup';

interface FieldRendererProps {
  field: FormFieldConfig;
  form: UseFormReturn<FieldValues>;
}

export function FieldRenderer({ field, form }: FieldRendererProps) {
  // Watch all values to evaluate conditions dynamically
  const formValues = useWatch({ control: form.control });
  
  const isVisible = field.visibleWhen ? field.visibleWhen(formValues) : !field.hidden;
  if (!isVisible) return null;

  const isEnabled = field.enabledWhen ? field.enabledWhen(formValues) : !field.disabled;
  const isRequired = field.requiredWhen ? field.requiredWhen(formValues) : field.required;
  const isReadonly = field.readonlyWhen ? field.readonlyWhen(formValues) : false;

  if (field.type === 'custom' && field.render) {
    return field.render(form);
  }

  const commonProps = {
    control: form.control,
    name: field.name,
    label: field.label,
    placeholder: field.placeholder,
    description: field.description,
    required: isRequired,
    disabled: !isEnabled || isReadonly,
  };

  switch (field.type) {
    case 'text':
    case 'password':
      return <AppTextField {...commonProps} type={field.type} />;
    
    case 'textarea':
      return <AppTextareaField {...commonProps} rows={field.rows || 3} />;
    
    case 'number':
    case 'currency':
      return <AppNumberField {...commonProps} min={field.min} max={field.max} />;
    
    case 'email':
      return <AppEmailField {...commonProps} />;
    
    case 'phone':
      return <AppPhoneField {...commonProps} />;
    
    case 'select':
    case 'radio': // We map radio to select for now or can implement AppRadioGroup
      const options = (field.options || []).map(opt => ({
        label: opt.label,
        value: String(opt.value) // Ensure value is string
      }));
      return <AppSelectField {...commonProps} options={options} />;
    
    case 'date':
    case 'datetime':
      return <AppDateField {...commonProps} />;
    
    case 'checkbox':
      return <AppCheckboxField {...commonProps} />;
    
    case 'switch':
      return <AppSwitchField {...commonProps} />;
    
    // File uploads in forms are typically complex controlled components.
    // For now, we'll just wrap the basic upload. Proper integration requires a custom Controller.
    case 'lookup':
      return (
        <Controller
          control={form.control}
          name={field.name}
          render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {field.label}
                {isRequired && <span className="text-destructive ml-1">*</span>}
              </label>
              <div ref={ref}>
                <AppLookup
                  lookupKey={field.lookupKey!}
                  value={value}
                  onChange={onChange}
                  multiple={field.multiple}
                  disabled={commonProps.disabled}
                  placeholder={field.placeholder}
                />
              </div>
              {field.description && !error && <p className="text-[0.8rem] text-muted-foreground">{field.description}</p>}
              {error && <p className="text-[0.8rem] text-destructive">{error.message}</p>}
            </div>
          )}
        />
      );

    case 'image':
      return (
        <Controller
          control={form.control}
          name={field.name}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {field.label}
                {isRequired && <span className="text-destructive ml-1">*</span>}
              </label>
              <AppImageUpload 
                value={value} 
                onChange={onChange} 
                maxSize={field.maxSize} 
                disabled={commonProps.disabled}
              />
              {field.description && !error && <p className="text-[0.8rem] text-muted-foreground">{field.description}</p>}
              {error && <p className="text-[0.8rem] text-destructive">{error.message}</p>}
            </div>
          )}
        />
      );

    case 'file':
      return (
        <Controller
          control={form.control}
          name={field.name}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {field.label}
                {isRequired && <span className="text-destructive ml-1">*</span>}
              </label>
              <AppFileUpload 
                value={value} 
                onChange={onChange} 
                maxSize={field.maxSize} 
                disabled={commonProps.disabled}
              />
              {field.description && !error && <p className="text-[0.8rem] text-muted-foreground">{field.description}</p>}
              {error && <p className="text-[0.8rem] text-destructive">{error.message}</p>}
            </div>
          )}
        />
      );

    default:
      return <AppTextField {...commonProps} />;
  }
}
