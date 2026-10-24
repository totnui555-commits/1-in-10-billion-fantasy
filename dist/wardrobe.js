'use strict';
// Appearance is derived, never consumes the story RNG and never changes saved identities.
const Wardrobe=(()=>{
 const palettes=[['#526d57','#b7bb8a','#35483d'],['#70648a','#d6be98','#433c5a'],['#a4774e','#e1c595','#624936'],['#557f90','#bbd8cf','#354e64'],['#985f65','#e0b3a0','#593c4d'],['#425e68','#aab7a3','#2e404c'],['#78814e','#d5cf9c','#4a5338'],['#6f504c','#bfa185','#473a38'],['#b4a58a','#efe0bc','#70634f'],['#467c73','#c0ceaa','#2d534f'],['#8d7388','#d7c0d0','#514555'],['#ae854b','#f0d4a0','#725734'],['#53608a','#b7c7da','#333c60'],['#8e9b8c','#e0dcc2','#53635a'],['#ae796e','#e7cbb7','#724f4e'],['#585050','#c0afa1','#34383a'],['#79758f','#e3d4b8','#4c485f'],['#9a926b','#ebe0ae','#5b5a41'],['#3f6962','#adc4b0','#294740'],['#84705c','#cdbd9b','#514437'],['#83535e','#dcb9c0','#4b3544'],['#647a9a','#d0d5da','#3c4b66'],['#a49d91','#f0e8ce','#69635e'],['#715c82','#d9bea1','#43354f']];
 const hairColors=['#302f35','#644233','#a1754f','#cab783','#4b555f','#b9b2a2','#713d4e','#4c6659','#9a786a','#303f4e','#d5c9a6','#795d80'];
 const hash=(n)=>{n=Math.imul(n^(n>>>16),2246822507);n=Math.imul(n^(n>>>13),3266489909);return(n^(n>>>16))>>>0};
 const cache=new Map;
 function identity(s,m=null){let n=hash((s.seed||0)^((m?.race??s.race??0)+1)*65537);for(const ch of (m?.name||m?.id||'self'))n=hash(n^ch.charCodeAt(0));const l=m?.look||s.look||{};return hash(n^(l.hair||0)*131^(l.coat||0)*8191^(l.eyes||0)*31)}
 function style(s,m=null){const key=identity(s,m);if(cache.has(key))return cache.get(key);const at=n=>hash(key+n*104729),v={key,palette:at(1)%24,cut:at(2)%12,hair:at(3)%16,hairColor:at(4)%12,pattern:at(5)%8,accessory:at(6)%8,hat:at(7)%8,mark:at(8)%8,detail:at(9)%8};if(cache.size>=1024)cache.clear();cache.set(key,v);return v}
 function role(s,m,age){if(age<18)return 'casual';const label=m?.occupation|| (Number.isInteger(s.job)?JOBS[s.job]?.[0]:'')||'';return /เวท|อาคม|พยากรณ์|คาถา|นักปราชญ์/.test(label)?'mage':/อัศวิน|ทหาร|องครักษ์|นักรบ|ยาม|ผู้กล้า/.test(label)?'guard':/เกษตร|ชาวนา|ชาวไร่|สวน|เลี้ยงสัตว์/.test(label)?'farmer':/ช่าง|ตีเหล็ก|ครัว|ปรุง|ขนม|เหมือง/.test(label)?'craft':/นักผจญภัย|พราน|สำรวจ|เดินทาง/.test(label)?'traveler':/นักบวช|นักพรต|ศาสนา/.test(label)?'priest':'casual'}
 function colors(v){return palettes[v.palette]}
 const box=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
 function garment(c,s,m,age,skin){const v=style(s,m),[base,trim,dark]=colors(v),r=role(s,m,age),cut=r==='mage'||r==='priest'?4:r==='guard'?7:r==='craft'?6:r==='farmer'?2:r==='traveler'?9:v.cut;
  if(age<1){box(c,4,22,16,3,base);box(c,7,29,10,2,trim);return}
  box(c,4,16,16,15,base);box(c,5,29,5,8,dark);box(c,15,29,5,8,dark);box(c,4,35,6,2,age<4?skin:dark);box(c,15,35,6,2,age<4?skin:dark);
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
  // Patterns occupy small panels so the face and silhouette remain readable.
  for(let i=0;i<4;i++){const x=5+i*4,y=21+(v.detail+i)%5;if(v.pattern===1)box(c,x,y,1,2,trim);if(v.pattern===2)box(c,x,22,2,1,trim);if(v.pattern===3)box(c,6,19+i*3,12,1,dark);if(v.pattern===4)box(c,6+i*3,18,1,10,trim);if(v.pattern===5)box(c,x,y,2,2,dark);if(v.pattern===6)box(c,7+i*3,20+i*2,2,2,trim);if(v.pattern===7)box(c,17,19+i*3,2,1,trim)}
  box(c,4,29,16,2,dark);box(c,10,29,3,2,trim);
  if(v.accessory===1){box(c,17,23,5,6,dark);box(c,18,24,3,1,trim)}
  if(v.accessory===2){box(c,3,17,2,11,trim);box(c,4,17,2,2,trim);box(c,6,19,2,2,trim);box(c,8,21,2,2,trim)}
  if(v.accessory===3){box(c,7,17,11,2,trim);box(c,16,19,3,6,trim)}
  if(v.accessory===4){box(c,17,18,4,7,dark);box(c,18,19,2,5,trim)}
  if(v.accessory===5){box(c,5,18,3,3,trim);box(c,6,19,1,1,dark)}
  if(v.accessory===6){box(c,19,25,3,5,trim);box(c,20,24,1,2,dark)}
  if(v.accessory===7&&age>=12){box(c,0,19,2,12,dark);box(c,1,19,3,2,trim)}
  if((s.rank||0)>=5&&age>=18){box(c,5,17,1,9,trim);box(c,18,17,1,9,trim);box(c,12,20,2,2,'#d1b16d')}
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
  if(age>=40&&age<60){b(4,5,2,4,'#acaaa0');b(18,5,2,4,'#acaaa0')}
 }
 function headwear(c,s,m,age,race){if(age<4||![0,1,2,3,4,11,12,26,27].includes(race))return;const v=style(s,m),[base,trim,dark]=colors(v),r=role(s,m,age),hat=r==='farmer'?1:r==='guard'?3:r==='mage'?4:v.hat;
  if(hat===1){box(c,0,1,24,3,trim);box(c,5,-3,14,4,base);box(c,6,0,12,1,dark)}
  if(hat===2){box(c,3,0,18,3,dark);box(c,6,-3,12,3,base);box(c,18,2,5,2,dark)}
  if(hat===3){box(c,4,-1,16,5,'#879791');box(c,11,-3,3,5,trim);box(c,4,3,2,5,dark);box(c,18,3,2,5,dark)}
  if(hat===4){box(c,2,1,20,3,dark);box(c,7,-2,11,4,base);box(c,10,-5,6,3,base);box(c,7,0,11,1,trim)}
  if(hat===5){box(c,3,2,18,2,trim);box(c,17,3,3,5,base)}
  if(hat===6){box(c,4,1,15,2,base);box(c,6,-1,3,2,trim);box(c,14,-1,3,2,trim)}
 }
 // Bodies without clothing retain their anatomy: markings, not human suits or hats.
 function native(c,s,m,age,race){if(age<1)return;const v=style(s,m),p=typeof Ecology!=='undefined'?Ecology.profile(race):null,[base,trim,dark]=colors(v),type=p?.body||'hands';
  if(p?.civic&&type==='hands'){box(c,6,18,13,3,base);box(c,8,21,2,7,trim);box(c,16,23,3,4,dark);return}
  const positions=type==='root'?[[5,12],[22,5],[14,29]]:type==='gel'?[[5,18],[18,26],[10,30]]:type==='wings'?[[1,17],[23,20],[12,29]]:['quad','fins'].includes(type)?[[1,22],[9,24],[16,23]]:[[8,18],[17,24],[10,29]];
  positions.forEach(([x,y],i)=>{const n=hash(v.key+i*97);box(c,x+(v.mark%3),y,(v.mark%3)+1,1+(n%3),i%2?base:trim);if(v.mark>3)box(c,x+3,y+2,2,1,dark)});
  if(type==='core'||type==='stone'){box(c,11,21,4,4,base);box(c,12,22,2,2,trim)}
 }
 return{style,identity,colors,role,garment,hair,headwear,native,palettes,hairColors};
})();
