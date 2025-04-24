import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createColumns } from '@/components/features/tracks/columns';
import { DataTable } from '@/components/features/tracks/data-table';
import { getGenres, getTracks, useDeleteTrack } from '@/lib/network/queries';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { SortingOrder, TrackData } from '@/types/types';
import { DebounceInput } from 'react-debounce-input';
import { Input } from '@/components/ui/input';
import { AddEditTrackDialog } from '@/components/features/tracks/add-edit-track-dialog';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { UploadFileDialog } from '@/components/features/tracks/upload-file-dialog';
import { ConfirmDialog } from '@/components/features/tracks/confirm-dialog';
import { toast } from 'sonner';

type SearchParamsType = {
  page: number;
  size: number;
  sort?: string;
  order?: SortingOrder;
  q?: string;
};

export const Route = createFileRoute('/tracks')({
  component: TracksTablePage,
  pendingComponent: () => <div>Loading...</div>,
  validateSearch: search => {
    const { page = 1, size = 10, sort, order, q } = search;
    return {
      page,
      size,
      sort,
      order,
      q,
    } as SearchParamsType;
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps: { page, size, sort, order, q } }) => {
    return [
      queryClient.ensureQueryData(getTracks({ page, limit: size, sort, order, search: q })),
      queryClient.ensureQueryData(getGenres()),
    ];
  },
});

const useQueryParamsTableState = () => {
  const { page, size, sort, order, q } = Route.useSearch();
  const routeApi = getRouteApi('/tracks');
  const navigate = routeApi.useNavigate();

  const paginationState = { pageIndex: page - 1, pageSize: size };
  const sortingState = sort ? [{ id: sort, desc: order === 'desc' }] : [];

  const updatePagination = (pagination: PaginationState) => {
    navigate({
      search: prev => ({
        ...prev,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
    });
  };

  const updateSorting = (sorting: SortingState) => {
    const sort = sorting[0];
    const newSortParams = (
      !sort
        ? { sort: undefined, order: undefined }
        : { sort: sort.id, order: sort.desc ? 'desc' : 'asc' }
    ) as Pick<SearchParamsType, 'sort' | 'order'>;
    navigate({
      search: prev => ({ ...prev, ...newSortParams }),
    });
  };

  const updateSearch = (searchString: string) => {
    navigate({
      search: prev => ({ ...prev, q: searchString }),
    });
  };

  return {
    page,
    size,
    sort,
    order,
    search: q,
    paginationState,
    updatePagination,
    sortingState,
    updateSorting,
    updateSearch,
  };
};

function TracksTablePage() {
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);

  const {
    page,
    size,
    sort,
    order,
    search,
    paginationState,
    updatePagination,
    sortingState,
    updateSorting,
    updateSearch,
  } = useQueryParamsTableState();

  const {
    data: { data, meta },
    refetch: refetchTracks,
  } = useSuspenseQuery(getTracks({ page, limit: size, sort, order, search }));

  const { mutate: deleteTrack } = useDeleteTrack({
    onSuccess: () => {
      toast.success('Track was deleted successfully');
    },
    onError: ({ message }: { message: string }) => {
      toast.error(message);
    },
  });

  const columns = useMemo(
    () =>
      createColumns({
        onEdit: track => {
          setSelectedTrack(track);
          setAddEditDialogOpen(true);
        },
        onConfigure: track => {
          setSelectedTrack(track);
          setUploadFileDialogOpen(true);
        },
        onDelete: track => {
          setSelectedTrack(track);
          setConfirmDeleteDialogOpen(true);
        },
      }),
    [],
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center py-4 justify-between">
        <DebounceInput
          debounceTimeout={300}
          element={Input}
          value={search}
          placeholder="Search tracks..."
          onChange={event => {
            updateSearch(event.target.value);
          }}
          className="max-w-sm"
        />
        <Button
          onClick={() => setAddEditDialogOpen(true)}
          className="cursor-pointer"
          variant="outline"
        >
          Add Track
        </Button>
      </div>
      <DataTable
        pagination={paginationState}
        sorting={sortingState}
        onPaginationChange={updaterOrValue => {
          const newPagination =
            typeof updaterOrValue === 'function' ? updaterOrValue(paginationState) : updaterOrValue;
          updatePagination(newPagination);
        }}
        onSortingChange={updaterOrValue => {
          const newSortingState =
            typeof updaterOrValue === 'function' ? updaterOrValue(sortingState) : updaterOrValue;
          updateSorting(newSortingState);
        }}
        columns={columns}
        data={data}
        metaData={meta}
      />
      {addEditDialogOpen && (
        <AddEditTrackDialog
          open={addEditDialogOpen}
          trackSlug={selectedTrack?.slug}
          setOpen={setAddEditDialogOpen}
          onClose={() => {
            setSelectedTrack(null);
          }}
          onFormSubmit={() => {
            setAddEditDialogOpen(false);
            setSelectedTrack(null);
            refetchTracks();
          }}
        />
      )}
      {uploadFileDialogOpen && (
        <UploadFileDialog
          trackSlug={selectedTrack?.slug}
          open={uploadFileDialogOpen}
          setOpen={setUploadFileDialogOpen}
          onFormSubmit={() => {
            setUploadFileDialogOpen(false);
            setSelectedTrack(null);
            refetchTracks();
          }}
        />
      )}
      {confirmDeleteDialogOpen && (
        <ConfirmDialog
          open={confirmDeleteDialogOpen}
          setOpen={setConfirmDeleteDialogOpen}
          message="Track(s) will be deleted permanently"
          onConfirm={() => {
            if (selectedTrack?.id) {
              deleteTrack(selectedTrack?.id);
              refetchTracks();
            }
            setConfirmDeleteDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
