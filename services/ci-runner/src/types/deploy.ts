export interface DeployPayload {
  repoUrl: string;
  branch: string;
  projectId: string;
  commitHash: string;
  buildCommand?: string;
  startCommand?: string;
  envVars?: Record<string, string>;
}

export interface DeployResponse {
  status: 'SUCCESS' | 'FAILED';
  logs: string;
  outputPath?: string;
}

export interface BuildResult {
  success: boolean;
  logs: string;
  outputPath?: string;
} 