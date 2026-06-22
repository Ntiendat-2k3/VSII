import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyMapStateService } from '../../services/property-map-state.service';
import { HOT_FILTER, UNIT_TYPE_ICONS } from '../../constants/property-map.constant';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  private readonly state = inject(PropertyMapStateService);

  readonly HOT_FILTER = HOT_FILTER;
  readonly icons = UNIT_TYPE_ICONS;
  readonly activeFilters = this.state.filterTypes;

  readonly normalFilters = computed(() => {
    return this.state.masterData().unitTypeItems.filter(item => item.subGroupCode === 'LOW_RISE');
  });

  toggleFilter(type: string): void {
    const current = this.activeFilters();
    let updated: string[];
    
    if (current.includes(type)) {
      updated = current.filter(f => f !== type);
    } else {
      updated = [...current, type];
    }
    
    this.state.setFilters(updated);
  }

  isActive(type: string): boolean {
    return this.activeFilters().includes(type);
  }
}
