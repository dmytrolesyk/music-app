import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { SortingOrder, TracksI } from '@/types/types';
import { removeNullishValues } from '../utils';

const getData = <T>(promise: Promise<{ data: T }>): Promise<T> => promise.then(res => res?.data);

export const getTracks = (params?: {
  page: number;
  limit: number;
  sort?: string;
  order?: SortingOrder;
  search?: string;
}) => {
  const { page = 0, limit = 10, sort, order, search } = params ?? {};

  return queryOptions({
    queryKey: ['GET_TRACKS', page, limit, sort, order, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams(
        removeNullishValues({ page: String(page), limit: String(limit), sort, order, search }),
      );

      const response: TracksI = await getData(apiClient.get(`/tracks?${searchParams.toString()}`));
      return response;
    },
    placeholderData: keepPreviousData,
  });
};
