// Existing cumulative count stays in D1. Live presence is transient and deduplicated
// by an anonymous browser identifier; no character names or life stories are sent.
const HEADERS = {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const GAME_ORIGIN = 'https://one-in-10-billion-fantasy.traisorn-th.chatgpt.site';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TTL = 75_000;
function reply(data,status=200,cors='') { return new Response(JSON.stringify(data),{status,headers:{...HEADERS,...(cors?{'access-control-allow-origin':cors,'vary':'Origin'}:{})}}); }
function live(env) { return env.LIVE_STATS?.get(env.LIVE_STATS.idFromName('global')); }
async function totalBirths(env) { const row=await env.DB.prepare('SELECT COUNT(*) AS total FROM birth_events').first();return Number(row.total); }
export default {
 async fetch(req,env) {
  try {
   const u=new URL(req.url),origin=req.headers.get('origin')||'',allowed=origin===u.origin||origin===GAME_ORIGIN,cors=allowed?origin:'';
   if(!['/api/births','/api/stats','/api/live'].includes(u.pathname))return reply({error:'not found'},404);
   if(req.method==='OPTIONS')return allowed?new Response(null,{status:204,headers:{'access-control-allow-origin':origin,'access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'content-type','vary':'Origin'}}):reply({error:'origin not allowed'},403);
   if(u.pathname==='/api/live') {
    if(!allowed)return reply({error:'origin not allowed'},403);
    if(req.method!=='GET'||req.headers.get('upgrade')?.toLowerCase()!=='websocket')return reply({error:'websocket required'},426,cors);
    if(!UUID.test(u.searchParams.get('visitor')||''))return reply({error:'invalid visitor'},400,cors);
    if(!live(env))return reply({error:'live statistics unavailable'},503,cors);
    return live(env).fetch(req);
   }
   if(u.pathname==='/api/stats') {
    if(req.method!=='GET')return reply({error:'method not allowed'},405,cors);
    if(!live(env))return reply({error:'live statistics unavailable'},503,cors);
    const response=await live(env).fetch(new Request('https://stats.internal/snapshot'));
    if(!response.ok)return reply({error:'live statistics unavailable'},503,cors);
    return reply(await response.json(),200,cors);
   }
   if(!env.DB)return reply({error:'counter unavailable'},503,cors);
   if(req.method==='GET')return reply({total:await totalBirths(env),since:'installation'},200,cors);
   if(req.method!=='POST')return reply({error:'method not allowed'},405,cors);
   if(!allowed)return reply({error:'origin not allowed'},403);
   if(!/^application\/json(?:;|$)/i.test(req.headers.get('content-type')||''))return reply({error:'invalid content type'},415,cors);
   if(Number(req.headers.get('content-length')||0)>512)return reply({error:'request too large'},413,cors);
   const raw=await req.text();if(raw.length>512)return reply({error:'request too large'},413,cors);
   let body;try{body=JSON.parse(raw)}catch{return reply({error:'invalid JSON'},400,cors);}
   if(!body||Object.keys(body).length!==1||typeof body.lifeId!=='string'||!UUID.test(body.lifeId))return reply({error:'invalid lifeId'},400,cors);
   const result=await env.DB.prepare('INSERT OR IGNORE INTO birth_events (life_id) VALUES (?)').bind(body.lifeId.toLowerCase()).run();
   const total=await totalBirths(env);
   // Count durability does not depend on presence availability. A later snapshot
   // refresh recovers a missed notification without adding a second birth.
   try { if(live(env))await live(env).fetch(new Request('https://stats.internal/birth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({total})})); }catch{}
   return reply({total,recorded:result.meta.changes===1,since:'installation'},200,cors);
  } catch { return reply({error:'counter unavailable'},503); }
 }
};

export class LiveStats {
 constructor(state,env) { this.state=state;this.env=env;this.total=0;this.loaded=false;this.checked=0;this.refreshing=null;this.lastOnline=null;this.lastTotal=null; }
 async refresh() {
  if(this.loaded&&Date.now()-this.checked<30_000)return;
  if(this.refreshing)return this.refreshing;
  this.refreshing=(async()=>{
   if(!this.loaded){const stored=await this.state.storage.get('total');if(Number.isSafeInteger(stored)&&stored>=0)this.total=stored;}
   const total=await totalBirths(this.env);
   if(!Number.isSafeInteger(total)||total<0)throw new Error('Invalid count');
   this.total=Math.max(this.total,total);this.loaded=true;this.checked=Date.now();
   await this.state.storage.put('total',this.total);
  })().finally(()=>{this.refreshing=null;});
  return this.refreshing;
 }
 online(excluded=null) {
  const visitors=new Set(),now=Date.now();
  for(const socket of this.state.getWebSockets()) {
   if(socket===excluded||(typeof socket.readyState==='number'&&socket.readyState!==1))continue;
   try{const p=socket.deserializeAttachment();if(p?.visible&&now-p.last<=TTL&&UUID.test(p.visitor))visitors.add(p.visitor);}catch{}
  }
  return visitors.size;
 }
 snapshot(excluded=null) { return {type:'stats',online:this.online(excluded),total:this.total,updatedAt:new Date().toISOString()}; }
 broadcast(force=false,excluded=null) {
  if(!this.loaded)return false;
  const data=this.snapshot(excluded);
  if(!force&&data.online===this.lastOnline&&data.total===this.lastTotal)return false;
  this.lastOnline=data.online;this.lastTotal=data.total;
  const raw=JSON.stringify(data);
  for(const socket of this.state.getWebSockets()){if(socket!==excluded)try{socket.send(raw);}catch{}}
  return true;
 }
 async schedule() {
  if(this.state.getWebSockets().length>0) {
   const alarm=await this.state.storage.getAlarm();
   if(alarm===null||alarm===undefined)await this.state.storage.setAlarm(Date.now()+30_000);
  }
 }
 async fetch(req) {
  try {
   const u=new URL(req.url);
   if(u.pathname==='/birth'&&req.method==='POST') {
    const body=await req.json();
    if(!body||!Number.isSafeInteger(body.total)||body.total<0)return reply({error:'invalid total'},400);
    await this.refresh();this.total=Math.max(this.total,body.total);await this.state.storage.put('total',this.total);this.broadcast();
    return reply(this.snapshot());
   }
   if(u.pathname==='/snapshot'&&req.method==='GET'){await this.refresh();this.broadcast();return reply(this.snapshot());}
   if(u.pathname!=='/api/live'||req.headers.get('upgrade')?.toLowerCase()!=='websocket')return reply({error:'not found'},404);
   const visitor=u.searchParams.get('visitor')||'';
   if(!UUID.test(visitor))return reply({error:'invalid visitor'},400);
   if(this.state.getWebSockets().length>=5000)return reply({error:'live statistics busy'},503);
   await this.refresh();
   const pair=new WebSocketPair(),client=pair[0],server=pair[1],now=Date.now();
   this.state.acceptWebSocket(server);
   server.serializeAttachment({visitor:visitor.toLowerCase(),visible:u.searchParams.get('visible')!=='0',last:now,window:now,count:0});
   server.send(JSON.stringify(this.snapshot()));this.broadcast();await this.schedule();
   return new Response(null,{status:101,webSocket:client});
  }catch{return reply({error:'live statistics unavailable'},503);}
 }
 async webSocketMessage(socket,message) {
  if(typeof message!=='string'||message.length>256){socket.close(1008,'Invalid message');this.broadcast(false,socket);return;}
  let body;try{body=JSON.parse(message)}catch{return;}
  if(!body||typeof body!=='object'||!['heartbeat','visibility'].includes(body.type)||typeof body.visible!=='boolean')return;
  const p=socket.deserializeAttachment();if(!p)return;
  const now=Date.now();if(now-p.window>10_000){p.window=now;p.count=0;}
  if(++p.count>40){socket.close(1008,'Too many updates');this.broadcast(false,socket);return;}
  p.last=now;p.visible=body.visible;socket.serializeAttachment(p);
  try{await this.refresh();}catch{}
  if(!this.broadcast()&&this.loaded)try{socket.send(JSON.stringify(this.snapshot()));}catch{}
  await this.schedule();
 }
 async webSocketClose(socket,code=1000,reason='',wasClean=true) { try{socket.close(code,reason);}catch{}try{await this.refresh();}catch{}this.broadcast(false,socket); }
 async webSocketError(socket) { try{socket.close(1011,'Connection ended');}catch{}try{await this.refresh();}catch{}this.broadcast(false,socket); }
 async alarm() {
  const now=Date.now();
  for(const socket of this.state.getWebSockets()) {
   try{const p=socket.deserializeAttachment();if(!p||now-p.last>TTL)socket.close(1001,'Heartbeat expired');}catch{}
  }
  try{await this.refresh();}catch{}
  this.broadcast();
  if(this.state.getWebSockets().some(socket=>{try{return now-socket.deserializeAttachment().last<=TTL;}catch{return false;}}))await this.state.storage.setAlarm(now+30_000);
 }
}
