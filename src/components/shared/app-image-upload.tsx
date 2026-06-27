import { AppFileUpload } from './app-file-upload';

interface AppImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
  maxSize?: number;
}

export function AppImageUpload({
  value,
  onChange,
  disabled,
  className,
  maxSize = 2 * 1024 * 1024, // 2MB
}: AppImageUploadProps) {
  return (
    <AppFileUpload
      value={value}
      onChange={onChange}
      accept={{
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
      }}
      maxSize={maxSize}
      disabled={disabled}
      className={className}
      isImage={true}
    />
  );
}
