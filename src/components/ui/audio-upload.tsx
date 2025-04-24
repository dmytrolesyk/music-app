import { useCallback, useState, useRef } from 'react';
import { FileUp, X, Music, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadInputProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function AudioFileUploadInput({ value, onChange, disabled = false }: FileUploadInputProps) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }

      if (file) {
        const audioUrl = URL.createObjectURL(file);
        setAudioSrc(audioUrl);
        onChange(file);
      } else {
        setAudioSrc(null);
        onChange(null);
      }
    },
    [audioSrc, onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('audio/')) {
      handleFileChange(file);
    }
  };

  const removeFile = () => {
    handleFileChange(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'border-2 border-dashed rounded-md transition-colors',
          'flex flex-col items-center justify-center text-center p-4 h-36',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          audioSrc ? 'border-primary/40 bg-primary/5' : '',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={!disabled ? handleDrop : undefined}
        onClick={() => !disabled && !audioSrc && inputRef.current && inputRef.current.click()}
      >
        {audioSrc ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <audio src={audioSrc} controls className="w-full max-w-xs mb-2" />
            <div className="absolute top-0 right-0 p-1">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="w-6 h-6 rounded-full"
                onClick={e => {
                  e.stopPropagation();
                  removeFile();
                }}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
            <div className="bg-background/80 text-sm px-2 py-0.5 rounded flex items-center gap-1">
              <Check className="w-3 h-3 text-primary" />
              <span className="truncate max-w-[200px]">{value?.name}</span>
              {value?.size && (
                <span className="text-muted-foreground">({formatFileSize(value.size)})</span>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                {isDragging ? (
                  <Music className="w-6 h-6 text-primary" />
                ) : (
                  <FileUp className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isDragging ? 'Drop audio file here' : 'Upload audio file'}
                </p>
                <p className="text-xs text-muted-foreground">Drag and drop or click to upload</p>
              </div>
            </div>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
