const DB_NAME = 'tnag-community-v1';
const STORE_NAME = 'dish-photos';

function database(): Promise<IDBDatabase> {
 return new Promise((resolve, reject) => {
  if (!('indexedDB' in globalThis)) return reject(new Error('Trình duyệt không hỗ trợ lưu ảnh trên máy. / Local image storage is unavailable.'));
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(new Error('Không thể mở kho ảnh trên máy. / Cannot open local image storage.'));
 });
}

function finished(transaction: IDBTransaction): Promise<void> {
 return new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = transaction.onabort = () => reject(new Error('Không thể lưu ảnh trên máy. / Cannot save image locally.'));
 });
}

export async function readDishPhotos(ids: string[]): Promise<Map<string, string>> {
 if (!ids.length) return new Map();
 const db = await database();
 try {
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const entries = await Promise.all(ids.map(id => new Promise<[string, string | undefined]>((resolve, reject) => {
   const request = store.get(id);
   request.onsuccess = () => resolve([id, typeof request.result === 'string' ? request.result : undefined]);
   request.onerror = () => reject(request.error);
  })));
  await finished(transaction);
  return new Map(entries.filter((entry): entry is [string, string] => !!entry[1]));
 } finally { db.close(); }
}

export async function replaceDishPhotos(items: Array<{id: string; photo?: string}>): Promise<void> {
 const db = await database();
 try {
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const keep = new Set(items.map(item => item.id));
  const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
   const request = store.getAllKeys(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  for (const key of keys) if (typeof key === 'string' && !keep.has(key)) store.delete(key);
  for (const item of items) item.photo ? store.put(item.photo, item.id) : store.delete(item.id);
  await finished(transaction);
 } finally { db.close(); }
}

export async function clearDishPhotos(): Promise<void> {
 const db = await database();
 try { const transaction = db.transaction(STORE_NAME, 'readwrite'); transaction.objectStore(STORE_NAME).clear(); await finished(transaction); }
 finally { db.close(); }
}
