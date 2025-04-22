import { ColumnDef } from '@tanstack/react-table';
import { AudioPlayer } from '@/components/ui/audioplayer/audioplayer';
import { TrackDto } from '@/schemas/dto.types';

export const columns: ColumnDef<TrackDto>[] = [
  {
    id: 'actions',
    cell: ({ row }) => {
      return <div>actions</div>;
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'artist',
    header: 'Artist',
  },
  {
    accessorKey: 'album',
    header: 'Album',
  },
  {
    accessorKey: 'genres',
    header: 'Genres',
  },
  {
    accessorKey: 'coverImage',
    header: 'Cover Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue<string>('coverImage');
      return imageUrl ? <img width={150} height={150} src={imageUrl} /> : null;
    },
  },
  {
    accessorKey: 'audioFile',
    header: 'Audio',
    cell: ({ row }) => {
      const audioFile = row.getValue<string>('audioFile');
      return audioFile ? (
        <div className="w-[420px]">
          <AudioPlayer />
        </div>
      ) : null;
    },
  },
];
