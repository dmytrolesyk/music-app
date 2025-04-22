export const getEnvValue = (envVar: string) => import.meta.env[`VITE_${envVar}`];
