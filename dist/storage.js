'use strict';
const LifeStorage=(()=>{
const WRITE_DELAY=200;
let connection=null,pending=null,timer=null,draining=null,archiveRef=null,archiveRevision=null;
const entryIds=new WeakMap();let nextEntryId=0;
const snapshot=value=>typeof structuredClone==='function'?structuredClone(value):JSON.parse(JSON.stringify(value));
function revision(archive){
 // Finished lives are immutable snapshots. Include their identities and save
 // revisions so an in-place unshift/splice or replaced/imported life is seen.
 return archive.map(a=>{if(!entryIds.has(a))entryIds.set(a,++nextEntryId);return [entryIds.get(a),a.seed,a.turn,a.age,a.dead,a.score,a.gold,a.ageRulesVersion,a.diary?.sequence,a.stories?.sequence,a.log?.length,a.seen?.length].join(':')}).join('|');
}
function open(){
 if(connection)return connection;
 let attempt;attempt=new Promise((resolve,reject)=>{
  if(!window.indexedDB){reject(Error('IndexedDB unavailable'));return}
  const request=window.indexedDB.open('aether-lives',1);let settled=false;
  request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('records'))request.result.createObjectStore('records')};
  request.onsuccess=()=>{const db=request.result;if(settled){db.close();return}settled=true;db.onversionchange=()=>{db.close();if(connection===attempt)connection=null};resolve(db)};
  request.onerror=()=>{settled=true;reject(request.error||Error('Storage could not open'))};
  request.onblocked=()=>{settled=true;reject(Error('Storage blocked'))};
 });
 connection=attempt;attempt.catch(()=>{if(connection===attempt)connection=null});return attempt;
}
async function write(batch){
 const db=await open(),nextRevision=revision(batch.archive),archiveChanged=archiveRef!==batch.archive||archiveRevision!==nextRevision;
 const life=snapshot(batch.life),archive=archiveChanged?snapshot(batch.archive):null;
 await new Promise((resolve,reject)=>{
  let tx;try{tx=db.transaction('records','readwrite');const store=tx.objectStore('records');store.put(life,'life');if(archiveChanged)store.put(archive,'archive')}catch(error){if(tx)try{tx.abort()}catch(e){}reject(error);return}
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Storage write failed'));tx.onabort=()=>reject(tx.error||Error('Storage write aborted'));
 });
 if(archiveChanged){archiveRef=batch.archive;archiveRevision=nextRevision}
}
function schedule(){if(timer!==null||draining)return;timer=setTimeout(()=>{timer=null;flush().catch(()=>{})},WRITE_DELAY)}
function save(life,archive){
 return new Promise((resolve,reject)=>{
  if(!Array.isArray(archive)){reject(Error('Invalid life archive'));return}
  if(!pending)pending={life,archive,waiters:[]};else{pending.life=life;pending.archive=archive}
  pending.waiters.push({resolve,reject});schedule();
 });
}
function flush(){
 if(timer!==null){clearTimeout(timer);timer=null}
 if(draining)return draining.then(()=>pending?flush():undefined);
 if(!pending)return Promise.resolve();
 draining=(async()=>{
  while(pending){const batch=pending;pending=null;try{await write(batch);for(const waiter of batch.waiters)waiter.resolve()}catch(error){for(const waiter of batch.waiters)waiter.reject(error);throw error}}
 })().finally(()=>{draining=null;if(pending)schedule()});
 return draining;
}
async function load(){
 await flush();const db=await open();return new Promise((resolve,reject)=>{
  const tx=db.transaction('records','readonly'),store=tx.objectStore('records'),life=store.get('life'),archive=store.get('archive');
  tx.oncomplete=()=>resolve({life:life.result,archive:archive.result});tx.onerror=()=>reject(tx.error||Error('Storage read failed'));tx.onabort=()=>reject(tx.error||Error('Storage read aborted'));
 });
}
return {load,save,flush};
})();
