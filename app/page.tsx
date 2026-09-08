'use client';
import { SPIN_DURATION_MS, chooseFood, stopFraction, priceRarity } from '@/lib/case-mechanics';
import { flushSync } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, AudioLines, Volume2, VolumeX, Sparkles, Utensils, Leaf } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

type Food={name:string;sub:string;price:number;rarity:number;image:number;veg?:boolean;quip:string};
const foods:Food[]=[
{name:'Cơm tấm',sub:'Sườn bì chả • Việt Nam',price:45,rarity:0,image:0,quip:'Sườn có thể gãy. Kèo này thì không.'},
{name:'Phở bò',sub:'Tái nạm • Việt Nam',price:55,rarity:1,image:1,quip:'Đời có thể nhạt. Nước phở thì không.'},
{name:'Bánh mì',sub:'Thịt nướng • Việt Nam',price:25,rarity:0,image:2,quip:'Vũ khí cận chiến của dân văn phòng.'},
{name:'Bún chả',sub:'Chả nướng • Việt Nam',price:50,rarity:1,image:3,quip:'Một pha gắp chả đi vào lòng người.'},
{name:'Sushi cá hồi',sub:'Cá hồi • Nhật Bản',price:150,rarity:4,image:4,quip:'Legendary drop. Ví bạn vừa disconnect.'},
{name:'Pizza',sub:'Phô mai • Ý',price:100,rarity:2,image:5,quip:'Một miếng cho bạn. Phần còn lại cũng vậy.'},
{name:'Gà rán',sub:'Giòn cay • Quốc tế',price:65,rarity:1,image:6,quip:'Winner winner, chicken lunch.'},
{name:'Cơm chay',sub:'Đậu hũ & rau • Việt Nam',price:35,rarity:0,image:7,veg:true,quip:'Ăn chay nhưng chiến hết mình.'},
{name:'Bibimbap',sub:'Cơm trộn • Hàn Quốc',price:85,rarity:2,image:8,quip:'Trộn cơm. Đừng trộn deadline.'},
{"name": "Cơm gà Hội An", "sub": "Món ăn trưa", "price": 45, "rarity": 0, "image": 9, "veg": false, "quip": ""},
{"name": "Bún bò Huế", "sub": "Món ăn trưa", "price": 50, "rarity": 1, "image": 10, "veg": false, "quip": ""},
{"name": "Hủ tiếu", "sub": "Món ăn trưa", "price": 40, "rarity": 0, "image": 11, "veg": false, "quip": ""},
{"name": "Mì Quảng", "sub": "Món ăn trưa", "price": 45, "rarity": 0, "image": 12, "veg": false, "quip": ""},
{"name": "Bún thịt nướng", "sub": "Món ăn trưa", "price": 40, "rarity": 0, "image": 13, "veg": false, "quip": ""},
{"name": "Bánh cuốn", "sub": "Món ăn trưa", "price": 35, "rarity": 0, "image": 14, "veg": false, "quip": ""},
{"name": "Bún đậu mắm tôm", "sub": "Món ăn trưa", "price": 55, "rarity": 1, "image": 15, "veg": false, "quip": ""},
{"name": "Cơm rang dưa bò", "sub": "Món ăn trưa", "price": 50, "rarity": 0, "image": 16, "veg": false, "quip": ""},
{"name": "Bò lúc lắc", "sub": "Món ăn trưa", "price": 85, "rarity": 2, "image": 17, "veg": false, "quip": ""},
{"name": "Bánh xèo", "sub": "Món ăn trưa", "price": 50, "rarity": 1, "image": 18, "veg": false, "quip": ""},
{"name": "Bánh đa cua", "sub": "Món ăn trưa", "price": 45, "rarity": 0, "image": 19, "veg": false, "quip": ""},
{"name": "Mì xào bò", "sub": "Món ăn trưa", "price": 45, "rarity": 0, "image": 20, "veg": false, "quip": ""},
{"name": "Bún cá", "sub": "Món ăn trưa", "price": 40, "rarity": 0, "image": 21, "veg": false, "quip": ""},
{"name": "Gỏi cuốn", "sub": "Món ăn trưa", "price": 35, "rarity": 0, "image": 22, "veg": false, "quip": ""},
{"name": "Cháo sườn", "sub": "Món ăn trưa", "price": 25, "rarity": 0, "image": 23, "veg": false, "quip": ""},
{"name": "Ramen", "sub": "Món ăn trưa", "price": 100, "rarity": 2, "image": 24, "veg": false, "quip": ""},
{"name": "Udon", "sub": "Món ăn trưa", "price": 85, "rarity": 2, "image": 25, "veg": false, "quip": ""},
{"name": "Cơm cà ri Nhật", "sub": "Món ăn trưa", "price": 90, "rarity": 2, "image": 26, "veg": false, "quip": ""},
{"name": "Tteokbokki", "sub": "Món ăn trưa", "price": 65, "rarity": 1, "image": 27, "veg": false, "quip": ""},
{"name": "Burger", "sub": "Món ăn trưa", "price": 65, "rarity": 1, "image": 28, "veg": false, "quip": ""},
{"name": "Mì Ý bò bằm", "sub": "Món ăn trưa", "price": 80, "rarity": 2, "image": 29, "veg": false, "quip": ""},
{"name": "Pad Thai", "sub": "Món ăn trưa", "price": 75, "rarity": 1, "image": 30, "veg": false, "quip": ""},
{"name": "Mì Tom Yum", "sub": "Món ăn trưa", "price": 80, "rarity": 2, "image": 31, "veg": false, "quip": ""},
{"name": "Lẩu nấm chay", "sub": "Chay", "price": 120, "rarity": 3, "image": 32, "veg": true, "quip": ""},
{"name": "Mì nấm chay", "sub": "Chay", "price": 40, "rarity": 0, "image": 33, "veg": true, "quip": ""},
{"name": "Bánh mì chay", "sub": "Chay", "price": 25, "rarity": 0, "image": 34, "veg": true, "quip": ""},
{"name": "Gỏi cuốn chay", "sub": "Chay", "price": 35, "rarity": 0, "image": 35, "veg": true, "quip": ""},
].map(food=>({...food,rarity:priceRarity(food.price)}));
const tiers=['QUỐC DÂN','HIẾM','CỰC PHẨM','TỐI MẬT','★ ĐẶC BIỆT'];
const colors=['#4b69ff','#8847ff','#d32ce6','#eb4b4b','#e4ae39'];
function FoodImage({food}:{food:Food}){return <div role="img" aria-label={food.name} className="food-image" style={{backgroundImage:`url(${basePath}/food-hd-${Math.floor(food.image/4)}.webp)`,backgroundPosition:`${food.image%2*100}% ${Math.floor((food.image%4)/2)*100}%`}}/>}
function Card({food,small=false,slot}:{food:Food;small?:boolean;slot?:number}){return <div className={`food-card ${small?'small':''}`} data-slot-id={slot} style={{'--rarity':colors[food.rarity],...(slot===undefined?{}:{position:'absolute',left:slot*254})} as React.CSSProperties}><span className="tier">{tiers[food.rarity]}</span><FoodImage food={food}/><div className="card-copy"><strong>{food.name}</strong><span>{small?`~${food.price}.000đ`:food.sub}</span></div></div>}
export default function Home(){
 const [budget,setBudget]=useState('all'),[veg,setVeg]=useState(false),[sound,setSound]=useState(true),[spinning,setSpinning]=useState(false),[result,setResult]=useState<Food|null>(null),[revealed,setRevealed]=useState(false);
 const [reel,setReel]=useState(()=>foods.map((food,id)=>({food,id}))),[moving,setMoving]=useState(false);
 const busy=useRef(false),muted=useRef(false),viewport=useRef<HTMLDivElement>(null);
 useEffect(()=>{const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:unknown)=>void}}).modelContext;if(!context)return;const lifecycle=new AbortController();try{context.registerTool({name:'list_lunch_items',description:'Read all lunch options with approximate prices and vegetarian status.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:(input:unknown)=>{if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('Expected an empty object');return foods.map(({name,price,veg})=>({name,approximatePriceVND:price*1000,vegetarian:!!veg}))}},{signal:lifecycle.signal})}catch{}return ()=>lifecycle.abort()},[]);
 const eligible=foods.filter(f=>(budget==='all'||f.price<=Number(budget))&&(!veg||f.veg));

 const playing=useRef<Set<HTMLAudioElement>>(new Set());
 function sfx(name:string){if(muted.current)return;const a=new Audio(basePath+'/sounds/'+name+'.wav');a.volume=.65;playing.current.add(a);a.onended=()=>playing.current.delete(a);void a.play().catch(()=>playing.current.delete(a));}

 const track=useRef<HTMLDivElement>(null);
 const position=useRef(-400);
 const frame=useRef(0);
 useEffect(()=>()=>{cancelAnimationFrame(frame.current);playing.current.forEach(a=>a.pause())},[]);
 function open(){
  if(busy.current||!eligible.length||!track.current||!viewport.current)return;
  busy.current=true;
  const winner=chooseFood(eligible);
  const step=254,tileWidth=240,width=viewport.current.clientWidth;
  const start=position.current;
  const center=Math.floor((width/2-start)/step);
  const target=center-18;
  const end=width/2-tileWidth*stopFraction()-target*step;
  // Each card keeps its permanent world coordinate and React key. Add new cards
  // only to the left, offscreen; never reset the track or relocate visible cards.
  const items=reel.filter(item=>item.id<=center+Math.ceil(width/step)+2);
  const first=Math.min(...items.map(item=>item.id));
  const recent:Food[]=[];
  for(let id=first-1;id>=target-4;id--){
   const alternatives=eligible.filter(food=>!recent.includes(food));
   const food=id===target?winner:chooseFood(alternatives.length?alternatives:eligible);
   items.push({id,food});recent.push(food);if(recent.length>8)recent.shift();
  }
  flushSync(()=>{setReel(items);setSpinning(true);setMoving(true);setResult(null)});
  sfx('csgo_ui_crate_open');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?150:SPIN_DURATION_MS;
  const started=performance.now();
  let lastCell=Math.floor((start-width/2)/step);
  const animate=(now:number)=>{
   const progress=Math.max(0,Math.min(1,(now-started)/duration));
   const next=start+(end-start)*(1-Math.pow(1-progress,4));
   position.current=next;
   if(track.current)track.current.style.transform=`translate3d(${next}px,0,0)`;
   // Tick when a card actually crosses the pointer, including on slow devices.
   const cell=Math.floor((next-width/2)/step);
   if(cell!==lastCell){sfx('csgo_ui_crate_item_scroll');lastCell=cell}
   if(progress<1){frame.current=requestAnimationFrame(animate);return}
   busy.current=false;setSpinning(false);setMoving(false);setResult(winner);setRevealed(true);
   sfx(['item_reveal3_rare','item_reveal4_mythical','item_reveal5_legendary','item_reveal6_ancient','item_reveal6_ancient'][winner.rarity]);
  };
  frame.current=requestAnimationFrame(animate);
 }

 return <div className="site-shell">
 <header><a href={`${basePath}/`} className="brand"><span className="brand-icon"><Utensils size={21}/></span>truanayangi<span className="brand-dot">.</span></a><button className="sound-button" onClick={()=>setSound(s=>{muted.current=s;if(s)playing.current.forEach(a=>a.pause());return !s})} aria-label={sound?'Tắt âm thanh':'Bật âm thanh'}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}<span>Âm thanh {sound?'bật':'tắt'}</span></button></header>
 <main><div className="intro"><h1>Mở hòm ăn trưa</h1></div>
 <section className="case-panel" aria-label="Mở hòm món ăn">
 <div className={`reel-window ${moving?'is-spinning':''} `} ref={viewport}><div className="selector-line"/><div className="reel-track" ref={track}>{reel.map(({food,id})=><Card key={id} food={food} slot={id}/>)}</div><div className="reel-fade left"/><div className="reel-fade right"/></div></section>
 <div className="control-bar"><div className="filters"><div className="budget"><label id="budget-label">Ngân sách / người</label><Select value={budget} onValueChange={v=>setBudget(v??'all')} disabled={spinning}><SelectTrigger aria-labelledby="budget-label"><SelectValue>{budget==='all'?'Tất cả':`Tối đa ${budget}.000đ`}</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem><SelectItem value="35">Tối đa 35.000đ</SelectItem><SelectItem value="60">Tối đa 60.000đ</SelectItem><SelectItem value="100">Tối đa 100.000đ</SelectItem></SelectContent></Select></div><label className="veg"><Switch checked={veg} onCheckedChange={setVeg} disabled={spinning} aria-label="Chỉ ăn chay"/><span><Leaf size={15}/> Ăn chay</span></label></div><div className="open-wrap"><button className="open-button" disabled={spinning||!eligible.length} onClick={open}>{spinning?<AudioLines size={22}/>:<Sparkles size={21}/>} {spinning?'ĐANG MỞ HÒM…':result?'MỞ LẠI':'MỞ HÒM'} <span>↗</span></button></div></div>
 <Dialog open={revealed} onOpenChange={setRevealed}><DialogContent className="winner-dialog" showCloseButton={false}>{result&&<><span className="winner-label">VẬT PHẨM MỚI</span><DialogTitle className="winner-title">{result.name}</DialogTitle><DialogDescription className="winner-description">Giá tham khảo · ~{result.price}.000đ / người</DialogDescription><div className="winner-art" style={{'--rarity':colors[result.rarity]} as React.CSSProperties}><FoodImage food={result}/></div><div className="winner-actions"><a className="find-button" href={`https://www.google.com/maps/search/${encodeURIComponent(result.name+' gần đây')}`} target="_blank" rel="noreferrer">TÌM QUÁN <ArrowUpRight size={16}/></a><button onClick={()=>setRevealed(false)}>TIẾP TỤC</button></div></>}</DialogContent></Dialog>

 <section className="inventory"><div className="section-heading"><div><span className="eyebrow">TRONG HÒM CÓ GÌ?</span><h2>Vật phẩm trong hòm <span>{eligible.length.toString().padStart(2,'0')}</span></h2></div><div className="rarity-legend">{tiers.map((t,i)=><span key={t}><i style={{background:colors[i]}}/>{t}</span>)}</div></div><div className="inventory-grid">{eligible.map(f=><Card food={f} small key={f.name}/>)}</div></section>

 <footer><span>truanayangi.</span><span>Fan-made · SFX: Valve / <a href="https://github.com/sourcesounds/csgo" target="_blank" rel="noreferrer">SourceSounds</a></span></footer>
 </main></div>
}
