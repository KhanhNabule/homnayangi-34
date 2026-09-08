// CS:GO Panorama timing reconstructed from popup_capability_decodable.js/.css.
// Reference: https://github.com/Desynci/CSGO_Panorama_Code.pbin
export const OPENING_DELAY_MS = 2400;
export const SPIN_DURATION_MS = 6000;
export const TICK_SECONDS = [0,.063,.125,.188,.250,.313,.375,.438,.500,.563,.625,.688,.750,.813,.875,.938,1,1.063,1.125,1.188,1.250,1.313,1.375,1.483,1.351,1.620,1.701,1.786,1.872,2.003,2.154,2.313,2.466,2.615,2.773,2.941,3.104,3.339,3.630,3.953,4.385,5.004].sort((a,b)=>a-b);
// Grouped iPOS/Nestlé 2025 lunch spending implies roughly 49–52k under
// documented endpoint assumptions. This is a proxy, not an office-only mean.
export const TARGET_LUNCH_PRICE = 51;
export const GOLD_PROBABILITY = .007;
export function caseEase(progress:number){const p=Math.max(0,Math.min(1,progress));let lo=0,hi=1;for(let i=0;i<30;i++){const t=(lo+hi)/2,u=1-t,x=3*u*u*t*.075+3*u*t*t*.165+t*t*t;if(x<p)lo=t;else hi=t}const t=(lo+hi)/2,u=1-t;return 3*u*u*t*.82+3*u*t*t+t*t*t}
type PricedMeal={price:number;rarity:number};
export function createFoodSelector<T extends PricedMeal>(population:T[],target=TARGET_LUNCH_PRICE,goldProbability=GOLD_PROBABILITY){
 if(!population.length)throw new Error('No meals in population');
 if(!Number.isFinite(target)||goldProbability<0||goldProbability>=1||!Number.isFinite(goldProbability))throw new Error('Invalid selection parameters');
 if(population.some(f=>!Number.isFinite(f.price)||f.price<=0))throw new Error('Invalid meal price');
 const gold=population.filter(f=>f.rarity===4),regular=population.filter(f=>f.rarity!==4);
 if(!regular.length)throw new Error('Population needs non-jackpot meals');
 const jackpot=gold.length?goldProbability:0;
 const goldMean=gold.length?gold.reduce((s,f)=>s+f.price,0)/gold.length:0;
 const regularTarget=(target-jackpot*goldMean)/(1-jackpot);
 const min=Math.min(...regular.map(f=>f.price)),max=Math.max(...regular.map(f=>f.price));
 if(regularTarget<min||regularTarget>max)throw new Error('Target mean is outside feasible meal prices');
 // Maximum entropy over meals, subject to mean cost and fixed jackpot mass:
 // p_i ∝ exp(-lambda * price_i). Solve lambda once, outside the click path.
 function weights(lambda:number){const anchor=lambda>=0?min:max;return regular.map(f=>Math.exp(-lambda*(f.price-anchor)))}
 function mean(lambda:number){const w=weights(lambda);return regular.reduce((s,f,i)=>s+f.price*w[i],0)/w.reduce((s,x)=>s+x,0)}
 let lo=-1,hi=1;
 if(regularTarget>min&&regularTarget<max){
  while(mean(lo)<regularTarget)lo*=2;
  while(mean(hi)>regularTarget)hi*=2;
  for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(mean(mid)>regularTarget)lo=mid;else hi=mid}
 }
 const raw=regularTarget===min||regularTarget===max?regular.map(f=>f.price===regularTarget?1:0):weights((lo+hi)/2);
 const total=raw.reduce((s,x)=>s+x,0);
 const probabilities=new Map<T,number>();
 regular.forEach((f,i)=>probabilities.set(f,(1-jackpot)*raw[i]/total));
 gold.forEach(f=>probabilities.set(f,jackpot/gold.length));
 return {probabilities,choose(items:T[],random=Math.random):T{
  if(!items.length)throw new Error('No eligible meals');
  const w=items.map(f=>{const p=probabilities.get(f);if(p===undefined)throw new Error('Unknown meal');return p});
  const sum=w.reduce((s,p)=>s+p,0);if(sum<=0)throw new Error('Eligible meals have no probability');
  let remaining=random()*sum;
  for(let i=0;i<items.length;i++)if((remaining-=w[i])<0)return items[i];
  for(let i=items.length-1;i>=0;i--)if(w[i]>0)return items[i];
  throw new Error('Invalid probability total');
 }};
}
export function stopFraction(random=Math.random){return (Math.floor(random()*81)+10)/100}

export function priceRarity(priceInThousands:number){return priceInThousands<=40?0:priceInThousands<=65?1:priceInThousands<=100?2:priceInThousands<=130?3:4}

// Cosmetic motion is independent of reward selection. Every profile is monotonic
// and finishes at zero velocity; vary travel, duration and drag between rolls.
export function createSpinProfile(random = Math.random) {
 return {durationMs:7500+Math.floor(random()*2001),tiles:30+Math.floor(random()*11),friction:2.7+random()*.6};
}
export function spinProgress(progress:number,friction:number) {
 const p=Math.max(0,Math.min(1,progress));
 return 1-Math.pow(1-p,friction);
}
