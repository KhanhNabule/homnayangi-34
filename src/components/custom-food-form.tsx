import {useEffect, useRef, useState, type FormEvent} from 'react';
import {ImagePlus, Plus} from 'lucide-react';
import {prepareDishPhoto} from '@/lib/dish-photo';
import type {CustomFood} from '@/lib/personal-pool';
import type {Language} from '@/lib/i18n';

export function CustomFoodForm({item, language, onSave, onCancel}: {
 item?: CustomFood; language: Language; onSave: (item: CustomFood) => boolean; onCancel: () => void;
}) {
 const vi = language === 'vi';
 const [name, setName] = useState(item?.name ?? '');
 const [price, setPrice] = useState(String(item?.price ?? 50));
 const [veg, setVeg] = useState(item?.veg ?? false);
 const [photo, setPhoto] = useState(item?.photo);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 const request = useRef(0);
 const fileInput = useRef<HTMLInputElement>(null);
 useEffect(() => () => { request.current++; }, []);
 async function selectPhoto(file?: File) {
  if (!file) return;
  const token = ++request.current;
  setBusy(true); setError('');
  try { const next = await prepareDishPhoto(file); if(token === request.current) setPhoto(next); }
  catch { if(token === request.current) setError(vi ? 'Không đọc được ảnh. Chọn JPG, PNG hoặc WebP tối đa 8 MB.' : 'Cannot read image. Choose JPG, PNG or WebP up to 8 MB.'); }
  finally { if(token === request.current) setBusy(false); }
 }
 function submit(event: FormEvent) {
  event.preventDefault();
  if (busy) return;
  onSave({id: item?.id ?? crypto.randomUUID(), name: name.trim(), price: Number(price), veg, ...(photo ? {photo} : {})});
 }
 return <form className="custom-form" onSubmit={submit}>
  <label>{vi ? 'Tên món' : 'Dish name'}<input required value={name} maxLength={60} onChange={e=>setName(e.target.value)}/></label>
  <label>{vi ? 'Giá (nghìn đồng)' : 'Price (thousand VND)'}<input required type="number" min="10" max="500" step="1" value={price} onChange={e=>setPrice(e.target.value)}/></label>
  <div className="dish-photo-editor">
   {photo ? <img src={photo} alt={vi ? 'Ảnh món xem trước' : 'Dish preview'}/> : <div className="dish-photo-placeholder"><ImagePlus size={28}/></div>}
   <div><label>{vi ? 'Ảnh món (không bắt buộc)' : 'Dish photo (optional)'}<input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{void selectPhoto(e.target.files?.[0]); e.target.value='';}}/></label>
   <p>{vi ? 'JPG, PNG, WebP · tối đa 8 MB. Ảnh được cắt vuông và thu nhỏ để lưu cookie; số ảnh lưu được có giới hạn.' : 'JPG, PNG, WebP · up to 8 MB. Photos are cropped square and reduced for limited cookie storage.'}</p>
   {photo && <button type="button" onClick={()=>{request.current++;setBusy(false);setPhoto(undefined);setError('');}}>{vi ? 'Xóa ảnh' : 'Remove photo'}</button>}</div>
  </div>
  {busy && <p role="status">{vi ? 'Đang xử lý ảnh…' : 'Processing photo…'}</p>}
  {error && <p className="preferences-message" role="alert">{error}</p>}
  <label className="inline-check"><input type="checkbox" checked={veg} onChange={e=>setVeg(e.target.checked)}/>{vi ? 'Món chay' : 'Vegetarian'}</label>
  <button className="pool-primary" type="submit" disabled={busy}><Plus size={16}/>{item ? (vi ? 'Cập nhật' : 'Update') : (vi ? 'Thêm món' : 'Add dish')}</button>
  {item && <button type="button" onClick={onCancel}>{vi ? 'Huỷ sửa' : 'Cancel edit'}</button>}
 </form>;
}
