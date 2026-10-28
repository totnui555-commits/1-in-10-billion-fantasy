/* Integration draft for the game's accept-life button. Stored IDs are random,
   not names, race or gameplay data. The counter starts at installation. */
const BirthCounter=(()=>{
 const endpoint='https://fantasy-life-birth-counter.prompt-buddy-cloudflare.workers.dev/api/births',prefix='fantasy-birth-pending:';let current=null,flushing=null;
 function pending(){try{const ids=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(prefix))ids.push(k.slice(prefix.length))}return ids}catch{return []}}
 function paint(){document.querySelectorAll('[data-birth-count]').forEach(e=>{e.textContent=current===null?'—':current.toLocaleString(document.documentElement.lang==='en'?'en-US':'th-TH')});document.querySelectorAll('[data-birth-status]').forEach(e=>{e.hidden=current!==null})}
 async function update(){try{const r=await fetch(endpoint,{cache:'no-store'});if(!r.ok)throw Error();const v=await r.json();if(!Number.isSafeInteger(v.total)||v.total<0)throw Error();current=v.total;paint()}catch{document.querySelectorAll('[data-birth-status]').forEach(e=>{e.hidden=false;e.textContent=typeof GameLanguage!=='undefined'?GameLanguage.text('ยังเชื่อมต่อสถิติไม่ได้'):'ยังเชื่อมต่อสถิติไม่ได้'})}}
 async function doFlush(){for(const id of pending()){try{const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({lifeId:id})});if(!r.ok)break;localStorage.removeItem(prefix+id)}catch{break}}await update()}
 function flush(){if(!flushing)flushing=doFlush().finally(()=>{flushing=null});return flushing}
 function recordNewLife(s){if(!globalThis.crypto?.randomUUID)return;if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s.birthCounterId||''))s.birthCounterId=crypto.randomUUID();try{localStorage.setItem(prefix+s.birthCounterId,'1')}catch{}void flush().then(()=>{if(pending().includes(s.birthCounterId))void flush()})}
 return {recordNewLife,update,flush,paint};
})();
