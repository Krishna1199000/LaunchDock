import { simpleGit, SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs/promises';
import logger from './logger';

export async function cloneRepo(
  repoUrl: string,
  branch: string,
  projectId: string
): Promise<string> {
  const timestamp = Date.now();
  const cloneDir = path.join(process.env.BUILD_DIR_BASE || '/tmp', `${projectId}-${timestamp}`);
  
  try {
    // Create directory if it doesn't exist
    await fs.mkdir(cloneDir, { recursive: true });
    
    // Clone the repository
    const git: SimpleGit = simpleGit();
    await git.clone(repoUrl, cloneDir, ['--branch', branch, '--single-branch']);
    
    logger.info(`Successfully cloned ${repoUrl} (${branch}) to ${cloneDir}`);
    return cloneDir;
  } catch (error) {
    logger.error('Failed to clone repository', { error, repoUrl, branch });
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
}

export async function cleanupBuildDir(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    logger.info(`Cleaned up build directory: ${dir}`);
  } catch (error) {
    logger.error('Failed to cleanup build directory', { error, dir });
  }
} 