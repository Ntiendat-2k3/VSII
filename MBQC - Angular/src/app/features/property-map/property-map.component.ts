import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PropertyMapStateService } from './services/property-map-state.service';
import { MapHeaderComponent } from './components/map-header/map-header.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { MapCanvasComponent } from './components/map-canvas/map-canvas.component';
import LoginFormComponent from '../auth/login-form.component';
import { HeroSectionComponent } from '../../components/common/hero-section/hero-section.component';
import { CONFIG } from '../../constants/config.constant';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-property-map',
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressSpinnerModule,
    MapHeaderComponent,
    FilterBarComponent,
    MapCanvasComponent,
    LoginFormComponent,
    HeroSectionComponent
  ],
  templateUrl: './property-map.component.html',
  styleUrls: ['./property-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PropertyMapComponent {
  private readonly state = inject(PropertyMapStateService);
  private readonly auth = inject(AuthService);

  readonly projectId = CONFIG.DEFAULT_PROJECT_ID;
  readonly isLoadingMap = this.state.isLoadingMap;
  readonly isLoadingUnits = this.state.isLoadingUnits;
  readonly isLoggedIn = this.auth.isLoggedIn;

  constructor() {
    toObservable(this.isLoggedIn).pipe(
      filter(Boolean),
      takeUntilDestroyed()
    ).subscribe(() => {
      // Load Master Data first
      this.state.loadMasterData('UNIT_TYPE');
      this.state.loadMasterData('INQUIRY_STATUS');
      this.state.loadMasterData('UNIT_STATUS');

      // Load core map info and units
      this.state.loadMapData(this.projectId);
      this.state.loadUnits(this.projectId);
    });
  }
}
