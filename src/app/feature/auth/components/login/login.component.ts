import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MyErrorStateMatcher } from "../../models/auth.model";
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
        public switchEvent = output<{ formname: string }>();
        public readonly matcher = new MyErrorStateMatcher();
    
    public readonly loginForm = new FormGroup({
        loginFormControl: new FormControl(),
        passwordFormControl: new FormControl(),
    })

    public switchToRegisterForm(): void {
        this.switchEvent.emit({ formname: 'register' })
    }

    public onSubmit(): void {
        console.log(this.loginForm.getRawValue())
    }
}