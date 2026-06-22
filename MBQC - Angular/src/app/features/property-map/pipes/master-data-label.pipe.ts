import { Pipe, PipeTransform } from '@angular/core';
import { MasterData } from '../services/property-map-state.service';

@Pipe({
  name: 'masterDataLabel',
  standalone: true
})
export class MasterDataLabelPipe implements PipeTransform {
  transform(
    code: string | null | undefined, 
    type: 'unitTypes' | 'inquiryStatuses' | 'unitStatuses', 
    masterData: MasterData,
    fallbackName?: string
  ): string {
    if (!code) {
      if (type === 'unitStatuses') return 'Đã bán';
      if (type === 'unitTypes') return 'Chưa cập nhật';
      return '';
    }

    const dict = masterData?.[type] || {};
    return fallbackName || dict[code] || code;
  }
}
