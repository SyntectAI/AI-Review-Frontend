import { ChangeDetectionStrategy, Component, inject, output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MyErrorStateMatcher, RegisterRequest } from "../../models/auth.model";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
    public readonly switchEvent = output<{ formname: string }>();
    public readonly matcher = new MyErrorStateMatcher();
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    
    public readonly registerForm = new FormGroup({
        emailFormControl: new FormControl('', [Validators.required, Validators.email]),
        loginFormControl: new FormControl('', [Validators.required]),
        passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    get emailFormControl(): AbstractControl<string | null, string | null, unknown> | null {
        return this.registerForm.get('emailFormControl');
    }

    get loginFormControl(): AbstractControl<string | null, string | null, unknown> | null {
        return this.registerForm.get('loginFormControl');
    }

    get passwordFormControl(): AbstractControl<string | null, string | null, unknown> | null {
        return this.registerForm.get('passwordFormControl');
    }

    public switchToLoginForm(): void {
        this.switchEvent.emit({ formname: 'login' });
    }

    public onSubmit(): void {
        if (this.registerForm.valid) {
            const registerData: RegisterRequest = {
                email: this.registerForm.value.emailFormControl || '',
                login: this.registerForm.value.loginFormControl || '',
                password: this.registerForm.value.passwordFormControl || ''
            };

            this.authService.register(registerData).subscribe({
                next: (response) => {
                    console.log('Registration successful:', response);
                    // Redirect to dashboard after successful registration
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('Registration failed:', error);
                    // Handle error (show message to user)
                    this.registerForm.setErrors({ registrationFailed: true });
                }
            });
        } else {
            // Mark all fields as touched to trigger validation messages
            Object.keys(this.registerForm.controls).forEach(key => {
                const control = this.registerForm.get(key);
                control?.markAsTouched();
            });
        }
    }
}
