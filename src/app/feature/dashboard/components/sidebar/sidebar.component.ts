import { ChangeDetectionStrategy, Component, EventEmitter, inject, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

export type SidebarSection = 'project-setup' | 'settings' | 'documentation';

interface MenuItem {
  id: SidebarSection;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  public readonly sidebarToggle = output<boolean>();

  public readonly isCollapsed = signal<boolean>(false);
  public readonly activeSection = signal<SidebarSection>('project-setup');

  private readonly router = inject(Router);
  private readonly menuItemsData: MenuItem[] = [
    {
      id: 'project-setup',
      label: 'Project Setup',
      icon: 'settings',
      route: '/dashboard/project-setup'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'tune',
      route: '/dashboard/settings'
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: 'description',
      route: '/dashboard/documentation'
    }
  ];

  public toggleSidebar(): void {
    const newState = !this.isCollapsed();
    this.isCollapsed.set(newState);
    this.sidebarToggle.emit(newState);
  }

  public selectSection(section: SidebarSection): void {
    this.activeSection.set(section);
    const menuItem = this.menuItemsData.find(item => item.id === section);
    if (menuItem) {
      this.router.navigate([menuItem.route]);
    }
  }

  public get menuItems(): MenuItem[] {
    return this.menuItemsData;
  }

  public getMenuItemClass(item: MenuItem): string {
    const baseClass = 'menu-item';
    const activeClass = this.activeSection() === item.id ? 'active' : '';
    return [baseClass, activeClass].filter(Boolean).join(' ');
  }

  public getSidebarClass(): string {
    const baseClass = 'sidebar';
    const collapsedClass = this.isCollapsed() ? 'collapsed' : '';
    return [baseClass, collapsedClass].filter(Boolean).join(' ');
  }
}
