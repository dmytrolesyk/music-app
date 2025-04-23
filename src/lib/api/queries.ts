import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { TracksI } from '@/schemas/dto.types';

const getData = <T>(promise: Promise<{ data: T }>): Promise<T> => promise.then(res => res?.data);

export const getTracks = (params?: { page: number; limit: number }) => {
  console.log({ params });
  const { page = 0, limit = 10 } = params ?? {};

  return queryOptions({
    queryKey: ['GET_TRACKS', page, limit],
    queryFn: async () => {
      const response: TracksI = await getData(apiClient.get(`/tracks?page=${page}&limit=${limit}`));
      return response;
    },
    placeholderData: keepPreviousData,
  });
};
