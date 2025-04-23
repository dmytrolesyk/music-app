import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { AudioPlayer } from '@/components/ui/audioplayer/audioplayer';
import { Button } from '@/components/ui/button';
import { TrackI } from '@/types/types';

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

export const columns: ColumnDef<TrackI>[] = [
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     return <div>actions</div>;
  //   },
  // },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => {
      return <SortingButton title="Title" onClick={column.getToggleSortingHandler()} />;
    },
  },
  {
    id: 'artist',
    accessorKey: 'artist',
    header: ({ column }) => {
      return <SortingButton title="Artist" onClick={column.getToggleSortingHandler()} />;
    },
  },
  {
    id: 'album',
    accessorKey: 'album',
    header: ({ column }) => {
      return <SortingButton title="Album" onClick={column.getToggleSortingHandler()} />;
    },
  },
  {
    id: 'genres',
    accessorKey: 'genres',
    header: 'Genres',
    // header: ({ column }) => {
    //   return <SortingButton title="Genres" onClick={column.getToggleSortingHandler()} />;
    // },
  },
  {
    id: 'coverImage',
    accessorKey: 'coverImage',
    header: 'Cover Image',
    cell: ({ row }) => {
      const imageUrl = row.original.coverImage;
      return imageUrl ? <img width={150} height={150} src={imageUrl} /> : null;
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
          <AudioPlayer />
        </div>
      ) : null;
    },
  },
];
