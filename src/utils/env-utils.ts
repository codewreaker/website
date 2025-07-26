import { isDevelopment } from 'std-env';

// Safely check for Vite preprod environment variable in both Node and browser contexts
const vitePreprod =
  typeof (import.meta as any).env !== 'undefined'
    ? (import.meta as any).env.VITE_PREPROD
    : undefined;

export const isDev = Boolean(isDevelopment || vitePreprod);
console.log('IS_DEV', isDev)

/**
 * Logs all Vercel system environment variables (as listed in the docs) using console.dir.
 * See: https://vercel.com/docs/environment-variables/system-environment-variables
 */
export function logVercelEnvVars() {
  const vercelEnvVars = [
    'VERCEL',
    'VERCEL_ENV',
    'VERCEL_URL',
    'VERCEL_GIT_PROVIDER',
    'VERCEL_GIT_REPO_ID',
    'VERCEL_GIT_REPO_OWNER',
    'VERCEL_GIT_REPO_SLUG',
    'VERCEL_GIT_COMMIT_REF',
    'VERCEL_GIT_COMMIT_SHA',
    'VERCEL_GIT_COMMIT_MESSAGE',
    'VERCEL_GIT_COMMIT_AUTHOR_LOGIN',
    'VERCEL_GIT_COMMIT_AUTHOR_NAME',
    'VERCEL_GIT_COMMIT_AUTHOR_EMAIL',
    'VERCEL_GIT_PULL_REQUEST_ID',
    'VERCEL_GIT_PULL_REQUEST_NUMBER',
    'VERCEL_GIT_PULL_REQUEST_TITLE',
    'VERCEL_GIT_PULL_REQUEST_BODY',
    'VERCEL_GIT_PULL_REQUEST_HEAD_REF',
    'VERCEL_GIT_PULL_REQUEST_BASE_REF',
    'VERCEL_GIT_PREVIOUS_SHA',
    'VERCEL_GIT_PREVIOUS_COMMIT_REF',
    'VERCEL_GIT_PREVIOUS_COMMIT_SHA',
    'VERCEL_GIT_PREVIOUS_COMMIT_MESSAGE',
    'VERCEL_GIT_PREVIOUS_COMMIT_AUTHOR_LOGIN',
    'VERCEL_GIT_PREVIOUS_COMMIT_AUTHOR_NAME',
    'VERCEL_GIT_PREVIOUS_COMMIT_AUTHOR_EMAIL',
    'VERCEL_PROJECT_ID',
    'VERCEL_ORG_ID',
    'VERCEL_BRANCH_URL',
    'VERCEL_DEPLOYMENT_ID',
    'VERCEL_TEAM_ID',
    'VERCEL_REGION',
    'VERCEL_ANALYTICS_ID',
    'VERCEL_STATIC_BUILD',
    'VITE_PREPROD',
    'PAYLOAD_SECRET',
  ];

  const values: Record<string, string | undefined> = {};
  const esm_values: Record<string, string | undefined> = {};
  for (const key of vercelEnvVars) {
    values[`process.env.${key}`] = process.env?.[key];
    // Vite/ESM env vars are available via import.meta.env in supported environments
    esm_values[`import.meta.env.${key}`] = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env[key] : undefined;
  }
  console.dir(values, { depth: null });
  console.dir(esm_values, { depth: null });
}

