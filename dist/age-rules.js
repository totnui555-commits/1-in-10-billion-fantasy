'use strict';
/* Migrate pending questions to the same developmental rules as new lives. */
const AgeRules=(()=>{
function minimum(entry){const key=entry.key||'';if(key.startsWith('decision-'))return EVENTS.find(e=>e.id===key.slice(9))?.min??null;if(key.startsWith('growth-'))return Number(key.slice(7));if(entry.kind==='work')return 16;if(key.startsWith('career-'))return 16;return null}
function fitsRecord(s,record,min){const actual=record.age+Math.max(0,((record.month||1)-1)/12);return Number.isFinite(min)&&Engine.ageEquivalent(actual,s.race)+.001<min}
function migrateDevelopment(s){
 if(s.developmentRulesVersion===1)return s;
 const span=RACES[s.race][2],oldMaturity=Math.max(18,span*18/85);
 const convert=v=>{if(!Number.isFinite(v)||v<0)return v;const actual=v<=18?v*oldMaturity/18:oldMaturity+(v-18)*(span-oldMaturity)/67;return Engine.ageEquivalent(actual,s.race)};
 if(s.calendar&&Number.isFinite(s.calendar.nextDecision))s.calendar.nextDecision=convert(s.calendar.nextDecision);
 if(s.growth){if(Number.isFinite(s.growth.lastAge))s.growth.lastAge=convert(s.growth.lastAge);if(Array.isArray(s.growth.milestones))s.growth.milestones=s.growth.milestones.map(v=>v===20?18:v)}
 for(const a of [s.projects?.active,...(Array.isArray(s.projects?.paused)?s.projects.paused:[])])if(a&&Number.isFinite(a.lastBio))a.lastBio=convert(a.lastBio);
 for(const a of Object.values(s.stories?.arcs||{}))if(a&&typeof a==='object'){a.started=convert(a.started);a.updated=convert(a.updated)}
 s.developmentRulesVersion=1;return s;
}
function reconcile(s){
 const c=typeof Simulation==='undefined'?null:Simulation.ensure(s);
 if(s.ageRulesVersion!==3){
  for(const entry of s.diary?.entries||[]){const min=minimum(entry);if(fitsRecord(s,entry,min))entry.legacyAgeMismatch=true}
  for(const collection of [s.diary?.memories,s.stories?.memories])if(Array.isArray(collection)){for(let i=collection.length-1;i>=0;i--){const m=collection[i],e=EVENTS.find(e=>e.id===m.id);if(e&&fitsRecord(s,m,e.min))collection.splice(i,1)}}
  if(s.growth){const age=Engine.biological(s);s.growth.stage=LifeGrowth.stage(s).name;s.growth.lastAge=age;s.growth.milestones=s.growth.milestones.filter(v=>v<=age);if(age<6)s.growth.education='home'}
  if(s.job!==null&&Engine.biological(s)<16){const old=s.job;s.job=null;if(typeof Livelihood!=='undefined')Livelihood.careerChanged(s,old)}
  s.ageRulesVersion=3;
 }
 if(!s.dead&&c?.pending&&!Engine.eligible(s,s.event)){
  c.pending=false;s.outcome=null;s.journey=null;const pool=EVENTS.filter(e=>Simulation.isMajor(e)&&Engine.eligible(s,e));if(pool.length){const preferred=pool.filter(e=>e.childhood||e.childhoodStory),choices=preferred.length?preferred:pool;const e=choices[s.seed%choices.length];s.event={...e,context:WorldLore.context(s,c.count)};c.pending=true;c.nextDecision=Engine.biological(s)+1.6}else c.nextDecision=Math.max(4,Engine.biological(s)+.25);
 }
 if(!s.dead&&s.outcome&&!Engine.ageFits(s,s.event))s.outcome=null;
 return s;
}
return {reconcile,minimum,migrateDevelopment};
})();
