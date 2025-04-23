import { ColumnDef } from '@tanstack/react-table';
import { AudioPlayer } from '@/components/ui/audioplayer/audioplayer';
import { TrackI } from '@/schemas/dto.types';

export const columns: ColumnDef<TrackI>[] = [
  {
    id: 'actions',
    cell: ({ row }) => {
      return <div>actions</div>;
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'artist',
    accessorKey: 'artist',
    header: 'Artist',
  },
  {
    id: 'album',
    accessorKey: 'album',
    header: 'Album',
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
