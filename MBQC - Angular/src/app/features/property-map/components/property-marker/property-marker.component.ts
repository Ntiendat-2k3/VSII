import { Component, ChangeDetectionStrategy, inject, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyMapStateService } from '../../services/property-map-state.service';
import { PropertyMapService } from '../../services/property-map.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormatPricePipe } from '../../pipes/format-price.pipe';
import { MasterDataLabelPipe } from '../../pipes/master-data-label.pipe';
import { CONFIG } from '../../../../constants/config.constant';
import type { UnitItem } from '../../models/property-map.model';
import { UNIT_TYPE_ICONS } from '../../constants/property-map.constant';

@Component({
  selector: 'app-property-marker',
  standalone: true,
  imports: [CommonModule, FormatPricePipe, MasterDataLabelPipe],
  templateUrl: './property-marker.component.html',
  styleUrls: ['./property-marker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyMarkerComponent {
  @Input({ required: true }) unit!: UnitItem;
  @Input() hideArrow = false;
  @Output() close = new EventEmitter<void>();

  private readonly state = inject(PropertyMapStateService);
  private readonly api = inject(PropertyMapService);
  private readonly toast = inject(ToastService);

  readonly projectId = CONFIG.DEFAULT_PROJECT_ID;
  readonly isSubmitting = signal(false);
  readonly icons = UNIT_TYPE_ICONS;

  readonly masterData = this.state.masterData;

  handleClose() {
    this.close.emit();
  }

  handleInquiry(event: MouseEvent) {
    event.stopPropagation();
    if (this.isSubmitting() || this.unit.inquiryStatusCode) return;

    this.isSubmitting.set(true);
    this.api.createInquiry(this.projectId, this.unit.unitCode).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.toast.success('Yêu cầu đã được gửi thành công!');
          // Update unit status locally
          this.unit.inquiryStatusCode = res.status;
          const newStatusName = res.inquiryStatusName || res.statusName;
          if (newStatusName) {
            this.unit.inquiryStatusName = newStatusName;
          }
          this.state.units.update(units =>
            units.map(u => u.unitCode === this.unit.unitCode
              ? { ...u, inquiryStatusCode: res.status, inquiryStatusName: newStatusName || u.inquiryStatusName }
              : u
            )
          );
        } else {
          this.toast.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toast.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
      }
    });
  }
}
