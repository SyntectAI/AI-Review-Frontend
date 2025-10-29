import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { ProjectConfiguration } from '../models/project-config.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectConfigService {
  private readonly STORAGE_KEY = 'project_configuration';

  /**
   * Load existing project configuration
   * Returns mock data for now, with simulated network delay
   */
  getProjectConfiguration(): Observable<ProjectConfiguration> {
    try {
      // Try to get from localStorage first
      const storedConfig = localStorage.getItem(this.STORAGE_KEY);
      if (storedConfig) {
        const config = JSON.parse(storedConfig) as ProjectConfiguration;
        return of(config).pipe(delay(300)); // Simulate network delay
      }

      // Return mock configuration if no stored config
      const mockConfig = this.getMockConfiguration();
      return of(mockConfig).pipe(delay(500));
    } catch (error) {
      return throwError(() => new Error('Failed to load project configuration'));
    }
  }

  /**
   * Save project configuration
   * Currently saves to localStorage and returns the saved config
   */
  saveProjectConfiguration(config: ProjectConfiguration): Observable<ProjectConfiguration> {
    try {
      // Validate required fields
      this.validateConfiguration(config);

      // Save to localStorage (mock backend)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));

      // Simulate network delay and return success
      return of(config).pipe(delay(400));
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Get mock configuration for testing
   */
  getMockConfiguration(): ProjectConfiguration {
    return {
      githubToken: 'ghp_mock_token_1234567890abcdef',
      llmApiToken: 'sk-mock_llm_api_token_1234567890',
      llmSourceUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      name: 'AI Review Project',
      temperature: 0.2,
      instruction: 'Please review the following code for potential issues, best practices violations, and improvement suggestions. Focus on code quality, security, performance, and maintainability.',
      prompt: 'Analyze this code repository and provide a comprehensive review covering:\n1. Code quality and style\n2. Security vulnerabilities\n3. Performance optimizations\n4. Best practices adherence\n5. Suggestions for improvement'
    };
  }

  /**
   * Clear stored configuration
   */
  clearConfiguration(): Observable<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return of(void 0).pipe(delay(100));
    } catch (error) {
      return throwError(() => new Error('Failed to clear configuration'));
    }
  }

  /**
   * Validate project configuration
   */
  private validateConfiguration(config: ProjectConfiguration): void {
    const errors: string[] = [];

    // Required fields validation
    if (!config.githubToken?.trim()) {
      errors.push('GitHub token is required');
    }
    if (!config.llmApiToken?.trim()) {
      errors.push('LLM API token is required');
    }
    if (!config.llmSourceUrl?.trim()) {
      errors.push('LLM source URL is required');
    }
    if (!config.model?.trim()) {
      errors.push('Model is required');
    }
    if (!config.name?.trim()) {
      errors.push('Project name is required');
    }

    // Temperature validation
    if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 1)) {
      errors.push('Temperature must be between 0 and 1');
    }

    // Character limit validation
    if (config.instruction && config.instruction.length > 8000) {
      errors.push('Instruction must be less than 8000 characters');
    }
    if (config.prompt && config.prompt.length > 10000) {
      errors.push('Prompt must be less than 10000 characters');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
  }
}
