'use strict';
// Browser integration uses an in-process mock transport. It never posts a birth
// or opens a presence socket against production.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const API = 'https://fantasy-life-birth-counter.prompt-buddy-cloudflare.workers.dev';
(async()=>{
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const sessions=new Set(),births=new Set(),errors=[];let posts=0;
 const online=()=>new Set([...sessions].filter(s=>s.visible).map(s=>s.visitor)).size;
 const snapshot=()=>({type:'stats',online:online(),total:births.size,updatedAt:new Date().toISOString()});
 function broadcast(){for(const s of sessions){try{s.ws.send(JSON.stringify(snapshot()))}catch{}}}
 async function context(){
  const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await c.addInitScript(()=>{window.__statsVisible=true;Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>window.__statsVisible?'visible':'hidden'})});
  await c.route(API+'/**',async route=>{
   const r=route.request(),path=new URL(r.url()).pathname;
   if(path==='/api/births'&&r.method()==='POST'){
    posts++;const b=JSON.parse(r.postData());births.add(b.lifeId);broadcast();
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({total:births.size,recorded:true,since:'installation'})});return;
   }
   if(path==='/api/stats'||path==='/api/births'){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(path==='/api/stats'?snapshot():{total:births.size,since:'installation'})});return;}
   await route.abort();
  });return c;
 }
 async function page(c){
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
  const owned=new Set();const remove=()=>{for(const s of owned)sessions.delete(s);owned.clear();broadcast()};p.on('close',remove);
  await p.routeWebSocket(/\/api\/live(?:\?|$)/,ws=>{
   const u=new URL(ws.url()),s={ws,visitor:u.searchParams.get('visitor'),visible:u.searchParams.get('visible')!=='0'};sessions.add(s);owned.add(s);
   ws.onMessage(raw=>{let msg;try{msg=JSON.parse(String(raw))}catch{return}if(['heartbeat','visibility'].includes(msg.type)&&typeof msg.visible==='boolean'){s.visible=msg.visible;broadcast()}});
   ws.onClose(()=>{sessions.delete(s);owned.delete(s);broadcast()});broadcast();
  });
  await p.goto('http://127.0.0.1:8765/?lang=th');await p.locator('#openBirth').waitFor();await p.waitForFunction(()=>document.querySelector('#worldLiveStats')?.dataset.connection==='live');return p;
 }
 async function count(p,selector,n){await p.waitForFunction(([s,n])=>document.querySelector(s)?.textContent===String(n),[selector,n]);}
 async function visibility(p,value){await p.evaluate(v=>{window.__statsVisible=v;document.dispatchEvent(new Event('visibilitychange'))},value);}
 const c1=await context(),a=await page(c1);await count(a,'[data-online-count]',1);await count(a,'[data-birth-count]',0);
 assert((await a.locator('#worldLiveStats').innerText()).includes('ออนไลน์ตอนนี้'));
 const tab=await page(c1);await count(tab,'[data-online-count]',1);await count(a,'[data-online-count]',1);assert.equal(sessions.size,2,'two sockets share one browser identity');
 const c2=await context(),b=await page(c2);await count(a,'[data-online-count]',2);await count(b,'[data-online-count]',2);
 await visibility(a,false);await count(b,'[data-online-count]',2); // Same-browser tab remains visible.
 await visibility(tab,false);await count(b,'[data-online-count]',1);
 await visibility(a,true);await count(a,'[data-online-count]',2);
 await a.locator('#openBirth').click();await a.locator('#acceptLife').waitFor();await a.locator('#worldLiveStats').waitFor({state:'visible'});assert.equal(posts,0);
 await a.locator('#rerollBirth').click();await a.locator('#acceptLife').waitFor();assert.equal(posts,0,'birth previews and rerolls are not accepted lives');
 await a.locator('#acceptLife').click();await count(a,'[data-birth-count]',1);await count(b,'[data-birth-count]',1);assert.equal(posts,1,'accepting life sends one event');assert.equal(await a.locator('#worldLiveStats').count(),1);
 assert.equal(await a.locator('#app #worldLiveStats').count(),0,'bar survives outside app rerenders');
 await a.evaluate(()=>save(true));await a.reload();await a.locator('#resumeLife').waitFor();await count(a,'[data-birth-count]',1);await a.locator('#resumeLife').click();await a.waitForTimeout(150);assert.equal(posts,1,'reload/resume does not start a new life');
 await b.selectOption('#gameLanguage','en');await b.waitForFunction(()=>document.querySelector('[data-live-label]')?.textContent==='Online now');assert((await b.locator('#worldLiveStats').innerText()).includes('Lives started'));
 await b.selectOption('#gameLanguage','th');await b.waitForFunction(()=>document.querySelector('[data-live-label]')?.textContent==='ออนไลน์ตอนนี้');
 assert(await b.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'390px viewport does not overflow');
 await b.screenshot({path:'/workspace/work/stats-v42-mobile.png',fullPage:false});
 // A failed connection must not invent an online count of zero. Dispatching the
 // browser's offline event makes the UI transition synchronously before retry.
 await b.evaluate(()=>window.dispatchEvent(new Event('offline')));
 assert.equal(await b.locator('[data-online-count]').textContent(),'—');assert.equal(await b.locator('[data-birth-count]').textContent(),'1');
 assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: live statbar, browser deduplication, visibility changes, live birth push, reroll/accept/resume semantics, TH/EN, mobile layout and offline fallback; no production mutations');
})().catch(e=>{console.error(e);process.exit(1)});
