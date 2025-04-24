import { ArrowUpDown, Pencil } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { AudioPlayer } from '@/components/ui/audioplayer';
import { Button } from '@/components/ui/button';
import { TrackI } from '@/types/types';
import { Input } from '@/components/ui/input';

const SortingButton = ({
  title,
  onClick,
}: {
  title: string;
  onClick: undefined | ((event: unknown) => void);
}) => (
  <Button variant="ghost" className="cursor-pointer" onClick={onClick}>
    {title}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const createColumns = ({
  onEdit,
}: {
  onEdit: (track: TrackI) => void;
}): ColumnDef<TrackI>[] => [
  {
    id: 'edit',
    accessorKey: 'edit',
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button onClick={() => onEdit(row.original)} variant="ghost" className="cursor-pointer">
          <Pencil className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <div className="flex-col">
          <SortingButton title="Title" onClick={column.getToggleSortingHandler()} />
          <div className="my-2">
            <Input
              placeholder="Filter titles..."
              value={(column.getFilterValue() as string) ?? ''}
              onChange={event => column.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      );
    },
  },
  {
    id: 'artist',
    accessorKey: 'artist',
    header: ({ column }) => {
      return (
        <div>
          <SortingButton title="Artist" onClick={column.getToggleSortingHandler()} />
          <div className="my-2">
            <Input
              placeholder="Filter artists..."
              value={(column.getFilterValue() as string) ?? ''}
              onChange={event => column.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      );
    },
  },
  {
    id: 'album',
    accessorKey: 'album',
    header: ({ column }) => {
      return (
        <div>
          <SortingButton title="Album" onClick={column.getToggleSortingHandler()} />
          <div className="my-2">
            <Input
              placeholder="Filter albums..."
              value={(column.getFilterValue() as string) ?? ''}
              onChange={event => column.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      );
    },
  },
  {
    id: 'genres',
    accessorKey: 'genres',
    header: 'Genres',
  },
  {
    id: 'coverImage',
    accessorKey: 'coverImage',
    header: 'Cover Image',
    cell: ({ row }) => {
      const imageUrl = row.original.coverImage;
      return imageUrl ? (
        <img className="mt-2 max-h-32 rounded" width={150} height={150} src={imageUrl} />
      ) : null;
    },
  },
  {
    id: 'audiofile',
    accessorKey: 'audioFile',
    header: 'Audio',
    cell: ({ row }) => {
      const audioFile = row.original.audioFile;
      return audioFile ? (
        <div className="w-[420px]">
          <AudioPlayer fileName={audioFile} />
        </div>
      ) : null;
    },
  },
];
