export interface GitHubPushPayload {
  ref: string;
  before: string;
  after: string;
  repository: {
    name: string;
    full_name: string;
    private: boolean;
    owner: {
      name: string;
      email: string;
      login: string;
    };
  };
  pusher: {
    name: string;
    email: string;
  };
  commits: Array<{
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
      username: string;
    };
    committer: {
      name: string;
      email: string;
      username: string;
    };
  }>;
}

export interface WebhookEvent {
  type: 'push';
  payload: GitHubPushPayload;
} 