import { getEnvValue } from '@/lib/system';

const BASE_API_URL = getEnvValue('API_HOST');

export const getFileUrl = (fileName: string) => `${BASE_API_URL}/api/files/${fileName}`;
