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
    return queryClient.ensureQueryData(getTracks({ page, limit: size, sort, order, search: q }));
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

  const result = useSuspenseQuery(getTracks({ page, limit: size, sort, order, search }));

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
        onSearch={updateSearch}
        searchString={search}
        columns={columns}
        data={data}
        metaData={meta}
      />
    </div>
  );
}
