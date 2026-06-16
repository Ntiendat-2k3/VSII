import { describe, it, expect } from 'vitest';
import { formatPrice, formatShortPrice } from './formatters';

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

describe('formatShortPrice', () => {
  it('should format 6,179,000,000 to 6,17T', () => {
    expect(formatShortPrice(6179000000)).toBe('6,17T');
  });

  it('should format 15,101,436,069 to 15,1T (strips trailing zero)', () => {
    expect(formatShortPrice(15101436069)).toBe('15,1T');
  });

  it('should format 15,129,436,069 to 15,12T', () => {
    expect(formatShortPrice(15129436069)).toBe('15,12T');
  });

  it('should format 15,000,000,000 to 15T (strips all trailing zeros)', () => {
    expect(formatShortPrice(15000000000)).toBe('15T');
  });

  it('should format undefined/null/NaN to empty string', () => {
    expect(formatShortPrice(undefined)).toBe('');
    expect(formatShortPrice(null)).toBe('');
    expect(formatShortPrice(NaN)).toBe('');
  });
});
