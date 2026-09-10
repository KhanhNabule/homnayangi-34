// Small local thumbnails keep automatic persistence within the cookie budget.
export const MAX_PHOTO_LENGTH = 1600;
export function isDishPhoto(value: unknown): value is string {
 return typeof value === 'string' && value.length <= MAX_PHOTO_LENGTH && /^data:image\/webp;base64,UklGR[A-Za-z0-9+/]+={0,2}$/.test(value);
}

export async function prepareDishPhoto(file: File): Promise<string> {
 if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
  throw new Error('Chọn ảnh JPG, PNG hoặc WebP tối đa 8 MB. / Choose JPG, PNG or WebP up to 8 MB.');
 }
 const bitmap = await createImageBitmap(file);
 try {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');
  const crop = Math.min(bitmap.width, bitmap.height);
  for (const size of [96, 80, 64, 48, 32]) {
   canvas.width = canvas.height = size;
   context.drawImage(bitmap, (bitmap.width-crop)/2, (bitmap.height-crop)/2, crop, crop, 0, 0, size, size);
   const photo = canvas.toDataURL('image/webp', .45);
   if (isDishPhoto(photo)) return photo;
  }
  throw new Error('Ảnh quá lớn để lưu cookie. / Image exceeds cookie capacity.');
 } finally { bitmap.close(); }
}
