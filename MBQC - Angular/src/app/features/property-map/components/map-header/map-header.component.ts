import { Component, ChangeDetectionStrategy, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyMapStateService } from '../../services/property-map-state.service';
import { PropertyMapService } from '../../services/property-map.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of, takeUntil } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { CONFIG } from '../../../../constants/config.constant';

@Component({
  selector: 'app-map-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map-header.component.html',
  styleUrls: ['./map-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapHeaderComponent implements OnDestroy {
  private readonly state = inject(PropertyMapStateService);
  private readonly api = inject(PropertyMapService);
  private readonly toast = inject(ToastService);

  readonly projectId = CONFIG.DEFAULT_PROJECT_ID;
  readonly keyword = signal('');
  readonly suggestions = signal<string[]>([]);
  readonly showSuggestions = signal(false);
  readonly isLoadingSuggestions = signal(false);
  readonly activeIndex = signal(-1);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value.trim()) {
          this.suggestions.set([]);
          this.showSuggestions.set(false);
          this.isLoadingSuggestions.set(false);
          return of(null);
        }
        return this.api.getUnitCodes(this.projectId, value).pipe(
          catchError(() => {
            this.suggestions.set([]);
            this.isLoadingSuggestions.set(false);
            return of(null);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(codes => {
      if (codes) {
        this.suggestions.set(codes);
        this.activeIndex.set(-1);
        this.showSuggestions.set(true);
        this.isLoadingSuggestions.set(false);
      }
    });

    effect(() => {
      const globalKw = this.state.searchKeyword();
      if (globalKw !== this.keyword()) {
        this.keyword.set(globalKw);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(value: string) {
    this.keyword.set(value);
    if (value.trim()) {
      this.isLoadingSuggestions.set(true);
    }
    this.searchSubject.next(value);
  }

  private fetchSuggestions(kw: string) {
    // Moved to switchMap in constructor
  }

  selectSuggestion(code: string) {
    this.keyword.set(code);
    this.state.searchKeyword.set(code);
    this.showSuggestions.set(false);
    this.activeIndex.set(-1);
    
    // Find the unit and tell state to focus it
    const allUnits = this.state.units();
    const unit = allUnits.find(u => u.unitCode.toUpperCase() === code.toUpperCase());
    if (unit) {
      this.state.forceShowUnit(unit);
    } else {
      // Unit is likely out of stock or not in the initial load, fetch it
      this.api.searchUnits(this.projectId, code).pipe(takeUntil(this.destroy$)).subscribe({
        next: (units) => {
          const fetchedUnit = units.find(u => u.unitCode.toUpperCase() === code.toUpperCase());
          if (fetchedUnit) {
            this.state.units.update(list => {
              if (!list.some(u => u.id === fetchedUnit.id)) {
                return [...list, fetchedUnit];
              }
              return list;
            });
            this.state.forceShowUnit(fetchedUnit);
          }
        },
        error: () => {
          this.toast.error('Lỗi khi tải thông tin sản phẩm.');
        }
      });
    }
  }

  clearSearch(event: MouseEvent) {
    event.stopPropagation();
    this.keyword.set('');
    this.state.searchKeyword.set('');
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.activeIndex.set(-1);
    this.state.clearSearchedUnit();
  }

  onInputFocus() {
    if (this.keyword().trim()) {
      this.showSuggestions.set(true);
    }
  }

  onInputBlur() {
    // Wait briefly for mousedown/click on dropdown to complete before hiding suggestions
    setTimeout(() => {
      this.showSuggestions.set(false);
    }, 200);
  }

  onKeyDown(event: KeyboardEvent) {
    const list = this.suggestions();
    if (!list.length || !this.showSuggestions()) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIdx = (this.activeIndex() + 1) % list.length;
      this.activeIndex.set(nextIdx);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIdx = this.activeIndex() <= 0 ? list.length - 1 : this.activeIndex() - 1;
      this.activeIndex.set(prevIdx);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const currentIdx = this.activeIndex();
      if (currentIdx >= 0 && currentIdx < list.length) {
        this.selectSuggestion(list[currentIdx]);
      } else if (this.keyword()) {
        this.selectSuggestion(this.keyword());
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.showSuggestions.set(false);
      this.activeIndex.set(-1);
    }
  }
}
