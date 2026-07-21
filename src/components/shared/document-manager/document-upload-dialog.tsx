'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUploadDocument } from '@/hooks/use-documents';

const documentSchema = z.object({
  document_category: z.string().min(1, 'Category is required'),
  document_number: z.string().optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentUploadDialogProps {
  entityType: string;
  entityId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DocumentUploadDialog({ entityType, entityId, open, onOpenChange, onSuccess }: DocumentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: uploadDocument, isPending } = useUploadDocument();
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      document_category: '',
      document_number: '',
      issue_date: '',
      expiry_date: '',
    }
  });

  const onSubmit = async (data: DocumentFormValues) => {
    try {
      if (!file) {
        toast.error('Please select a file to upload');
        return;
      }
      
      const formData = new FormData();
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId);
      formData.append('document_category', data.document_category);
      if (data.document_number) formData.append('document_number', data.document_number);
      if (data.issue_date) formData.append('issue_date', data.issue_date);
      if (data.expiry_date) formData.append('expiry_date', data.expiry_date);
      formData.append('file', file);
      
      await uploadDocument(formData);
      
      toast.success('Document uploaded successfully');
      form.reset();
      setFile(null);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="document_category">Document Type</Label>
            <Input 
              id="document_category" 
              placeholder="e.g. INSURANCE, RC" 
              {...form.register('document_category')} 
            />
            {form.formState.errors.document_category && (
              <span className="text-xs text-red-500">{form.formState.errors.document_category.message}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_number">Document Number (Optional)</Label>
            <Input 
              id="document_number" 
              placeholder="e.g. AB123456" 
              {...form.register('document_number')} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input 
                id="issue_date" 
                type="date" 
                {...form.register('issue_date')} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input 
                id="expiry_date" 
                type="date" 
                {...form.register('expiry_date')} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input 
              id="file" 
              type="file" 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
