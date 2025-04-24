import { Dispatch, SetStateAction, useState } from 'react';
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
  const { data: trackToEdit, isLoading } = useQuery(getTrack(trackSlug));
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile({
    onSuccess: () => {
      onFormSubmit();
    },
  });

  const { mutate: removeAudio, isPending: isRemoving } = useRemoveFile({
    onSuccess: () => {
      onFormSubmit();
    },
  });

  const [shouldRemoveExisting, setShouldRemoveExisting] = useState(false);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);

    if (!newFile && trackToEdit?.audioFile) {
      setShouldRemoveExisting(true);
    } else {
      setShouldRemoveExisting(false);
    }
  };

  const handleSave = () => {
    if (!trackToEdit) return;

    if (file) {
      uploadFile({ trackId: trackToEdit.id, file });
    } else if (shouldRemoveExisting) {
      removeAudio(trackToEdit.id);
    } else {
      setOpen(false);
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
          <AudioFileUploadInput onChange={handleFileChange} />
          <DialogFooter>
            <Button onClick={handleSave} disabled={isLoading || isProcessing} type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </Spinner>
      </DialogContent>
    </Dialog>
  );
}
