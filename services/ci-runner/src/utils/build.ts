import { spawn } from 'child_process';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs';
import { BuildResult } from '../types/deploy';
import logger from './logger';

export async function runBuild(
  projectDir: string,
  buildCommand: string = 'pnpm run build',
  startCommand: string = 'pnpm start'
): Promise<BuildResult> {
  const logs: string[] = [];
  let success = false;

  try {
    // Run install
    await runCommand(projectDir, 'npx pnpm install', logs);

    // Run build
    await runCommand(projectDir, buildCommand, logs);

    // Run start
    await runCommand(projectDir, startCommand, logs);

    success = true;
  } catch (error) {
    logger.error('Build failed', { error, logs });
    success = false;
  }

  // Compress build output
  const outputPath = await compressBuildOutput(projectDir);

  return {
    success,
    logs: logs.join('\n'),
    outputPath,
  };
}

async function runCommand(
  cwd: string,
  command: string,
  logs: string[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      shell: true, // ✅ Important for Windows to resolve npx, pnpm, etc.
    });

    child.stdout.on('data', (data) => {
      const output = data.toString();
      logs.push(output);
      logger.info(output.trim());
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      logs.push(output);
      logger.error(output.trim());
    });

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: "${command}" with code ${code}`));
    });
  });
}

async function compressBuildOutput(projectDir: string): Promise<string | undefined> {
  const buildDirs = ['.next', 'dist', 'build'];
  let buildDir: string | undefined;

  for (const dir of buildDirs) {
    const fullPath = path.join(projectDir, dir);
    if (fs.existsSync(fullPath)) {
      buildDir = dir;
      break;
    }
  }

  if (!buildDir) {
    logger.info('No build output found to compress');
    return undefined;
  }

  const outputPath = path.join(projectDir, `${buildDir}.zip`);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      logger.info(`Build output compressed to ${outputPath}`);
      resolve(outputPath);
    });

    archive.on('error', (err) => {
      logger.error('Failed to compress build output', { error: err });
      reject(err);
    });

    archive.pipe(output);
    archive.directory(path.join(projectDir, buildDir), false);
    archive.finalize();
  });
}
