import fs from 'fs/promises';
import path from 'path';
import logger from './logger';

export async function injectEnvVars(
  projectDir: string,
  envVars: Record<string, string>
): Promise<void> {
  if (!envVars || Object.keys(envVars).length === 0) {
    logger.info('No environment variables to inject');
    return;
  }

  try {
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const envPath = path.join(projectDir, '.env');
    await fs.writeFile(envPath, envContent, 'utf-8');
    
    logger.info(`Successfully injected environment variables to ${envPath}`);
  } catch (error) {
    logger.error('Failed to inject environment variables', { error });
    throw new Error(`Failed to inject environment variables: ${error.message}`);
  }
} 