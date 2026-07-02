import { Trip, TripDocumentCategory, TripDocument } from '../../domain/trip-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, File, Trash2, Download } from 'lucide-react';
import { useTripDocuments } from '../../hooks/use-trip-documents';
import { formatBytes } from '@/shared/lib/utils';
import { format } from 'date-fns';

interface TripDocumentsTabProps {
  trip: Trip;
}

export const CATEGORIES: { id: TripDocumentCategory; label: string }[] = [
  { id: 'permit', label: 'Permits' },
  { id: 'invoice', label: 'Invoices' },
  { id: 'lr_consignment', label: 'LR / Consignment' },
  { id: 'proof_of_delivery', label: 'Proof of Delivery' },
  { id: 'driver_document', label: 'Driver Documents' },
  { id: 'vehicle_document', label: 'Vehicle Documents' },
  { id: 'image', label: 'Images' },
  { id: 'other', label: 'Other' },
];

import { useState } from 'react';
import { TripDocumentUploadDialog } from '../../components/trip-document-upload-dialog';

export function TripDocumentsTab({ trip }: TripDocumentsTabProps) {
  const { data, isLoading } = useTripDocuments(trip.id);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('');

  const documents = data?.items || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-14 bg-muted/50 border-b" />
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  const renderDocumentList = (docs: TripDocument[]) => {
    if (docs.length === 0) {
      return (
        <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md bg-muted/20">
          No documents uploaded in this category.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map(doc => (
          <div key={doc.id} className="flex items-start gap-3 p-3 border rounded-lg hover:border-primary/50 transition-colors group">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" title={doc.file_name}>{doc.file_name}</p>
              <p className="text-[10px] text-muted-foreground flex gap-1.5 mt-0.5">
                <span>{formatBytes(doc.file_size_bytes)}</span>
                <span>•</span>
                <span>{format(new Date(doc.uploaded_at), 'MMM d, yyyy')}</span>
              </p>
            </div>
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => window.open(doc.file_url, '_blank')}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {CATEGORIES.map(category => {
        const categoryDocs = documents.filter((d: TripDocument) => d.category === category.id);
        
        return (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {category.label}
                <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {categoryDocs.length}
                </span>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-muted-foreground"
                onClick={() => { setUploadCategory(category.id); setUploadOpen(true); }}
              >
                <Upload className="mr-2 h-3.5 w-3.5" /> Add
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {renderDocumentList(categoryDocs)}
            </CardContent>
          </Card>
        );
      })}

      <TripDocumentUploadDialog 
        tripId={trip.id}
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        defaultCategory={uploadCategory}
      />
    </div>
  );
}
