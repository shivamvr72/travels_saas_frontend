import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAddTripNote } from '../api';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TripNoteDialogProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TripNoteDialog({
  tripId,
  isOpen,
  onClose,
}: TripNoteDialogProps) {
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const addNoteMutation = useAddTripNote();

  const handleAddNote = () => {
    if (!note.trim()) {
      setError('Please type a note before saving.');
      return;
    }

    addNoteMutation.mutate(
      { id: tripId, note: note.trim() },
      {
        onSuccess: () => {
          onClose();
          setNote('');
          setError(null);
        },
        onError: () => {
          setError('Failed to add the note. Please try again.');
        }
      }
    );
  };

  const handleClose = () => {
    if (!addNoteMutation.isPending) {
      onClose();
      setNote('');
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Dispatcher Note</DialogTitle>
          <DialogDescription>
            This note will be added to the trip activity log as a persistent remark.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Textarea
            placeholder="Type your note here..."
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (error) setError(null);
            }}
            disabled={addNoteMutation.isPending}
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={addNoteMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNote}
            disabled={addNoteMutation.isPending}
          >
            {addNoteMutation.isPending ? 'Saving...' : 'Add Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
