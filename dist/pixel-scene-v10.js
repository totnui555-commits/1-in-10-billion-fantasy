'use strict';
const Illustration=(()=>{
let sceneTime=0,actorWalking=false;
const P=[
 {sky:'#d1a56e',far:'#9c915d',near:'#778457',ground:'#b08a55',roof:'#736546'},
 {sky:'#8ba68e',far:'#627c65',near:'#405f4d',ground:'#6e845e',roof:'#514e3f'},
 {sky:'#4c4869',far:'#544e70',near:'#38374f',ground:'#493e52',roof:'#302d42'},
 {sky:'#93a1a0',far:'#747c77',near:'#505c59',ground:'#76735e',roof:'#4b4e4b'},
 {sky:'#8faeb2',far:'#66868d',near:'#456b72',ground:'#597981',roof:'#586a70'},
 {sky:'#d2a8a0',far:'#8d7482',near:'#665771',ground:'#9d7083',roof:'#585169'},
 {sky:'#4e99a0',far:'#287887',near:'#1f596e',ground:'#225c73',roof:'#194d64'},
 {sky:'#ae806c',far:'#725d54',near:'#4c5350',ground:'#74624e',roof:'#4c4942'}
];
function palette(k){return (k>=8&&typeof FrontierRealms!=='undefined'?FrontierRealms.definitions[k-8]?.palette:null)||P[k]||P[0]}
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
const poly=(c,points,col)=>{c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
const mix=n=>{n=Math.imul(n^(n>>>16),2246822507);return (n^(n>>>13))>>>0};
function silhouette(c,x,y,w,h,col,seed=1){rect(c,x,y,w,h,col);rect(c,x-2,y+5,2,Math.floor(h*.4),col);rect(c,x+w,y+7,2,Math.floor(h*.3),col);rect(c,x+Math.floor(w*.2),y+h,Math.max(2,Math.floor(w*.24)),6,'#303d39');rect(c,x+Math.floor(w*.62),y+h,Math.max(2,Math.floor(w*.24)),6,'#303d39');if(seed%2)rect(c,x+w,y+1,Math.max(2,Math.floor(w*.3)),3,col)}
// Ages here are biological equivalents, so a long-lived race grows at its own pace.
function lifeLook(age){
 const years=Math.max(0,Number(age)||0);
 return years<1?{stage:'baby',height:.48,pace:1.2}:years<4?{stage:'toddler',height:.59+years*.018,pace:3.4}:years<12?{stage:'child',height:.68+(years-4)*.022,pace:3.2}:years<18?{stage:'teen',height:.86+(years-12)*.023,pace:2.8}:years<40?{stage:'adult',height:1,pace:2.5}:years<60?{stage:'middle',height:.99,pace:1.9}:years<75?{stage:'elder',height:.93,pace:1.2}:{stage:'elder',height:.88,pace:.85};
}
function memberAge(s,m){const lifespan=RACES[m.race]?.[2]||85;return Engine.ageEquivalent(m.alive?FamilyWorld.age(s,m):m.deathAge??FamilyWorld.age(s,m),m.race)}
function household(s){return Array.isArray(s.household?.members)?s.household.members:[]}
function drawRemembrance(c,x,y,scale=1,s=null){if(s&&s.race!==0){const p=Ecology.profile(s);if(p.water||p.strict||!Ecology.organic(s)){c.save();c.translate(x,y);c.scale(scale,scale);rect(c,1,18,27,2,'#788878');if(p.water){for(let i=0;i<4;i++){rect(c,5+i*5,11-i%2*4,2,2,'#c5d5bb');rect(c,7+i*4,20,1,4,'#8eaca0')}}else if(['seed','spore','bud'].includes(p.origin)){rect(c,13,7,2,13,'#7c9271');rect(c,7,9,7,3,'#b0bc8c');rect(c,15,5,6,3,'#b0bc8c')}else{rect(c,7,14,7,5,'#9aa58c');rect(c,16,10,5,8,'#c5c3a2');rect(c,12,4,2,3,'#d5d2a8')}c.restore();return}}c.save();c.translate(x,y);c.scale(scale,scale);rect(c,0,14,28,4,'#665a48');rect(c,3,18,3,7,'#514f43');rect(c,22,18,3,7,'#514f43');rect(c,3,8,11,6,'#d1be8a');rect(c,4,9,9,1,'#8f8666');rect(c,19,3,4,11,'#e4d4a4');rect(c,20,-1,2,4,'#edc478');rect(c,18,13,6,2,'#938466');rect(c,9,4,3,4,'#9dac80');c.restore()}
function drawUnusual(c,x,y,scale,s,age,race,look,member=null){
 if(![36,37,38,39,40,41,43,44].includes(race))return false;
 const profile=lifeLook(age),young=age<4,skin=RACES[race]?.[3]||'#9cac8a',beat=Math.floor(sceneTime*4)%4,bob=beat===1?1:0;
 c.save();c.translate(Math.round(x),Math.round(y+37*scale*(1-profile.height))+bob);c.scale(scale*profile.height,scale*profile.height);rect(c,-7,34,40,3,'#26353245');
 if(race===36){
  if(age<1){rect(c,4,11,18,23,'#d4c6a2');rect(c,7,6,12,7,'#dfd1ae');rect(c,10,9,3,7,skin);rect(c,17,18,3,3,skin);rect(c,6,25,3,3,skin)}else{
   poly(c,[[-13,30],[-19,17],[-6,23],[4,18],[27,18],[34,25],[33,33],[7,34],[-1,30]],skin);rect(c,23,6,14,21,skin);rect(c,29,13,13,10,skin);rect(c,36,14,8,7,skin);rect(c,27,10,3,3,'#e7d28d');rect(c,28,10,1,2,'#303a32');poly(c,[[24,8],[20,1],[29,5]],'#dfcc9e');poly(c,[[31,8],[35,0],[35,10]],'#dfcc9e');
   const flap=beat%2;poly(c,[[4,23],[-1,5-flap*3],[9,10],[20,1+flap*3],[19,23]],'#748c7f');poly(c,[[6,21],[6,10],[12,15],[18,8],[16,22]],'#a4b39b');rect(c,4,29,6,8,skin);rect(c,25,28,6,9,skin);rect(c,4,35,9,2,'#ded0a4');rect(c,25,35,9,2,'#ded0a4');for(let i=0;i<4;i++)rect(c,-1+i*6,17-i%2*2,3,3,'#b5bb8d');if(beat===2)rect(c,43,16,2,2,'#d1b178')}
 }else if(race===37){
  const wing=beat%2,fire=young?'#c7a46d':'#ce9b69';poly(c,[[9,18],[-9,4+wing*5],[-5,23],[7,27]],'#b97560');poly(c,[[16,18],[35,3+wing*6],[30,25],[19,28]],'#cfa066');rect(c,7,15,13,16,fire);rect(c,9,6,11,12,'#d6b176');poly(c,[[10,6],[9,0],[15,4],[20,-1],[19,8]],'#d6a16c');rect(c,15,10,2,2,'#3d4539');poly(c,[[19,12],[26,14],[20,16]],'#e1c789');for(let i=0;i<3;i++)poly(c,[[9+i*4,28],[3+i*8,38],[13+i*4,32]],['#d5ab72','#b97861','#e2c58e'][i]);rect(c,9,30,2,5,'#b6a77f');rect(c,17,30,2,5,'#b6a77f');
 }else if(race===38){
  c.globalAlpha=.85;poly(c,[[-3,34],[-6,27],[-3,17],[3,11],[19,10],[27,18],[30,29],[26,35]],'#93c9bd');c.globalAlpha=1;poly(c,[[10,17],[16,22],[12,30],[6,24]],'#d4e5be');rect(c,0,21,2,3,'#3a665a');rect(c,20,21,2,3,'#3a665a');rect(c,6,13,8,2,'#c8e7d0');rect(c,-3,31,28,2,'#73afa6');
 }else if(race===39||race===40){
  rect(c,2,1,13,12,skin);rect(c,1,0,15,5,'#64564a');rect(c,5,6,2,2,'#303b34');rect(c,11,6,2,2,'#303b34');rect(c,4,12,9,16,'#849573');rect(c,0,15,4,10,skin);rect(c,13,15,4,10,skin);
  if(race===39){rect(c,-8,23,35,9,'#98775e');rect(c,-7,29,4,8,'#6b5b48');rect(c,2,30,4,7,'#6b5b48');rect(c,19,29,4,8,'#6b5b48');rect(c,27,23,6,3,'#5b5043');rect(c,31,25,2,7,'#5b5043')}else{poly(c,[[-8,23],[4,20],[24,22],[30,31],[19,35],[-1,34],[-10,29]],'#7c6c82');for(let i=0;i<4;i++){poly(c,[[-6,25+i*2],[-18-i*2,18+i*5],[-19-i*2,35],[-16-i*2,35],[-15-i*2,23+i*4]],'#645c69');poly(c,[[24,25+i*2],[36+i*2,18+i*5],[37+i*2,35],[34+i*2,35],[33+i*2,23+i*4]],'#645c69')}}
 }else if(race===41){
  rect(c,4,2,14,13,skin);rect(c,2,0,18,5,'#526b70');rect(c,2,4,4,12,'#526b70');rect(c,16,4,4,12,'#526b70');rect(c,7,7,2,2,'#354e47');rect(c,14,7,2,2,'#354e47');rect(c,7,15,10,12,'#a1c8b4');rect(c,3,17,4,11,skin);rect(c,17,17,4,11,skin);poly(c,[[7,26],[17,26],[24,30],[21,35],[3,35],[-4,30],[-9,35],[-11,28],[0,27],[9,31]],'#72a89d');rect(c,6,29,11,2,'#b0cfb3');
 }else if(race===43){
  rect(c,4,12,14,21,'#c4c1a1');poly(c,[[-6,14],[0,2],[9,-3],[23,1],[30,13]],'#9b8682');rect(c,-5,13,35,4,'#d2bd9c');rect(c,1,5,4,3,'#dcd3b1');rect(c,17,3,5,4,'#dcd3b1');rect(c,7,20,2,3,'#4e5547');rect(c,14,20,2,3,'#4e5547');rect(c,1,25,4,5,'#b4b49b');rect(c,18,25,4,5,'#b4b49b');rect(c,4,33,5,3,'#a1a88e');rect(c,14,33,5,3,'#a1a88e');
 }else if(race===44){
  const sway=Math.round(Math.sin(sceneTime*2)*2);rect(c,8,0+sway,3,7,'#c0b68c');rect(c,0,7+sway,27,3,'#697b70');rect(c,3,10+sway,21,21,'#d5c58e');rect(c,6,13+sway,15,15,'#ead9a4');rect(c,0,31+sway,27,3,'#697b70');rect(c,8,34+sway,2,3,'#b9d1af');rect(c,18,34+sway,2,3,'#b9d1af');rect(c,8,18+sway,2,3,'#58685a');rect(c,17,18+sway,2,3,'#58685a');poly(c,[[4,34+sway],[2,43+sway],[10,37+sway]],'#a9c3ac');poly(c,[[21,34+sway],[25,43+sway],[15,37+sway]],'#a9c3ac');
 }
 Wardrobe.native(c,s,member,age,race);
 Workwear.equipment(c,s,member,age,race);
 c.restore();return true;
}
function drawCompanion(c,x,y,scale,pet){
 if(!pet)return;const entry=typeof LifeChoices!=='undefined'?LifeChoices.petCatalog?.find(p=>p.id===pet.speciesId||p.name===pet.name):null;
 const label=pet.name||'',shape=entry?.shape||(/สไลม์/.test(label)?'slime':/มังกร/.test(label)?'dragon':/นก|เหยี่ยว/.test(label)?'bird':/แมว/.test(label)?'cat':/สุนัข|หมา/.test(label)?'dog':'fox');
 const f=Math.floor(sceneTime*4)%4;c.save();c.translate(x,y+(f===1?1:0));c.scale(scale,scale);rect(c,0,18,26,2,'#26353232');
 const skin=({cat:'#bba884',dog:'#a78d6e',fox:'#c29b6b',wolf:'#8b9992',rabbit:'#d1cab0',rat:'#a7a197',dragon:'#829f83',golem:'#9ba88e',deer:'#b7a277',horse:'#a38b72',unicorn:'#d5d0b5',slime:'#91c8b5',frog:'#8ca775',turtle:'#91a078',snake:'#9cad7d',bird:'#a3b6a1',owl:'#a39480',phoenix:'#cbaa77',griffin:'#b7ac86',bat:'#8c8199',moth:'#c2b598',butterfly:'#b6a2ba',elemental:'#acc9b2',axolotl:'#c9b5b4'})[shape]||'#aaa888';
 if(['cat','dog','fox','wolf','rabbit','rat'].includes(shape)){
  rect(c,1,6,18,11,skin);rect(c,15,1,11,12,skin);rect(c,4,16,3,4,'#6b6d55');rect(c,16,16,3,4,'#6b6d55');rect(c,20,6,2,2,'#344b3d');
  if(shape==='rabbit'){rect(c,16,-9,3,12,skin);rect(c,23,-10,3,13,skin);rect(c,17,-6,1,6,'#b99992');rect(c,-2,8,5,6,'#e0dbc4')}else if(shape==='rat'){rect(c,13,0,5,5,skin);rect(c,22,0,5,5,skin);rect(c,-5,14,8,2,'#bca491');rect(c,-7,10,2,5,'#bca491')}else if(shape==='dog'){rect(c,15,1,3,11,'#796b55');rect(c,24,2,3,8,'#796b55');rect(c,-2,3,3,9,skin)}else{poly(c,[[15,4],[15,-4],[20,2]],skin);poly(c,[[21,3],[26,-4],[26,6]],skin);poly(c,[[1,8],[-9,2],[-5,13],[3,14]],skin);if(shape==='fox')rect(c,-9,2,5,4,'#e1d3ad');if(shape==='wolf')rect(c,18,11,10,4,'#aeb9a6')}
 }else if(['dragon','griffin','horse','unicorn','deer'].includes(shape)){
  rect(c,1,7,21,10,skin);rect(c,19,0,7,15,skin);rect(c,23,3,7,7,skin);rect(c,25,4,2,2,'#3d4d3d');rect(c,3,17,3,7,'#646750');rect(c,18,17,3,7,'#646750');poly(c,[[2,7],[-5,2],[-3,12],[3,13]],skin);
  if(shape==='dragon'||shape==='griffin'){poly(c,[[4,10],[-4,-2],[5,2],[13,-4],[14,12]],shape==='dragon'?'#a2b28f':'#d7d0ad');poly(c,[[21,1],[23,-5],[25,2]],'#d2c79a')}if(shape==='unicorn')poly(c,[[25,0],[30,-9],[27,3]],'#d5c488');if(shape==='deer'){rect(c,20,-8,2,9,'#c8b78f');rect(c,16,-5,5,2,'#c8b78f');rect(c,26,-9,2,10,'#c8b78f');rect(c,27,-6,4,2,'#c8b78f')}if(shape==='horse')rect(c,17,0,3,12,'#67594c');
 }else if(['bird','owl','phoenix','bat','butterfly','moth'].includes(shape)){
  const flap=f%2?3:-2;poly(c,[[10,8],[-2,1+flap],[-6,12+flap],[8,18]],skin);poly(c,[[17,8],[29,1+flap],[33,12+flap],[18,18]],skin);rect(c,8,4,12,15,skin);rect(c,10,0,10,9,skin);rect(c,12,4,2,2,'#34473b');rect(c,18,4,2,2,'#34473b');if(shape==='owl'){rect(c,9,2,6,6,'#d8d4b2');rect(c,16,2,6,6,'#d8d4b2');rect(c,11,4,2,2,'#34473b');rect(c,18,4,2,2,'#34473b')}if(shape==='phoenix'){poly(c,[[9,17],[3,27],[13,22],[19,27],[19,18]],'#d2a274');rect(c,14,-5,3,6,'#d3b272')}if(shape==='bat'){poly(c,[[10,2],[8,-4],[14,0]],skin);poly(c,[[16,2],[22,-4],[20,5]],skin)}if(shape==='butterfly'||shape==='moth'){rect(c,13,1,3,18,'#797c65');for(let i=0;i<3;i++){rect(c,1+i*3,7+i%2*5,2,2,'#dfd2ac');rect(c,22+i*3,7+i%2*5,2,2,'#dfd2ac')}}
 }else if(shape==='slime'||shape==='elemental'){
  c.globalAlpha=.82;poly(c,[[0,19],[-1,11],[5,3],[18,1],[27,9],[29,18],[22,22],[6,22]],skin);c.globalAlpha=1;rect(c,7,9,2,3,'#386451');rect(c,20,9,2,3,'#386451');rect(c,10,4,7,2,'#dbebcd');if(shape==='elemental')for(let i=0;i<3;i++)rect(c,i*11-2,0-(f+i)%4*2,3,3,'#cce2b8');
 }else if(shape==='snake'){rect(c,0,14,21,6,skin);rect(c,19,5,7,13,skin);rect(c,20,2,12,8,skin);rect(c,28,4,2,2,'#3c5440');rect(c,5,13,11,2,'#c2cba1')}
 else if(shape==='turtle'){poly(c,[[0,17],[3,5],[17,3],[25,9],[25,18]],'#7b8c62');rect(c,22,12,10,7,skin);rect(c,29,14,1,1,'#3b4d39');for(let i=0;i<3;i++)rect(c,5+i*6,7+i%2*4,4,4,'#a6b48b');rect(c,3,18,4,3,skin);rect(c,19,18,4,3,skin)}
 else if(shape==='frog'||shape==='axolotl'){rect(c,3,8,23,12,skin);rect(c,4,3,8,9,skin);rect(c,18,3,8,9,skin);rect(c,7,5,2,2,'#3c523f');rect(c,21,5,2,2,'#3c523f');rect(c,-2,16,9,5,skin);rect(c,23,16,9,5,skin);if(shape==='axolotl'){for(let i=0;i<3;i++){rect(c,-4+i,3+i*4,7,2,'#b89197');rect(c,27,3+i*4,7,2,'#b89197')}}}
 else if(shape==='fish'){poly(c,[[3,12],[9,5],[21,4],[29,12],[21,19],[8,18]],'#abc3ad');poly(c,[[4,10],[-3,4],[-3,22],[5,16]],'#8da9a5');rect(c,22,8,2,2,'#384d40');for(let i=0;i<3;i++)rect(c,11+i*4,7,1,10,'#c9d7b8')}
 else if(['beetle','spider','crab'].includes(shape)){const col=shape==='crab'?'#b59b82':shape==='spider'?'#847b8e':'#9da879';rect(c,5,6,20,13,col);rect(c,10,1,11,9,col);rect(c,12,4,2,2,'#3e4d3d');rect(c,18,4,2,2,'#3e4d3d');for(let i=0;i<(shape==='spider'?4:3);i++){rect(c,-2-i%2*3,7+i*4,8,2,col);rect(c,24,7+i*4,8+i%2*3,2,col)}if(shape==='crab'){rect(c,-4,-1,8,8,col);rect(c,27,-1,8,8,col)}if(shape==='beetle')rect(c,14,6,1,13,'#5f7358')}
 else if(shape==='octopus'){rect(c,6,0,18,15,'#b2a0aa');for(let i=0;i<5;i++){rect(c,i*7-1,13,5,9-(i+f)%3,'#b2a0aa')}rect(c,10,6,2,3,'#495648');rect(c,18,6,2,3,'#495648')}
 else if(shape==='mushroom'){rect(c,10,6,11,14,'#d3c6a2');poly(c,[[0,7],[6,-1],[17,-4],[29,6],[29,10],[0,10]],'#aa8d84');rect(c,5,3,4,3,'#e3d6b1');rect(c,19,2,4,3,'#e3d6b1');rect(c,12,13,2,2,'#555f48');rect(c,18,13,2,2,'#555f48')}
 else if(shape==='golem'){rect(c,5,0,20,14,skin);rect(c,8,15,15,9,skin);rect(c,0,14,6,7,skin);rect(c,25,14,6,7,skin);rect(c,9,4,3,3,'#d7dfad');rect(c,18,4,3,3,'#d7dfad');rect(c,10,22,4,3,'#5f775b');rect(c,19,22,4,3,'#5f775b')}
 else{rect(c,4,5,19,14,skin);rect(c,6,0,15,8,skin);rect(c,10,4,2,2,'#3f5641')}
 c.restore();
}


function drawFrontier(c,x,y,scale,s,age,race,look,member=null){
 if(race<48||race>71)return false;
 const p=lifeLook(age),skin=RACES[race][3],cloth=Wardrobe.outfit(s,member,age).shirt,ink='#35433f',light='#e2d3ad',beat=Math.floor(sceneTime*p.pace)%4,bob=beat===1?1:0;
 c.save();c.translate(Math.round(x),Math.round(y+37*scale*(1-p.height))+bob);c.scale(scale*p.height,scale*p.height);
 rect(c,-4,35,36,2,'#283b3540');
 if(age<1){rect(c,4,12,17,22,'#d8cfad');rect(c,7,7,11,7,skin);rect(c,3,23,19,4,cloth);rect(c,8,10,2,2,ink);rect(c,15,10,2,2,ink);if([49,54,55,56,57,69].includes(race)){rect(c,5,8,15,25,'#d6cfaf');rect(c,8,5,9,4,'#e6debf');rect(c,9,16,3,4,skin);rect(c,15,25,3,3,skin)}c.restore();return true}
 if([51,54,55,57].includes(race)){
  rect(c,-5,18,35,13,skin);rect(c,20,5,13,17,skin);rect(c,27,11,9,8,skin);rect(c,25,9,2,2,ink);for(const dx of [-3,6,20,27])rect(c,dx,28+(beat%2&&dx===6?1:0),4,8,skin);poly(c,[[-5,19],[-14,9],[-11,26],[-4,28]],skin);
  if(race===51){poly(c,[[19,9],[15,25],[22,21],[22,5]],'#476b70');rect(c,0,21,24,2,'#b1d4bd');rect(c,30,4,5,5,'#5f9691')}
  if(race===54){poly(c,[[-2,19],[-17,3],[-12,24],[3,25]],'#a38c69');rect(c,17,2,18,4,'#c4a25a');rect(c,18,5,3,14,'#698c96');rect(c,31,5,3,14,'#698c96');rect(c,19,6,14,8,skin)}
  if(race===55){poly(c,[[27,7],[30,-5],[31,7]],light);for(let i=0;i<5;i++)rect(c,-1+i*6,22,3,3,'#c2cda7');rect(c,7,34,5,2,light);rect(c,23,34,5,2,light);rect(c,14,10,4,14,'#768f82')}
  if(race===57){poly(c,[[-10,23],[-20,15],[-17,31],[-5,31]],skin);poly(c,[[1,18],[10,7],[12,18]],'#a2bfba');for(let i=0;i<4;i++)rect(c,i*6,27,4,2,'#b4d4cd');rect(c,19,30,13,4,skin)}
 }else if(race===58){
  rect(c,-1,13,28,21,'#937458');rect(c,-3,10,32,7,'#b39670');rect(c,1,17,24,9,ink);for(let i=0;i<5;i++)rect(c,2+i*5,17,3,4,light);rect(c,10,13,5,12,'#d0b277');rect(c,4,6,3,3,ink);rect(c,20,6,3,3,ink);rect(c,3,33,4,4,ink);rect(c,21,33,4,4,ink);if(beat===1)rect(c,5,23,19,3,'#ba8584');
 }else if([49,56].includes(race)){
  poly(c,[[5,15],[-12,5+beat*2],[-8,26],[5,27]],skin);poly(c,[[18,15],[37,4+beat*2],[31,27],[17,26]],skin);rect(c,5,13,15,18,cloth);rect(c,6,3,13,12,skin);rect(c,14,7,2,2,ink);poly(c,[[18,8],[25,11],[18,13]],light);rect(c,7,30,3,7,light);rect(c,17,30,3,7,light);
  if(race===49){rect(c,5,1,14,4,'#755f59');rect(c,5,4,3,10,'#755f59');for(let i=0;i<3;i++)rect(c,-5+i*5,20+i,3,7,light)}else{poly(c,[[7,4],[5,-4],[12,2],[18,-5],[18,6]],'#d6c57e');poly(c,[[30,14],[37,9],[33,20],[39,19],[29,31]],'#dfd39c');rect(c,8,19,11,2,'#e2d7ac')}
 }else{
  // A shared readable body with a different silhouette and facial construction for each people.
  Wardrobe.back(c,s,member,age);
  rect(c,4,15,16,16,cloth);rect(c,3,3,18,13,skin);rect(c,1,19,4,11,skin);rect(c,20,18,4,11,skin);rect(c,5,29,5,8,ink);rect(c,15,29,5,8,ink);rect(c,7,7,2,2,ink);rect(c,15,7,2,2,ink);rect(c,8,12,8,1,'#8a7b6d');rect(c,4,1,16,3,'#77685d');
  Wardrobe.garment(c,s,member,age,skin);
  if(race===48){poly(c,[[3,6],[-3,-2],[8,3]],skin);poly(c,[[18,4],[25,-1],[22,9]],skin);rect(c,18,10,9,6,skin);poly(c,[[19,28],[32,31],[27,35],[20,32]],skin);rect(c,7,17,4,7,'#c5a66f')}
  if(race===50){rect(c,-1,15,5,20,'#6a7f83');rect(c,21,15,5,20,'#6a7f83');rect(c,6,3,13,3,'#687b7d');rect(c,2,30,22,4,'#8fa9ad');rect(c,7,24,9,1,light)}
  if(race===52){poly(c,[[3,18],[-12,6],[-10,27],[4,28]],'#707e83');poly(c,[[21,18],[34,5],[31,28],[20,28]],'#707e83');poly(c,[[3,4],[0,-5],[9,3]],skin);poly(c,[[16,3],[23,-4],[21,6]],skin);rect(c,11,23,1,7,'#69767a')}
  if(race===53){rect(c,5,5,15,6,skin);rect(c,9,6,7,4,light);rect(c,12,6,2,3,ink);rect(c,-1,17,5,14,skin);rect(c,22,16,5,15,skin);rect(c,5,17,14,4,'#aa8c70')}
  if(race===59){rect(c,2,0,20,5,'#b69c91');rect(c,3,4,3,15,'#b69c91');rect(c,19,4,3,15,'#b69c91');rect(c,9,2,1,7,'#b49b67');rect(c,10,10,1,5,'#b49b67');rect(c,8,18,8,3,'#ddc8b7');rect(c,3,28,20,4,'#ba9e98')}
  if(race===60){rect(c,2,0,21,4,'#6f6b7e');rect(c,0,15,5,20,'#6f6b7e');rect(c,21,15,5,20,'#6f6b7e');rect(c,9,19,6,6,'#a4c6b3');rect(c,7,6,3,3,'#74b6ac');rect(c,15,6,3,3,'#74b6ac');rect(c,9,11,7,3,'#657077')}
  if(race===61){rect(c,3,0,18,16,cloth);rect(c,8,5,10,9,ink);rect(c,0,18,12,12,skin);rect(c,3,20,2,2,ink);rect(c,9,20,2,2,ink);rect(c,10,14,6,3,'#c7ae83');rect(c,15,1,2,5,'#cbbe99')}
  if(race===62){poly(c,[[3,3],[1,26],[-3,35],[9,32],[14,37],[20,32],[26,35],[22,3]],skin);rect(c,7,7,2,3,'#6c7680');rect(c,15,7,2,3,'#6c7680');rect(c,10,14,5,4,'#9b9fa8');rect(c,5,2,15,3,'#e5e4d0')}
  if(race===63){poly(c,[[5,27],[22,27],[12,35],[24,35],[17,39],[1,34]],'#79a3ad');rect(c,4,29,18,8,skin);rect(c,1,-1,22,5,'#72939e');rect(c,10,-3,5,5,'#d3bd77');rect(c,10,18,4,5,'#d3bd77')}
  if(race===64){rect(c,3,1,18,16,'#e0d1a7');rect(c,7,-2,11,5,'#e0d1a7');rect(c,12,-7,2,7,ink);poly(c,[[12,-7],[9,-12-beat%2],[13,-18],[17,-11],[15,-6]],'#e5bd6d');rect(c,3,18,4,10,'#d6c69e');rect(c,17,4,3,7,'#c6b48c')}
  if(race===65){for(let i=0;i<5;i++){rect(c,2+i*4,2+(i%2),5,13,skin);rect(c,2+i*4,25+(i%2)*4,4,8,skin)}rect(c,1,16,24,15,'#898396');rect(c,6,3-beat,14,3,'#c4bdca')}
  if(race===66){poly(c,[[4,4],[0,-4],[10,3]],skin);poly(c,[[16,3],[24,-3],[21,6]],skin);rect(c,5,10,16,5,ink);for(let i=0;i<4;i++)rect(c,6+i*4,10,2,2,light);rect(c,9,21,7,7,'#d4ba8c')}
  if(race===67){rect(c,4,2,17,13,'#b7a46e');rect(c,8,4,9,9,'#d7d1b5');rect(c,12,5,1,5,ink);rect(c,12,9,4,1,ink);rect(c,8,19,9,9,'#b49d63');rect(c,11,22,3,3,'#e0d0a0');rect(c,22,21,5,3,'#c7b779')}
  if(race===68){rect(c,1,0,23,5,'#e0e4d4');rect(c,2,4,3,18,'#e0e4d4');rect(c,20,4,3,18,'#e0e4d4');rect(c,5,17,15,4,'#91b4c0');for(let i=0;i<3;i++)rect(c,7+i*5,23,2,2,'#e4e8dc')}
  if(race===69){poly(c,[[3,4],[-2,-5],[2,-5],[6,3],[8,-10],[11,-9],[9,4]],'#d7b5a7');poly(c,[[18,4],[19,-7],[22,-5],[22,4],[28,-1],[29,2],[23,8]],'#b8868d');rect(c,5,20,15,2,'#b4c9ae');rect(c,24,27,4,4,'#e4c4ae')}
  if(race===70){rect(c,5,-2,3,7,skin);rect(c,16,-2,3,7,skin);rect(c,2,1,21,4,'#8b765f');rect(c,10,6,4,4,ink);rect(c,-2,22,5,3,skin);rect(c,24,22,5,3,skin);rect(c,8,17,9,2,'#c8b58a')}
  if(race===71){for(let row=0;row<4;row++)for(let i=0;i<4;i++)poly(c,[[2+i*5,2+row*6],[7+i*5,2+row*6],[4+i*5,7+row*6]],row<2?'#a7987c':'#8c846b');rect(c,16,8,8,6,skin);rect(c,18,8,2,2,ink);poly(c,[[21,24],[31,31],[24,33]],'#9b8b70')}
 }
 if(p.stage==='elder'&&(typeof Ecology==='undefined'||Ecology.profile(race).grasp)){rect(c,24,24,2,13,'#7f7257');rect(c,22,23,5,2,'#7f7257')}
 Wardrobe.native(c,s,member,age,race);
 Workwear.equipment(c,s,member,age,race);
 c.restore();return true;
}

function drawEcologyBody(c,x,y,scale,s,age,race,look,member=null){
 if(![8,13,16,22,30,32,33,50,57,63,65,68,69].includes(race))return false;
 const p=lifeLook(age),skin=RACES[race][3],ink='#304840',light='#d3dfbc',beat=Math.floor(sceneTime*2)%4,bob=Math.round(Math.sin(sceneTime*1.7)*1.2);
 c.save();c.translate(Math.round(x),Math.round(y+37*scale*(1-p.height))+bob);c.scale(scale*p.height,scale*p.height);
 if(race===8){
  poly(c,[[7,17],[20,17],[21,25],[17,32],[24,35],[34,30],[34,37],[23,41],[11,34],[9,28]],'#71a4a3');poly(c,[[32,32],[38,25],[41,31],[36,36],[43,38],[37,42],[32,37]],'#9ac5b7');
  rect(c,7,14,13,9,skin);rect(c,8,3,12,12,skin);rect(c,7,1,14,4,'#647e7c');rect(c,6,4,3,10,'#647e7c');rect(c,19,4,3,9,'#647e7c');rect(c,10,7,2,2,ink);rect(c,16,7,2,2,ink);poly(c,[[6,17],[-1,22],[3,24],[9,20]],skin);poly(c,[[20,18],[27,22],[24,25],[18,21]],skin);for(let i=0;i<4;i++)rect(c,12+i%2*5,25+i*3,3,1,light);
 }else if(race===13){poly(c,[[-5,35],[-4,18],[2,8],[13,5],[24,11],[29,24],[27,36]],skin);rect(c,-1,32,26,5,skin);rect(c,1,13,7,3,'#c0e1cf');rect(c,6,22,3,3,ink);rect(c,17,22,3,3,ink);rect(c,10,27,5,1,'#719c86');rect(c,12,14,5,4,'#bdd7b4')}
 else if(race===50){poly(c,[[-11,27],[-4,17],[15,16],[25,21],[27,32],[12,36],[-9,34]],skin);rect(c,19,7,14,18,skin);rect(c,29,16,8,7,skin);rect(c,27,12,2,2,ink);rect(c,34,17,3,2,ink);poly(c,[[9,27],[18,34],[7,36],[3,33]],'#739b9b');poly(c,[[-10,26],[-20,21],[-18,31],[-10,34]],'#749998');for(let i=0;i<3;i++)rect(c,24+i*3,24,2,1,light)}
 else if(race===57){poly(c,[[-19,31],[-7,20],[5,20],[10,27],[17,21],[17,7],[23,2],[31,6],[33,22],[28,34],[17,39],[4,32],[-6,28],[-12,36]],skin);poly(c,[[-17,29],[-26,20],[-25,36],[-16,34]],'#8db8b5');rect(c,24,9,2,2,ink);rect(c,29,16,8,4,skin);for(let i=0;i<5;i++)rect(c,-8+i*7,27+i%2*4,3,2,light);poly(c,[[18,9],[12,1],[22,4]],'#a7cebe')}
 else if(race===30||race===69){
  const coral=race===69,col=coral?'#be939a':'#7c8c62';rect(c,9,12,10,21,skin);poly(c,[[9,28],[-1,38],[6,37],[13,32],[21,38],[29,38],[19,29]],skin);
  for(const [dx,h] of [[1,3],[10,-8],[24,-1]]){rect(c,dx,h+5,4,24-h,skin);poly(c,[[dx,11],[dx-8,h],[dx-5,h-3],[dx+3,7],[dx+9,h-5],[dx+12,h-2],[dx+4,14]],col)}
  if(!coral){poly(c,[[-10,0],[3,-6],[13,-2],[9,6],[-5,6]],'#9cad7a');poly(c,[[15,-8],[31,-5],[36,2],[22,5]],'#9aad76')}
  rect(c,11,18,2,2,ink);rect(c,16,18,2,2,ink);rect(c,13,24,3,1,ink);
 }else{
  poly(c,[[5,6],[12,0],[22,7],[23,20],[18,29],[27,34],[15,38],[5,32],[-2,36],[1,26]],skin);rect(c,8,12,3,3,light);rect(c,17,12,3,3,light);poly(c,[[4,19],[-6,23],[-7,31],[0,28]],skin);poly(c,[[21,19],[31,24],[29,30],[23,26]],skin);
  if([16,33].includes(race)){poly(c,[[7,5],[5,-3],[12,3]],skin);poly(c,[[18,4],[25,-2],[22,9]],skin)}
  for(let i=0;i<4;i++)rect(c,-4+i*10,32+(beat+i)%4,2,2,race===22?'#d6b890':race===32?'#d6c197':light);
 }
 Wardrobe.native(c,s,member,age,race);
 Workwear.equipment(c,s,member,age,race);
 c.restore();return true;
}

function drawPerson(c,x,y,scale,s,age=30,member=null){
 const race=member?.race??s.race,look=member?.look||s.look||{hair:0,coat:0,eyes:0},skin=race===0&&Number.isInteger(look.complexion)?['#e8c6a0','#d9af87','#c39570','#ae7b5c','#95644e','#754d41'][look.complexion]||'#c8a783':RACES[race]?.[3]||'#c8a783',baseHair=Wardrobe.hairColors[Wardrobe.style(s,member).hairColor],profile=lifeLook(age),infant=profile.stage==='baby',small=infant||profile.stage==='toddler',elder=profile.stage==='elder',middle=profile.stage==='middle',hair=elder?'#c4c1b2':baseHair,job=member?0:(Number.isInteger(s.job)&&age>=16?s.job:0),coat=Wardrobe.outfit(s,member,age).shirt;
 if(nativeNewborn(c,x,y,scale,s,age,race))return;
 if(drawEcologyBody(c,x,y,scale,s,age,race,look,member))return;
 if(drawFrontier(c,x,y,scale,s,age,race,look,member))return;
 if(drawUnusual(c,x,y,scale,s,age,race,look,member))return;
 const beat=Math.floor(sceneTime*profile.pace+(member?.name?.length||s.seed%7))%4,bob=infant?0:beat===1?1:0,posture=elder?2:0;
 c.save();
 // Keep feet on one ground line as the child grows; the sprite never floats.
 c.translate(Math.round(x),Math.round(y+37*scale*(1-profile.height))+bob);c.scale(scale*profile.height,scale*profile.height);
 rect(c,1,34,22,3,'#26353245');
 if(infant){
  // A wrapped newborn has no walking boots or work outfit.
  poly(c,[[6,15],[17,15],[22,23],[21,31],[17,35],[7,35],[2,28],[3,20]],'#e3d2ae');
  poly(c,[[4,20],[19,24],[20,28],[4,24]],coat);rect(c,7,30,12,2,'#c3b18f');
 }else{
  Wardrobe.back(c,s,member,age);
  const legTop=small?27:29;
  const stride=actorWalking&&!small?(Math.floor(sceneTime*5)%4<2?2:-2):0;rect(c,4+stride,legTop,5,37-legTop,'#343b37');rect(c,15-stride,legTop,5,37-legTop,'#343b37');
  poly(c,[[3,17],[7,14],[16,14],[21,18],[23,legTop],[19,31],[5,31],[1,27]],coat);
  rect(c,8,18,5,small?5:9,'#d6cb9f');rect(c,3,26,18,2,'#384840');rect(c,10,19,2,4,'#8b744c');
 }
 Wardrobe.garment(c,s,member,age,skin);
 rect(c,8+posture,13,7,5,skin);rect(c,5+posture,4+(elder?1:0),13,12,skin);rect(c,4+posture,2+(elder?1:0),15,5,hair);rect(c,3+posture,4,4,8,hair);rect(c,16+posture,4,4,8,hair);
 if(!infant)Wardrobe.hair(c,s,member,age,skin,posture);
 // Age changes the posture and hair while eyes and racial features stay familiar.
 rect(c,7+posture,8,2,2,'#30352e');rect(c,14+posture,8,2,2,'#30352e');rect(c,11+posture,11,2,1,'#9d705e');
 if([1,2,3].includes(race)){poly(c,[[4+posture,7],[-3+posture,3],[-1+posture,10],[4+posture,11]],skin);poly(c,[[18+posture,7],[25+posture,3],[23+posture,10],[18+posture,11]],skin)}
 if([5,6,7].includes(race)){poly(c,[[5+posture,4],[2+posture,-5],[9+posture,1]],hair);poly(c,[[15+posture,3],[19+posture,-5],[20+posture,6]],hair);if(!infant)poly(c,[[6,18],[-1,25],[3,27],[8,22]],coat)}
 if((race===4||race===11)&&age>=18){rect(c,4+posture,13,15,4,hair);rect(c,6+posture,16,3,4,hair);rect(c,14+posture,16,3,4,hair)}
 if(race===8){poly(c,[[2,16],[-3,22],[2,24],[5,20]],'#92c4bf');poly(c,[[20,16],[25,22],[20,24],[17,20]],'#92c4bf')}
 if(race===9){poly(c,[[5+posture,3],[4+posture,-4],[9+posture,1]],'#8d8e6f');poly(c,[[15+posture,2],[19+posture,-5],[19+posture,4]],'#8d8e6f');if(!infant)poly(c,[[20,26],[28,30],[25,34],[20,31]],'#78895f')}
 if(race===10||race===17){poly(c,[[4,18],[-5,11],[-2,20],[3,24]],'#bda5c5');poly(c,[[20,18],[29,11],[26,20],[21,24]],'#e4cad8')}
 if(race===12){poly(c,[[4+posture,4],[-3+posture,1],[1+posture,11],[5+posture,9]],skin);poly(c,[[18+posture,4],[25+posture,1],[21+posture,11],[17+posture,9]],skin);if(!small){rect(c,7+posture,12,2,2,'#f0ead2');rect(c,14+posture,12,2,2,'#f0ead2')}}
 if(race===13){c.globalAlpha=.78;rect(c,4+posture,1,16,14,'#94d6ca');c.globalAlpha=1;rect(c,7+posture,8,2,2,'#28504b');rect(c,14+posture,8,2,2,'#28504b');if(!infant)rect(c,9,22,7,3,'#b8e0d4')}
 if(race===14){rect(c,4+posture,2,15,3,'#d1cec3');rect(c,6+posture,8,3,2,'#e8dbb2');rect(c,14+posture,8,3,2,'#e8dbb2');rect(c,5+posture,12,2,1,'#81827e')}
 if(race>=15&&race<=22){const horn=['#54484a','#534c62','#735f75','#9baeb0','#8d514f','#858096','#383b3d','#75665f'][race-15],tip=small?-3:-7;poly(c,[[6+posture,3],[4+posture,tip],[10+posture,-1],[11+posture,2]],horn);poly(c,[[15+posture,2],[20+posture,tip],[19+posture,4]],horn);if(race===16||race===21){poly(c,[[3,20],[-8,13],[-4,25],[3,29]],'#746784');poly(c,[[21,20],[30,13],[26,26],[21,29]],'#514b64')}if(race===19)rect(c,19+posture,11,3,2,'#a94f57')}
 if(race===23){poly(c,[[4,18],[-12,8],[-8,20],[1,27]],'#d8d0ba');poly(c,[[20,18],[36,8],[31,23],[21,28]],'#f0ead7');rect(c,7+posture,3,11,2,'#e4dbbe')}
 // Added peoples have their own pixel silhouette rather than sharing demon horns.
 if(race===24){rect(c,16+posture,10,6,4,skin);rect(c,20+posture,10,2,1,'#3b564a');if(!infant)poly(c,[[20,27],[30,32],[25,35],[18,31]],skin);rect(c,8+posture,2,3,2,'#95b481')}
 if(race===25){poly(c,[[16+posture,9],[24+posture,11],[17+posture,13]],'#c4a26c');poly(c,[[6+posture,3],[8+posture,-3],[11+posture,3]],'#e5d7ae');if(!infant){const flap=Math.floor(sceneTime*3)%2;poly(c,[[2,19],[-6,22+flap*3],[-3,28],[5,24]],skin);poly(c,[[21,19],[28,22+flap*3],[25,28],[19,24]],skin)}}
 if(race===26){rect(c,1+posture,2,5,6,skin);rect(c,18+posture,2,5,6,skin);rect(c,2+posture,3,3,3,'#c4948b');rect(c,19+posture,3,3,3,'#c4948b');rect(c,18+posture,12,3,2,'#b78983');if(!infant){rect(c,22,29,7,2,'#bd9c8c');rect(c,28,26,2,5,'#bd9c8c')}}
 if(race===27){poly(c,[[5+posture,4],[0+posture,-3],[0+posture,4],[5+posture,7]],'#ddd1aa');poly(c,[[17+posture,4],[23+posture,-3],[23+posture,4],[17+posture,7]],'#ddd1aa');rect(c,7+posture,12,10,4,'#b39976');rect(c,10+posture,13,2,1,'#574d42');rect(c,15+posture,13,2,1,'#574d42')}
 if(race===28){rect(c,6+posture,2,11,3,'#8ba875');rect(c,9+posture,-1,5,3,'#ccad65');if(!infant){rect(c,4,29,16,8,skin);rect(c,18,33,11,4,skin);rect(c,27,30,4,5,skin);rect(c,6,30,11,2,'#c2c49c')}}
 if(race===29){rect(c,5+posture,-4,2,8,'#617a68');rect(c,17+posture,-4,2,8,'#617a68');rect(c,3+posture,-5,4,2,'#b8c1a1');rect(c,17+posture,-5,4,2,'#b8c1a1');rect(c,7+posture,7,3,4,'#536d56');rect(c,13+posture,7,3,4,'#536d56');if(!infant){rect(c,0,22,3,2,skin);rect(c,22,22,3,2,skin)}}
 if(race===30){for(let i=0;i<4;i++)poly(c,[[4+posture+i*4,3],[6+posture+i*4,-3-i%2*2],[9+posture+i*4,3]],'#688d56');rect(c,2,22,3,4,'#789765');rect(c,20,22,3,4,'#789765')}
 if(race===31){rect(c,4+posture,3,16,3,'#85979a');rect(c,7+posture,8,3,2,'#d9e8b0');rect(c,14+posture,8,3,2,'#d9e8b0');rect(c,10+posture,12,4,2,'#667f80');if(!infant){rect(c,8,20,8,6,'#9caf9d');rect(c,11,21,2,3,'#dfe6b4');rect(c,4,28,3,3,'#93a49b');rect(c,18,28,3,3,'#93a49b')}}
 if(race===32){poly(c,[[5+posture,3],[5+posture,-5],[10+posture,2]],'#c4ad7c');poly(c,[[15+posture,3],[20+posture,-5],[19+posture,4]],'#c4ad7c');rect(c,19+posture,13,3,1,'#a27f59');if(!infant)rect(c,22,30+Math.floor(sceneTime*3)%2,2,2,'#d2bb85')}
 if(race===33){poly(c,[[5+posture,3],[2+posture,-4],[8+posture,0]],'#8979a9');poly(c,[[15+posture,3],[21+posture,-4],[18+posture,1]],'#8979a9');if(!infant){poly(c,[[3,20],[-5,15],[-2,25],[3,28]],'#aaa2c2');poly(c,[[21,20],[28,15],[26,25],[21,28]],'#aaa2c2')}}
 if(race===34){rect(c,7+posture,-3,3,6,'#d4c5a0');rect(c,14+posture,-3,3,6,'#d4c5a0');rect(c,5+posture,11,3,2,'#b86f63');rect(c,16+posture,11,3,2,'#b86f63');if(!small){rect(c,8+posture,13,2,2,'#eee2bb');rect(c,14+posture,13,2,2,'#eee2bb')}}
 if(race===35){rect(c,5+posture,-5,14,2,'#d3d9b7');rect(c,2+posture,-4,3,2,'#aab9b5');rect(c,19+posture,-4,3,2,'#aab9b5');rect(c,7+posture,8,2,2,'#a2c8c9');rect(c,14+posture,8,2,2,'#a2c8c9');if(!infant){const twinkle=Math.floor(sceneTime*4)%3;rect(c,-2,18+twinkle*3,2,2,'#dce6bd');rect(c,26,24-twinkle*2,2,2,'#dce6bd')}}
 if(race===42){rect(c,3,1,18,5,'#8f9d9d');rect(c,5,6,15,10,'#a8b4ac');rect(c,6,8,12,3,'#566c6d');rect(c,8,9,3,1,'#d4e5ae');rect(c,14,9,3,1,'#d4e5ae');rect(c,2,18,20,8,'#91a599');rect(c,9,19,6,5,'#d6d8ae')}
 if(race===45){poly(c,[[3,3],[7,-2],[16,-3],[21,5],[19,15],[4,15]],'#5d526c');rect(c,7,7,2,2,'#d7dfbd');rect(c,14,7,2,2,'#d7dfbd');rect(c,3,11,2,5+beat%2,'#5d526c');rect(c,19,8,2,7,'#5d526c');poly(c,[[2,21],[-4,24],[-3,29],[1,26],[4,28]],'#6f6079');poly(c,[[21,21],[28,25],[25,30],[23,26],[20,27]],'#6f6079');if(age>=6){rect(c,27,19,1,18,'#63556b');poly(c,[[27,22],[28,11],[34,5],[32,15]],'#b0a2bb');rect(c,26,34,3,3,'#51465f')}}
 if(race===46){rect(c,0,17,24,10,'#879a81');rect(c,2,1,19,4,'#7e877a');rect(c,3,14,17,4,'#a7a28a');rect(c,0,20,4,9,'#a3a789');rect(c,21,20,4,9,'#a3a789');rect(c,5,4,3,2,'#c6c4a1')}
 if(race===47){rect(c,4,-13,4,18,skin);rect(c,15,-16,4,20,skin);rect(c,5,-10,2,9,'#c7a6a3');rect(c,16,-12,2,11,'#c7a6a3');rect(c,22,27,6,6,'#dedcc4')}
 Wardrobe.headwear(c,s,member,age,race);
 if(Math.floor(sceneTime*8+(s.seed%29))%43===0){rect(c,7+posture,8,2,2,skin);rect(c,14+posture,8,2,2,skin);rect(c,7+posture,9,2,1,'#30352e');rect(c,14+posture,9,2,1,'#30352e')}
 if(!infant){
  rect(c,1,23+(beat===2?1:0),3,4,skin);rect(c,21,23+(beat===0?1:0),3,4,skin);
  if(profile.stage==='child'){rect(c,18,18,6,10,'#ad8960');rect(c,19,19,1,7,'#d9c391')}
  if(profile.stage==='teen'){rect(c,2,16,2,12,'#c2b787');rect(c,17,25,6,5,'#a18459')}
  if((look.coat||0)%3===1)poly(c,[[3,18],[-2,29],[4,29],[8,22]],Wardrobe.outfit(s,member,age).cape);
  if(elder){rect(c,24,23,2,14,'#806747');rect(c,21,22,5,2,'#806747');rect(c,8,11,1,1,'#9c8877');rect(c,18,11,1,1,'#9c8877')}
 }
 if(!infant)Workwear.equipment(c,s,member,age,race);
 c.restore();
}
function stars(c,seed,night){for(let i=0;i<18;i++){const x=mix(seed+i*31)%475,y=8+mix(seed+i*73)%54;rect(c,x,y,2,2,night?'#e8d9aa':'#f2ead1') }}
function tree(c,x,y,size,color='#465f4a'){rect(c,x-2,y-size*.1,4,size*.48,'#655848');poly(c,[[x,y-size],[x-size*.45,y-size*.38],[x-size*.23,y-size*.42],[x-size*.54,y-size*.05],[x+size*.48,y-size*.05],[x+size*.2,y-size*.43],[x+size*.43,y-size*.48]],color)}
function house(c,x,y,w,h,p){rect(c,x,y,w,h,'#d0bf9a');poly(c,[[x-7,y+4],[x+w/2,y-12],[x+w+8,y+4]],p.roof);rect(c,x+w*.2,y+h*.38,w*.17,h*.2,'#edcf8d');rect(c,x+w*.68,y+h*.38,w*.17,h*.2,'#edcf8d');rect(c,x+w*.43,y+h*.57,w*.2,h*.43,'#665347');rect(c,x+2,y+h*.81,w-4,2,'#9c835e')}
function landscape(c,s,moment){
 const k=s.kingdom,p=palette(k),seed=s.seed+(moment?.id||0)*29,night=['ก่อนหลับ','ยามค่ำ','ค่ำคืน'].includes(moment?.phase),isWater=k===4||k===6;
 c.fillStyle=p.sky;c.fillRect(0,0,480,180);stars(c,seed,night);
 if(night){c.fillStyle='#e8d6a8';c.beginPath();c.arc(374,31,13,0,Math.PI*2);c.fill();c.fillStyle=p.sky;c.beginPath();c.arc(380,27,12,0,Math.PI*2);c.fill()}
 // Four layered ridges keep the horizon legible on a phone sized panel.
 poly(c,[[0,104],[52,72],[95,93],[151,52],[214,96],[272,61],[333,91],[393,54],[480,89],[480,180],[0,180]],p.far);
 poly(c,[[0,126],[64,101],[119,120],[184,94],[247,122],[313,94],[386,121],[442,100],[480,116],[480,180],[0,180]],p.near);
 if(k===0){for(let x=20;x<470;x+=46){rect(c,x,93-(x%5)*2,4,45,'#e4d1a3');rect(c,x-4,105-(x%3)*2,12,3,'#e4d1a3')}rect(c,0,145,480,35,p.ground);for(let x=20;x<480;x+=41)rect(c,x,144+(x%3)*7,13,2,'#d3b276')}
 if(k===1||k===5){for(let x=12;x<480;x+=40)tree(c,x,145-(x%3)*5,39+(x%4)*4,k===1?'#394f43':'#62536e');if(k===1){rect(c,362,54,20,92,'#66563f');rect(c,342,63,60,4,'#9baa73')}}
 if(k===2){for(let x=16;x<465;x+=48){const hh=38+(mix(seed+x)%46);rect(c,x,134-hh,25,hh,'#433a54');for(let y=141-hh;y<132;y+=14)rect(c,x+7,y,4,5,'#d7b68a');poly(c,[[x-3,134-hh],[x+12,123-hh],[x+27,134-hh]],'#302e43')}rect(c,0,147,480,33,'#4b4051')}
 if(k===3){for(let x=12;x<465;x+=55){poly(c,[[x,145],[x+17,90-(x%4)*4],[x+32,145]],'#5c605c');rect(c,x+13,120,4,14,'#d7a86c')}rect(c,381,72,7,62,'#474b47');rect(c,375,66,19,7,'#474b47');rect(c,379,49,11,18,'#d78654');for(let i=0;i<11;i++)rect(c,402+i*5,129-i%3*7,2,2,'#e2bd7a')}
 if(k===4){rect(c,0,141,480,39,'#537780');for(let i=0;i<14;i++)rect(c,(i*43+7)%480,150+i%5*5,22,2,'#acc6bf');poly(c,[[320,113],[346,89],[411,91],[438,115]],'#544f53');rect(c,339,114,72,28,'#5d5050');rect(c,372,72,5,22,'#d4c9a8');poly(c,[[374,60],[389,74],[377,74]],'#d9b97f')}
 if(k===6){rect(c,0,46,480,3,'#b7e3d0');for(let i=0;i<17;i++){const x=(i*73+seed)%480,y=70+(i*31)%70;rect(c,x,y,3,3,'#b9e4d4');rect(c,x+1,y-5,1,2,'#b9e4d4')}for(let x=12;x<480;x+=38){poly(c,[[x,180],[x+8,148],[x+5,125],[x+14,109],[x+17,149],[x+24,169]],iColor(x));rect(c,x+9,146,4,3,'#7bc3bd')} }
 if(k===7){rect(c,0,145,480,35,'#78654f');for(let x=15;x<450;x+=56){rect(c,x,84+(x%4)*7,4,60,'#62574c');rect(c,x+15,97+(x%3)*6,3,49,'#706357')}for(let i=0;i<9;i++){const x=(i*57+seed)%480;rect(c,x,156-i%3*3,3,5,'#9e8262');rect(c,x+2,154-i%3*3,3,5,'#93a16c')}}
 if(k===5){rect(c,0,146,480,34,'#7f647c');for(let x=35;x<455;x+=63){rect(c,x,43,2,34,'#665c66');rect(c,x+15,41,2,28,'#665c66');rect(c,x+1,49,15,11,'#e8bd7e');rect(c,x+3,51,11,7,'#f4d79c')} }
 if(!isWater&&k!==0&&k!==7)rect(c,0,149,480,31,p.ground);
}
function iColor(x){return ['#70a985','#edbf75','#bd89aa','#7bb6a2'][Math.abs(Math.floor(x))%4]}
function feature(c,s,moment){const title=(s.calendar?.pending?s.event?.title:moment?.title)||'',kind=s.calendar?.pending?'decision':moment?.kind||'';let icon='✧';if(/ครอบครัว|บ้าน|แม่|พ่อ|พี่น้อง|ลูก|คู่ชีวิต/.test(title))icon='⌂';else if(/งาน|อาชีพ|เหมือง|โรงงาน|ฝึก/.test(title))icon='⚒';else if(/รบ|สงคราม|อาวุธ|ทหาร/.test(title))icon='⚔';else if(/เรียน|หนังสือ|สถาบัน/.test(title))icon='✎';else if(/ฝน|พายุ|น้ำท่วม/.test(title))icon='☂';else if(/เงา|ฝัน|ดาว|คำสาป|เวท/.test(title))icon='✧';else if(/สัตว์|มังกร|ไข่/.test(title))icon='♢';return {title,kind,icon}}
function drawPet(c,x,y,scale,pet){drawCompanion(c,x,y,scale,pet)}
function drawSituation(c,s,f){const t=f.title||'';
 if(/รบ|สงคราม|อาวุธ|ป้อม|ศึก|ทหาร/.test(t)){rect(c,70,82,3,61,'#55463c');poly(c,[[73,85],[98,90],[74,101]],'#a85e4b');rect(c,56,132,35,5,'#55473e');rect(c,52,137,6,8,'#8e7657');rect(c,88,137,6,8,'#8e7657');rect(c,104,94,3,35,'#4f4c45');poly(c,[[107,96],[119,101],[107,106]],'#d2b57e')}
 else if(/เรียน|หนังสือ|สถาบัน|อักษร|อ่าน/.test(t)){rect(c,48,105,40,34,'#554d43');rect(c,53,109,30,25,'#b99e74');for(let i=0;i<4;i++){rect(c,57,113+i*5,21,1,'#6b725e')}rect(c,95,113,17,21,'#784c49');rect(c,98,110,17,21,'#c0a66f');rect(c,100,115,12,2,'#eee0ba')}
 else if(/รัก|คู่ชีวิต|ชา|จดหมาย|แต่งงาน|คำสาบาน/.test(t)){rect(c,43,116,43,5,'#654b43');rect(c,47,121,3,17,'#57453b');rect(c,79,121,3,17,'#57453b');rect(c,57,101,9,13,'#d5bd8d');rect(c,59,98,5,4,'#f3dfab');rect(c,24,83,6,21,'#665c57');rect(c,20,78,14,7,'#d9b878');rect(c,25,72,4,6,'#f8e0a6')}
 else if(/เจ็บ|ป่วย|รักษา|หมอ|ยา|อาการ/.test(t)){rect(c,49,120,51,15,'#7f6d61');rect(c,55,112,41,10,'#e0d2ae');rect(c,51,134,5,7,'#50483f');rect(c,92,134,5,7,'#50483f');rect(c,103,110,6,19,'#819374');rect(c,100,106,12,5,'#d2bd8d')}
 else if(/เดินทาง|คาราวาน|เรือ|แผนที่|สะพาน|ถนน/.test(t)){rect(c,54,122,47,19,'#735c48');rect(c,49,117,58,7,'#b89461');c.strokeStyle='#e1c784';c.lineWidth=1;c.beginPath();c.moveTo(62,116);c.lineTo(77,106);c.lineTo(93,115);c.stroke();rect(c,73,105,8,12,'#eee0be')}
 else if(/สัตว์|อสูร|มังกร|ไข่|ภูต/.test(t)){rect(c,53,132,35,6,'#74604c');for(let i=0;i<3;i++)rect(c,56+i*13,128-i%2*3,10,4,['#9eae7e','#b8a170','#9eae7e'][i]);rect(c,68,116,9,12,'#efe0b6');rect(c,71,113,4,4,'#d4bd83')}
 else if(/เงา|ดาว|ฝัน|คำสาป|เวท|กระจก/.test(t)){c.strokeStyle='#edd89d';c.lineWidth=1;c.beginPath();c.arc(77,112,23,.35,Math.PI*1.78);c.stroke();for(let i=0;i<7;i++){const x=58+(mix(s.seed+i*17)%38),y=94+(mix(s.seed+i*53)%31);rect(c,x,y,2,2,'#fff0bc')}}
 else if(/บ้าน|ครอบครัว|พ่อ|แม่|พี่น้อง|ลูก/.test(t)){rect(c,49,123,43,5,'#694f40');rect(c,53,128,3,10,'#54463d');rect(c,84,128,3,10,'#54463d');rect(c,66,111,7,9,'#d9b768');rect(c,68,108,3,4,'#f1deaa')}
}
function atmosphere(c,s,t,foreground){
 const k=s.kingdom,frame=Math.floor(t*8),night=['ก่อนหลับ','ยามค่ำ','ค่ำคืน'].includes(s.diary?.entries?.[0]?.phase);
 if(!foreground){
  if(k!==6)for(let i=0;i<4;i++){const x=((i*143+Math.floor(t*(i%2+1)*3))%560)-45,y=20+i%3*13;rect(c,x,y,33,5,night?'#abb6c140':'#f7ecd08c');rect(c,x+7,y-4,18,4,night?'#abb6c140':'#f7ecd08c')}
  return;
 }
 if(k===4||k===6){for(let i=0;i<18;i++){const x=(i*47+Math.floor(t*7))%480,y=155+i%5*5;rect(c,x,y,6+(frame+i)%3*3,1,'#bbded28c')} }
 if(k===6){for(let i=0;i<12;i++){const x=16+i*39+Math.round(Math.sin(t+i)*4),y=170-((i*23+Math.floor(t*12))%150);rect(c,x,y,2,2,'#bcebe5');rect(c,x+2,y+2,2,2,'#7fc4c5')}}
 if(k===1||k===5||k===7){for(let i=0;i<13;i++){const x=(i*53+Math.floor(t*8)+Math.round(Math.sin(t+i)*3))%480,y=(i*29+Math.floor(t*5))%165;rect(c,x,y,3,2,k===5?'#edc0cc':k===7?'#d1a267':'#a6be78')}}
 if(k===2||k===3){for(let i=0;i<12;i++){const x=355+i*5+Math.round(Math.sin(t*2+i)*4),y=139-(i*13+Math.floor(t*16))%88;rect(c,x,y,2,(frame+i)%3===0?3:1,i%2?'#e6ad69':'#d17853')}}
 if(k===0||k===7){for(let i=0;i<24;i++){const x=i*21,y=173+i%3*2,sway=(frame+i)%6<3?1:-1;rect(c,x,y,1,5,'#627351');rect(c,x+sway,y-1,2,2,'#91a568')}}
 if(k===0||k===2||k===3||k===7){rect(c,313,103,2,18,'#665c4c');rect(c,315,103,10,5,k===2?'#a17b97':'#c7b67e');rect(c,325,104+(frame%4<2?0:1),4,4,k===2?'#a17b97':'#c7b67e')}
 if(night||k===1||k===5){for(let i=0;i<8;i++){if((frame+i*3)%18>9)continue;const x=50+i*52+Math.round(Math.sin(t+i)*5),y=90+i%3*20+Math.round(Math.cos(t*.7+i)*4);rect(c,x,y,2,2,'#f3e5a5')}}
}
// Every location has its own floor plan, equipment and animated activity.
function furnishings(c,key,x,y,scale=1,t=sceneTime,col='#9e815b'){
 c.save();c.translate(x,y);c.scale(scale,scale);const f=Math.floor(t*6);
 const box=(xx,yy,w,h,k=col)=>rect(c,xx,yy,w,h,k),paper='#e2d3a7',dark='#4a4b40',green='#6c8e62',gold='#d4b976';
 if(['books','bookcase','shelves'].includes(key)){box(0,-35,43,37,'#6b5748');for(let r=0;r<3;r++){for(let i=0;i<7;i++)box(4+i*5,-31+r*11,3,7+(i%2),['#a37166','#839873','#b9a777','#718c92'][i%4]);box(0,-22+r*11,43,2)}}
 else if(['desk','workbench','table'].includes(key)){box(0,-14,44,5);box(4,-9,4,17);box(36,-9,4,17);box(11,-18,19,3,paper);box(21,-20,2,7,dark)}
 else if(['reading-lamp','lamp','candles'].includes(key)){box(0,0,13,3,dark);box(5,-19,3,20);box(2,-26,10,9,paper);box(5,-24,4,5,(f%4<2?'#f4db91':'#e3c682'))}
 else if(['bed','cot'].includes(key)){box(0,-14,48,17);box(3,-18,42,7,paper);box(19,-17,27,11,'#8d9c7a');box(4,-18,11,6,'#eee2c5');box(2,2,4,7,dark);box(42,2,4,7,dark)}
 else if(['cradle','pet-bed','egg-warmer'].includes(key)){poly(c,[[0,-7],[35,-7],[31,8],[4,8]],col);box(4,-10,26,7,paper);for(let i=0;i<5;i++)box(5+i*6,-15,2,12);box(0,-16,35,2);if(key==='egg-warmer'){box(12,-25,12,18,paper);box(15,-28,6,3,paper);box(15,-20,3,3,gold)}}
 else if(['pot','cooking-pot','cauldron'].includes(key)){box(3,-17,27,16,'#53594d');box(0,-19,34,4,'#777c66');box(1,-15,3,9,dark);box(29,-15,3,9,dark);box(6,-1,4,5,dark);box(24,-1,4,5,dark);for(let i=0;i<3;i++)box(7+i*8,-26-((f+i*3)%9),3,4,'#e6dabf9a')}
 else if(['stove','oven','hearth','furnace'].includes(key)){box(0,-41,47,47,'#7b7366');box(5,-33,37,31,'#363b36');for(let i=0;i<5;i++){box(9+i*6,-9-((f+i*2)%9),4,13+((f+i*2)%9),i%2?'#e5ad65':'#cf8056')}box(-3,4,53,4,'#8b8b77');box(4,-46,39,6,'#a4a08c')}
 else if(key==='anvil'){poly(c,[[0,-23],[42,-23],[35,-15],[24,-13],[25,-4],[34,1],[34,6],[7,6],[7,1],[15,-4],[16,-14],[5,-15]],'#87938b');box(5,7,31,9,'#6f5c49')}
 else if(['herbs','herb-box','garden-bed','planter'].includes(key)){box(0,-4,42,12);box(3,-7,36,4,'#584f3d');for(let i=0;i<5;i++){box(6+i*7,-19-i%2*4,2,14,green);box(2+i*7,-16,5,3,'#91a275');box(8+i*7,-22,5,3,green)}}
 else if(['flowers','crystal-tree'].includes(key)){for(let i=0;i<5;i++){box(i*9,-15-i%3*5,2,19,green);box(i*9-3,-21-i%3*5,8,6,key==='crystal-tree'?'#a7cfb4':['#d4ad89','#b99eb0','#d4c68d'][i%3])}}
 else if(['alchemy-set','bottles','medicine'].includes(key)){for(let i=0;i<6;i++){box(i*7,-12-i%2*4,5,12,['#8ca798','#b69b78','#9c9eb9'][i%3]);box(1+i*7,-17-i%2*4,3,5,paper);box(1+i*7,-19-i%2*4,3,2,dark)}}
 else if(['harp','violin','flute'].includes(key)){if(key==='flute'){box(1,-20,38,4,gold);for(let i=0;i<5;i++)box(6+i*5,-20,2,2,dark)}else if(key==='violin'){box(12,-30,3,19,dark);box(6,-14,15,17,col);box(9,-19,9,7,col);box(13,-16,1,22,paper);box(25,-34,2,37,gold)}else{poly(c,[[0,-37],[31,-32],[26,5],[22,5],[27,-28],[5,-31],[5,5],[0,5]],gold);for(let i=0;i<5;i++)box(7+i*4,-29+i,1,32-i,paper)}}
 else if(['drum','board-game'].includes(key)){box(0,-10,35,15,'#7c604d');box(0,-13,35,4,paper);for(let i=0;i<4;i++)box(4+i*8,-9,2,11,gold);if(key==='board-game'){for(let i=0;i<6;i++)box(4+i*5,-14,2,2,i%2?dark:gold)}}
 else if(key==='easel'){box(8,-44,4,49);poly(c,[[9,-7],[3,10],[7,10],[13,-7]],col);poly(c,[[11,-7],[24,10],[28,10],[15,-7]],col);box(-4,-39,32,29,paper);box(0,-35,24,21,'#a7b99a');poly(c,[[0,-14],[8,-28],[16,-17],[24,-29],[24,-14]],'#64816c');box(18,-33,4,4,gold)}
 else if(['telescope','map-stand','star-chart','globe'].includes(key)){if(key==='telescope'){box(10,-18,3,27);poly(c,[[11,-4],[1,12],[5,12],[14,0],[23,12],[27,12]],dark);poly(c,[[1,-21],[31,-34],[36,-25],[5,-12]],'#9b9e83');box(29,-36,7,12,gold)}else if(key==='globe'){box(13,-22,3,27,dark);box(5,4,22,3,dark);box(3,-36,28,23,'#91b5ab');box(8,-31,6,8,green);box(16,-27,9,10,green);box(4,-26,26,1,paper)}else{box(0,-33,39,32,col);box(3,-30,33,26,paper);for(let i=0;i<5;i++)box(6+i*6,-25+(i*7)%18,2,2,'#657e74');box(7,0,3,12);box(28,0,3,12)}}
 else if(['loom','curtain'].includes(key)){box(0,-43,4,51);box(35,-43,4,51);box(0,-43,39,4);box(0,-7,39,4);for(let i=0;i<8;i++)box(5+i*4,-39,2,29,['#c9b78b','#a18c9b','#7e967c'][i%3]);box(4,-19+f%2,31,2,paper)}
 else if(['training-dummy','dummy'].includes(key)){box(18,-25,4,34);box(7,-28,28,9,'#bda879');box(10,-15,22,20,'#bda879');box(15,-39,12,11,'#cdbd91');box(19,-36,3,3,dark);box(0,9,42,3,dark)}
 else if(['treasure-chest','chest'].includes(key)){box(0,-18,39,24,'#775641');box(0,-21,39,7,col);box(4,-21,4,27,gold);box(31,-21,4,27,gold);box(16,-6,7,7,gold);box(19,-4,2,3,dark)}
 else if(['aquarium','terrarium'].includes(key)){box(0,-31,44,35,'#b7cabb');box(3,-28,38,28,key==='aquarium'?'#7eb5b5':'#9da87c');box(0,-33,44,4,dark);box(0,3,44,4,dark);for(let i=0;i<4;i++)box(7+i*8,-12-i%2*8,2,14,green);if(key==='aquarium')poly(c,[[14+f%5,-18],[25+f%5,-18],[29+f%5,-23],[29+f%5,-11],[25+f%5,-15],[14+f%5,-15]],gold)}
 else if(key==='bird-perch'){box(19,-36,4,43);box(4,-39,34,4);box(7,6,27,4);box(1,-43,4,11);box(36,-43,4,11)}
 else if(['prayer-shrine','altar'].includes(key)){box(0,-9,45,15);box(-3,-14,51,6,paper);box(17,-34,12,18,gold);poly(c,[[23,-43],[13,-31],[33,-31]],gold);furnishings(c,'candles',-12,-13,.6,t,col);furnishings(c,'candles',48,-13,.6,t,col)}
 else if(['fishing-rod','travel-pack'].includes(key)){box(7,-43,2,47,col);if(key==='fishing-rod'){box(9,-43,21,1,paper);box(29,-43,1,39,paper);box(27,-4,5,3,dark)}else{box(13,-24,26,28,'#817058');box(18,-27,16,5,col);box(15,-16,22,2,paper)}}
 else if(key==='teapot'){box(7,-14,20,15,'#b7ba99');box(1,-12,8,5,'#b7ba99');box(25,-12,8,9,'#b7ba99');box(27,-10,4,5,dark);box(10,-17,14,3,paper);box(15,-20,4,3,col)}
 else if(['yoga-mat','rug','blanket'].includes(key)){poly(c,[[0,0],[33,0],[45,11],[10,11]],'#a89486');box(6,3,29,1,paper);box(10,8,28,1,paper)}
 else if(['writing-set','scrolls'].includes(key)){box(0,-5,28,14,paper);for(let i=0;i<3;i++)box(5,-2+i*3,18,1,'#9c967a');box(33,-3,6,10,dark);poly(c,[[35,-4],[46,-23],[42,-25],[34,-11]],paper)}
 else if(key==='boat-model'){poly(c,[[0,-4],[44,-4],[34,8],[9,8]],col);box(20,-35,2,33,paper);poly(c,[[23,-34],[23,-7],[40,-7]],paper)}
 else if(key==='toys'){box(3,-5,9,10,'#bfa67c');box(15,-10,10,15,'#9aa783');box(28,-2,9,7,'#ac8e87');box(31,-7,4,5,'#ac8e87')}
 else if(key==='weapon-rack'){box(0,-33,4,40);box(39,-33,4,40);box(0,-20,43,4);for(let i=0;i<4;i++){box(9+i*8,-37,2,39,'#c6caba');box(6+i*8,-3,8,2,gold)}}
 else if(key==='noticeboard'){box(0,-38,49,42,'#6b5d4a');box(3,-35,43,35,'#b19e79');for(let i=0;i<5;i++){box(6+i%3*13,-31+Math.floor(i/3)*15,10,12,paper);box(8+i%3*13,-28+Math.floor(i/3)*15,6,1,'#898770')}}
 else if(key==='blackboard'){box(0,-42,68,39,col);box(3,-39,62,32,'#4e6453');for(let i=0;i<4;i++)box(8,-34+i*6,33+i%2*18,1,paper);box(6,-2,4,16);box(58,-2,4,16)}
 else if(key==='target'){box(18,-40,4,53);box(1,-40,37,33,paper);box(7,-35,25,23,'#9c6f5b');box(13,-29,13,11,paper);box(17,-26,5,5,'#9c6f5b')}
 else if(key==='throne'){box(0,-47,36,54,col);box(4,-43,28,34,'#997b7c');box(4,-4,28,8,gold);box(-5,-20,7,28,col);box(34,-20,7,28,col);box(-1,-51,38,4,gold)}
 else if(key==='baskets'){for(let i=0;i<3;i++){box(i*15,-8-i%2*5,13,15,col);box(1+i*15,-11-i%2*5,11,4,green);for(let j=0;j<3;j++)box(2+i*15+j*4,-7-i%2*5,1,12,paper)}}
 else if(key==='pottery'){for(let i=0;i<4;i++){box(i*10,-14+i%2*6,8,19-i%2*6,'#b69a79');box(2+i*10,-17+i%2*6,4,4,'#b69a79');box(2+i*10,-17+i%2*6,4,1,dark)}}
 else if(key==='bell'){box(15,-37,3,21);poly(c,[[9,-22],[24,-22],[29,-7],[5,-7]],gold);box(1,-8,33,3,gold);box(14,-4,5,4,paper)}
 else {box(0,-12,30,17);box(4,-9,22,2,paper);box(4,-4,22,2,paper)}
 c.restore();
}
function realmArchitecture(c,s,scene){
 const k=scene.realm,p=palette(k),inside=scene.interior,base=inside?20:98;
 // Local materials, silhouettes and lamps accompany the palette, even indoors.
 if(k===0){for(const x of [16,442]){rect(c,x,base,15,134-base,'#b7ad8e');rect(c,x-4,base-5,23,5,'#d7c8a1');rect(c,x+3,base+5,3,124-base,'#ddd0ac')}rect(c,227,inside?12:base-20,17,4,'#d8bd76')}
 if(k===1){for(const x of [14,452]){rect(c,x,18,9,131,'#655e47');poly(c,[[x+3,17],[x-12,32],[x+4,25],[x+19,39],[x+18,25]],'#87a16c')}if(inside)for(let x=48;x<450;x+=53)rect(c,x,18,31,3,'#8e9e74')}
 if(k===2){for(const x of [20,438]){poly(c,[[x,145],[x+9,12],[x+21,145]],'#3a3447');rect(c,x+8,43,4,10,'#c9b788')}rect(c,224,inside?15:74,27,5,'#9b839c')}
 if(k===3){for(const x of [20,444]){rect(c,x,16,11,133,'#737c70');for(let y=20;y<145;y+=22)rect(c,x+3,y,3,3,'#bec6a2')}rect(c,25,17,426,5,'#909782')}
 if(k===4){for(const x of [17,447]){rect(c,x,21,9,128,'#786958');for(let y=25;y<145;y+=18)rect(c,x-2,y,13,3,'#c0b998')}if(inside)for(let x=55;x<440;x+=64)poly(c,[[x,20],[x+24,42],[x+48,20]],'#b4c3b1')}
 if(k===5){for(const x of [36,415]){rect(c,x+9,17,1,32,'#5c5457');rect(c,x,48,21,19,'#dbba83');rect(c,x+3,51,15,13,'#f2dbad');rect(c,x+9,68,2,11,'#a78873')}if(inside)rect(c,19,17,443,3,'#9b7c83')}
 if(k===6){for(const x of [20,437]){poly(c,[[x,145],[x+7,32],[x+13,53],[x+22,14],[x+19,87],[x+26,145]],'#78a49b');rect(c,x+9,62,3,4,'#c1dbb6')}if(inside)for(let i=0;i<5;i++)rect(c,98+i*69,23,4,4,'#bde0c4')}
 if(k===7){for(const x of [18,448]){rect(c,x,18,11,131,'#7c6551');rect(c,x-3,38,17,4,'#b9a07c');rect(c,x+2,43,7,8,'#d2be97')}if(inside){poly(c,[[18,20],[238,42],[460,20],[460,11],[18,11]],'#ab8c6a');rect(c,235,39,4,15,'#e2c17d')}}

 if(k>=8){
  const accent=p.accent||'#e2d0a2';
  if(k===8){for(const x of [8,426]){rect(c,x,36,42,105,'#667e79');for(let y=40;y<140;y+=13)rect(c,x,y,42,3,'#a2ada0');poly(c,[[x-8,39],[x+21,10],[x+50,39]],'#dce3d4');rect(c,x+17,70,8,17,accent)}if(!inside)for(let i=0;i<16;i++)rect(c,(i*37+Math.floor(sceneTime*4))%480,Math.floor((i*29+sceneTime*11)%145),2,2,'#e8eddf')}
  if(k===9){for(const x of [20,421]){rect(c,x,19,35,124,p.wall);rect(c,x-3,18,41,5,'#b6a177');for(let i=0;i<3;i++)rect(c,x+5+i*9,23,4,19,'#658892');rect(c,x+11,81,12,27,'#819f9f')}if(inside)for(let i=0;i<10;i++)rect(c,45+i*42,16,20,4,'#688e91')}
  if(k===10){for(const x of [15,433]){rect(c,x,17,29,125,p.wall);rect(c,x-4,17,37,5,accent);rect(c,x+10,31,9,32,p.near);rect(c,x+5,75,19,5,accent)}if(!inside){rect(c,15,83,450,2,'#ad9870');for(let i=0;i<18;i++)rect(c,20+i*25,83,1,18,'#ad9870')}}
  if(k===11){for(const x of [20,417]){rect(c,x+15,69,11,79,'#9da98d');poly(c,[[x-8,73],[x,47],[x+22,33],[x+50,58],[x+54,73]],'#a0828d');for(let i=0;i<4;i++)rect(c,x+3+i*11,63-i%2*6,5,3,accent)}for(let i=0;i<7;i++)rect(c,(i*63+Math.floor(sceneTime*4))%480,29+i%3*33,2,2,accent)}
  if(k===12){for(const x of [11,426]){rect(c,x,20,42,125,'#a78b6b');for(let j=0;j<10;j++)rect(c,x,25+j*12,42,1,'#c8b995');rect(c,x+4,31,34,34,'#d4c493');rect(c,x+19,35,2,16,'#5e6b61');rect(c,x+19,49,11,2,'#5e6b61');rect(c,x+5,81,32,4,'#c9b071')}if(inside)rect(c,0,17,480,3,'#bda369')}
  if(k===13){for(const x of [17,428]){rect(c,x,31,36,112,'#858998');poly(c,[[x-3,32],[x+17,14],[x+39,32]],'#b0a8a4');for(let i=0;i<5;i++){rect(c,x+6,47+i*15,23,8,'#b4b0ac');rect(c,x+9,50+i*15,15,1,'#6b7080')}}if(inside)rect(c,60,18,360,3,'#c7c2b6')}
  if(k===14){for(const x of [10,414]){poly(c,[[x,142],[x+8,80],[x+25,53],[x+48,83],[x+58,142]],p.wall);rect(c,x+7,105,45,4,'#ad8064');rect(c,x+24,104,13,38,'#716950');rect(c,x+25,38,2,25,'#8d795b');poly(c,[[x+27,39],[x+45,44],[x+27,49]],'#b8785c')}if(inside){poly(c,[[9,15],[240,40],[470,15]],'#c4af84');rect(c,235,36,6,20,'#9b795a')}}
  if(k===15){for(const x of [12,427]){rect(c,x,68,41,77,p.wall);poly(c,[[x-4,70],[x+6,47],[x+21,38],[x+36,49],[x+45,70]],'#8ca8aa');rect(c,x+18,76,5,19,'#57858b');rect(c,x+8,108,25,3,accent);for(let j=0;j<4;j++)rect(c,x+j*12,138-j%2*9,4,4,'#a2b9a4')}if(inside)for(let i=0;i<5;i++)rect(c,95+i*71,19,3,3,accent)}
 }

 if(s.heritage?.familyId==='hero'){rect(c,462,69,3,37,'#d5d4b5');rect(c,455,88,17,3,'#bfb57f')}
 if(s.heritage?.familyId==='demonKing'){poly(c,[[458,82],[449,69],[460,76],[471,68],[465,83]],'#b38b9a');rect(c,458,82,7,17,'#d8b98a')}
}
function nativeBackground(c,s,scene,t){
 const env=scene.environment,p=palette(scene.realm),accent=['#b8c59b','#aaa6c5','#ceb688','#8bb5b0'][scene.realm%4];
 const water=['river-sanctuary','reef-home','open-ocean'].includes(env),cave=['cave-warren','stone-niche','root-hollow'].includes(env);
 rect(c,0,0,480,180,water?'#3d6974':cave?'#343e40':p.sky);
 const rock=(x,y,w,h,col)=>poly(c,[[x,y+h],[x+4,y+5],[x+w*.4,y],[x+w-3,y+7],[x+w,y+h]],col);
 const grass=(x,y,col)=>{for(let i=0;i<4;i++)poly(c,[[x+i*3,y],[x+i*3-4+Math.round(Math.sin(t+i)),y-10-i%2*6],[x+i*3+2,y]],col)};
 const nest=(x,y,w=60)=>{for(let j=0;j<4;j++)rect(c,x-j*3,y+j*3,w+j*6,3,j%2?'#8e8163':'#a6966f');rect(c,x+7,y+2,w-14,3,'#c2b48c')};
 if(water){
  for(let i=0;i<6;i++)poly(c,[[i*94-30,0],[i*94+9,0],[i*94+96,180],[i*94+61,180]],'#a9d4ba0d');
  poly(c,[[0,149],[79,136],[149,151],[262,140],[366,148],[480,134],[480,180],[0,180]],env==='river-sanctuary'?'#7e9b85':'#88a99a');
  for(let i=0;i<18;i++){const x=(i*43+scene.realm*11)%480,y=26+(i*31+180-Math.floor(t*(7+i%3)))%132;rect(c,x,y,2,2,'#abd5c580')}
  for(const x of [22,56,378,434]){const sway=Math.round(Math.sin(t+x)*3);poly(c,[[x,162],[x-6+sway,107],[x+2+sway,115],[x+5,163]],'#527e70');poly(c,[[x+5,153],[x+16+sway,123],[x+20+sway,117],[x+12,160]],'#76a38c')}
  if(env==='reef-home'){for(const [x,h] of [[78,53],[332,37],[405,69]]){rect(c,x,155-h,7,h,'#ae8d8e');for(let j=0;j<3;j++){rect(c,x-12-j*3,157-h+j*15,25+j*5,5,j%2?accent:'#c4a79f');rect(c,x-13-j*3,147-h+j*15,4,12,'#c8aea7')}}rock(299,127,75,35,'#547d7a');rock(307,139,51,23,'#345f66')}
  if(env==='river-sanctuary'){for(const [x,w] of [[51,66],[319,106],[403,52]])rock(x,130,w,34,'#638a7c');for(let i=0;i<9;i++)rect(c,(i*59+Math.floor(t*12))%480,82+i%3*17,22,1,'#a9ccaf40')}
  if(env==='open-ocean'){poly(c,[[0,168],[112,154],[231,167],[351,155],[480,168],[480,180],[0,180]],'#496f72');for(let i=0;i<12;i++){const x=(i*37+Math.floor(t*11))%480,y=52+i%4*14;rect(c,x,y,6,2,i%2?accent:'#80b2ae');poly(c,[[x-3,y-2],[x,y+1],[x-3,y+4]],'#80b2ae')}}
 }else if(cave){
  rect(c,0,141,480,39,env==='root-hollow'?'#665d4c':'#686b5b');
  for(let i=0;i<10;i++)poly(c,[[i*52-8,0],[i*52+20,35+(i%3)*12],[i*52+47,0]],'#505c56');
  for(const x of [8,95,347,420]){rock(x,74,47,76,'#48554e');rock(x+9,114,27,40,env==='root-hollow'?'#81715a':'#7a826c')}
  if(env==='cave-warren'){for(const x of [56,335]){rock(x,76,76,73,'#657264');rock(x+14,93,47,57,'#283c3c');nest(x+14,149,46)}for(let i=0;i<7;i++)poly(c,[[35+i*66,127],[40+i*66,110-i%2*10],[47+i*66,129]],accent)}
  if(env==='stone-niche'){for(const x of [65,335]){rect(c,x,114,61,39,'#808575');rect(c,x+6,119,49,29,'#52685f');poly(c,[[x+19,140],[x+27,121],[x+38,141]],accent);rect(c,x+26,128,5,7,'#e0dfb3')}for(let i=0;i<8;i++)rect(c,27+i*57,162,8,2,accent)}
  if(env==='root-hollow'){for(const x of [45,137,352,442]){poly(c,[[x,0],[x+16,0],[x+4,92],[x+28,130],[x+20,136],[x-7,94]],'#8c7959');for(let j=0;j<4;j++){rect(c,x+12+j*6,135-j*3,2,18,accent);rect(c,x+10+j*6,133-j*3,6,3,'#b6b895')}}}
 }else{
  poly(c,[[0,111],[70,78],[149,99],[228,66],[328,105],[404,71],[480,102],[480,180],[0,180]],p.far);rect(c,0,145,480,35,p.ground);
  switch(env){
   case 'reed-marsh':rect(c,0,123,480,4,'#afc1a729');rect(c,12,128,174,3,'#c3cbb329');rect(c,0,136,480,44,'#658d80');poly(c,[[0,139],[92,128],[153,148],[231,151],[336,136],[480,141],[480,180],[0,180]],'#809b7b');rect(c,111,151,217,29,'#658e83');for(const x of [23,42,73,348,384,422,454]){const sw=Math.round(Math.sin(t+x)*2);rect(c,x,108,2,51,'#63764f');rect(c,x-1+sw,95,4,17,'#9c9568');grass(x,163,'#526f54')}for(let i=0;i<9;i++)rect(c,104+(i*31+Math.floor(t*7))%222,157+i%3*7,18,1,'#afc5a680');rock(300,140,30,14,'#82917b');for(const x of [127,172,273]){rect(c,x,166,12,2,'#a2b88c');rect(c,x+3,164,7,2,'#a2b88c');rect(c,x+6,164,2,2,'#638778')}for(const x of [44,386,424]){rect(c,x-2,96,5,12,'#a2946d');rect(c,x-3,98,7,5,'#b7a37b')}const dx=68+Math.floor(Math.sin(t*.9)*15);rect(c,dx,115,5,1,'#d0d3b0');rect(c,dx+2,113,1,5,'#d0d3b0');break;
   case 'dune-refuge':rect(c,0,112,480,68,'#c3ac81');poly(c,[[0,131],[128,94],[251,147],[403,111],[480,137],[480,180],[0,180]],'#d2b98b');rock(25,69,122,86,'#a08e70');rock(45,93,79,64,'#655f4e');for(let i=0;i<8;i++)rect(c,245+i*22,160-i%3*5,17,1,'#b09b75');grass(401,144,'#828761');break;
   case 'cliff-roost':rect(c,0,141,480,39,'#8e9480');poly(c,[[137,135],[169,125],[313,130],[348,148],[480,145],[480,180],[0,180],[0,145]],'#a3a68b');poly(c,[[0,0],[45,0],[71,102],[129,143],[0,161]],'#747f72');nest(48,137,76);nest(354,140,81);for(let i=0;i<6;i++)rect(c,(i*87+Math.floor(t*15))%480,32+i*12,19,1,'#e3e5ce50');break;
   case 'steppe-camp':for(let i=0;i<22;i++)grass(i*23,151+i%3*9,i%2?'#8d9b6e':'#a8ad7a');nest(41,150,64);rock(368,142,67,23,'#899578');break;
   case 'frost-den':rect(c,0,137,480,43,'#d1dcd0');rock(36,78,111,77,'#9bb7b6');rock(54,102,70,54,'#5c8593');rect(c,47,148,91,6,'#dbe2d3');for(let i=0;i<15;i++)rect(c,(i*43+Math.floor(t*3))%480,(i*37+Math.floor(t*12))%180,2,2,'#eef1de');break;
   case 'ember-nest':rect(c,0,139,480,41,'#696357');for(const x of [39,348]){nest(x,142,73);for(let i=0;i<8;i++)rect(c,x+8+i*7,149-(i+Math.floor(t*3))%3,5,2,i%2?'#d4ab70':'#ad7b5d')}for(let i=0;i<16;i++)rect(c,(i*37+scene.realm*3)%480,135-(i*17+Math.floor(t*14))%90,2,2,'#dec28c80');break;
   case 'tree-village':for(const x of [45,131,360,435]){rect(c,x,3,12,150,'#7b8060');poly(c,[[x-40,10],[x+8,0],[x+58,20],[x+43,47],[x-35,41]],p.near)}for(const x of [50,337]){rect(c,x,125,94,6,'#b0a279');rect(c,x+12,131,4,25,'#77795a');rect(c,x+73,131,4,25,'#77795a');poly(c,[[x-9,104],[x+41,79],[x+103,104]],'#8f9b71')}break;
   case 'web-canopy':for(const x of [28,395]){rect(c,x,0,17,162,'#777d61');for(let i=0;i<5;i++){poly(c,[[x+8,45+i*15],[240,79+i*17],[448,45+i*15],[240,81+i*17]],'#bbcab780')}}for(let i=0;i<8;i++)rect(c,23+i*60,146+i%2*4,51,1,'#d0d6bc');break;
   case 'spirit-grove':rect(c,0,0,480,180,'#4a6261');for(const x of [35,100,368,430])tree(c,x,154,110,'#557969');rect(c,0,155,480,25,'#697c65');for(let i=0;i<35;i++){const x=(i*61+scene.realm*7)%480,y=35+(i*29+Math.floor(t*(2+i%4)))%121;rect(c,x,y,2,2,i%3?accent:'#dedfb0')}break;
   case 'moss-glade':for(const x of [31,82,389,446])tree(c,x,153,100,p.near);rect(c,0,143,480,37,'#9cae7d');for(let i=0;i<24;i++){const x=i*23%480,y=150+i%4*7;rect(c,x,y,11,3,'#b8bf8d');rect(c,x+4,y-5,2,6,'#718d64');rect(c,x+2,y-7,6,3,accent)}break;
  }
 }
 // Mineral, light and vegetation colours retain the region without adding human buildings.
 for(let i=0;i<13;i++){const x=(i*47+scene.realm*17)%474,y=166+(i*11+scene.realm*3)%12;rect(c,x,y,3+i%4,2,i%3?accent:p.near)}
}
function nativeNewborn(c,x,y,scale,s,age,race){
 if(typeof Ecology==='undefined'||!race||age>=2)return false;const p=Ecology.profile(race);if(p.origin==='birth'&&p.body!=='quad')return false;
 const skin=RACES[race][3],ink='#34473e';c.save();c.translate(Math.round(x),Math.round(y+22*scale));c.scale(scale*.8,scale*.8);
 if(p.origin==='birth'&&p.body==='quad'){c.restore();drawPerson(c,x-2*scale,y+13*scale,scale*.64,s,3);return true}
 if(['egg','roe'].includes(p.origin)){poly(c,[[5,17],[5,6],[10,-1],[19,-1],[24,7],[24,17],[20,22],[9,22]],'#d7d3b1');rect(c,8,15,5,3,skin);rect(c,17,6,4,3,skin);rect(c,10,1,8,2,'#eee3c0')}
 else if(['seed','spore','bud'].includes(p.origin)&&p.body!=='gel'){rect(c,5,18,21,5,'#7f9269');rect(c,14,3,4,16,skin);poly(c,[[15,10],[6,6],[5,1],[14,4]],skin);poly(c,[[17,6],[23,-1],[28,1],[23,7]],skin);rect(c,15,12,1,2,ink)}
 else if(p.body==='gel'){poly(c,[[0,21],[2,9],[9,3],[21,4],[29,15],[26,23]],skin);rect(c,8,14,2,2,ink);rect(c,18,14,2,2,ink);rect(c,4,10,5,2,'#d0dbc0')}
 else{poly(c,[[2,22],[5,5],[14,-3],[23,6],[27,22]],skin);rect(c,10,9,8,7,'#ddd9b0');rect(c,12,11,4,3,ink);if(p.origin==='ember')poly(c,[[6,4],[11,-7],[15,0],[20,-5],[23,5]],'#dec181')}
 c.restore();return true;
}

function sceneBackground(c,s,scene,t){
 if(typeof Ecology!=='undefined'&&Ecology.nativeScenes.includes(scene.environment)){nativeBackground(c,s,scene,t);return}
 const p=palette(scene.realm),env=scene.environment,night=/ค่ำ|หลับ|กลางคืน/.test(scene.phase),wood=scene.realm===2?'#6b5a6d':scene.realm===6?'#6e9a94':'#a18b68';
 if(scene.interior){rect(c,0,0,480,180,p.wall||(scene.realm===2?'#706479':scene.realm===6?'#87aaa2':'#c1baa0'));rect(c,0,0,480,13,p.near);rect(c,0,141,480,39,scene.realm===2?'#625268':'#99866b');for(let y=146;y<180;y+=11)rect(c,0,y,480,1,'#6a695452');for(let x=0;x<480;x+=54)rect(c,x,143,1,37,'#665b4940');if(!['mine','dragon-lair','observatory'].includes(env)){rect(c,174,27,114,63,wood);rect(c,180,32,102,52,night?'#566474':p.sky);poly(c,[[180,84],[207,57],[233,76],[262,51],[282,70],[282,84]],p.far);rect(c,229,31,4,54,wood);rect(c,179,56,104,3,wood)}}
 else{rect(c,0,0,480,180,p.sky);poly(c,[[0,110],[52,72],[100,95],[156,52],[220,91],[288,61],[354,101],[420,53],[480,98],[480,180],[0,180]],p.far);poly(c,[[0,129],[68,103],[128,123],[194,95],[258,125],[328,96],[393,123],[454,101],[480,119],[480,180],[0,180]],p.near);atmosphere(c,{...s,kingdom:scene.realm},t,false);rect(c,0,146,480,34,p.ground)}
 // The floor plans deliberately differ between places; the protagonist stays readable near center.
 switch(env){
 case 'nursery':furnishings(c,'cradle',61,133,1.45,t,wood);furnishings(c,'toys',330,145,1.2,t,wood);furnishings(c,'wardrobe',377,103,1.7,t,wood);furnishings(c,'rug',167,158,2.2,t,wood);rect(c,73,30,28,4,'#b8a67b');for(let i=0;i<3;i++){rect(c,78+i*10,34,1,12,'#c7c9a2');rect(c,75+i*10,45+(i%2)*4,7,7,['#b6949e','#b9b675','#91ac9c'][i])}break;
 case 'bedroom':furnishings(c,'bed',38,138,2,t,wood);furnishings(c,'chest',357,137,1.6,t,wood);furnishings(c,'lamp',330,139,1.2,t,wood);furnishings(c,'rug',160,160,2.7,t,wood);break;
 case 'kitchen':furnishings(c,'hearth',38,133,1.55,t,wood);furnishings(c,'pot',57,76,1.05,t);furnishings(c,'table',319,140,2.1,t,wood);furnishings(c,'teapot',350,109,1,t);furnishings(c,'bottles',370,74,1.5,t);rect(c,362,77,86,4,wood);for(let i=0;i<4;i++)rect(c,323+i*18,30,7,13,'#ab9c75');break;
 case 'study':furnishings(c,'bookcase',38,120,2.3,t,wood);furnishings(c,'desk',326,137,2.1,t,wood);furnishings(c,'lamp',391,108,1.2,t,wood);furnishings(c,'globe',295,108,.9,t);furnishings(c,'writing-set',338,104,1,t);break;
 case 'music':furnishings(c,'harp',65,130,2.1,t,wood);furnishings(c,'drum',110,143,1.2,t,wood);furnishings(c,'easel',358,130,1.9,t,wood);for(let i=0;i<3;i++){const y=51+(i*17+Math.floor(t*9))%53;rect(c,131+i*15,y,4,4,'#786e57');rect(c,134+i*15,y-8,1,10,'#786e57')}break;
 case 'garden':rect(c,22,137,443,4,wood);for(let x=32;x<460;x+=37){rect(c,x,120,3,28,wood);rect(c,x+3,123,31,2,wood)}for(let i=0;i<5;i++)furnishings(c,i%2?'flowers':'planter',28+i*83,156,1.3,t,wood);rect(c,161,143,143,24,'#bac19b');break;
 case 'forge':furnishings(c,'furnace',40,137,2.1,t,wood);furnishings(c,'anvil',319,136,1.6,t,wood);furnishings(c,'weapon-rack',394,131,1.4,t,wood);for(let i=0;i<5;i++)rect(c,62+i*7,80-(i*11+Math.floor(t*25))%51,2,2,'#e3b76a');break;
 case 'alchemy':furnishings(c,'shelves',45,93,2.1,t,wood);furnishings(c,'bottles',50,72,1.8,t);furnishings(c,'cauldron',83,137,1.9,t);furnishings(c,'table',327,137,2.3,t,wood);furnishings(c,'bottles',337,108,1.8,t);rect(c,155,159,159,2,'#d6c799');rect(c,175,168,118,2,'#c9bd97');for(let i=0;i<5;i++)rect(c,74+i*10,98-(Math.floor(t*9)+i*9)%38,3,3,'#a3c7a38c');break;
 case 'clinic':furnishings(c,'cot',34,136,1.7,t,wood);furnishings(c,'cot',335,136,1.7,t,wood);rect(c,136,27,3,105,wood);rect(c,139,26,33,86,'#d7d5b3');furnishings(c,'medicine',336,66,1.7,t);rect(c,330,69,93,4,wood);rect(c,76,38,5,20,'#a07968');rect(c,69,45,19,5,'#a07968');break;
 case 'classroom':furnishings(c,'blackboard',33,93,1.65,t,wood);for(const x of [46,346])for(const y of [129,162])furnishings(c,'desk',x,y,1.35,t,wood);rect(c,358,33,75,45,wood);for(let row=0;row<4;row++){rect(c,365,41+row*9,60,1,'#6e6951');for(let col=0;col<6;col++)rect(c,370+col*8+(row%2)*3,38+row*9,4,6,'#d3b582')}break;
 case 'library':for(const x of [30,108,326,405])furnishings(c,'shelves',x,129,1.6,t,wood);rect(c,362,43,4,104,'#e1d2a7');rect(c,380,43,4,104,'#e1d2a7');for(let y=49;y<145;y+=14)rect(c,364,y,18,2,'#e1d2a7');furnishings(c,'scrolls',166,150,1.2,t);break;
 case 'market':for(const x of [26,332]){rect(c,x,94,4,58,wood);rect(c,x+106,94,4,58,wood);poly(c,[[x-8,95],[x+11,68],[x+89,68],[x+116,95]],'#bd9f82');for(let i=0;i<7;i++)rect(c,x+i*17,84,13,11,i%2?'#d3b78d':'#9c8a77');rect(c,x-2,131,114,8,wood);furnishings(c,'baskets',x+8,126,1.7,t,wood)}break;
 case 'guild':furnishings(c,'noticeboard',36,112,2.1,t,wood);furnishings(c,'table',323,137,2.8,t,wood);furnishings(c,'map-stand',349,96,1.4,t,wood);rect(c,174,37,109,4,wood);for(let i=0;i<4;i++)rect(c,185+i*24,42,13,9,'#ddc795');break;
 case 'barracks':furnishings(c,'target',52,132,1.7,t,wood);furnishings(c,'dummy',340,137,1.8,t,wood);furnishings(c,'weapon-rack',402,133,1.2,t,wood);house(c,139,106,48,37,p);rect(c,160,91,3,53,wood);poly(c,[[163,91],[188,96],[163,109]],'#a56d61');break;
 case 'council':rect(c,169,131,144,8,'#b0a385');rect(c,181,124,121,7,'#c9bd98');furnishings(c,'throne',351,126,1.9,t,wood);for(const x of [62,142,300,428]){rect(c,x,31,12,109,'#c5b99b');rect(c,x-4,25,20,7,'#dfd1ae')}for(const x of [89,401]){rect(c,x,33,26,52,p.roof);poly(c,[[x,85],[x+13,98],[x+26,85]],p.roof);rect(c,x+11,45,4,22,'#cfba81')}break;
 case 'shrine':furnishings(c,'altar',54,135,2,t,wood);furnishings(c,'bell',367,116,2,t,wood);for(let i=0;i<4;i++)furnishings(c,'candles',171+i*38,142,.9,t,wood);rect(c,0,139,480,4,'#b6b393');break;
 case 'farm':house(c,319,100,96,46,p);poly(c,[[309,102],[366,61],[425,102]],'#8d6c54');rect(c,349,114,36,32,'#655844');for(let row=0;row<3;row++)for(let i=0;i<11;i++){const x=15+i*41,y=154+row*9;rect(c,x,y,31,2,'#786c4f');rect(c,x+10,y-9,2,9,'#a5ae73');rect(c,x+7,y-10,8,3,'#cfbf7c')}rect(c,64,66,8,69,'#947d5b');const turn=Math.floor(t*3)%4;rect(c,35,82+turn%2,67,4,'#c7b88e');rect(c,66+turn%2,52,4,68,'#c7b88e');break;
 case 'mine':rect(c,0,0,480,180,'#3d4948');for(let i=0;i<11;i++)poly(c,[[i*47-9,0],[i*47+16,38+i%3*13],[i*47+35,0]],'#59645a');for(const x of [31,127,322,419]){rect(c,x,35,10,110,'#6a6350');rect(c,x-8,31,75,9,'#776b55')}rect(c,0,145,480,35,'#655f4b');for(let x=0;x<480;x+=28){rect(c,x,156,21,4,'#8a7d60')}rect(c,0,152,480,2,'#a7aba0');rect(c,0,169,480,2,'#a7aba0');furnishings(c,'chest',342,142,1.8,t,'#7d8a7c');for(let i=0;i<7;i++)poly(c,[[49+i*57,111],[53+i*57,86-i%3*7],[60+i*57,111]],['#94b9ae','#c6b28c','#a0a6c3'][i%3]);break;
 case 'forest':for(const [x,h] of [[25,111],[79,98],[136,124],[334,118],[405,108],[459,132]])tree(c,x,156,h,scene.realm===2?'#6b5a75':scene.realm===6?'#537f75':scene.realm===7?'#5e7053':'#4c6b53');rect(c,116,157,93,12,'#74664d');rect(c,118,155,12,16,'#aa9670');for(let i=0;i<8;i++){rect(c,31+i*57,167-i%3*4,3,7,'#ccbda2');rect(c,27+i*57,161-i%3*4,12,6,'#a3837c')}break;
 case 'waterfall':poly(c,[[0,0],[149,0],[158,129],[116,148],[0,149]],p.near);poly(c,[[327,0],[480,0],[480,147],[300,151]],p.near);rect(c,165,25,126,121,'#a8c7bd');for(let i=0;i<13;i++)rect(c,171+i*9,27+(i*13+Math.floor(t*41))%108,3,26,'#d1e1ce');rect(c,131,141,205,39,'#82a99d');for(let i=0;i<8;i++)rect(c,139+i*26,151+i%3*9,18,2,'#c9dfce');break;
 case 'mountain':poly(c,[[0,145],[84,23],[166,137],[251,10],[348,145]],'#798d84');poly(c,[[60,59],[84,23],[109,58],[87,49]],'#e0dfc6');poly(c,[[225,49],[251,10],[277,51],[250,37]],'#e0dfc6');poly(c,[[0,154],[70,147],[134,163],[200,151],[282,169],[363,147],[480,159],[480,180],[0,180]],'#b3a581');for(let i=0;i<8;i++)rect(c,334+i*15,144+(i<4?i:7-i),13,3,'#c7bb96');rect(c,331,124,2,34,wood);rect(c,451,125,2,34,wood);rect(c,331,128,121,1,'#dbcb9d');break;
 case 'snowpass':rect(c,0,145,480,35,'#d6dfcf');poly(c,[[0,134],[81,22],[167,141],[259,17],[348,138],[413,48],[480,136]],'#c3d1c5');poly(c,[[57,58],[81,22],[107,58],[83,50]],'#f1eddb');house(c,344,113,77,37,p);poly(c,[[334,117],[382,79],[430,116]],'#ece9d6');for(let i=0;i<19;i++)rect(c,(i*41+Math.floor(t*7))%480,(i*31+Math.floor(t*20))%180,2,2,'#f5f3e3');break;
 case 'desert':rect(c,0,76,480,104,'#c1a77e');poly(c,[[0,111],[79,73],[158,105],[277,64],[381,105],[480,78],[480,180],[0,180]],'#d0b48a');poly(c,[[28,145],[72,86],[118,145]],'#a48c70');rect(c,71,86,3,63,wood);rect(c,52,132,34,15,'#6e6551');furnishings(c,'travel-pack',366,140,1.9,t,wood);for(let i=0;i<4;i++)rect(c,342+i*23,154+i%2*4,13,2,'#9d8d64');break;
 case 'coast':rect(c,0,97,480,83,'#7baba9');rect(c,0,140,480,40,'#d3bf91');for(let i=0;i<13;i++){rect(c,(i*43+Math.floor(t*9))%480,112+i%4*8,29,2,'#c6ded1')}for(const x of [36,408]){rect(c,x,78,6,70,'#8c7856');poly(c,[[x+3,83],[x-32,69],[x-40,78],[x+2,74],[x+29,55],[x+42,63],[x+7,78],[x+34,87]],'#6e8c63')}for(let i=0;i<8;i++){rect(c,20+i*61,160+i%3*5,5,3,'#eee0bc')}break;
 case 'ship':rect(c,0,74,480,106,'#628d98');for(let i=0;i<14;i++)rect(c,(i*41+Math.floor(t*17))%480,88+i%4*12,24,2,'#b8d5cb');rect(c,0,136,480,44,'#9f8766');for(let i=0;i<5;i++)rect(c,0,143+i*9,480,1,'#6e6551');rect(c,71,24,7,128,'#796a50');poly(c,[[83,29],[155,110],[83,110]],'#ddd4b3');rect(c,392,22,7,130,'#796a50');poly(c,[[385,29],[315,110],[385,110]],'#dfd5b1');rect(c,0,124,480,5,'#c4b388');for(let x=5;x<480;x+=31)rect(c,x,128,3,24,'#786a52');break;
 case 'port':rect(c,0,128,480,52,'#729b9e');rect(c,0,145,480,35,'#9e8a6e');for(let x=0;x<480;x+=23)rect(c,x,146,1,34,'#756b56');rect(c,82,52,31,87,'#c4bfa1');rect(c,76,47,43,9,'#838c79');rect(c,77,34,41,14,'#e1c78e');poly(c,[[71,34],[98,18],[126,34]],p.roof);furnishings(c,'boat-model',341,130,2.5,t,wood);furnishings(c,'baskets',23,162,1.3,t,wood);break;
 case 'river':rect(c,0,122,480,44,'#7baba9');for(let i=0;i<14;i++)rect(c,(i*37+Math.floor(t*10))%480,129+i%3*10,24,1,'#b9d8c5');poly(c,[[88,145],[129,116],[345,116],[391,145]],'#a3926d');rect(c,109,121,258,4,'#c6b58e');for(let i=0;i<14;i++)rect(c,115+i*17,110,2,19,wood);for(let i=0;i<8;i++){rect(c,18+i*62,155,2,19,'#8a9f71');rect(c,17+i*62,148,5,8,'#b5a06f')}break;
 case 'border':rect(c,41,45,70,102,'#9b9d85');rect(c,365,45,70,102,'#9b9d85');rect(c,36,38,80,10,'#b8b79a');rect(c,360,38,80,10,'#b8b79a');rect(c,108,64,260,14,'#aeaa8c');rect(c,178,82,6,62,wood);rect(c,303,82,6,62,wood);poly(c,[[178,84],[201,92],[178,105]],'#c8b781');poly(c,[[309,84],[333,92],[309,105]],p.roof);rect(c,138,148,217,32,'#c9ba92');break;
 case 'ruins':for(const [x,h] of [[35,56],[99,95],[356,71],[422,99]]){rect(c,x,145-h,19,h,'#929981');rect(c,x-5,139-h,29,7,'#b0b297');poly(c,[[x,144-h],[x+7,134-h],[x+17,144-h]],'#b9baa3');for(let i=0;i<4;i++)rect(c,x+2+(i%2)*6,146-h+i*13,3,11,'#77966b')}for(let i=0;i<4;i++)rect(c,162-i*13,148+i*7,151+i*26,7,'#a8ab8e');break;
 case 'dragon-lair':rect(c,0,0,480,180,'#444a4d');for(let i=0;i<13;i++){poly(c,[[i*40-8,0],[i*40+14,44+(i%3)*17],[i*40+35,0]],'#69705f')}rect(c,0,145,480,35,'#6a6551');for(let i=0;i<54;i++)rect(c,23+(i*37)%132,143-(i*13)%29,5,3,i%3?'#c6ae69':'#ddc98b');furnishings(c,'treasure-chest',47,131,1.6,t,wood);furnishings(c,'egg-warmer',350,139,1.8,t,wood);rect(c,346,134,59,5,'#a89969');break;
 case 'workshop':furnishings(c,'loom',44,129,1.85,t,wood);furnishings(c,'workbench',323,140,2.7,t,wood);furnishings(c,'pottery',332,107,1.9,t,wood);for(let i=0;i<6;i++){rect(c,49+i*16,27,2,16,wood);rect(c,46+i*16,43,8,9,'#b7b797')}break;
 case 'observatory':rect(c,0,0,480,142,'#556276');for(let i=0;i<28;i++)rect(c,(i*67+13)%480,13+(i*31)%104,Math.floor(t*4+i)%8<3?2:1,1,'#e4d7aa');poly(c,[[0,22],[115,0],[239,0],[239,8],[119,8],[0,31]],'#9a9a83');poly(c,[[480,22],[366,0],[243,0],[243,8],[362,8],[480,31]],'#9a9a83');furnishings(c,'telescope',340,133,2.2,t,wood);furnishings(c,'star-chart',46,131,2.1,t,wood);furnishings(c,'desk',110,144,1.2,t,wood);break;
 }
 realmArchitecture(c,s,scene);
}
function purchasedDecor(c,s,scene,t){
 const ids=s.lifeChoices?.inventory;if(!Array.isArray(ids)||!ids.length)return;
 const catalog=typeof LifeChoices!=='undefined'?LifeChoices.shop:[];
 const selected=ids.map(id=>catalog?.find(x=>x.id===id)||{id,prop:id}).filter(item=>!item.scene||item.scene===scene.environment||scene.interior&&['reading-lamp','pet-bed','travel-pack','treasure-chest'].includes(item.prop)).slice(-4);
 selected.forEach((item,i)=>{if(item.ecologyHabitats){const x=18+i*49;rect(c,x,170,29,3,'#7c8d6b');for(let j=0;j<4;j++)poly(c,[[x+j*7,170],[x+3+j*7,158-j%2*5],[x+7+j*7,170]],['#b5c5a0','#9bbcb1','#b9b087','#9fabbf'][i%4]);return}furnishings(c,item.prop||item.id,14+i*44,172,.78,t,'#9b865f')});
}

// Small, scene-specific pixel motions. Coordinates are deterministic and never
// affect game state; a stopped clock simply renders the same frame again.
function sceneMotionLayer(c,s,scene,t){
 const env=scene.environment,seed=s.seed>>>0,phase=Math.floor(t*8),px=(n,m)=>((n%m)+m)%m;
 if(['forest','tree-village','garden','spirit-grove'].includes(env)){for(let i=0;i<12;i++){const x=px(seed+i*67+phase*2,480),y=42+px(i*39+Math.floor(t*5)+(seed%31),102);rect(c,x,y,3,2,i%3?'#e5dca389':'#b5d5a18a')}}
 if(['coast','ship','port','river','river-sanctuary','reef-home','open-ocean','waterfall'].includes(env)){for(let i=0;i<11;i++){const x=px(i*63+phase*3+(seed%47),510)-20,y=153+(i%4)*5;rect(c,x,y,20+i%3*5,2,'#d1e5d291')}}
 if(['forge','mine','ember-nest','dragon-lair'].includes(env)){for(let i=0;i<10;i++){const x=30+px(i*41+seed+Math.floor(t*7),420),y=135-px(i*17+phase,95);rect(c,x,y,2+i%2,3,i%2?'#e2ac658c':'#f6d39aa6')}}
 if(['alchemy','study','observatory','spirit-grove'].includes(env)){for(let i=0;i<8;i++){const x=35+px(seed+i*53,405),y=32+px(i*27-Math.floor(t*5),100);if((phase+i*3)%19<12){rect(c,x,y,3,3,'#e6dca3b8');rect(c,x+1,y-2,1,7,'#efe3b5a8')}}}
 if(['kitchen','nursery','bedroom','workshop'].includes(env)){for(let i=0;i<5;i++){const y=95-px(phase+i*14,47),x=61+i*3+Math.round(Math.sin(t+i)*2);rect(c,x,y,3,3,'#ede3c47a')}}
 if(['mountain','snowpass','border','ruins','desert'].includes(env)){for(let i=0;i<8;i++){const x=px(i*73+phase*4+seed,500)-10,y=78+(i%5)*13;rect(c,x,y,8+i%3*3,1,'#eee7cf88')}}
}
function drawScene(canvas,s,time=0){
 sceneTime=time;if(!canvas)return;const c=canvas.getContext('2d');if(!c)return;
 const moment=s.diary?.entries?.find(e=>!e.legacyAgeMismatch&&!e.legacyEcologyMismatch),f=feature(c,s,moment),scene=typeof SceneCatalog!=='undefined'?SceneCatalog.resolve(s):{environment:'garden',realm:s.kingdom,label:'สวน',interior:false,phase:moment?.phase||'',season:moment?.season||''};
 c.clearRect(0,0,canvas.width,canvas.height);c.save();c.imageSmoothingEnabled=false;c.scale(canvas.width/480,canvas.height/180);
 sceneBackground(c,s,scene,time);
 sceneMotionLayer(c,s,scene,time);
 const deity=typeof FaithLore==='undefined'?null:FaithLore.find(g=>g.id===(s.calendar?.pending&&s.event?.faithOnly||moment?.deityMark));if(deity){const x=357,y=28+Math.floor(Math.sin(time*1.4)),colour=deity.colour;rect(c,x-12,y-12,58,47,'#e6e6d2b0');rect(c,x+15,y-6,3,31,colour);for(let i=0;i<4;i++){rect(c,x+i*9,y+7+i%2*3,5,3,colour);if(deity.sigil==='horn'||deity.sigil==='wing'){rect(c,x-4+i*3,y-5+i*4,4,7,colour);rect(c,x+34-i*3,y-5+i*4,4,7,colour)}if(deity.sigil==='root')rect(c,x+i*9,y+14,2,9,colour)}if(deity.sigil==='sun'||deity.sigil==='eye'){rect(c,x+5,y+1,25,16,colour);rect(c,x+13,y+5,9,8,'#e9e7d1')}rect(c,x-5,y+28,42,2,colour);}
 const threat=moment?.worldThreat;if(threat){const colours={demon:'#9e5e64',lich:'#8b94a6',grail:'#c2a768',tide:'#619fac'},colour=colours[threat]||'#8b846c';for(let i=0;i<5;i++){const x=325+i*24;rect(c,x,25+i%2*10,2,25,colour);poly(c,[[x+2,25+i%2*10],[x+14,29+i%2*10],[x+2,35+i%2*10]],colour)}if(threat==='tide')for(let i=0;i<8;i++)rect(c,(i*62+Math.floor(time*7))%480,165+i%2*6,37,2,'#b3d3c2');}
 if(!s.sceneOnly){const specificGuest=s.calendar?.pending&&typeof VisualMemory!=='undefined'?VisualMemory.actor(s,s.event?.context):moment?.guest||moment?.visual?.guest||null;const title=f.title||'',family=household(s).filter(m=>m.alive&&(!['river-sanctuary','reef-home','open-ocean'].includes(scene.environment)||Ecology.profile(m.race).water)),bio=Engine.biological(s),isHome=['nursery','bedroom','kitchen','study','music','garden',...(typeof Ecology!=='undefined'?Ecology.nativeScenes:[])].includes(scene.environment);let kin=[];
 if(isHome){if(/รัก|คู่ชีวิต|ชา|แต่งงาน/.test(title))kin=[family.find(m=>m.id==='partner')||family[0]].filter(Boolean);else if(/ลูก|เด็กของคุณ/.test(title))kin=family.filter(m=>m.id.startsWith('child-')).slice(0,2);else kin=family.filter(m=>!m.id.startsWith('partner')&&!m.id.startsWith('child-')).slice(0,2)}
 if(isHome&&specificGuest){const known=family.find(m=>m.name===specificGuest.name);if(known&&!kin.includes(known))kin=[kin[0],known].filter(Boolean)}kin.forEach((m,i)=>drawPerson(c,160+i*29,121,1.02,{...s,race:m.race,look:m.look},memberAge(s,m),m));
 if(bio>=4&&!s.dead&&(!['river-sanctuary','reef-home','open-ocean'].includes(scene.environment)||!specificGuest||Ecology.profile(specificGuest.race).water)&&(specificGuest&&!kin.some(m=>m.name===specificGuest.name)||!isHome&&['classroom','market','guild','barracks','council','clinic','border','workshop'].includes(scene.environment))){const guest={...s,job:null,race:specificGuest?.race??s.race,look:specificGuest?.look||{hair:(s.seed+12)%5,coat:(s.seed>>>6)%8,eyes:(s.seed>>>9)%3}};drawPerson(c,287,119,1.12,guest,specificGuest?.age??(scene.environment==='classroom'?Math.max(5,Math.min(17,bio)):30),family.find(m=>m.name===specificGuest?.name)||specificGuest||{name:'ผู้สัญจร',look:guest.look,race:guest.race})}
 const walking=!s.dead&&bio>=4&&['border','mountain','snowpass','forest','ruins'].includes(scene.environment),step=walking?Math.round(Math.sin(time*.75)*(bio>=60?7:13)):0;
 if(s.dead)drawRemembrance(c,219,139,1.3,s);else{actorWalking=walking;try{drawPerson(c,213+step,109,1.75,s,bio)}finally{actorWalking=false}}
 if(s.pet)drawPet(c,266+step,149,1.05,s.pet);
 purchasedDecor(c,s,scene,time);}
 if(['river-sanctuary','reef-home','open-ocean'].includes(scene.environment)){for(let i=0;i<12;i++)rect(c,(i*43+Math.floor(time*5))%480,157+i%3*6,24,1,'#a7d3bd25')}
 if(!scene.interior&&!(typeof Ecology!=='undefined'&&Ecology.nativeScenes.includes(scene.environment))){atmosphere(c,{...s,kingdom:scene.realm},time,true);if(/ฝน/.test(scene.season)){for(let i=0;i<27;i++){const x=(i*67+Math.floor(time*41))%480,y=(i*31+Math.floor(time*83))%180;rect(c,x,y,1,6,'#dfece080')}}}
 else if(['kitchen','bedroom','nursery'].includes(scene.environment)&&/ค่ำ|หลับ/.test(scene.phase)){rect(c,0,0,480,180,'#34415226');furnishings(c,'lamp',309,138,1,time)}
 if(/ค่ำ|หลับ/.test(scene.phase)&&!scene.interior)rect(c,0,0,480,180,'#28394b30');
 if(s.calendar?.pending){rect(c,12,11,6,6,'#dfc184');rect(c,22,13,35,2,'#eadbb2')}
 c.restore();return scene;
}
function drawPortrait(canvas,s){sceneTime=0;if(!canvas)return;const c=canvas.getContext('2d');if(!c)return;c.clearRect(0,0,canvas.width,canvas.height);const p=palette(s.kingdom);if(s.race&&typeof Ecology!=='undefined'){c.save();c.scale(canvas.width/480,canvas.height/180);nativeBackground(c,s,{environment:Ecology.profile(s).scene,realm:s.kingdom},0);c.restore()}else{rect(c,0,0,canvas.width,canvas.height,p.sky);rect(c,0,92,canvas.width,58,p.near);if(s.kingdom===1||s.kingdom===5){for(let x=8;x<canvas.width;x+=31)tree(c,x,111,47,p.near)}else{rect(c,12,70,34,57,'#a99f7b');rect(c,8,67,44,6,'#c9b98f');rect(c,121,75,40,52,'#9b8b6a');poly(c,[[117,77],[142,58],[166,77]],'#615c4c')}}const relatives=household(s).filter(m=>m.alive);relatives.slice(0,2).forEach((m,i)=>drawPerson(c,28+i*31,78,1.45,{...s,race:m.race,look:m.look},memberAge(s,m),m));if(s.dead)drawRemembrance(c,78,100,1.4,s);else drawPerson(c,69,51,2.4,s,Engine.biological(s));if(s.pet)drawPet(c,132,121,1.15,s.pet);rect(c,0,139,canvas.width,11,'#27343a4a')}
function spriteBounds(race){if(race===57)return [-26,40];if(race===50)return [-21,40];if(race>=48)return [48,49,51,52,54,55,56].includes(race)?[-21,40]:[-5,33];return ({8:[-4,44],13:[-5,31],30:[-12,37],32:[-8,33],50:[-21,39],57:[-26,40],69:[-10,39],36:[-20,45],37:[-10,36],38:[-7,31],39:[-9,34],40:[-26,44],41:[-12,25],43:[-7,31],44:[-1,29],47:[0,29]})[race]||[-5,31]}
function drawKin(canvas,s,member){sceneTime=0;if(!canvas||!member)return;const c=canvas.getContext('2d');if(!c)return;c.imageSmoothingEnabled=false;rect(c,0,0,canvas.width,canvas.height,(palette(s.kingdom)).sky);rect(c,0,47,canvas.width,25,(palette(s.kingdom)).near);const bounds=spriteBounds(member.race),scale=Math.min(1.42,(canvas.width-3)/(bounds[1]-bounds[0])),x=(canvas.width-(bounds[1]-bounds[0])*scale)/2-bounds[0]*scale;drawPerson(c,x,67-37*scale,scale,{...s,race:member.race,look:member.look},memberAge(s,member),member);rect(c,0,68,canvas.width,4,'#26353232');if(!member.alive){c.fillStyle='#e0e0d560';c.fillRect(0,0,canvas.width,canvas.height)}}
// Preview art uses fixed samples and never consumes the simulation's random stream.
function drawRacePreview(canvas,s,time=0){
 if(!canvas)return;const c=canvas.getContext('2d');if(!c)return;
 const previousTime=sceneTime;sceneTime=time;
 try{c.save();c.imageSmoothingEnabled=false;c.clearRect(0,0,canvas.width,canvas.height);c.scale(canvas.width/120,canvas.height/120);
 const p=palette(s.kingdom);if(s.race&&typeof Ecology!=='undefined'){c.save();c.scale(.25,2/3);nativeBackground(c,s,{environment:Ecology.profile(s).scene,realm:s.kingdom},time);c.restore()}else{rect(c,0,0,120,120,p.sky);poly(c,[[0,71],[24,47],[47,65],[80,39],[120,69],[120,120],[0,120]],p.far);rect(c,0,94,120,26,p.near);
 rect(c,23,106,74,5,'#394b4140');rect(c,27,103,66,4,'#c3c2a0');rect(c,31,100,58,3,'#e0d5b1')}
 const bounds=spriteBounds(s.race),scale=Math.min(2,104/(bounds[1]-bounds[0])),x=(120-(bounds[1]-bounds[0])*scale)/2-bounds[0]*scale;drawPerson(c,x,104-37*scale,scale,{...s,job:null},24);
 for(let i=0;i<4;i++){const x=12+i*29,y=19+(i*17)%36;if((Math.floor(time*4)+i)%7<4)rect(c,x,y,1,1,'#f5e6b8')}
 c.restore()}finally{sceneTime=previousTime}
}
function drawWelcome(canvas,s,time=0){
 if(!canvas)return;const c=canvas.getContext('2d');if(!c)return;
 const previousTime=sceneTime;sceneTime=time;
 try{c.save();c.imageSmoothingEnabled=false;c.clearRect(0,0,canvas.width,canvas.height);c.scale(canvas.width/480,canvas.height/180);
 landscape(c,s,null);atmosphere(c,s,time,false);house(c,340,108,44,40,palette(s.kingdom));house(c,70,113,38,35,palette(s.kingdom));
 tree(c,24,149,68,(palette(s.kingdom)).near);rect(c,134,149,206,31,'#c9b98a');rect(c,147,152,181,3,'#d7c79a');
 drawPerson(c,160,120,1.1,{race:0,rank:1,seed:31,look:{hair:1,coat:2}},32);
 drawPerson(c,290,125,1,{race:1,rank:2,seed:15,look:{hair:2,coat:0}},24);
 drawPerson(c,219,75,2.5,{...s,job:null},24);drawPet(c,268,147,1.1,{name:'แมว'});atmosphere(c,s,time,true);
 c.restore()}finally{sceneTime=previousTime}
}
return {drawScene,drawPortrait,drawKin,drawPerson,drawRacePreview,drawWelcome};
})();
