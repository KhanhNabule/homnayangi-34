const assert=require('node:assert/strict');
const {mkdtempSync,rmSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {join}=require('node:path');
const {execFileSync}=require('node:child_process');
const out=mkdtempSync(join(tmpdir(),'lunch-selection-'));
try{
 execFileSync(process.execPath,['node_modules/typescript/bin/tsc','lib/foods.ts','lib/case-mechanics.ts','--outDir',out,'--module','commonjs','--target','es2020','--skipLibCheck']);
 const {foods}=require(join(out,'foods.js'));
 const {createFoodSelector,TARGET_LUNCH_PRICE,GOLD_PROBABILITY}=require(join(out,'case-mechanics.js'));
 const selector=createFoodSelector(foods);const mass=f=>selector.probabilities.get(f);
 let seed=12345;const rng=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
 const counts=[0,1,2,3,4].map(t=>foods.filter(f=>f.rarity===t).length);
 const theoretical=counts.map((_,t)=>foods.filter(f=>f.rarity===t).reduce((s,f)=>s+mass(f),0));
 const expectedPrice=foods.reduce((s,f)=>s+f.price*mass(f),0);
 assert.ok(Math.abs(expectedPrice-TARGET_LUNCH_PRICE)<1e-9);
 assert.ok(Math.abs(theoretical.reduce((s,x)=>s+x,0)-1)<1e-12);
 assert.ok(Math.abs(theoretical[4]-GOLD_PROBABILITY)<1e-12);
 const observed=[0,0,0,0,0];let spend=0;
 for(let i=0;i<1000000;i++){const meal=selector.choose(foods,rng);observed[meal.rarity]++;spend+=meal.price}
 observed.forEach((n,t)=>assert.ok(Math.abs(n/1000000-theoretical[t])<.002));
 assert.ok(Math.abs(spend/1000000-TARGET_LUNCH_PRICE)<.15);
 // Every CDF interval, including conditioning on each supported filter.
 for(const limit of [35,60,100,Infinity])for(const veg of [false,true]){
  const pool=foods.filter(f=>f.price<=limit&&(!veg||f.veg));
  const total=pool.reduce((s,f)=>s+mass(f),0);let cumulative=0;
  for(const food of pool){assert.equal(selector.choose(pool,()=>(cumulative+mass(food)/2)/total),food);cumulative+=mass(food)}
 }
 assert.throws(()=>selector.choose([]));assert.equal(selector.choose([foods[0]],rng),foods[0]);
 assert.throws(()=>createFoodSelector(foods,1));assert.throws(()=>createFoodSelector(foods,51,1));
 const equal=[{price:50,rarity:0},{price:50,rarity:1}];
 assert.deepEqual([...createFoodSelector(equal,50).probabilities.values()],[.5,.5]);
 const noGold=createFoodSelector(foods.filter(f=>f.rarity!==4));
 assert.ok(Math.abs([...noGold.probabilities].reduce((s,[f,p])=>s+f.price*p,0)-51)<1e-9);
 const p=foods.map(mass);
 console.log({counts,theoretical,simulation:observed.map(n=>n/1000000),simulatedPrice:spend/1000000,expectedPrice,sameNext:p.reduce((s,x)=>s+x*x,0),distinct10:p.reduce((s,x)=>s+1-(1-x)**10,0),fiveBlue:theoretical[0]**5});

}finally{rmSync(out,{recursive:true,force:true})}
