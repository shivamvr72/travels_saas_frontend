'use client';

import { useState } from 'react';
import { useDocuments } from '@/hooks/use-documents';
import { Button } from '@/components/ui/button';
import { FileUp, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DocumentUploadDialog } from './document-upload-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DocumentVaultProps {
  entityType: string;
  entityId: string;
  title?: string;
}

export function DocumentVault({ entityType, entityId, title = 'Documents' }: DocumentVaultProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const { data: response, isLoading } = useDocuments({
    entity_type: entityType,
    entity_id: entityId
  });
  
  const documents = response?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button onClick={() => setIsUploadOpen(true)} size="sm">
          <FileUp className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-sm text-muted-foreground animate-pulse">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
          <File className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No documents found.</p>
          <Button variant="link" onClick={() => setIsUploadOpen(true)}>
            Upload your first document
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium truncate" title={doc.document_category}>
                    {doc.document_category}
                  </div>
                  <Badge variant={doc.status === 'VERIFIED' ? 'default' : 'secondary'}>
                    {doc.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4 space-y-1">
                  {doc.document_number && (
                    <div>Number: {doc.document_number}</div>
                  )}
                  {doc.expiry_date && (
                    <div className="flex items-center text-orange-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <DocumentUploadDialog 
        entityType={entityType}
        entityId={entityId}
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
      />
    </div>
  );
}
