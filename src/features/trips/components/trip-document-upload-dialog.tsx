import { useState } from 'react';
import { useUploadTripDocument } from '../api';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';
import { CATEGORIES } from '../workspace/tabs/trip-documents-tab';
import { TripDocumentCategory } from '../domain/trip-types';

interface TripDocumentUploadDialogProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export function TripDocumentUploadDialog({ 
  tripId, 
  isOpen, 
  onClose,
  defaultCategory = ''
}: TripDocumentUploadDialogProps) {
  const [category, setCategory] = useState(defaultCategory);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const uploadMutation = useUploadTripDocument();

  const handleUpload = () => {
    if (!category || !file) {
      setError('Please select a category and a file.');
      return;
    }
    setError(null);

    // Using Mock File URL since we don't have real backend upload
    // In a real app, we'd use FormData and upload to S3/Cloud Storage
    
    uploadMutation.mutate(
      {
        id: tripId,
        payload: {
          category: category as TripDocumentCategory,
          file: file,
        }
      },
      {
        onSuccess: () => {
          setFile(null);
          setCategory('');
          onClose();
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to upload document');
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to this trip.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Select document category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <Input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploadMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || !category || uploadMutation.isPending}
          >
            {uploadMutation.isPending && <Upload className="mr-2 h-4 w-4 animate-bounce" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
