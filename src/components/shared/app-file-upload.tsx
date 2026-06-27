import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, File, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';

interface AppFileUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  isImage?: boolean;
}

export function AppFileUpload({
  value,
  onChange,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled,
  className,
  isImage = false,
}: AppFileUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onChange(file);
      if (isImage) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        // Free memory when component unmounts or preview changes
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setPreview(file.name);
      }
    }
  }, [onChange, isImage]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
  };

  if (value || preview) {
    return (
      <div className={cn("relative rounded-lg border border-border p-4 bg-muted/20 flex flex-col items-center justify-center gap-4", className)}>
        {isImage ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {preview ? (
               // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="object-cover w-full h-full" />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-background rounded-md w-full border border-border/50 shadow-sm">
            <div className="p-2 bg-primary/10 rounded-md text-primary">
              <File className="h-6 w-6" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">
                {typeof value === 'string' ? value.split('/').pop() : (value as File)?.name || 'Document'}
              </p>
              <p className="text-xs text-muted-foreground">Uploaded</p>
            </div>
          </div>
        )}
        <Button 
          type="button" 
          variant="destructive" 
          size="sm" 
          onClick={handleRemove}
          disabled={disabled}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" /> Remove
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "cursor-pointer rounded-lg border-2 border-dashed p-8 transition-colors flex flex-col items-center justify-center gap-2 text-center",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
        isDragReject ? "border-destructive bg-destructive/5" : "",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="p-3 bg-muted rounded-full">
        <UploadCloud className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">
          {isDragActive ? "Drop file here" : "Click or drag file to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isImage ? 'PNG, JPG or WEBP' : 'PDF, DOCX, or Images'} (Max {Math.round(maxSize / 1024 / 1024)}MB)
        </p>
      </div>
    </div>
  );
}
