import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{LiveStats} from './worker.mjs';
const GAME='https://one-in-10-billion-fantasy.traisorn-th.chatgpt.site';
const BASE='https://counter.example';
const A='550e8400-e29b-41d4-a716-446655440000',B='550e8400-e29b-41d4-a716-446655440001';
function socket(visitor=A,visible=true,last=Date.now()) {
 return {readyState:1,data:{visitor,visible,last,window:Date.now(),count:0},messages:[],closes:[],deserializeAttachment(){return structuredClone(this.data);},serializeAttachment(v){this.data=structuredClone(v);},send(raw){this.messages.push(JSON.parse(raw));},close(...args){this.closes.push(args);this.readyState=3;}};
}
function fixture(peers=[],count=123) {
 const stored=new Map(),alarms=[];let reads=0;
 const state={getWebSockets:()=>peers,acceptWebSocket:s=>peers.push(s),storage:{get:async k=>stored.get(k),put:async(k,v)=>stored.set(k,v),getAlarm:async()=>alarms.at(-1)??null,setAlarm:async n=>alarms.push(n)}};
 const env={DB:{prepare:()=>({first:async()=>{reads++;return {total:count};}})}};
 const live=new LiveStats(state,env);
 return {live,state,env,stored,alarms,get reads(){return reads;}};
}

test('unique visible browsers, rather than tabs, determine online count',async()=>{
 const f=fixture([socket(A),socket(A),socket(B,false)]);await f.live.refresh();
 assert.equal(f.live.snapshot().online,1);assert.equal(f.live.snapshot().total,123);
 f.state.getWebSockets()[2].data.visible=true;assert.equal(f.live.snapshot().online,2);
});
test('visibility changes broadcast to everyone and a visible sibling keeps browser online',async()=>{
 const first=socket(A),sibling=socket(A),other=socket(B);const f=fixture([first,sibling,other]);await f.live.refresh();f.live.broadcast();
 assert.equal(first.messages.at(-1).online,2);
 await f.live.webSocketMessage(first,JSON.stringify({type:'visibility',visible:false}));assert.equal(f.live.snapshot().online,2);
 await f.live.webSocketMessage(sibling,JSON.stringify({type:'visibility',visible:false}));assert.equal(other.messages.at(-1).online,1);
});
test('heartbeat acknowledges sender without broadcasting unchanged counts to other tabs',async()=>{
 const peer=socket(A),other=socket(B);const f=fixture([peer,other]);await f.live.refresh();f.live.broadcast();const sent=peer.messages.length,othersSent=other.messages.length;
 await f.live.webSocketMessage(peer,JSON.stringify({type:'heartbeat',visible:true}));
 assert.equal(peer.messages.length,sent+1);assert.equal(other.messages.length,othersSent);assert.equal(peer.messages.at(-1).type,"stats");assert.equal(f.reads,1);assert(f.alarms.length>0);
});
test('expired peers disappear and are closed by the bounded cleanup alarm',async()=>{
 const old=socket(A,true,Date.now()-76000),fresh=socket(B);const f=fixture([old,fresh]);await f.live.refresh();await f.live.alarm();
 assert.equal(old.readyState,3);assert.equal(fresh.messages.at(-1).online,1);assert(f.alarms.at(-1)>Date.now());
});
test('disconnect removes just that tab; last visible tab removes the visitor',async()=>{
 const a=socket(A),a2=socket(A),b=socket(B);const f=fixture([a,a2,b]);await f.live.refresh();f.live.broadcast();
 await f.live.webSocketClose(a);assert.equal(f.live.snapshot().online,2);
 await f.live.webSocketClose(a2);assert.equal(b.messages.at(-1).online,1);
});
test('new accepted births publish monotonically and remain durable across presence restarts',async()=>{
 const peer=socket();const f=fixture([peer]);await f.live.refresh();f.live.broadcast();
 let response=await f.live.fetch(new Request('https://stats.internal/birth',{method:'POST',body:JSON.stringify({total:125})}));assert.equal(response.status,200);assert.equal(peer.messages.at(-1).total,125);assert.equal(f.stored.get('total'),125);
 const messages=peer.messages.length;await f.live.fetch(new Request('https://stats.internal/birth',{method:'POST',body:JSON.stringify({total:124})}));assert.equal(peer.messages.length,messages);assert.equal(f.live.total,125);
 const restarted=new LiveStats(f.state,f.env);await restarted.refresh();assert.equal(restarted.total,125);
});
test('concurrent cache hydration reads the D1 total once',async()=>{
 const f=fixture();await Promise.all(Array.from({length:20},()=>f.live.refresh()));assert.equal(f.reads,1);assert.equal(f.live.total,123);
});
test('malformed or oversized websocket input cannot poison online statistics',async()=>{
 const a=socket();const f=fixture([a]);await f.live.refresh();
 for(const value of ['null','[]','false','{}','{','{"type":"visibility","visible":"false"}'])await f.live.webSocketMessage(a,value);
 assert.equal(a.data.visible,true);assert.equal(a.messages.length,0);
 await f.live.webSocketMessage(a,'a'.repeat(257));assert.equal(a.closes[0][0],1008);
});
test('burst rate limit removes a connection rather than inflating counters',async()=>{
 const a=socket();const f=fixture([a]);await f.live.refresh();
 for(let i=0;i<41;i++)await f.live.webSocketMessage(a,'{"type":"heartbeat","visible":true}');assert.equal(a.closes[0][0],1008);assert.equal(f.live.online(),0);
});
test('new websocket receives existing history and schedules heartbeat expiry',async()=>{
 const f=fixture([],502);let made;
 const OriginalResponse=globalThis.Response,OriginalPair=globalThis.WebSocketPair;
 globalThis.WebSocketPair=class{constructor(){made=socket(A);return {0:{client:true},1:made};}};
 globalThis.Response=class{constructor(body,opts){return opts?.status===101?{status:101,webSocket:opts.webSocket}:new OriginalResponse(body,opts);}};
 try {
  const r=await f.live.fetch(new Request(BASE+'/api/live?visitor='+A+'&visible=1',{headers:{upgrade:'websocket'}}));
  assert.equal(r.status,101);assert.equal(made.messages[0].total,502);assert.equal(made.messages[0].online,1);assert.equal(f.alarms.length,1);
 } finally {globalThis.Response=OriginalResponse;globalThis.WebSocketPair=OriginalPair;}
});
test('public websocket route validates Origin, upgrade and visitor ID before routing',async()=>{
 let calls=0;const env={LIVE_STATS:{idFromName:n=>{assert.equal(n,'global');return n;},get:()=>({fetch:async()=>{calls++;return new Response('forwarded');}})}};
 assert.equal((await worker.fetch(new Request(BASE+'/api/live?visitor='+A,{headers:{origin:'https://evil.example',upgrade:'websocket'}}),env)).status,403);
 assert.equal((await worker.fetch(new Request(BASE+'/api/live?visitor=bad',{headers:{origin:GAME,upgrade:'websocket'}}),env)).status,400);
 assert.equal((await worker.fetch(new Request(BASE+'/api/live?visitor='+A,{headers:{origin:GAME}}),env)).status,426);
 assert.equal((await worker.fetch(new Request(BASE+'/api/live?visitor='+A,{headers:{origin:GAME,upgrade:'websocket'}}),env)).status,200);assert.equal(calls,1);
});
test('HTTP fallback snapshot has the same counts and correct cross-origin headers',async()=>{
 const peer=socket();const f=fixture([peer],987);const env={LIVE_STATS:{idFromName:n=>n,get:()=>({fetch:r=>f.live.fetch(r)})}};
 const response=await worker.fetch(new Request(BASE+'/api/stats',{headers:{origin:GAME}}),env);assert.equal(response.status,200);assert.equal(response.headers.get('access-control-allow-origin'),GAME);
 const data=await response.json();assert.equal(data.total,987);assert.equal(data.online,1);assert.equal(data.type,'stats');assert(!('visitor' in data));
});
test('hibernation-close loads history before broadcasting, never resets total to zero',async()=>{
 const a=socket(A),b=socket(B);const f=fixture([a,b],901);await f.live.webSocketClose(a);assert.equal(b.messages.at(-1).total,901);assert.equal(b.messages.at(-1).online,1);
});
