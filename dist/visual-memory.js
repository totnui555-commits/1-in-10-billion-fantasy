'use strict';
// Historical images contain bounded, whitelisted visual data, never live state.
const VisualMemory=(()=>{
 const maxFrames=120;
 const finite=(n,a,b)=>typeof n==='number'&&Number.isFinite(n)&&n>=a&&n<=b;
 const integer=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
 const smallText=(s,max=100)=>typeof s==='string'&&s.length<=max;
 const visualIndex=n=>Number.isFinite(Number(n))?Math.max(0,Math.min(30,Math.floor(Number(n)))):0;
 const look=l=>({hair:visualIndex(l?.hair),coat:visualIndex(l?.coat),eyes:visualIndex(l?.eyes),...(Number.isInteger(l?.complexion)?{complexion:l.complexion}:{})});
 function actor(s,context={}){
  const active=s.projects?.active,who=context.npc||active?.cast?.name;if(typeof who!=='string'||!who||who.length>=100)return null;
  const member=(s.household?.members||[]).find(m=>m.alive&&m.name===who&&(m.id===context.relativeId||m.id===active?.cast?.memberId));
  let seed=s.seed>>>0;for(const ch of who)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
  return {name:who,race:member?.race??(integer(context.npcRace,0,RACES.length-1)?context.npcRace:active?.id==='goblin-treaty'?0:s.race),look:member?look(member.look):{hair:seed%6,coat:(seed>>>4)%8,eyes:(seed>>>8)%3},age:member?Engine.ageEquivalent(FamilyWorld.age(s,member),member.race):finite(context.npcAge,0,10000)?context.npcAge:30};
 }
 function validGuest(g){return g===null||g===undefined||!!g&&smallText(g.name)&&integer(g.race,0,RACES.length-1)&&validLook(g.look)&&finite(g.age,0,10000)}
 function capture(s,e){
  e.visual={version:1,ecology:s.ecology?{mode:s.ecology.mode,learning:s.ecology.learning}:undefined,guest:e.guest||(e.kind==='project'?actor(s):null),race:s.race,kingdom:s.kingdom,rank:s.rank,age:s.age,quarter:s.calendar?.quarter||0,seed:s.seed,look:look(s.look),job:s.job,dead:!!s.dead,
   pet:s.pet?{name:s.pet.name,bond:s.pet.bond,speciesId:s.pet.speciesId||null,health:s.pet.health??85,trained:s.pet.trained??0}:null,
   items:(s.lifeChoices?.inventory||[]).slice(0,typeof LifeChoices==='undefined'?36:LifeChoices.shop.length),hobby:s.lifeChoices?.hobby||null,
   cast:(s.household?.members||[]).slice(0,8).map(m=>({id:String(m.id).slice(0,80),name:String(m.name).slice(0,100),role:String(m.role).slice(0,200),occupation:String(m.occupation).slice(0,200),race:m.race,look:look(m.look),ageAtBirth:m.ageAtBirth,alive:m.alive,deathAge:m.deathAge??null}))};
  return e.visual;
 }
 function trim(entries){
  const photos=entries.filter(e=>e.visual);if(photos.length<=maxFrames)return;
  const keep=new Set(photos.slice(0,80));
  const birth=photos.find(e=>e.key==='birth');if(birth)keep.add(birth);
  for(const e of photos)if(keep.size<maxFrames&&['decision','growth','family','project','project-ending'].includes(e.kind))keep.add(e);
  for(const e of photos)if(keep.size<maxFrames)keep.add(e);
  for(const e of photos)if(!keep.has(e))delete e.visual;
 }
 function validLook(l){return !!l&&integer(l.hair,0,30)&&integer(l.coat,0,30)&&integer(l.eyes,0,30)&&(l.complexion===undefined||integer(l.complexion,0,5))}
 function validFrame(v){
  if(v?.ecology&&(!['native','exchange'].includes(v.ecology.mode)||!['native','exchange'].includes(v.ecology.learning)))return false;
  if(!v||!validGuest(v.guest)||v.version!==1||!integer(v.race,0,RACES.length-1)||!integer(v.kingdom,0,KINGDOMS.length-1)||!integer(v.rank,0,CLASSES.length-1)||!finite(v.age,0,10000)||!integer(v.quarter,0,3)||!integer(v.seed,0,4294967295)||!validLook(v.look)||!(v.job===null||integer(v.job,0,JOBS.length-1))||typeof v.dead!=='boolean')return false;
  const items=typeof LifeChoices==='undefined'?[]:LifeChoices.shop;
  if(!Array.isArray(v.items)||v.items.length>items.length||new Set(v.items).size!==v.items.length||!v.items.every(id=>items.some(x=>x.id===id))||!(v.hobby===null||v.items.includes(v.hobby)))return false;
  if(v.pet&&(!PETS.includes(v.pet.name)||!finite(v.pet.bond,0,100)||!finite(v.pet.health,0,100)||!finite(v.pet.trained,0,100)||!(v.pet.speciesId===null||typeof LifeChoices!=='undefined'&&LifeChoices.petCatalog.some(p=>p.id===v.pet.speciesId&&p.name===v.pet.name))))return false;
  return Array.isArray(v.cast)&&v.cast.length<=8&&v.cast.every(m=>m&&smallText(m.id,80)&&smallText(m.name)&&smallText(m.role,200)&&smallText(m.occupation,200)&&integer(m.race,0,RACES.length-1)&&validLook(m.look)&&finite(m.ageAtBirth,-10000,100000)&&typeof m.alive==='boolean'&&(m.deathAge===null||finite(m.deathAge,0,100000)));
 }
 function valid(s){const entries=s.diary?.entries||[];return entries.filter(e=>e.visual!==undefined).length<=maxFrames&&entries.every(e=>e.visual===undefined||validFrame(e.visual))}
 function has(e){return !!e?.visual&&validFrame(e.visual)}
 function sceneRecord(s,e){const realm=Number.isInteger(e.realm)?e.realm:KINGDOMS.findIndex(k=>k[0]===e.where);return {...e,legacyAgeMismatch:false,legacyEcologyMismatch:false,realm:realm>=0&&realm<KINGDOMS.length?realm:s.homeKingdom??s.kingdom}}
 function read(s,e){
  let entry=sceneRecord(s,e);const v=has(e)&&!e.legacyEcologyMismatch?e.visual:null;if(v?.guest)entry={...entry,guest:{...v.guest,look:{...v.guest.look}}};
  if(v)return {ecology:v.ecology?{...v.ecology}:undefined,race:v.race,kingdom:v.kingdom,homeKingdom:s.homeKingdom??v.kingdom,rank:v.rank,age:v.age,seed:v.seed,look:{...v.look},job:v.job,dead:v.dead,pet:v.pet?{...v.pet}:null,calendar:{quarter:v.quarter,pending:false},household:{members:v.cast.map(m=>({...m,look:{...m.look}}))},lifeChoices:{inventory:v.items.slice(),hobby:v.hobby},diary:{entries:[entry]}};
  // Older records retain their place, but cannot reconstruct who was present.
  return {race:s.race,kingdom:entry.realm,homeKingdom:s.homeKingdom??entry.realm,rank:s.rank,age:e.age||0,seed:s.seed,look:{...s.look},job:null,dead:false,pet:null,sceneOnly:true,calendar:{quarter:Math.max(0,Math.min(3,Math.floor(((e.month||1)-1)/3))),pending:false},household:{members:[]},lifeChoices:{inventory:[],hobby:null},diary:{entries:[entry]}};
 }
 function draw(canvas,s,e,time=0){if(!e||!canvas)return null;return Illustration.drawScene(canvas,read(s,e),time)}
 function caption(s,e){const scene=SceneCatalog.resolve(read(s,e),sceneRecord(s,e));return scene.label+' · '+(has(e)&&!e.legacyEcologyMismatch?'รูปลักษณ์และของใช้ที่บันทึกไว้ในวันนั้น':'ภาพสถานที่ประกอบ · บันทึกนี้ไม่ได้เก็บรูปลักษณ์ในวันนั้น')}
 return {capture,trim,has,valid,validFrame,read,draw,caption,maxFrames,actor};
})();
