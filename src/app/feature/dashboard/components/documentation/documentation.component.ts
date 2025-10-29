import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationComponent {
  public readonly title = 'Documentation';
  public readonly message = 'This section is under construction.';
  public readonly description = 'Documentation will be available in future updates.';
}
