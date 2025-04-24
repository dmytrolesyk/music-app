import { keepPreviousData, queryOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from './apiClient';
import { SortingOrder, TrackI, TracksI } from '@/types/types';
import { removeNullishValues } from '../utils';

type ErrorResponse = { error?: string };
const DEFAULT_ERROR = 'An error has occurred';
const formatError = (e: AxiosError<ErrorResponse>) => ({
  message: e.response?.data?.error ?? DEFAULT_ERROR,
});

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
    queryFn: (): Promise<TracksI> => {
      const searchParams = new URLSearchParams(
        removeNullishValues({ page: String(page), limit: String(limit), sort, order, search }),
      );

      return getData(apiClient.get(`/tracks?${searchParams.toString()}`));
    },
    placeholderData: keepPreviousData,
  });
};

export const getTrack = (trackSlug?: string) =>
  queryOptions({
    queryKey: ['GET_TRACK', trackSlug],
    queryFn: async (): Promise<TrackI | null> =>
      trackSlug ? getData(apiClient.get(`tracks/${trackSlug}`)) : null,
  });

export const getGenres = () =>
  queryOptions({
    queryKey: ['GET_GENRES'],
    queryFn: (): Promise<string[]> => getData(apiClient.get('/genres')),
  });

export const useAddTrack = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: (params: Pick<TrackI, 'title' | 'artist' | 'album' | 'genres' | 'coverImage'>) => {
      const { title, artist, album, genres, coverImage } = params;
      return apiClient.post('/tracks', {
        title,
        artist,
        album,
        genres,
        coverImage,
      });
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      if (onError) {
        onError(formatError(e));
      }
    },
  });
};

export const useEditTrack = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: (
      params: Pick<TrackI, 'id' | 'title' | 'artist' | 'album' | 'genres' | 'coverImage'>,
    ) => {
      const { id, title, artist, album, genres, coverImage } = params;
      return apiClient.put(`/tracks/${id}`, {
        title,
        artist,
        album,
        genres,
        coverImage,
      });
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      if (onError) {
        onError(formatError(e));
      }
    },
  });
};
