import { Injectable, signal, computed, inject } from '@angular/core';
import { HOT_FILTER, UNIT_STATUS } from '../constants/property-map.constant';
import type { UnitItem } from '../models/property-map.model';
import type { MapGetResponse, MasterDataResponse } from '../models/property-map.dto';
import { PropertyMapService } from './property-map.service';
import { take } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

export interface MasterData {
  unitTypes: Record<string, string>;
  unitTypeItems: MasterDataResponse[];
  inquiryStatuses: Record<string, string>;
  unitStatuses: Record<string, string>;
}

export interface FocusCoords {
  x: number;
  y: number;
  xPixel?: number;
  yPixel?: number;
  rotation?: number;
  pageWidth?: number;
  pageHeight?: number;
  zoomLevel?: number;
}

@Injectable({ providedIn: 'root' })
export class PropertyMapStateService {
  private readonly propertyMapService = inject(PropertyMapService);
  private readonly toast = inject(ToastService);

  readonly mapData = signal<MapGetResponse | null>(null);
  readonly units = signal<UnitItem[]>([]);
  readonly filterTypes = signal<string[]>([]);
  readonly searchKeyword = signal('');
  readonly searchedUnit = signal<UnitItem | null>(null);
  readonly focusCoords = signal<FocusCoords | null>(null);
  readonly isLoadingMap = signal(false);
  readonly isLoadingUnits = signal(false);
  readonly masterData = signal<MasterData>({ unitTypes: {}, unitTypeItems: [], inquiryStatuses: {}, unitStatuses: {} });

  readonly filteredUnits = computed(() => {
    const activeFilters = this.filterTypes();
    const allUnits = this.units();
    if (activeFilters.length === 0) return [];

    const availableUnits = allUnits.filter(u => u.statusCode === UNIT_STATUS.AVAILABLE);

    return availableUnits.filter(unit => {
      if (unit.isHot && activeFilters.includes(HOT_FILTER)) return true;
      if (!unit.unitTypeCode) return true;

      if (activeFilters.includes(unit.unitTypeCode)) return true;
      return false;
    });
  });

  loadMapData(projectId: number): void {
    this.isLoadingMap.set(true);
    this.propertyMapService.getMapData(projectId).pipe(take(1)).subscribe({
      next: (data) => {
        this.mapData.set(data);
        this.isLoadingMap.set(false);
      },
      error: () => {
        this.isLoadingMap.set(false);
        this.toast.error('Lỗi tải dữ liệu bản đồ. Vui lòng thử lại sau.');
      }
    });
  }

  loadUnits(projectId: number, keyword?: string): void {
    this.isLoadingUnits.set(true);
    this.propertyMapService.searchUnits(projectId, keyword).pipe(take(1)).subscribe({
      next: (units) => {
        this.units.set(units);
        this.isLoadingUnits.set(false);
      },
      error: () => {
        this.isLoadingUnits.set(false);
        this.toast.error('Lỗi tải danh sách sản phẩm. Vui lòng thử lại sau.');
      }
    });
  }

  loadMasterData(groupCode: string): void {
    this.propertyMapService.getMasterData({ groupCode }).pipe(take(1)).subscribe({
      next: (list) => {
        if (!list || list.length === 0) return;
        const mapping: Record<string, string> = {};
        list.forEach(item => {
          if (item.code && item.value) mapping[item.code] = item.value;
        });

        this.masterData.update(prev => {
          if (groupCode === 'UNIT_TYPE') {
            const sortedItems = [...list].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            if (this.filterTypes().length === 0) {
              const lowRiseCodes = sortedItems.filter(i => i.subGroupCode === 'LOW_RISE').map(i => i.code);
              this.filterTypes.set([HOT_FILTER, ...lowRiseCodes]);
            }
            return { ...prev, unitTypes: { ...prev.unitTypes, ...mapping }, unitTypeItems: sortedItems };
          }
          if (groupCode === 'INQUIRY_STATUS') return { ...prev, inquiryStatuses: { ...prev.inquiryStatuses, ...mapping } };
          if (groupCode === 'UNIT_STATUS') return { ...prev, unitStatuses: { ...prev.unitStatuses, ...mapping } };
          return prev;
        });
      },
      error: () => {
        this.toast.error('Lỗi tải dữ liệu hệ thống.');
      }
    });
  }

  setFilters(filters: string[]): void {
    this.filterTypes.set(filters);
  }

  forceShowUnit(unit: UnitItem): void {
    this.searchedUnit.set(unit);
  }

  clearSearchedUnit(): void {
    this.searchedUnit.set(null);
  }

  setFocusUnit(coords: FocusCoords | null): void {
    this.focusCoords.set(coords);
  }
}
