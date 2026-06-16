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

/**
 * Định dạng giá trị tiền thành dạng ngắn 'xx,xxT' (ví dụ: '15,12T').
 * Làm tròn XUỐNG: Math.floor(value / 1e9 * 100) / 100
 * Loại bỏ các số 0 thừa ở cuối.
 */
export const formatShortPrice = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) return '';

  const billion = Math.floor((value / 1_000_000_000) * 100) / 100;
  let str = billion.toFixed(2);
  if (str.endsWith('0')) str = str.slice(0, -1);
  if (str.endsWith('0')) str = str.slice(0, -1);
  if (str.endsWith('.')) str = str.slice(0, -1);
  return str.replace('.', ',') + 'T';
};
