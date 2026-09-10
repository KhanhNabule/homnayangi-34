import {useEffect,useState} from 'react';
import {emptyProfile,validateProfile,type PoolProfile} from '@/lib/personal-pool';
import {loadPool,savePool,clearPool} from '@/lib/pool-cookies';
export function usePreferences(){
 const [profile,setProfile]=useState<PoolProfile>(emptyProfile),[error,setError]=useState('');
 useEffect(()=>{void loadPool().then(setProfile).catch(e=>setError((e as Error).message))},[]);
 const save=async(next:PoolProfile)=>{try{const checked=validateProfile(next);await savePool(checked);setProfile(checked);setError('');return true}catch(e){setError((e as Error).message);return false}};
 const reload=async()=>{try{const next=await loadPool();setProfile(next);setError('');return next}catch(e){setError((e as Error).message);return null}};
 const remove=async()=>{try{await clearPool();setProfile(emptyProfile());setError('');return true}catch(e){setError((e as Error).message);return false}};
 return {profile,error,setError,save,reload,remove};
}
export type Preferences=ReturnType<typeof usePreferences>;
