import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice',
  standalone: true
})
export class FormatPricePipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value == null || isNaN(value)) return '0,00 tỷ';

    const billion = Math.floor((value / 1_000_000_000) * 100) / 100;
    return billion.toFixed(2).replace('.', ',') + ' tỷ';
  }
}

@Pipe({
  name: 'formatShortPrice',
  standalone: true
})
export class FormatShortPricePipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value == null || isNaN(value)) return '';

    const billion = Math.floor((value / 1_000_000_000) * 100) / 100;
    let str = billion.toFixed(2);
    if (str.endsWith('0')) str = str.slice(0, -1);
    if (str.endsWith('0')) str = str.slice(0, -1);
    if (str.endsWith('.')) str = str.slice(0, -1);
    return str.replace('.', ',') + 'T';
  }
}
