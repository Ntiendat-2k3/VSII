import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly navItems = ['GIỚI THIỆU', 'DỰ ÁN', 'TIN TỨC'];
  readonly mobileOpen = signal(false);

  toggleMobileMenu() {
    this.mobileOpen.update(v => !v);
  }
}
