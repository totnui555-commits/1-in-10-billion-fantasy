'use strict';
// Appearance is derived, never consumes the story RNG and never changes saved identities.
const Wardrobe=(()=>{
 const palettes=[['#526d57','#b7bb8a','#35483d'],['#70648a','#d6be98','#433c5a'],['#a4774e','#e1c595','#624936'],['#557f90','#bbd8cf','#354e64'],['#985f65','#e0b3a0','#593c4d'],['#425e68','#aab7a3','#2e404c'],['#78814e','#d5cf9c','#4a5338'],['#6f504c','#bfa185','#473a38'],['#b4a58a','#efe0bc','#70634f'],['#467c73','#c0ceaa','#2d534f'],['#8d7388','#d7c0d0','#514555'],['#ae854b','#f0d4a0','#725734'],['#53608a','#b7c7da','#333c60'],['#8e9b8c','#e0dcc2','#53635a'],['#ae796e','#e7cbb7','#724f4e'],['#585050','#c0afa1','#34383a'],['#79758f','#e3d4b8','#4c485f'],['#9a926b','#ebe0ae','#5b5a41'],['#3f6962','#adc4b0','#294740'],['#84705c','#cdbd9b','#514437'],['#83535e','#dcb9c0','#4b3544'],['#647a9a','#d0d5da','#3c4b66'],['#a49d91','#f0e8ce','#69635e'],['#715c82','#d9bea1','#43354f']];
 palettes.push(['#557468','#c9d4b6','#314d43'],['#a4664d','#e6c18f','#623e32'],['#777b9c','#d9cedc','#424b69'],['#aa9a73','#e6dab6','#686248'],['#5a8794','#cedddd','#354f66'],['#845e7e','#dec4ca','#513d59'],['#879667','#d4dfb0','#4f6140'],['#b08c71','#f0d6b3','#785649'],['#526c83','#c7c8ad','#343e57'],['#9a805f','#ebd4a3','#605037'],['#698b82','#c4d8c6','#3c615b'],['#9b6f78','#e3c4bd','#624451'],['#6c647d','#d6d0b5','#423d56'],['#a1ab99','#e6e9cb','#617566'],['#b79a62','#f0dd9b','#7c633d'],['#456956','#a5bfa2','#2e493f'],['#6d8caa','#e0dac5','#425a74'],['#a28d9e','#e6ccd0','#64536e'],['#776557','#cbbca5','#4e4039'],['#a99c87','#efe2c8','#736654'],['#497c7b','#b8d3c0','#305456'],['#ab685d','#e4c1a0','#6d4441'],['#767e57','#cbd199','#4c563b'],['#7e5970','#d7bcb5','#4d384f']);
 const hairColors=['#302f35','#644233','#a1754f','#cab783','#4b555f','#b9b2a2','#713d4e','#4c6659','#9a786a','#303f4e','#d5c9a6','#795d80'];
 hairColors.push('#a98b58','#c7ac91','#665846','#435955','#89666e','#baa66e','#55647a','#6c4d35');
 const hash=(n)=>{n=Math.imul(n^(n>>>16),2246822507);n=Math.imul(n^(n>>>13),3266489909);return(n^(n>>>16))>>>0};
 const cache=new Map;
 function identity(s,m=null){let n=hash((s.seed||0)^((m?.race??s.race??0)+1)*65537);for(const ch of (m?.name||m?.id||'self'))n=hash(n^ch.charCodeAt(0));const l=m?.look||s.look||{};return hash(n^(l.hair||0)*131^(l.coat||0)*8191^(l.eyes||0)*31)}
 function style(s,m=null){const key=identity(s,m);if(cache.has(key))return cache.get(key);const at=n=>hash(key+n*104729),v={key,palette:at(1)%48,cut:at(2)%36,hair:at(3)%32,hairColor:at(4)%20,pattern:at(5)%20,accessory:at(6)%24,hat:at(7)%18,mark:at(8)%16,detail:at(9)%8,lower:at(10)%12,boots:at(11)%8,sleeves:at(12)%8,mantle:at(13)%12,accent:at(14)%48};if(cache.size>=1024)cache.clear();cache.set(key,v);return v}
 const uniforms={mage:[4,12,18,24,30],guard:[7,13,19,25,31],farmer:[2,14,20,26,32],craft:[6,15,21,27,33],traveler:[9,16,22,28,34],priest:[4,17,23,29,35],merchant:[1,5,12,18,26],artist:[3,8,17,24,28],healer:[6,14,23,29,35],sailor:[3,10,16,21,32],scholar:[4,11,18,22,30],cook:[6,15,20,27,33]};
 function role(s,m,age){if(age<16)return 'casual';const assigned=typeof Workwear==='undefined'?null:Workwear.category(s,m,age);if(assigned)return assigned;const label=(m?m.occupation:(Number.isInteger(s.job)?JOBS[s.job]?.[0]:''))||'';return /เวท|อาคม|พยากรณ์|คาถา|นักปราชญ์/.test(label)?'mage':/อัศวิน|ทหาร|องครักษ์|นักรบ|ยาม|ผู้กล้า/.test(label)?'guard':/เกษตร|ชาวนา|ชาวไร่|สวน|เลี้ยงสัตว์/.test(label)?'farmer':/นักบวช|นักพรต|ศาสนา/.test(label)?'priest':/รักษา|แพทย์|พยาบาล|หมอ|สมุนไพร/.test(label)?'healer':/เรือ|ประมง|ทะเล/.test(label)?'sailor':/ดนตรี|นักร้อง|ศิลปิน|วาด|นักเต้น|ละคร/.test(label)?'artist':/พ่อค้า|แม่ค้า|นายหน้า|ธนาคาร|บัญชี/.test(label)?'merchant':/ครัว|ปรุง|ขนม|อบอาหาร/.test(label)?'cook':/ช่าง|ตีเหล็ก|เหมือง/.test(label)?'craft':/นักผจญภัย|พราน|สำรวจ|เดินทาง/.test(label)?'traveler':/อาจารย์|ครู|บรรณารักษ์|อักษร|นักวิจัย/.test(label)?'scholar':'casual'}
 function cutFor(s,m,age){const v=style(s,m),pool=uniforms[role(s,m,age)];return age<12?[0,1,2,3,5,8,10,14,17,20,24,26,32][v.cut%13]:pool?pool[v.cut%pool.length]:v.cut}
 // The birth realm supplies a woven motif; moving does not change one's clothes.
 function culture(s){return Math.abs(s.homeKingdom??s.kingdom??0)%16}
 function colors(v){return palettes[v.palette]}
 function outfit(s,m=null,age=30){const assigned=typeof Workwear==='undefined'?null:Workwear.dyes(s,m,age);if(assigned)return assigned;const v=style(s,m),[shirt,trim,shade]=colors(v);return{shirt,trim,shade,cape:palettes[v.accent][2],lower:palettes[v.accent][0],lowerShade:palettes[v.accent][2],leather:shade,accent:trim,metal:'#9ca9a3',linen:'#e1d7b7'}}
 const box=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
 function garment(c,s,m,age,skin){const v=style(s,m),dye=outfit(s,m,age),{shirt:base,trim,shade:dark}=dye,r=role(s,m,age),cut=cutFor(s,m,age);
  if(age<1){box(c,4,22,16,3,base);box(c,7,29,10,2,trim);return}
  box(c,4,16,16,15,base);box(c,5,29,5,8,dye.lower);box(c,15,29,5,8,dye.lower);box(c,4,35,6,2,age<4?skin:dark);box(c,15,35,6,2,age<4?skin:dark);
  if(cut===0){box(c,10,17,4,12,trim);box(c,11,18,2,6,base)}
  if(cut===1){box(c,5,17,5,12,dark);box(c,15,17,4,12,dark);box(c,10,17,5,3,trim)}
  if(cut===2){box(c,6,18,2,11,dark);box(c,16,18,2,11,dark);box(c,7,24,11,7,dark);box(c,8,25,3,3,trim)}
  if(cut===3){box(c,3,16,19,4,trim);box(c,5,20,14,2,dark)}
  if(cut===4){box(c,3,26,19,8,base);box(c,11,17,2,17,trim);box(c,3,32,19,2,trim)}
  if(cut===5){box(c,4,16,4,15,trim);box(c,17,16,3,15,trim);box(c,9,16,5,3,dark)}
  if(cut===6){box(c,8,17,8,15,trim);box(c,9,24,6,3,dark);box(c,11,17,2,4,base)}
  if(cut===7){box(c,3,16,19,4,dark);box(c,6,20,12,8,'#9ca8a1');box(c,8,21,8,2,trim);box(c,10,24,4,3,dark)}
  if(cut===8){for(let y=18;y<30;y+=4)box(c,4,y,16,2,trim)}
  if(cut===9){box(c,2,17,6,15,dark);box(c,17,17,5,13,dark);box(c,6,18,2,11,trim)}
  if(cut===10){box(c,4,16,16,5,trim);box(c,9,21,7,3,trim);box(c,12,24,5,4,trim)}
  if(cut===11){box(c,5,16,14,3,dark);box(c,10,17,4,12,trim);box(c,2,20,3,6,base)}
  if(cut===12){box(c,2,16,20,3,dark);box(c,4,19,5,12,trim);box(c,16,19,5,12,trim)}
  if(cut===13){for(let y=18;y<29;y+=3)box(c,4,y,16,2,'#9ca8a1');box(c,2,16,5,4,trim);box(c,18,16,5,4,trim)}
  if(cut===14){box(c,4,16,16,9,trim);box(c,10,16,4,3,skin);box(c,7,25,10,6,dark)}
  if(cut===15){box(c,5,16,3,10,dark);box(c,17,16,2,10,dark);box(c,6,24,14,8,trim);box(c,8,25,3,3,base)}
  if(cut===16){box(c,3,16,18,5,dark);box(c,3,21,5,11,trim);box(c,17,21,4,11,trim)}
  if(cut===17){box(c,3,16,20,6,trim);box(c,7,22,15,3,dark);box(c,16,25,6,6,trim)}
  if(cut===18){box(c,3,16,18,15,dark);box(c,4,16,6,4,trim);box(c,14,16,6,4,trim);for(let y=21;y<29;y+=3)box(c,11,y,2,1,trim)}
  if(cut===19){box(c,2,15,7,6,'#939c93');box(c,16,15,7,6,'#939c93');box(c,7,19,10,10,dark);box(c,8,21,8,2,trim)}
  if(cut===20){box(c,4,17,16,14,trim);box(c,4,21,16,2,base);box(c,7,26,11,4,base);box(c,12,16,1,10,dark)}
  if(cut===21){box(c,4,16,16,8,dark);box(c,8,23,9,9,trim);box(c,9,25,7,1,base)}
  if(cut===22){box(c,3,16,19,4,trim);box(c,3,20,4,11,dark);box(c,18,20,4,11,dark);box(c,9,20,6,8,trim)}
  if(cut===23){box(c,3,16,19,17,trim);box(c,10,17,5,16,base);box(c,11,18,3,3,dark)}
  if(cut===24){box(c,2,16,21,5,trim);box(c,4,21,17,12,base);box(c,4,31,17,2,trim);box(c,8,17,2,4,dark)}
  if(cut===25){box(c,3,16,19,7,'#8e9b99');box(c,5,23,15,8,dark);for(let x=6;x<20;x+=4)box(c,x,24,2,5,trim)}
  if(cut===26){box(c,4,16,16,5,dark);box(c,5,21,15,8,trim);box(c,9,22,7,6,base);box(c,5,29,15,3,trim)}
  if(cut===27){box(c,3,17,19,14,trim);box(c,10,17,2,13,dark);box(c,16,23,4,4,base)}
  if(cut===28){box(c,2,16,7,16,dark);box(c,16,16,7,16,dark);box(c,7,17,2,8,trim);box(c,16,17,2,8,trim)}
  if(cut===29){box(c,3,16,19,17,base);box(c,4,16,17,5,trim);box(c,4,28,17,4,trim);box(c,10,19,4,4,dark)}
  if(cut===30){box(c,4,16,16,15,dark);box(c,7,16,2,15,trim);box(c,16,16,2,15,trim);box(c,8,17,8,3,base)}
  if(cut===31){box(c,2,15,21,5,trim);box(c,6,20,13,9,'#85918a');box(c,11,21,3,6,dark)}
  if(cut===32){box(c,4,16,16,12,base);for(let y=18;y<28;y+=4)box(c,4,y,16,2,trim);box(c,6,28,13,4,dark)}
  if(cut===33){box(c,4,16,16,16,dark);box(c,8,19,9,13,trim);box(c,9,25,7,4,base)}
  if(cut===34){box(c,3,17,6,14,trim);box(c,15,17,6,14,dark);box(c,10,17,5,6,base);box(c,4,28,16,3,trim)}
  if(cut===35){box(c,3,16,19,17,trim);box(c,4,17,5,15,base);box(c,17,17,4,15,base);box(c,10,24,6,2,dark)}
  // Independent sleeve shapes: cuffed, puffed, rolled, short, layered and open.
  if(v.sleeves===1){box(c,1,18,4,6,trim);box(c,20,18,4,6,trim)}
  if(v.sleeves===2){box(c,0,17,5,6,base);box(c,20,17,5,6,base);box(c,1,22,4,2,dark);box(c,20,22,4,2,dark)}
  if(v.sleeves===3){box(c,1,18,4,4,base);box(c,20,18,4,4,base);box(c,1,21,4,1,trim);box(c,20,21,4,1,trim)}
  if(v.sleeves===4){box(c,1,18,4,10,dark);box(c,20,18,4,10,dark);box(c,1,26,4,2,trim);box(c,20,26,4,2,trim)}
  if(v.sleeves===5){box(c,1,17,4,4,trim);box(c,20,17,4,4,trim)}
  if(v.sleeves===6){box(c,1,19,4,9,base);box(c,20,19,4,9,base);box(c,1,23,4,2,trim);box(c,20,23,4,2,trim)}
  if(v.sleeves===7){box(c,1,18,4,6,skin);box(c,20,18,4,6,skin)}
  // Patterns occupy small panels so the face and silhouette remain readable.
  for(let i=0;i<4;i++){const x=5+i*4,y=21+(v.detail+i)%5;if(v.pattern===1)box(c,x,y,1,2,trim);if(v.pattern===2)box(c,x,22,2,1,trim);if(v.pattern===3)box(c,6,19+i*3,12,1,dark);if(v.pattern===4)box(c,6+i*3,18,1,10,trim);if(v.pattern===5)box(c,x,y,2,2,dark);if(v.pattern===6)box(c,7+i*3,20+i*2,2,2,trim);if(v.pattern===7)box(c,17,19+i*3,2,1,trim)}
  for(let i=0;i<4;i++){const x=6+i*3,y=20+i*2;
   if(v.pattern===8){box(c,x,y,3,1,trim);box(c,x+1,y-1,1,3,trim)}
   if(v.pattern===9){box(c,6,19+i*3,4,1,trim);box(c,15,20+i*3,4,1,trim)}
   if(v.pattern===10){box(c,x,21,1,8,trim);box(c,5,20+i*3,15,1,trim)}
   if(v.pattern===11){box(c,x,y,2,1,dark);box(c,x+1,y+1,2,1,trim)}
   if(v.pattern===12){box(c,6,20+i*3,2,2,trim);box(c,17,20+i*3,2,2,trim)}
   if(v.pattern===13){box(c,x,22+i%2*3,2,2,trim);box(c,x,23+i%2*3,1,1,base)}
   if(v.pattern===14){box(c,6+i*3,19+i%2*5,2,1,trim);box(c,6+i*3,20+i%2*5,1,2,trim)}
   if(v.pattern===15)box(c,8+i*2,20+i*2,4,1,trim);
   if(v.pattern===16){box(c,5,19+i*3,3,1,dark);box(c,17,20+i*3,3,1,dark)}
   if(v.pattern===17){box(c,x,20,1,2,trim);box(c,x,26,1,2,trim)}
   if(v.pattern===18){box(c,6,20+i*3,12,1,trim);box(c,8+i*3,19,1,10,dark)}
   if(v.pattern===19){box(c,9+i,19+i*2,2,2,trim);box(c,16-i,19+i*2,2,2,trim)}
  }
  const lower=age<4?v.lower%3:v.lower,shoe=age<4?skin:dye.leather,bottom=dye.lower,legShade=dye.lowerShade;
  if(lower===1){box(c,4,29,17,6,bottom);box(c,8,30,1,5,trim);box(c,17,30,1,5,trim)}
  if(lower===2){box(c,4,29,7,4,bottom);box(c,14,29,7,4,bottom);box(c,5,33,5,2,skin);box(c,15,33,5,2,skin)}
  if(lower===3){box(c,3,29,19,7,trim);for(let x=5;x<21;x+=4)box(c,x,30,1,6,legShade)}
  if(lower===4){box(c,4,29,7,7,bottom);box(c,14,29,7,7,bottom);box(c,6,31,2,3,trim);box(c,16,32,2,2,trim)}
  if(lower===5){box(c,5,30,5,5,trim);box(c,15,30,5,5,trim)}
  if(lower===6){box(c,4,29,17,7,legShade);box(c,11,30,3,6,trim)}
  if(lower===7){box(c,3,29,8,6,bottom);box(c,14,29,8,6,bottom);box(c,4,34,7,1,trim);box(c,14,34,7,1,trim)}
  if(lower===8){box(c,4,29,17,6,bottom);box(c,4,33,17,2,trim);box(c,11,29,2,6,legShade)}
  if(lower===9){box(c,5,29,5,7,legShade);box(c,15,29,5,7,legShade);box(c,5,29,2,6,trim);box(c,18,29,2,6,trim)}
  if(lower===10){box(c,3,29,19,7,bottom);box(c,3,31,19,1,trim);box(c,3,34,19,1,trim)}
  if(lower===11){box(c,4,29,7,7,trim);box(c,14,29,7,7,trim);box(c,5,31,5,1,legShade);box(c,15,33,5,1,legShade)}
  box(c,4,35,6,2,shoe);box(c,15,35,6,2,shoe);
  if(age>=4){if(v.boots===1||v.boots===5){box(c,5,32,5,5,dye.leather);box(c,15,32,5,5,dye.leather);box(c,5,32,5,1,trim);box(c,15,32,5,1,trim)}
   if(v.boots===2){box(c,4,35,6,2,trim);box(c,15,35,6,2,trim)}
   if(v.boots===3){box(c,5,34,5,2,skin);box(c,15,34,5,2,skin);box(c,6,35,1,2,trim);box(c,16,35,1,2,trim)}
   if(v.boots===4){box(c,4,34,6,3,dye.leather);box(c,15,34,6,3,dye.leather)}
   if(v.boots===6){box(c,5,32,5,5,trim);box(c,15,32,5,5,trim);box(c,7,33,1,3,dye.leather);box(c,17,33,1,3,dye.leather)}
   if(v.boots===7){box(c,4,35,7,2,dye.leather);box(c,14,35,7,2,dye.leather);box(c,4,36,7,1,trim);box(c,14,36,7,1,trim)}}
  const race=m?.race??s.race??0;
  if([1,2,3].includes(race)){box(c,11,22,1,5,trim);box(c,9,23,2,1,trim);box(c,12,25,2,1,trim)}
  if([4,11,31].includes(race)){box(c,9,22,6,4,dark);box(c,10,23,4,2,trim);box(c,11,22,2,4,trim)}
  if(race===12){box(c,6,23,4,4,trim);box(c,6,23,1,1,dark);box(c,9,26,1,1,dark)}
  if(race>=15&&race<=22){box(c,9,22,2,2,trim);box(c,13,22,2,2,trim);box(c,11,24,2,2,trim)}
  if(race===23){box(c,6,17,3,3,trim);box(c,15,17,3,3,trim);box(c,8,19,2,2,trim);box(c,14,19,2,2,trim)}
  const motif=culture(s); // sixteen compact textile languages, never extra particles
  if(motif%4===0){box(c,7,26,2,1,trim);box(c,8,25,1,3,trim)}
  if(motif%4===1){box(c,6,25,1,4,trim);box(c,7,26,2,1,trim);box(c,7,28,2,1,trim)}
  if(motif%4===2){box(c,6,26,3,2,dark);box(c,7,25,1,1,trim)}
  if(motif%4===3){box(c,6,26,1,3,trim);box(c,8,25,1,3,trim);box(c,7,26,1,2,dark)}
  box(c,17,25+(motif>>2),2,1,trim);
  box(c,4,29,16,2,dark);box(c,10,29,3,2,trim);
  if(v.accessory===1){box(c,17,23,5,6,dye.leather);box(c,18,24,3,1,dye.accent)}
  if(v.accessory===2){box(c,3,17,2,11,dye.accent);box(c,4,17,2,2,dye.accent);box(c,6,19,2,2,dye.accent);box(c,8,21,2,2,dye.accent)}
  if(v.accessory===3){box(c,7,17,11,2,dye.accent);box(c,16,19,3,6,dye.accent)}
  if(v.accessory===4){box(c,17,18,4,7,dye.leather);box(c,18,19,2,5,dye.accent)}
  if(v.accessory===5){box(c,5,18,3,3,dye.accent);box(c,6,19,1,1,dye.leather)}
  if(v.accessory===6){box(c,19,25,3,5,dye.accent);box(c,20,24,1,2,dye.leather)}
  if(v.accessory===7&&age>=12){box(c,0,19,2,12,dye.leather);box(c,1,19,3,2,dye.accent)}
  if(v.accessory===8){box(c,17,20,5,9,dye.leather);box(c,18,21,3,6,dye.accent);box(c,18,23,3,1,base)}
  if(v.accessory===9){box(c,2,17,3,13,dye.accent);box(c,2,28,6,3,dye.leather)}
  if(v.accessory===10){box(c,6,17,13,2,dye.leather);box(c,17,19,3,8,dye.accent)}
  if(v.accessory===11){box(c,17,26,5,5,base);box(c,18,27,3,2,dye.accent)}
  if(v.accessory===12){box(c,19,19,4,11,dye.accent);box(c,20,20,1,9,dye.leather)}
  if(v.accessory===13){box(c,3,17,4,5,dye.accent);box(c,4,18,2,3,base)}
  if(v.accessory===14){box(c,9,17,7,1,dye.accent);box(c,11,18,3,3,dye.leather);box(c,12,19,1,1,dye.accent)}
  if(v.accessory===15){box(c,1,27,6,4,dye.leather);box(c,2,28,4,2,dye.accent)}
  if(v.accessory===16){box(c,17,24,5,7,dye.accent);box(c,18,25,3,1,dye.leather);box(c,18,29,3,1,dye.leather)}
  if(v.accessory===17){box(c,5,18,2,9,dye.accent);box(c,18,18,2,9,dye.accent);box(c,6,26,13,2,dye.accent)}
  if(v.accessory===18){box(c,2,17,3,4,dye.leather);box(c,20,17,3,4,dye.leather);box(c,3,18,1,1,dye.accent);box(c,21,18,1,1,dye.accent)}
  if(v.accessory===19){box(c,6,16,12,2,dye.accent);box(c,9,18,6,2,dye.leather)}
  if(v.accessory===20&&age>=18){box(c,-2,20,3,13,dye.leather);box(c,-3,19,5,2,dye.accent);box(c,-1,22,1,8,dye.accent)}
  if(v.accessory===21){box(c,20,26,4,5,dye.leather);box(c,21,27,2,2,dye.accent)}
  if(v.accessory===22){box(c,6,17,12,1,dye.accent);box(c,7,18,10,1,dye.leather);box(c,9,19,6,1,dye.accent)}
  if(v.accessory===23){box(c,17,20,5,10,dye.leather);box(c,18,21,3,8,base);box(c,18,22,3,1,dye.accent);box(c,18,28,3,1,dye.accent)}
  if(typeof Workwear!=='undefined')Workwear.uniform(c,s,m,age);
  if((s.rank||0)>=5&&age>=18){box(c,5,17,1,9,trim);box(c,18,17,1,9,trim);box(c,12,20,2,2,'#d1b16d')}
 }
 // Rear layers are drawn before the body, preserving arms, tails and wing outlines.
 function back(c,s,m,age){if(age<4)return;const v=style(s,m),{shirt:base,trim,shade:dark,cape:col}=outfit(s,m,age);
  if(v.mantle===1){box(c,0,17,24,15,col);box(c,-1,29,26,4,col)}
  if(v.mantle===2){box(c,-1,16,26,7,col);box(c,0,23,24,3,trim)}
  if(v.mantle===3){box(c,-1,17,7,18,col);box(c,0,34,5,2,trim)}
  if(v.mantle===4){box(c,19,17,6,18,col);box(c,20,33,5,2,trim)}
  if(v.mantle===5){box(c,-1,17,26,15,col);box(c,0,31,7,3,trim);box(c,18,31,6,3,trim)}
  if(v.mantle===6){box(c,-1,16,26,7,dark);box(c,0,15,24,3,trim)}
  if(v.mantle===7){box(c,1,18,6,17,col);box(c,19,18,5,17,col);box(c,2,33,3,3,trim);box(c,21,32,3,3,trim)}
  if(v.mantle===8){box(c,0,17,6,8,col);box(c,19,17,6,8,col);box(c,1,24,4,3,trim);box(c,21,24,3,3,trim)}
  if(v.mantle===9){box(c,-1,17,26,16,col);box(c,0,33,6,3,col);box(c,19,33,5,3,col)}
  if(v.mantle===10){box(c,0,18,6,12,base);box(c,20,18,5,12,base);box(c,1,27,3,4,trim);box(c,22,27,2,4,trim)}
  if(v.mantle===11){box(c,0,17,7,14,col);box(c,19,17,6,14,col);box(c,0,17,2,14,trim);box(c,23,17,2,14,trim)}
 }
 function hair(c,s,m,age,skin,posture=0){const v=style(s,m),col=age>=60?'#c4c1b2':hairColors[v.hairColor],b=(x,y,w,h,k=col)=>box(c,x+posture,y,w,h,k);b(3,2,17,10,skin);b(4,2,15,4);const h=v.hair;
  if(h===0){b(4,5,3,7);b(17,5,3,6)}
  if(h===1){b(3,1,17,4);b(3,4,3,10);b(17,4,3,10)}
  if(h===2){b(3,0,18,5);b(5,4,3,4);b(9,4,3,2);b(18,4,2,5)}
  if(h===3){b(8,-2,7,7);b(4,3,15,2)}
  if(h===4){b(3,3,3,14);b(18,3,3,14);b(2,16,4,6);b(18,16,4,6)}
  if(h===5){b(3,1,18,4);b(3,5,4,4);b(6,5,4,2);b(19,5,2,6)}
  if(h===6){b(4,4,3,7);b(18,4,2,7);b(18,11,3,8);b(19,19,2,3)}
  if(h===7){b(3,0,18,5);b(2,4,3,3);b(19,3,3,5);b(5,-2,3,3);b(14,-2,4,3)}
  if(h===8){b(3,3,3,12);b(18,3,3,12);b(7,-3,9,5);b(10,-4,4,2)}
  if(h===9){b(3,3,3,7);b(17,3,3,7);b(1,5,3,4);b(20,4,3,5)}
  if(h===10){b(3,4,3,5);b(18,4,3,5);b(4,2,15,2,skin)}
  if(h===11){b(3,1,18,4);b(4,4,3,3);b(10,4,4,3);b(18,4,3,11)}
  if(h===12){b(3,2,3,13);b(18,2,3,13);b(2,13,4,4);b(18,13,4,4)}
  if(h===13){b(3,1,18,4);b(3,4,3,7);b(18,4,3,7);b(4,2,3,2,colors(v)[1])}
  if(h===14){b(4,1,15,3);b(3,4,3,4);b(19,4,2,4);b(20,1,4,7);b(23,5,2,6)}
  if(h===15){b(3,2,3,12);b(18,2,3,12);b(2,13,4,2,colors(v)[1]);b(18,13,4,2,colors(v)[1])}
  if(h===16){b(3,1,18,4);b(3,5,3,12);b(19,5,3,12);b(2,16,3,5);b(20,16,3,5);b(2,20,3,1,colors(v)[1]);b(20,20,3,1,colors(v)[1])}
  if(h===17){b(6,-4,4,4);b(14,-4,4,4);b(3,1,18,4);b(3,4,3,8);b(18,4,3,8)}
  if(h===18){b(7,-3,9,4);b(3,1,18,4);b(19,3,4,5);b(21,7,3,7);b(22,14,2,4)}
  if(h===19){b(3,0,18,5);b(3,5,3,8);b(18,4,3,8);b(5,-2,3,3);b(10,-3,3,3);b(16,-2,3,3)}
  if(h===20){b(2,1,20,5);b(2,5,3,10);b(19,5,3,10);b(2,14,5,3);b(17,14,5,3)}
  if(h===21){b(4,0,16,4);b(4,4,3,5);b(17,4,3,5);b(8,-2,2,3);b(12,-3,2,3);b(16,-1,2,2)}
  if(h===22){b(3,1,18,4);b(3,4,4,4);b(7,4,3,2);b(19,4,3,9);b(20,12,3,6);b(22,17,2,4)}
  if(h===23){b(3,1,18,4);b(3,4,3,6);b(18,4,3,6);b(5,12,2,5);b(17,12,2,5);b(5,16,3,2);b(16,16,3,2)}
  if(h===24){b(4,1,15,3);b(3,4,3,5);b(18,4,3,5);b(3,10,3,3);b(19,10,3,3);b(4,13,2,5);b(19,13,2,5)}
  if(h===25){b(3,1,18,3);b(3,4,3,12);b(18,4,3,12);b(2,15,4,5);b(18,15,4,5);b(7,1,2,3,colors(v)[1]);b(15,1,2,3,colors(v)[1])}
  if(h===26){b(4,0,15,4);b(4,4,3,4);b(17,4,3,4);b(19,1,4,5);b(21,5,3,4);b(20,9,4,4)}
  if(h===27){b(3,0,18,4);b(3,4,3,9);b(19,4,3,9);b(3,12,2,4);b(20,12,2,4);b(10,-3,4,3)}
  if(h===28){b(3,0,18,4);b(3,4,3,6);b(19,4,3,6);b(5,3,2,3);b(9,3,2,4);b(13,3,2,3);b(17,3,2,4)}
  if(h===29){b(4,0,15,4);b(3,4,3,9);b(18,4,3,9);b(2,12,4,3);b(18,12,4,3);b(2,16,3,3);b(19,16,3,3)}
  if(h===30){b(3,0,18,5);b(3,5,4,5);b(18,5,3,5);b(5,-2,4,3);b(15,-2,4,3);b(1,5,3,4);b(21,5,3,4)}
  if(h===31){b(3,1,18,4);b(3,5,3,10);b(18,5,3,10);b(1,14,5,5);b(19,14,5,5);b(2,18,4,2,colors(v)[1]);b(20,18,4,2,colors(v)[1])}
  if(age>=40&&age<60){b(4,5,2,4,'#acaaa0');b(18,5,2,4,'#acaaa0')}
 }
 function headwear(c,s,m,age,race){if(age<4||![0,1,2,3,4,11,12,26,27].includes(race))return;const v=style(s,m),{shirt:base,trim,shade:dark}=outfit(s,m,age),r=role(s,m,age),hatDefault=age<12?[0,1,2,5,6,8,11,15][v.hat%8]:r==='farmer'?[1,8,12,15][v.hat%4]:r==='guard'?[3,9,13,17][v.hat%4]:r==='mage'?[4,10,14,16][v.hat%4]:v.hat,hat=typeof Workwear==='undefined'?hatDefault:Workwear.hats(s,m,age,hatDefault);
  if(hat===1){box(c,0,1,24,3,trim);box(c,5,-3,14,4,base);box(c,6,0,12,1,dark)}
  if(hat===2){box(c,3,0,18,3,dark);box(c,6,-3,12,3,base);box(c,18,2,5,2,dark)}
  if(hat===3){box(c,4,-1,16,5,'#879791');box(c,11,-3,3,5,trim);box(c,4,3,2,5,dark);box(c,18,3,2,5,dark)}
  if(hat===4){box(c,2,1,20,3,dark);box(c,7,-2,11,4,base);box(c,10,-5,6,3,base);box(c,7,0,11,1,trim)}
  if(hat===5){box(c,3,2,18,2,trim);box(c,17,3,3,5,base)}
  if(hat===6){box(c,4,1,15,2,base);box(c,6,-1,3,2,trim);box(c,14,-1,3,2,trim)}
  if(hat===8){box(c,-1,1,26,2,trim);box(c,4,-2,16,3,base);box(c,6,-3,12,1,trim)}
  if(hat===9){box(c,3,0,19,4,'#9ca9a2');box(c,3,4,3,3,dark);box(c,19,4,3,3,dark);box(c,8,-2,9,2,trim)}
  if(hat===10){box(c,2,1,21,3,dark);box(c,6,-1,13,3,base);box(c,8,-4,8,3,base);box(c,7,0,12,1,trim)}
  if(hat===11){box(c,3,0,18,4,trim);box(c,3,4,3,3,trim);box(c,18,4,3,3,trim);box(c,7,-2,11,2,base)}
  if(hat===12){box(c,1,0,23,3,dark);box(c,5,-3,15,3,base);box(c,6,-1,13,1,trim);box(c,21,2,3,5,trim)}
  if(hat===13){box(c,3,0,18,4,dark);box(c,4,-2,16,2,base);box(c,10,-4,5,3,trim);box(c,3,3,3,4,'#9ca9a2');box(c,18,3,3,4,'#9ca9a2')}
  if(hat===14){box(c,4,0,17,4,base);box(c,5,-3,14,3,base);box(c,9,-5,6,2,trim);box(c,4,2,17,1,trim)}
  if(hat===15){box(c,2,1,21,3,base);box(c,6,-2,14,3,base);box(c,5,0,16,1,dark);box(c,2,4,3,3,trim)}
  if(hat===16){box(c,4,1,17,3,trim);box(c,4,-1,4,3,base);box(c,17,-1,4,3,base);box(c,9,-3,7,4,base)}
  if(hat===17){box(c,3,0,18,4,dark);box(c,5,-2,14,2,'#8e9d95');box(c,11,-4,3,4,trim);box(c,3,4,2,4,trim);box(c,20,4,2,4,trim)}
 }
 // Bodies without clothing retain their anatomy: markings, not human suits or hats.
 function native(c,s,m,age,race){if(age<1)return;const v=style(s,m),p=typeof Ecology!=='undefined'?Ecology.profile(race):null,[base,trim,dark]=colors(v),type=p?.body||'hands';
  if(p?.civic&&type==='hands'){box(c,6,18,13,3,base);box(c,8,21,2,7,trim);box(c,16,23,3,4,dark);return}
  const positions=type==='roots'?[[5,12],[22,5],[14,29]]:type==='gel'?[[5,18],[18,26],[10,30]]:type==='wings'?[[1,17],[23,20],[12,29]]:['quad','fins'].includes(type)?[[1,22],[9,24],[16,23]]:[[8,18],[17,24],[10,29]];
  positions.forEach(([x,y],i)=>{const n=hash(v.key+i*97),a=i%2?base:trim,mark=v.mark%8;
   if(mark===0)box(c,x,y,2,2,a);
   if(mark===1){box(c,x,y,4,1,a);box(c,x+1,y+1,2,1,dark)}
   if(mark===2){box(c,x,y,1,4,a);box(c,x+2,y+1,1,3,a)}
   if(mark===3){box(c,x,y,3,1,a);box(c,x,y+2,3,1,a)}
   if(mark===4){box(c,x+1,y,2,1,a);box(c,x,y+1,4,1,a);box(c,x+1,y+2,2,1,a)}
   if(mark===5){box(c,x,y,2,1,a);box(c,x+1,y+1,2,1,a);box(c,x+2,y+2,2,1,a)}
   if(mark===6){box(c,x,y,1,3,a);box(c,x+1,y+3,3,1,a)}
   if(mark===7){box(c,x,y,3,3,a);box(c,x+1,y+1,1,1,dark)}
   if(v.mark>=8)box(c,x+3,y-1,1,2,base);
   if(type==='roots'){box(c,x+1,y-2,1,2,trim);if(n%2)box(c,x+2,y-3,2,1,base)}
  });
  if(type==='core'||type==='stone'){box(c,11,21,4,4,base);box(c,12,22,2,2,trim)}
 }
 return{style,identity,colors,outfit,role,cutFor,culture,back,garment,hair,headwear,native,palettes,hairColors,uniforms};
})();
