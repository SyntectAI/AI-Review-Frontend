import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MyErrorStateMatcher } from "../../models/auth.model";
import { MatButtonModule } from "@angular/material/button";



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
    
    public readonly registerForm = new FormGroup({
        emailFormControl: new FormControl('', [Validators.required, Validators.email]),
        loginFormControl: new FormControl(),
        passwordFormControl: new FormControl(),
    })

    get emailFormControl(): AbstractControl<string | null, string | null, unknown> | null {
        return this.registerForm.get('emailFormControl')
    }

    public switchToLoginForm(): void {
        this.switchEvent.emit({ formname: 'login' })
    }

    public onSubmit(): void {
        console.log(this.registerForm.getRawValue())
    }
}
