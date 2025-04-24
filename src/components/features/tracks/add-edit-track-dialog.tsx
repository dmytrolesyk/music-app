import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { getGenres, useAddTrack } from '@/lib/api/queries';
import { ConfirmDialog } from './confirm-dialog';
import { TrackSchema } from '@/types/schemas';
import { GenresTagInput } from './genres-input';

const TrackFormSchema = TrackSchema.pick({
  title: true,
  artist: true,
  album: true,
  coverImage: true,
  genres: true,
});

type TrackForm = z.infer<typeof TrackFormSchema>;

const defaultTrack: TrackForm = {
  title: '',
  artist: '',
  album: '',
  coverImage: '',
  genres: [],
};

type AddEditTrackDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: () => void;
};

export function AddEditTrackDialog({ open, setOpen, onFormSubmit }: AddEditTrackDialogProps) {
  const { mutate: addTrack, isPending } = useAddTrack({
    onSuccess: () => {
      onFormSubmit();
    },
  });
  const { data: genres = [] } = useSuspenseQuery(getGenres());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: defaultTrack,
    validators: {
      onChange: TrackFormSchema,
    },
    onSubmit: async ({ value: newTrack }) => {
      addTrack(newTrack);
      form.reset();
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={newOpen => {
        if (!newOpen && form.state.isDirty) {
          setConfirmDialogOpen(true);
        } else {
          setOpen(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <Spinner spinning={isPending}>
          <DialogHeader>
            <DialogTitle>Add Track</DialogTitle>
            <DialogDescription>Fill in all the fields to add the track</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="title">
                  {field => (
                    <>
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="name"
                        onChange={e => field.handleChange(e.target.value)}
                        value={field.state.value}
                        className="col-span-3"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="artist">
                  {field => (
                    <>
                      <Label htmlFor="artist" className="text-right">
                        Artist
                      </Label>
                      <Input
                        onChange={e => field.handleChange(e.target.value)}
                        value={field.state.value}
                        id="artist"
                        className="col-span-3"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="album">
                  {field => (
                    <>
                      <Label htmlFor="album" className="text-right">
                        Album
                      </Label>
                      <Input
                        onChange={e => field.handleChange(e.target.value)}
                        value={field.state.value}
                        id="album"
                        className="col-span-3"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="coverImage">
                  {field => (
                    <>
                      <Label htmlFor="coverImage" className="text-right">
                        Cover Image
                      </Label>
                      <Input
                        onChange={e => field.handleChange(e.target.value)}
                        value={field.state.value}
                        id="coverImage"
                        className="col-span-3"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="genres">
                  {field => (
                    <>
                      <Label htmlFor="genres" className="text-right">
                        Genres
                      </Label>
                      <div className="col-span-3">
                        <GenresTagInput
                          value={field.state.value}
                          genres={genres}
                          onChange={values => field.handleChange(values)}
                        />
                      </div>
                    </>
                  )}
                </form.Field>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Spinner>
      </DialogContent>
      <ConfirmDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={() => {
          form.reset();
          setOpen(false);
        }}
      />
    </Dialog>
  );
}
