import { ChangeDetectionStrategy, Component, inject, output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginRequest, MyErrorStateMatcher } from "../../models/auth.model";
import { AuthService } from "../../../../core/services/auth.service";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    public readonly matcher = new MyErrorStateMatcher();
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    public readonly loginForm = new FormGroup({
        loginFormControl: new FormControl('admin', [Validators.required]),
        passwordFormControl: new FormControl('admin', [Validators.required]),
    });

    public onSubmit(): void {
        if (this.loginForm.valid) {
            const credentials: LoginRequest = {
                login: this.loginForm.value.loginFormControl || '',
                password: this.loginForm.value.passwordFormControl || ''
            };

            this.authService.login(credentials).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    // Redirect to dashboard or intended URL
                    const returnUrl = this.router.getCurrentNavigation()?.finalUrl?.toString() || '/dashboard';
                    this.router.navigate([returnUrl]);
                },
                error: (error) => {
                    console.error('Login failed:', error);
                }
            });
        } else {
            // Mark all fields as touched to trigger validation messages
            Object.keys(this.loginForm.controls).forEach(key => {
                const control = this.loginForm.get(key);
                control?.markAsTouched();
            });
        }
    }

    get loginFormControl(): AbstractControl<string | null, string | null, unknown> | null {
        return this.loginForm.get('loginFormControl');
    }

    get passwordFormControl(): AbstractControl<string | null, string | null, unknown> | null {
        return this.loginForm.get('passwordFormControl');
    }
}
