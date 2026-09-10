import { isDishPhoto } from './dish-photo';
import { foods, type Food } from './foods';
import { createFoodSelector, priceRarity } from './case-mechanics';
import {catalogProvince, isProvince, type Province} from './provinces';
export type CustomFood = { id: string; name: string; price: number; veg: boolean; photo?: string; province?: Province };
export type PoolProfile = { disabled: number[]; custom: CustomFood[]; revision: number };
export const emptyProfile = (): PoolProfile => ({ disabled: [], custom: [], revision: 0 });
const ids = new Set(foods.map(f => f.image));
export function validateProfile(input: unknown): PoolProfile {
 if (!input || typeof input !== 'object') throw new Error('Invalid profile');
 const p = input as Record<string, unknown>;
 if (Object.keys(p).some(k => !['disabled','custom','revision'].includes(k)) || !Array.isArray(p.disabled) || !Array.isArray(p.custom) || !Number.isSafeInteger(p.revision) || (p.revision as number)<0) throw new Error('Invalid profile');
 if (p.disabled.length>foods.length || p.custom.length>50 || new Set(p.disabled).size!==p.disabled.length || p.disabled.some(id=>!ids.has(id))) throw new Error('Invalid dishes');
 const custom = p.custom.map((item: unknown): CustomFood => {
  if (!item || typeof item!=='object') throw new Error('Invalid dish');
  const f=item as Record<string,unknown>;
  if(Object.keys(f).some(k=>!['id','name','price','veg','photo','province'].includes(k)) || typeof f.id!=='string' || !/^[0-9a-f-]{36}$/i.test(f.id) || typeof f.name!=='string' || !f.name.trim() || f.name.length>60 || /[\x00-\x1f\x7f]/.test(f.name) || !Number.isInteger(f.price) || (f.price as number)<10 || (f.price as number)>500 || typeof f.veg!=='boolean' || (f.province!==undefined&&!isProvince(f.province))) throw new Error('Invalid dish');
  if(f.photo!==undefined && !isDishPhoto(f.photo)) throw new Error('Invalid dish photo');
  return {...(f.photo ? {photo:f.photo as string} : {}),...(f.province ? {province:f.province as Province} : {}),id:f.id,name:f.name.trim().normalize('NFC'),price:f.price as number,veg:f.veg};
 });
 if(new Set(custom.map(f=>f.id)).size!==custom.length || foods.length-p.disabled.length+custom.length<1) throw new Error('Keep at least one dish');
 return {disabled:p.disabled as number[],custom,revision:p.revision as number};
}
export function personalFoods(profile: PoolProfile): Food[] {
 return [...foods.filter(f=>!profile.disabled.includes(f.image)).map(f=>({...f,province:catalogProvince(f.image)})), ...profile.custom.map(f=>({...f,customId:f.id,image:-1,sub:'Món của tôi',quip:'',rarity:priceRarity(f.price)}))];
}
export function personalSelector(population: Food[], target: number) {
 if(!population.length) return null;
 const feasible=Math.max(Math.min(...population.map(f=>f.price)),Math.min(target,Math.max(...population.map(f=>f.price))));
 return createFoodSelector(population,feasible);
}
