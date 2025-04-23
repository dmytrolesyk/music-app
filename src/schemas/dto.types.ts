import { z } from 'zod';
import { MetadataSchema, TrackSchema, TracksResponseSchema } from './dto.schemas';

export type TrackI = z.infer<typeof TrackSchema>;
export type TracksI = z.infer<typeof TracksResponseSchema>;
export type MetaDataI = z.infer<typeof MetadataSchema>;
