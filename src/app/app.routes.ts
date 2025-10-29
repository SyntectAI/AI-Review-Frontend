import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./feature/auth/components/auth-card/auth-card.component').then((c) => c.AuthCardComponent),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./feature/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        // canActivate: [authGuard],
        children: [
            {
                path: 'project-setup',
                loadComponent: () => import('./feature/dashboard/components/project-setup/project-setup.component').then((c) => c.ProjectSetupComponent),
            },
            {
                path: 'settings',
                loadComponent: () => import('./feature/dashboard/components/settings/settings.component').then((c) => c.SettingsComponent),
            },
            {
                path: 'documentation',
                loadComponent: () => import('./feature/dashboard/components/documentation/documentation.component').then((c) => c.DocumentationComponent),
            },
            {
                path: '',
                redirectTo: 'project-setup',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
