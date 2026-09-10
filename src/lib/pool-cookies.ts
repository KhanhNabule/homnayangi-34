import {readCookie, writeCookie, clearCookie} from './cookies';
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

export function loadPool(): PoolProfile {
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

export function savePool(profile: PoolProfile): void {
 const checked = validateProfile(profile);
 const encoded = btoa(Array.from(new TextEncoder().encode(JSON.stringify(checked)), b => String.fromCharCode(b)).join(''));
 const count = Math.ceil(encoded.length / CHUNK_SIZE);
 if (count > MAX_CHUNKS) throw new Error('Cookie đã đầy. Hãy xóa bớt ảnh hoặc món trước khi lưu. / Cookies are full. Remove photos or dishes before saving.');
 const previous = readCookie<unknown>('pool');
 const bank = isManifest(previous) && previous.bank === 'a' ? 'b' : 'a';
 try {
  for (let i = 0; i < count; i++) writeCookie(key(bank, i), encoded.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
  // Publish only after every chunk has been written and verified.
  writeCookie('pool', {version: 2, bank, count});
 } catch (error) {
  for (let i = 0; i < count; i++) { try { clearCookie(key(bank, i)); } catch { /* Preserve original failure. */ } }
  throw error;
 }
 // Old chunks are no longer referenced. Cleanup failure must not undo a successful save.
 for (const side of ['a', 'b']) for (let i = side === bank ? count : 0; i < MAX_CHUNKS; i++) {
  try { clearCookie(key(side, i)); } catch { /* Bounded leftovers are retried on the next save. */ }
 }
}

export function clearPool(): void {
 clearCookie('pool');
 for (const bank of ['a', 'b']) for (let i = 0; i < MAX_CHUNKS; i++) clearCookie(key(bank, i));
}
