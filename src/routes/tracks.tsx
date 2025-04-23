import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { columns } from '@/components/features/tracks/columns';
import { DataTable } from '@/components/features/tracks/data-table';
import { getTracks } from '@/lib/api/queries';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { SortingOrder } from '@/types/types';

type SearchParamsType = {
  page: number;
  size: number;
  sort?: string;
  order?: SortingOrder;
};

export const Route = createFileRoute('/tracks')({
  component: TracksTablePage,
  pendingComponent: () => <div>Loading...</div>,
  validateSearch: search => {
    const { page = 1, size = 10, sort, order } = search;
    return {
      page,
      size,
      sort,
      order,
    } as SearchParamsType;
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps: { page, size, sort, order } }) => {
    return queryClient.ensureQueryData(getTracks({ page, limit: size, sort, order }));
  },
});

const useQueryParamsTableState = () => {
  const { page, size, sort, order } = Route.useSearch();
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

  return {
    page,
    size,
    sort,
    order,
    paginationState,
    updatePagination,
    sortingState,
    updateSorting,
  };
};

function TracksTablePage() {
  const {
    page,
    size,
    sort,
    order,
    paginationState,
    updatePagination,
    sortingState,
    updateSorting,
  } = useQueryParamsTableState();

  const result = useSuspenseQuery(getTracks({ page, limit: size, sort, order }));

  const {
    data: { data, meta },
  } = result;

  return (
    <div className="container mx-auto py-10">
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
    </div>
  );
}
