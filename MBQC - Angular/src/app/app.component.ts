import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FooterComponent } from './components/common/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="app-wrapper-container">
      <app-navbar></app-navbar>
      <main class="app-main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-wrapper-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      background-color: var(--palette-bg-default);
    }
    .app-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  `],
})
export class AppComponent {
  title = 'mbqc';
}

