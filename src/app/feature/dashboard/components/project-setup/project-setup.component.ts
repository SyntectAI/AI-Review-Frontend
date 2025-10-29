import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DEFAULT_PROJECT_CONFIG, ProjectConfiguration, TEMPERATURE_OPTIONS } from '../../models/project-config.model';
import { ProjectConfigService } from '../../services/project-config.service';

@Component({
  selector: 'app-project-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './project-setup.component.html',
  styleUrls: ['./project-setup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSetupComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectConfigService = inject(ProjectConfigService);
  private readonly snackBar = inject(MatSnackBar);

  public readonly projectForm: FormGroup;
  public readonly temperatureOptions = TEMPERATURE_OPTIONS;
  public readonly isLoading = signal<boolean>(false);
  public readonly isSaving = signal<boolean>(false);
  public readonly hideGithubToken = signal<boolean>(true);
  public readonly hideLlmApiToken = signal<boolean>(true);

  constructor() {
    this.projectForm = this.createForm();
  }

  public ngOnInit(): void {
    this.loadConfiguration();
  }

  public createForm(): FormGroup {
    return this.fb.group({
      githubToken: ['', [Validators.required]],
      llmApiToken: ['', [Validators.required]],
      llmSourceUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      model: ['', [Validators.required]],
      name: ['', [Validators.required]],
      temperature: [DEFAULT_PROJECT_CONFIG.temperature, [Validators.min(0), Validators.max(1)]],
      instruction: ['', [Validators.maxLength(8000)]],
      prompt: ['', [Validators.maxLength(10000)]]
    });
  }

  public loadConfiguration(): void {
    this.isLoading.set(true);
    this.projectConfigService.getProjectConfiguration().subscribe({
      next: (config: ProjectConfiguration) => {
        this.projectForm.patchValue(config);
        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.showError('Failed to load configuration: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  public onSubmit(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      this.showError('Please fill in all required fields correctly.');
      return;
    }

    this.isSaving.set(true);
    const config = this.projectForm.value as ProjectConfiguration;

    this.projectConfigService.saveProjectConfiguration(config).subscribe({
      next: (savedConfig: ProjectConfiguration) => {
        this.showSuccess('Configuration saved successfully!');
        this.isSaving.set(false);
      },
      error: (error: Error) => {
        this.showError('Failed to save configuration: ' + error.message);
        this.isSaving.set(false);
      }
    });
  }

  public resetForm(): void {
    this.projectForm.reset({
      temperature: DEFAULT_PROJECT_CONFIG.temperature,
      instruction: '',
      prompt: ''
    });
    this.showInfo('Form has been reset to default values.');
  }

  public getErrorMessage(field: string): string {
    const formControl = this.projectForm.get(field);
    if (!formControl || !formControl.errors || !formControl.touched) {
      return '';
    }

    const errors = formControl.errors;
    if (errors['required']) {
      return `${this.getFieldLabel(field)} is required`;
    }
    if (errors['pattern']) {
      if (field === 'llmSourceUrl') {
        return 'Please enter a valid URL (http:// or https://)';
      }
      return 'Invalid format';
    }
    if (errors['minlength']) {
      return `${this.getFieldLabel(field)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.getFieldLabel(field)} must be no more than ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `${this.getFieldLabel(field)} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${this.getFieldLabel(field)} must be no more than ${errors['max'].max}`;
    }

    return 'Invalid value';
  }

  public getCharacterCount(field: string): number {
    const value = this.projectForm.get(field)?.value || '';
    return value.length;
  }

  public getCharacterLimit(field: string): number {
    switch (field) {
      case 'instruction':
        return 8000;
      case 'prompt':
        return 10000;
      default:
        return Infinity;
    }
  }

  public isFieldInvalid(field: string): boolean {
    const control = this.projectForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public togglePasswordVisibility(field: 'githubToken' | 'llmApiToken'): void {
    if (field === 'githubToken') {
      this.hideGithubToken.set(!this.hideGithubToken());
    } else if (field === 'llmApiToken') {
      this.hideLlmApiToken.set(!this.hideLlmApiToken());
    }
  }

  public getPasswordType(field: 'githubToken' | 'llmApiToken'): 'password' | 'text' {
    if (field === 'githubToken') {
      return this.hideGithubToken() ? 'password' : 'text';
    } else if (field === 'llmApiToken') {
      return this.hideLlmApiToken() ? 'password' : 'text';
    }
    return 'password';
  }

  public getPasswordIcon(field: 'githubToken' | 'llmApiToken'): 'visibility' | 'visibility_off' {
    if (field === 'githubToken') {
      return this.hideGithubToken() ? 'visibility' : 'visibility_off';
    } else if (field === 'llmApiToken') {
      return this.hideLlmApiToken() ? 'visibility' : 'visibility_off';
    }
    return 'visibility';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      githubToken: 'GitHub Token',
      llmApiToken: 'LLM API Token',
      llmSourceUrl: 'LLM Source URL',
      model: 'Model',
      name: 'Project Name',
      temperature: 'Temperature',
      instruction: 'Instruction',
      prompt: 'Prompt'
    };
    return labels[field] || field;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
