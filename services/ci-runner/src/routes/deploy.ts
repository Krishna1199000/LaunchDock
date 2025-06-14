import { Router, Request, Response } from 'express';
import { DeployPayload, DeployResponse } from '../types/deploy';
import { cloneRepo, cleanupBuildDir } from '../utils/git';
import { injectEnvVars } from '../utils/env';
import { runBuild } from '../utils/build';
import logger from '../utils/logger';

const router = Router();

router.post('/deploy', async (req: Request, res: Response) => {
  const payload = req.body as DeployPayload;
  let projectDir: string | undefined;

  try {
    // Validate payload
    if (!payload.repoUrl || !payload.branch || !payload.projectId || !payload.commitHash) {
      return res.status(400).json({
        status: 'FAILED',
        logs: 'Missing required fields: repoUrl, branch, projectId, or commitHash'
      });
    }

    // Clone repository
    projectDir = await cloneRepo(payload.repoUrl, payload.branch, payload.projectId);

    // Inject environment variables
    if (payload.envVars) {
      await injectEnvVars(projectDir, payload.envVars);
    }

    // Run build
    const buildResult = await runBuild(
      projectDir,
      payload.buildCommand,
      payload.startCommand
    );

    const response: DeployResponse = {
      status: buildResult.success ? 'SUCCESS' : 'FAILED',
      logs: buildResult.logs,
      outputPath: buildResult.outputPath
    };

    res.json(response);
  } catch (error) {
    logger.error('Deploy failed', { error });
    res.status(500).json({
      status: 'FAILED',
      logs: `Deploy failed: ${error.message}`
    });
  } finally {
    // Cleanup build directory
    if (projectDir) {
      await cleanupBuildDir(projectDir);
    }
  }
});

export default router; 