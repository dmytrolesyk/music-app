import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getTrack, useRemoveFile, useUploadFile } from '@/lib/network/queries';
import { AudioFileUploadInput } from '@/components/ui/audio-upload';
import { Spinner } from '@/components/ui/spinner';
import { AudioPlayer } from '@/components/ui/audioplayer';
import { ConfirmDialog } from './confirm-dialog';

type UploadFileDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: () => void;
  trackSlug?: string;
};

export function UploadFileDialog({
  open,
  trackSlug,
  setOpen,
  onFormSubmit,
}: UploadFileDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { data: trackToEdit, isLoading } = useQuery(getTrack(trackSlug));
  const { mutate: upload, isPending: isUploading } = useUploadFile({
    onSuccess: () => {
      onFormSubmit();
      toast.success(<p data-testid="toast-success">File was successfully uploaded</p>);
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  });

  const { mutate: remove, isPending: isRemoving } = useRemoveFile({
    onSuccess: () => {
      onFormSubmit();
      toast.success(<p data-testid="toast-success">File was successfully removed</p>);
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  });

  const uploadFile = () => {
    if (trackToEdit && file) {
      upload({ trackId: trackToEdit?.id, file });
    }
  };

  const removeFile = () => {
    if (trackToEdit) {
      remove(trackToEdit?.id);
    }
  };

  const isProcessing = isUploading || isRemoving;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <Spinner spinning={isLoading || isProcessing}>
          <DialogHeader>
            <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Manage audiofile for the track
            </DialogTitle>
          </DialogHeader>
          <dl className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <dt className="text-lg">Title</dt>
              <dd className="text-lg font-semibold col-span-3">{trackToEdit?.title}</dd>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <dt className="text-lg">Artist</dt>
              <dd className="text-lg font-semibold col-span-3">{trackToEdit?.artist}</dd>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <dt className="text-lg">Album</dt>
              <dd className="text-lg font-semibold col-span-3">{trackToEdit?.album}</dd>
            </div>
            <div>
              {trackToEdit?.coverImage && (
                <img
                  src={trackToEdit?.coverImage}
                  alt="Cover preview"
                  className="mt-2 max-h-48 rounded col-span-3"
                />
              )}
            </div>
          </dl>
          {trackToEdit?.audioFile ? (
            <div className="py-4">
              <AudioPlayer trackId={trackToEdit.id} fileName={trackToEdit.audioFile} />
            </div>
          ) : (
            <AudioFileUploadInput onChange={f => setFile(f)} />
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (trackToEdit?.audioFile) {
                  setConfirmDialogOpen(true);
                } else if (file) {
                  uploadFile();
                }
              }}
              disabled={isLoading || isProcessing || (!file && !trackToEdit?.audioFile)}
              type="submit"
            >
              {trackToEdit?.audioFile ? 'Delete file' : 'Upload file'}
            </Button>
          </DialogFooter>
        </Spinner>
      </DialogContent>
      <ConfirmDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={() => {
          removeFile();
          setOpen(false);
        }}
        message="Audio file will be deleted (you'll be able to upload a new one though)"
      />
    </Dialog>
  );
}
