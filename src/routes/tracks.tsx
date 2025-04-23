import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { columns } from '@/components/features/tracks/columns';
import { DataTable } from '@/components/features/tracks/data-table';
import { getTracks } from '@/lib/api/queries';
import { PaginationState } from '@tanstack/react-table';

type SearchType = {
  page: number;
  size: number;
};

export const Route = createFileRoute('/tracks')({
  component: TracksTablePage,
  pendingComponent: () => <div>Loading...</div>,
  validateSearch: search => {
    const { page = 1, size = 10 } = search;
    return {
      page,
      size,
    } as SearchType;
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps: search }) =>
    queryClient.ensureQueryData(getTracks({ page: search.page, limit: search.size })),
});

const useQueryParamsTableState = () => {
  const { page, size } = Route.useSearch();
  const routeApi = getRouteApi('/tracks');
  const navigate = routeApi.useNavigate();

  const updatePagination = (pagination: PaginationState) => {
    navigate({
      search: prev => ({ ...prev, page: pagination.pageIndex + 1, size: pagination.pageSize }),
    });
  };

  const paginationState = { pageIndex: page - 1, pageSize: size };

  return {
    page,
    size,
    paginationState,
    updatePagination,
  };
};

function TracksTablePage() {
  const { page, size, paginationState, updatePagination } = useQueryParamsTableState();

  const result = useSuspenseQuery(getTracks({ page, limit: size }));

  const {
    data: { data, meta },
  } = result;

  return (
    <div className="container mx-auto py-10">
      <DataTable
        pagination={paginationState}
        onPaginationChange={updater => {
          const newPagination = typeof updater === 'function' ? updater(paginationState) : updater;
          updatePagination(newPagination);
        }}
        columns={columns}
        data={data}
        metaData={meta}
      />
    </div>
  );
}
