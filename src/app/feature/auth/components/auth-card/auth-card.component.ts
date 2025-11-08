import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { LoginComponent } from "../login/login.component";

@Component({
    selector: 'app-auth-card',
    templateUrl: './auth-card.component.html',
    styleUrls: ['./auth-card.component.css'],
    imports: [MatButtonModule, LoginComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthCardComponent {
    private readonly router = inject(Router);
}