import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./feature/auth/components/auth-card/auth-card.component').then((c) => c.AuthCardComponent),
    }
];
