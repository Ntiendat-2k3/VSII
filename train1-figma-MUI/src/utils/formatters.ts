/**
 * Định dạng giá trị tiền (VNĐ) thành dạng 'xx,xx tỷ'.
 * Làm tròn XUỐNG: Math.floor(value / 1e9 * 100) / 100
 *
 * 15,101,436,069 → '15,10 tỷ'
 * 15,129,436,069 → '15,12 tỷ'
 */
export const formatPrice = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) return '0,00 tỷ';

  const billion = Math.floor((value / 1_000_000_000) * 100) / 100;
  return billion.toFixed(2).replace('.', ',') + ' tỷ';
};
