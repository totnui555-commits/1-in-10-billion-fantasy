'use strict';
// Explicit profession catalog: no guessing that a beekeeper is a sailor because
// the Thai word for glowing contains the same letters as the word for boat.
const Workwear=(()=>{
 const groups={
  fighter:[0],mage:[1,11,14,20,63,73,78,102,109],alchemist:[2],smith:[3,80],diplomat:[4,19,34,43,70],merchant:[5,40,82,107],beastkeeper:[6,48,64,68,77,91,100,115,119],explorer:[7,62,74,88,99,103,104,118],cartographer:[8,44,66],ranger:[9],guard:[10,110],judge:[12,94],artist:[13,83,108,117],innkeeper:[15,61,97],farmer:[16,22,38,72,87,96,105,116,121],priest:[17,39],rogue:[18],sovereign:[21],engineer:[23,36,45,49,50,65,71,76,85,86,95,101,106,120],baker:[24],healer:[25,46,54,69,112],tailor:[26,89,98],courier:[27,93],scholar:[28,41,52,53,79,111],clerk:[29,55],carpenter:[30],potter:[31,51],driver:[32],sailor:[33,60,75],inspector:[35,56],waterkeeper:[37,47,57,81,92,114,122],cook:[42,58,67,90,113],miner:[],luthier:[59],tea:[84]
 };
 const base={fighter:'guard',mage:'mage',alchemist:'healer',smith:'craft',diplomat:'merchant',merchant:'merchant',beastkeeper:'farmer',explorer:'traveler',cartographer:'scholar',ranger:'traveler',guard:'guard',judge:'priest',artist:'artist',innkeeper:'merchant',farmer:'farmer',priest:'priest',rogue:'traveler',sovereign:'priest',engineer:'craft',baker:'cook',healer:'healer',tailor:'craft',courier:'traveler',scholar:'scholar',clerk:'scholar',carpenter:'craft',potter:'craft',driver:'traveler',sailor:'sailor',inspector:'scholar',waterkeeper:'sailor',cook:'cook',miner:'craft',luthier:'craft',tea:'cook'};
 const index=new Map;for(const [role,ids] of Object.entries(groups))for(const id of ids){if(index.has(id))throw Error('Duplicate workwear profession '+id);index.set(id,role)}
 const byLabel=new Map;
 function resolve(s,m,age){if(age<16)return null;const label=m?(m.occupation||''):(Number.isInteger(s.job)?JOBS[s.job]?.[0]:'');if(!label)return null;
  if(!m&&index.has(s.job))return index.get(s.job);
  if(!byLabel.size)for(const [i,r] of index)if(JOBS[i])byLabel.set(JOBS[i][0],r);
  if(byLabel.has(label))return byLabel.get(label);
  return /ตีเหล็ก|ตีอาวุธ|ตีเกราะ/.test(label)?'smith':/เหมือง|ขุดแร่/.test(label)?'miner':/เลี้ยง|ฟัก|ฝึกสัตว์/.test(label)?'beastkeeper':/ตัดเสื้อ|ทอผ้า|เย็บ|รองเท้า/.test(label)?'tailor':/แผนที่|สำรวจที่ดิน/.test(label)?'cartographer':/ส่งสาร|ส่งจดหมาย/.test(label)?'courier':/เจ้าของ.*ร้าน|พ่อค้า|แม่ค้า|บัญชี/.test(label)?'merchant':null;
 }
 function category(s,m,age){const r=resolve(s,m,age);return r?base[r]:null}
 function hats(s,m,age,fallback){const r=resolve(s,m,age),v=Wardrobe.style(s,m).hat;const choices=({smith:[5,7,11],engineer:[2,5,9],baker:[11,15],cook:[11,15],healer:[5,6],scholar:[0,2,7],clerk:[0,2,7],ranger:[2,12,15],explorer:[2,12,15],sailor:[2,5,15],courier:[2,5,12],farmer:[1,8,12,15],beastkeeper:[1,5,8],diplomat:[0,6,7],judge:[2,14],priest:[6,14,16],sovereign:[6,16],artist:[2,5,10]})[r];return choices?choices[v%choices.length]:fallback}
 // Role-aware dye channels. Clothing changes with the recorded job, not identity.
 const dyeFamilies={
  mage:{h:[258,277,224,302],s:46,l:39},healer:{h:[171,187,156,203],s:46,l:42},guard:{h:[211,352,224,194],s:43,l:37},farmer:{h:[99,125,43,23],s:40,l:37},craft:{h:[17,200,37,215],s:30,l:31},traveler:{h:[142,196,31,223],s:40,l:34},priest:{h:[274,220,169,329],s:40,l:40},merchant:{h:[338,265,31,202],s:48,l:36},artist:{h:[332,280,15,191],s:56,l:45},sailor:{h:[207,191,224,172],s:53,l:38},scholar:{h:[224,168,277,352],s:40,l:38},cook:{h:[18,199,342,114],s:42,l:42}
 };
 const dyeCache=new Map;
 function mix(n){n=Math.imul(n^(n>>>16),2246822507);return(n^(n>>>13))>>>0}
 function hex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return '#'+[f(0),f(8),f(4)].map(v=>v.toString(16).padStart(2,'0')).join('')}
 function dyes(s,m,age){const role=resolve(s,m,age),family=role&&base[role],def=dyeFamilies[family];if(!def)return null;
  const label=m?m.occupation:JOBS[s.job]?.[0],v=Wardrobe.style(s,m);let n=v.key;for(const ch of label||role)n=mix(n^ch.charCodeAt(0));const key=v.key+':'+label;if(dyeCache.has(key))return dyeCache.get(key);
  const at=i=>mix(n+i*104729),h=def.h[at(1)%def.h.length]+(at(2)%13)-6,sat=def.s+(at(3)%11)-5,light=def.l+(at(4)%11)-5;
  const capeHue=h+[25,-25,150,190][at(5)%4],trimHue=h+[38,175,215,320][at(6)%4],legHue=h+[15,165,205,325][at(7)%4];
  const d={shirt:hex(h,sat,light),trim:hex(trimHue,36+at(8)%22,65+at(9)%12),shade:hex(h,sat-9,Math.max(18,light-15)),cape:hex(capeHue,32+at(10)%17,26+at(11)%15),lower:hex(legHue,19+at(12)%22,26+at(13)%16),lowerShade:hex(legHue,20,20+at(14)%10),leather:hex([18,29,209,344][at(15)%4],20+at(16)%14,22+at(17)%12),accent:hex(trimHue,51,53+at(18)%15),metal:hex([204,213,32,178][at(19)%4],10+at(20)%10,56+at(21)%14),linen:hex(h,12+at(22)%10,82+at(23)%9)};
  if(dyeCache.size>=2048)dyeCache.clear();dyeCache.set(key,d);return d;
 }
 const b=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
 function uniform(c,s,m,age){const r=resolve(s,m,age);if(!r)return;const dye=Wardrobe.outfit(s,m,age),{shirt:a,trim:t,shade:d,metal,linen:paper}=dye;
  if(['smith','carpenter','potter','tailor','engineer','luthier','miner'].includes(r)){b(c,8,17,2,8,d);b(c,15,17,2,8,d);b(c,7,23,12,9,r==='potter'?a:d);b(c,9,25,8,3,t);b(c,9,29,2,2,t);b(c,15,29,2,2,t)}
  if(['baker','cook','tea','innkeeper'].includes(r)){b(c,8,18,9,14,paper);b(c,6,25,13,6,paper);b(c,9,26,7,1,t);b(c,10,19,2,3,a)}
  if(['mage','priest','judge'].includes(r)){b(c,4,28,17,7,a);b(c,5,33,15,2,t);b(c,10,17,4,17,t);b(c,11,20,2,3,d)}
  if(['guard','fighter'].includes(r)){b(c,3,16,6,4,metal);b(c,16,16,6,4,metal);b(c,6,20,12,8,metal);b(c,8,21,8,2,d);b(c,11,23,3,4,t);b(c,5,29,15,3,d)}
  if(r==='healer'||r==='alchemist'){b(c,4,17,5,14,paper);b(c,15,17,5,14,paper);b(c,11,19,2,4,t);b(c,10,20,4,2,t);b(c,16,25,3,3,a)}
  if(['diplomat','merchant','sovereign'].includes(r)){b(c,7,17,3,12,d);b(c,14,17,3,12,d);b(c,10,19,4,2,t);b(c,11,24,2,2,t);if(r==='sovereign'){b(c,4,17,2,11,t);b(c,19,17,2,11,t)}}
  if(r==='rogue'){b(c,4,18,16,4,d);b(c,6,22,4,8,d);b(c,15,22,4,8,d);b(c,5,28,15,2,t)}
  if(['scholar','clerk','cartographer','inspector'].includes(r)){b(c,5,18,3,13,d);b(c,17,18,3,13,d);b(c,10,19,4,3,paper);b(c,11,23,2,4,t)}
  if(r==='sailor'||r==='waterkeeper'){for(let y=18;y<27;y+=4)b(c,5,y,15,2,paper);b(c,4,16,17,2,d)}
  if(r==='artist'){b(c,4,17,17,3,t);b(c,17,20,3,8,t);b(c,7,24,3,3,d)}
  if(['farmer','beastkeeper','ranger'].includes(r)){b(c,5,18,2,11,d);b(c,17,18,2,11,d);b(c,7,25,11,5,t);b(c,8,26,3,2,a)}
  if(['explorer','courier','driver'].includes(r)){for(let i=0;i<6;i++)b(c,5+i*2,17+i*2,2,2,d);b(c,17,25,5,6,d);b(c,18,26,3,1,t)}
 }
 function equipment(c,s,m,age,race){const r=resolve(s,m,age);if(!r)return;const p=typeof Ecology==='undefined'?null:Ecology.profile(race);if(p&&(!p.civic||!p.grasp))return;const {shirt:a,accent:t,leather:d,metal,linen:paper}=Wardrobe.outfit(s,m,age),wood='#7f644b',ink='#35453f';
  // Compact tools stay within portrait bounds and do not imply inventory/stat grants.
  if(['smith','engineer','carpenter'].includes(r)){b(c,24,23,2,13,wood);b(c,21,21,8,4,metal);if(r==='engineer'){b(c,22,21,2,2,ink);b(c,26,21,2,2,ink)}}
  if(r==='potter'){b(c,22,26,6,7,t);b(c,23,24,4,2,a);b(c,24,25,2,1,d)}
  if(r==='tailor'){b(c,23,23,1,10,metal);b(c,27,23,1,10,metal);b(c,22,31,3,3,t);b(c,26,31,3,3,t)}
  if(r==='miner'){b(c,24,22,2,14,wood);b(c,20,21,9,2,metal);b(c,20,23,2,2,metal)}
  if(r==='artist'||r==='luthier'){b(c,24,20,2,9,wood);b(c,21,28,8,7,wood);b(c,23,26,4,9,t);b(c,24,29,2,3,ink)}
  if(['scholar','judge','clerk'].includes(r)){b(c,22,26,7,9,d);b(c,23,27,5,7,paper);b(c,24,28,3,1,ink);b(c,24,30,3,1,ink)}
  if(r==='cartographer'||r==='inspector'){b(c,22,25,7,10,paper);b(c,24,27,1,5,d);b(c,23,31,4,1,a);b(c,27,26,1,5,a)}
  if(['mage','priest'].includes(r)){b(c,25,20,2,17,wood);b(c,23,17,6,5,t);b(c,25,18,2,2,a)}
  if(['healer','alchemist'].includes(r)){b(c,23,27,6,8,d);b(c,24,28,4,5,t);b(c,25,25,2,3,wood);b(c,25,29,2,3,paper)}
  if(['fighter','guard'].includes(r)){b(c,24,21,2,13,metal);b(c,22,30,6,2,t);b(c,24,32,2,5,wood);if(r==='guard'){b(c,-3,24,6,9,d);b(c,-2,25,4,7,t);b(c,-1,26,2,4,a)}}
  if(['farmer','ranger'].includes(r)){b(c,25,21,2,16,wood);if(r==='farmer'){b(c,22,20,7,2,metal);b(c,22,22,2,3,metal)}else{b(c,22,22,1,12,wood);b(c,23,20,3,1,wood);b(c,23,35,3,1,wood)}}
  if(r==='beastkeeper'){b(c,23,28,6,7,t);b(c,24,27,4,1,d);b(c,24,30,1,2,a);b(c,27,31,1,2,a)}
  if(['baker','cook','tea'].includes(r)){b(c,25,23,2,12,wood);if(r==='baker'){b(c,23,21,5,6,paper);b(c,24,22,1,3,wood)}else{b(c,23,21,6,3,metal);b(c,24,24,4,2,metal)}}
  if(['merchant','diplomat','innkeeper','sovereign'].includes(r)){b(c,22,28,7,7,d);b(c,23,26,5,3,t);b(c,24,30,3,3,t);b(c,25,31,1,1,paper)}
  if(['explorer','courier','driver','sailor','waterkeeper','rogue'].includes(r)){b(c,22,26,7,9,d);b(c,23,27,5,7,a);b(c,24,29,3,1,t);if(r==='courier'){b(c,23,28,5,4,paper);b(c,25,30,1,1,d)}if(r==='sailor'||r==='waterkeeper'){b(c,24,28,3,5,t);b(c,25,27,1,7,ink)}}
 }
 return{groups,base,resolve,category,hats,uniform,equipment,dyes,dyeFamilies};
})();
