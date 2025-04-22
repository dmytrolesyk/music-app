import { useSuspenseQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { DataTable } from './data-table';
import { getTracks } from '@/lib/api/queries';

export function TracksTable() {
  const result = useSuspenseQuery(getTracks);

  const { data } = result;

  return <DataTable columns={columns} data={data.data} />;
}
