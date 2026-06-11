import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatters';

describe('formatPrice', () => {
  it('should format 15,101,436,069 VNĐ to 15,10 tỷ', () => {
    expect(formatPrice(15101436069)).toBe('15,10 tỷ');
  });

  it('should format 15,121,436,069 VNĐ to 15,12 tỷ', () => {
    expect(formatPrice(15121436069)).toBe('15,12 tỷ');
  });

  it('should format 15,129,436,069 VNĐ to 15,12 tỷ (floors, not rounds)', () => {
    expect(formatPrice(15129436069)).toBe('15,12 tỷ');
  });

  it('should format undefined/null/NaN to 0,00 tỷ', () => {
    expect(formatPrice(undefined)).toBe('0,00 tỷ');
    expect(formatPrice(null)).toBe('0,00 tỷ');
    expect(formatPrice(NaN)).toBe('0,00 tỷ');
  });
});
