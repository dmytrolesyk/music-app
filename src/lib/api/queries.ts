import {
  keepPreviousData,
  queryOptions,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { SortingOrder, TrackI, TracksI } from '@/types/types';
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
    queryFn: async (): Promise<TracksI> => {
      const searchParams = new URLSearchParams(
        removeNullishValues({ page: String(page), limit: String(limit), sort, order, search }),
      );

      return getData(apiClient.get(`/tracks?${searchParams.toString()}`));
    },
    placeholderData: keepPreviousData,
  });
};

export const getGenres = () =>
  queryOptions({
    queryKey: ['GET_GENRES'],
    queryFn: (): Promise<string[]> => getData(apiClient.get('/genres')),
  });

export const useAddTrack = (options: { onSuccess?: () => void; onError?: () => void }) => {
  return useMutation({
    mutationFn: async (
      params: Pick<TrackI, 'title' | 'artist' | 'album' | 'genres' | 'coverImage'>,
    ) => {
      const { title, artist, album, genres, coverImage } = params;
      await new Promise(r => setTimeout(r, 2000));
      return await apiClient.post('/tracks', {
        title,
        artist,
        album,
        genres,
        coverImage,
      });
    },
    ...options,
  });
};
