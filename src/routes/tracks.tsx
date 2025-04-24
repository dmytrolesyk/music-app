import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { columns } from '@/components/features/tracks/columns';
import { DataTable } from '@/components/features/tracks/data-table';
import { getGenres, getTracks } from '@/lib/api/queries';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { SortingOrder } from '@/types/types';
import { DebounceInput } from 'react-debounce-input';
import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
import { AddEditTrackDialog } from '@/components/features/tracks/add-edit-track-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
  const [dialogOpen, setDialogOpen] = useState(false);
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
        <Button onClick={() => setDialogOpen(true)} className="cursor-pointer" variant="outline">
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
      <AddEditTrackDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onFormSubmit={() => {
          setDialogOpen(false);
          refetchTracks();
        }}
      />
    </div>
  );
}
