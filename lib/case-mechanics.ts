// CS:GO Panorama timing reconstructed from popup_capability_decodable.js/.css.
// Reference: https://github.com/Desynci/CSGO_Panorama_Code.pbin
export const OPENING_DELAY_MS = 2400;
export const SPIN_DURATION_MS = 6000;
export const TICK_SECONDS = [0,.063,.125,.188,.250,.313,.375,.438,.500,.563,.625,.688,.750,.813,.875,.938,1,1.063,1.125,1.188,1.250,1.313,1.375,1.483,1.351,1.620,1.701,1.786,1.872,2.003,2.154,2.313,2.466,2.615,2.773,2.941,3.104,3.339,3.630,3.953,4.385,5.004].sort((a,b)=>a-b);
// Perfect World's published 1:5 tier ratios, rare-special : covert = 2:5.
export const RARITY_WEIGHTS = [625,125,25,5,2];
export function caseEase(progress:number){const p=Math.max(0,Math.min(1,progress));let lo=0,hi=1;for(let i=0;i<30;i++){const t=(lo+hi)/2,u=1-t,x=3*u*u*t*.075+3*u*t*t*.165+t*t*t;if(x<p)lo=t;else hi=t}const t=(lo+hi)/2,u=1-t;return 3*u*u*t*.82+3*u*t*t+t*t*t}
export function chooseFood<T extends {rarity:number}>(items:T[],random= Math.random):T{if(!items.length)throw new Error('No eligible meals');const tiers=RARITY_WEIGHTS.map((weight,rarity)=>({weight,items:items.filter(f=>f.rarity===rarity)})).filter(t=>t.items.length);let n=random()*tiers.reduce((s,t)=>s+t.weight,0);const tier=tiers.find(t=>(n-=t.weight)<0)??tiers[tiers.length-1];return tier.items[Math.floor(random()*tier.items.length)]}
export function stopFraction(random=Math.random){return (Math.floor(random()*81)+10)/100}

export function priceRarity(priceInThousands:number){return priceInThousands<=40?0:priceInThousands<=65?1:priceInThousands<=100?2:priceInThousands<=130?3:4}
