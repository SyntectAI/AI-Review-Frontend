export interface ProjectConfiguration {
  githubToken: string;
  llmApiToken: string;
  llmSourceUrl: string;
  model: string;
  name: string;
  temperature: number;
  instruction: string;
  prompt: string;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export const DEFAULT_PROJECT_CONFIG: Partial<ProjectConfiguration> = {
  temperature: 0.2,
  instruction: '',
  prompt: ''
};

export const TEMPERATURE_OPTIONS = [
  { value: 0, label: '0.0' },
  { value: 0.1, label: '0.1' },
  { value: 0.2, label: '0.2' },
  { value: 0.3, label: '0.3' },
  { value: 0.4, label: '0.4' },
  { value: 0.5, label: '0.5' },
  { value: 0.6, label: '0.6' },
  { value: 0.7, label: '0.7' },
  { value: 0.8, label: '0.8' },
  { value: 0.9, label: '0.9' },
  { value: 1, label: '1.0' }
];
