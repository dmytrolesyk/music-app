import { z } from 'zod';

export const MetadataSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const TrackSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty('Title should not be empty'),
  artist: z.string().nonempty('Artist should not be empty'),
  album: z.string().optional(),
  genres: z.array(z.string().nonempty()),
  slug: z.string().nonempty(),
  coverImage: z.string().url('Should be a valid url').optional(),
  audioFile: z.string().optional(),
  createdAt: z.string().datetime().nonempty(),
  updatedAt: z.string().datetime().nonempty(),
});

export const TracksResponseSchema = z.object({
  data: z.array(TrackSchema),
  meta: MetadataSchema,
});
