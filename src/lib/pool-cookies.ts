import {readCookie, writeCookie, clearCookie} from './cookies';
import {clearDishPhotos, readDishPhotos, replaceDishPhotos} from './dish-photo-store';
import {emptyProfile, validateProfile, type PoolProfile} from './personal-pool';

const CHUNK_SIZE = 2500;
// Keep the committed cookie header below typical local-server header limits.
const MAX_CHUNKS = 5;
type Manifest = {version: 2; bank: 'a' | 'b'; count: number};
function isManifest(value: unknown): value is Manifest {
 const m = value as Partial<Manifest> | null;
 return !!m && m.version === 2 && (m.bank === 'a' || m.bank === 'b') && Number.isInteger(m.count) && m.count! > 0 && m.count! <= MAX_CHUNKS;
}
const key = (bank: string, index: number) => `pool-v2-${bank}-${index}`;

function cookieProfile(): PoolProfile {
 const saved = readCookie<unknown>('pool');
 if (saved === null) return emptyProfile();
 if (!isManifest(saved)) return validateProfile(saved); // Existing v1 profiles remain readable.
 let encoded = '';
 for (let i = 0; i < saved.count; i++) {
  const chunk = readCookie<unknown>(key(saved.bank, i));
  if (typeof chunk !== 'string' || chunk.length > CHUNK_SIZE || !/^[A-Za-z0-9+/=]+$/.test(chunk)) throw new Error('Cookie ảnh bị thiếu hoặc hỏng. / Photo cookies are missing or damaged.');
  encoded += chunk;
 }
 return validateProfile(JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(Uint8Array.from(atob(encoded), c => c.charCodeAt(0)))));
}

export function withoutPhotos(profile: PoolProfile): PoolProfile {
 return {...profile, custom: profile.custom.map(({photo: _photo, ...food}) => food)};
}

function clearLegacyChunks(): void {
 for (const bank of ['a', 'b']) for (let i = 0; i < MAX_CHUNKS; i++) {
  try { clearCookie(key(bank, i)); } catch { /* No active profile points here. */ }
 }
}

export async function loadPool(): Promise<PoolProfile> {
 const profile = cookieProfile();
 if (profile.custom.some(food => food.photo)) {
  await replaceDishPhotos(profile.custom);
  writeCookie('pool', withoutPhotos(profile));
  clearLegacyChunks();
  return profile;
 }
 const photos = await readDishPhotos(profile.custom.map(food => food.id));
 return {...profile, custom: profile.custom.map(food => photos.has(food.id) ? {...food, photo: photos.get(food.id)} : food)};
}

export async function savePool(profile: PoolProfile): Promise<void> {
 const checked = validateProfile(profile);
 await replaceDishPhotos(checked.custom);
 writeCookie('pool', withoutPhotos(checked));
 clearLegacyChunks();
}

export async function clearPool(): Promise<void> {
 clearCookie('pool');
 clearLegacyChunks();
 await clearDishPhotos();
}
