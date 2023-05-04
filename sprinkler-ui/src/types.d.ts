export type TargetType = {
  target: string;
  error?: string;
};

export type TaskType = {
  task: string;
  entrypoint: string;
  schedule?: string;
  timeout?: number;
  type: string;
};

export type TargetMetadataType = {
  os?: string;
  runtime?: string;
  version?: string;
};

export type TaskInstanceType = {
  target: string;
  task: string;
  timeout?: number;
  entrypoint_file: string;
  task_type: string;
  status: string;
  trigger_type: string;
  created_at_time: number;
  start_time: number;
  end_time: number;
  container_id: string;
  id: string;
  runtime: string;
  version: string;
  os?: string;
  git_hash: string;
};

export type NewSecretType = {
  secret: string;
  value: string;
};
