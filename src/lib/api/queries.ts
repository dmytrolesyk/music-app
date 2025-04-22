import { queryOptions } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { TracksDto } from '@/schemas/dto.types';

const getData = <T>(promise: Promise<{ data: T }>): Promise<T> => promise.then(res => res?.data);

export const getTracks = queryOptions({
  queryKey: ['GET_TRACKS'],
  queryFn: async () => {
    const response: TracksDto = await getData(apiClient.get('/tracks'));
    return response;
  },
});
