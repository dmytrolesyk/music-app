import { z } from 'zod';
import { TrackSchema, TracksResponseSchema } from './dto.schemas';

export type TrackDto = z.infer<typeof TrackSchema>;
export type TracksDto = z.infer<typeof TracksResponseSchema>;
