import { createFileRoute } from '@tanstack/react-router';
import { TracksTable } from '@/components/features/tracks/tracks';
import { getTracks } from '@/lib/api/queries';

export const Route = createFileRoute('/tracks')({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(getTracks),
});

function RouteComponent() {
  return (
    <div className="container mx-auto py-10">
      <TracksTable />
    </div>
  );
}
