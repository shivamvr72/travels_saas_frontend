import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { invoiceUpdateSchema, InvoiceUpdateValues } from '../schemas/finance-schemas';
import { Invoice } from '../domain/finance-types';

interface InvoiceFormProps {
  initialData: Invoice;
  onSubmit: (data: InvoiceUpdateValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InvoiceForm({ initialData, onSubmit, onCancel, isLoading }: InvoiceFormProps) {
  const form = useForm<InvoiceUpdateValues>({
    mode: 'onChange',
    resolver: zodResolver(invoiceUpdateSchema) as any,
    defaultValues: {
      base_rate: initialData.base_rate || 0,
      included_km: initialData.included_km || 0,
      included_hrs: initialData.included_hrs || 0,
      extra_km: initialData.extra_km || 0,
      extra_km_rate: initialData.extra_km_rate || 0,
      extra_hrs: initialData.extra_hrs || 0,
      extra_hr_rate: initialData.extra_hr_rate || 0,
      night_charge: initialData.night_charge || 0,
      driver_meal: initialData.driver_meal || 0,
      toll_tax: initialData.toll_tax || 0,
      parking_charge: initialData.parking_charge || 0,
      other_charges: initialData.other_charges || 0,
      gst_percent: initialData.gst_percent || 0,
    },
  });

  const LabelWithTooltip = ({ label, tooltip }: { label: string; tooltip: string }) => (
    <div className="flex items-center gap-1.5 mb-2">
      <FormLabel className="mb-0">{label}</FormLabel>
      <Tooltip>
        <TooltipTrigger type="button">
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Base Details */}
          <div className="space-y-4">
            <h4 className="font-medium border-b pb-2">Base Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="base_rate" render={({ field }) => (
                <FormItem>
                  <LabelWithTooltip label="Base Rate (₹)" tooltip="Fixed total charge for the included KM and hours (Not a per km rate)." />
                  <FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="included_km" render={({ field }) => (
                <FormItem>
                  <LabelWithTooltip label="Included KM" tooltip="Distance covered under the Base Rate." />
                  <FormControl><Input type="number" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="included_hrs" render={({ field }) => (
                <FormItem>
                  <LabelWithTooltip label="Included Hrs" tooltip="Time duration covered under the Base Rate." />
                  <FormControl><Input type="number" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Extra Usage */}
          <div className="space-y-4">
            <h4 className="font-medium border-b pb-2">Extra Usage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <FormField control={form.control} name="extra_km" render={({ field }) => (
                  <FormItem className="flex-1">
                    <LabelWithTooltip label="Extra KM" tooltip="Total KM driven beyond the included KM limit." />
                    <FormControl><Input type="number" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="extra_km_rate" render={({ field }) => (
                  <FormItem className="flex-1">
                    <LabelWithTooltip label="Rate/KM (₹)" tooltip="Charge applied per extra KM driven." />
                    <FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex gap-2">
                <FormField control={form.control} name="extra_hrs" render={({ field }) => (
                  <FormItem className="flex-1">
                    <LabelWithTooltip label="Extra Hrs" tooltip="Total hours taken beyond the included hours limit." />
                    <FormControl><Input type="number" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="extra_hr_rate" render={({ field }) => (
                  <FormItem className="flex-1">
                    <LabelWithTooltip label="Rate/Hr (₹)" tooltip="Charge applied per extra hour taken." />
                    <FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          </div>

          {/* Additional Charges */}
          <div className="space-y-4">
            <h4 className="font-medium border-b pb-2">Additional Charges</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="night_charge" render={({ field }) => (
                <FormItem><FormLabel>Night Charge (₹)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="driver_meal" render={({ field }) => (
                <FormItem><FormLabel>Driver Allowance (₹)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="toll_tax" render={({ field }) => (
                <FormItem><FormLabel>Toll Tax (₹)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="parking_charge" render={({ field }) => (
                <FormItem><FormLabel>Parking (₹)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="other_charges" render={({ field }) => (
                <FormItem><FormLabel>Other Charges (₹)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="gst_percent" render={({ field }) => (
                <FormItem><FormLabel>GST (%)</FormLabel><FormControl><Input type="number" step="0.01" max="100" {...field} onWheel={(e) => e.currentTarget.blur()} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Invoice Details'}
            </Button>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
