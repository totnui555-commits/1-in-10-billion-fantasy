'use strict';
// The journal reads stored pages. Looking back never moves the simulation forward.
const StoryJournal=(()=>{
 const PAGE_SIZE=30;
 const tone=e=>typeof StoryPresentation==='undefined'?'neutral':StoryPresentation.tone(e);
 const excerpt=e=>typeof StoryPresentation==='undefined'?(e.paragraphs?.[0]||''):StoryPresentation.summary(e);
 const kinds={loss:'การสูญเสีย',spending:'การใช้เงิน',investment:'เงินลงทุน',world:'ข่าวระหว่างเผ่า',home:'ชีวิตในบ้าน',daily:'ชีวิตประจำวัน',automatic:'ชีวิตประจำวัน',growth:'การเติบโต',story:'เรื่องต่อเนื่อง',project:'เป้าหมายระยะยาว',projectProgress:'เป้าหมายระยะยาว',work:'งานและกิจการ',interaction:'ความสัมพันธ์',relationship:'ความสัมพันธ์',decision:'การตัดสินใจ',family:'ครอบครัว',memory:'ความทรงจำ',focus:'โฟกัสรายปี',plan:'แผนชีวิต',purchase:'บ้านและของใช้',companion:'สหายร่วมชีวิต',status:'ฐานะในสังคม',training:'การฝึกฝน',heritage:'วิถีของเผ่า',arc:'เรื่องต่อเนื่อง'};
 let view={seed:null,query:'',year:'all',kind:'all',order:'newest',page:0};
 const pages=()=>Array.isArray(state?.diary?.entries)?state.diary.entries:[];
 const category=k=>({automatic:'daily',arc:'story',interaction:'relationship',projectProgress:'project'})[k]||k||'daily';
 const kindLabel=k=>kinds[category(k)]||'ช่วงหนึ่งของชีวิต';
 const orderPages=(entries,ascending=false)=>entries.slice().sort((a,b)=>{const difference=(Number(a.age)||0)-(Number(b.age)||0)||((Number(a.month)||1)-(Number(b.month)||1))||((Number(a.id)||0)-(Number(b.id)||0));return ascending?difference:-difference});
 const hasImage=e=>typeof VisualMemory!=='undefined'&&VisualMemory.has(e);
 const textOf=e=>[e.title,e.where,e.phase,e.season,...(Array.isArray(e.paragraphs)?e.paragraphs:[])].join(' ').normalize('NFC').toLocaleLowerCase('th');
 const date=e=>(e.worldYear?'ปี '+e.worldYear+' · ':'')+'อายุ '+e.age+' ปี · เดือน '+(e.month||1);
 function resetForLife(){if(view.seed!==state.seed)view={seed:state.seed,query:'',year:'all',kind:'all',order:'newest',page:0}}
 function filtered(){const term=view.query.trim().normalize('NFC').toLocaleLowerCase('th');return orderPages(pages().filter(e=>(view.year==='all'||String(e.age)===view.year)&&(view.kind==='all'||category(e.kind)===view.kind)&&(!term||textOf(e).includes(term))),view.order==='oldest')}
 function open(){
  resetForLife();const source=pages(),years=[...new Set(source.map(e=>Number(e.age)).filter(Number.isFinite))].sort((a,b)=>a-b),types=[...new Set(source.map(e=>category(e.kind)))].sort((a,b)=>kindLabel(a).localeCompare(kindLabel(b),'th'));
  if(view.year!=='all'&&!years.some(year=>String(year)===view.year))view.year='all';if(view.kind!=='all'&&!types.includes(view.kind))view.kind='all';
  modal(`<section class="story-journal" aria-label="สมุดชีวิต"><div class="eyebrow">สมุดชีวิต · ${source.length} หน้าที่เก็บไว้</div><h2>เรื่องราวของ ${esc(state.name)}</h2><p class="journal-intro">ย้อนดูสิ่งที่เคยทำ คนที่เคยพบ และทางที่เลือกไว้ ชีวิตพักระหว่างที่คุณอ่าน</p><div class="journal-filters"><label class="journal-search">ค้นในเรื่องราว<input id="journalSearch" type="search" value="${esc(view.query)}" placeholder="ชื่อคน สถานที่ หรือเรื่องที่จำได้" autocomplete="off"></label><label>ช่วงอายุ<select id="journalYear"><option value="all">ทุกช่วงอายุ</option>${years.map(year=>`<option value="${year}" ${view.year===String(year)?'selected':''}>อายุ ${year} ปี</option>`).join('')}</select></label><label>เรื่องประเภทไหน<select id="journalKind"><option value="all">ทุกเรื่องราว</option>${types.map(kind=>`<option value="${esc(kind)}" ${view.kind===kind?'selected':''}>${esc(kindLabel(kind))}</option>`).join('')}</select></label><label>เรียงหน้าหนังสือ<select id="journalOrder"><option value="newest" ${view.order==='newest'?'selected':''}>ใหม่ไปเก่า</option><option value="oldest" ${view.order==='oldest'?'selected':''}>เก่าไปใหม่</option></select></label></div><div id="journalResults" class="journal-results" aria-live="polite"></div><div class="journal-paging"><button class="secondary" id="journalPrevPage">← หน้าก่อน</button><span id="journalPageNumber"></span><button class="secondary" id="journalNextPage">หน้าถัดไป →</button></div><p class="journal-storage-note">สมุดเก็บเรื่องเล่าล่าสุดได้ 360 หน้า ภาพย้อนอดีตจะแสดงคนและของตามข้อมูลที่เก็บไว้ในวันนั้น หน้าที่ไม่มีข้อมูลภาพจะแสดงเพียงสถานที่ประกอบ</p></section>`);
  $('#journalSearch').oninput=e=>{view.query=e.target.value;view.page=0;paintList()};
  $('#journalYear').onchange=e=>{view.year=e.target.value;view.page=0;paintList()};
  $('#journalKind').onchange=e=>{view.kind=e.target.value;view.page=0;paintList()};
  $('#journalOrder').onchange=e=>{view.order=e.target.value;view.page=0;paintList()};
  $('#journalPrevPage').onclick=()=>{if(view.page>0){view.page--;paintList();scrollToResults()}};
  $('#journalNextPage').onclick=()=>{if((view.page+1)*PAGE_SIZE<filtered().length){view.page++;paintList();scrollToResults()}};
  paintList();
 }
 function scrollToResults(){const result=$('#journalResults');if(result?.scrollIntoView)result.scrollIntoView({block:'nearest'})}
 function paintList(){
  const matches=filtered(),count=Math.max(1,Math.ceil(matches.length/PAGE_SIZE));view.page=Math.max(0,Math.min(view.page,count-1));const shown=matches.slice(view.page*PAGE_SIZE,(view.page+1)*PAGE_SIZE);let lastYear=null;
  $('#journalResults').innerHTML=`<p class="journal-result-count">${matches.length===pages().length?'ทั้งหมด '+matches.length+' หน้า':'พบ '+matches.length+' จาก '+pages().length+' หน้า'}</p>${shown.map(e=>{const heading=lastYear!==e.age?`<h3 class="journal-year-heading">อายุ ${e.age} ปี</h3>`:'';lastYear=e.age;return `${heading}<button class="journal-page-row tone-${tone(e)}" data-journal-page="${e.id}"><span class="journal-row-meta"><span>เดือน ${e.month||1} · ${esc(kindLabel(e.kind))}</span><small>${hasImage(e)?'มีภาพวันนั้น':'ภาพสถานที่'}</small></span><strong>${esc(e.title)}</strong><span class="journal-row-excerpt">${esc(excerpt(e))}</span><span class="journal-row-place">${esc(e.where||'')}${e.legacyEcologyMismatch?' · บันทึกจากวิถีเผ่าเดิม':e.legacyAgeMismatch?' · บันทึกจากกติกาอายุเดิม':''} <span aria-hidden="true">↗</span></span></button>`}).join('')||'<div class="journal-empty"><p>ยังไม่พบหน้าที่ตรงกับคำค้น</p><small>ลองใช้คำสั้นลง หรือเลือกทุกช่วงอายุและทุกเรื่องราว</small></div>'}`;
  $('#journalPageNumber').textContent=matches.length?'หน้า '+(view.page+1)+' / '+count:'ยังไม่มีหน้า';$('#journalPrevPage').disabled=view.page===0;$('#journalNextPage').disabled=view.page>=count-1||!matches.length;
  $('#journalResults').querySelectorAll('[data-journal-page]').forEach(button=>button.onclick=()=>entry(Number(button.dataset.journalPage)));
 }
 function entry(id){
  resetForLife();const source=orderPages(pages(),true),index=source.findIndex(e=>e.id===Number(id)),e=source[index];
  if(!e){modal('<section class="story-journal"><h2>หน้านี้ไม่ได้อยู่ในสมุดแล้ว</h2><p>เรื่องเก่าบางหน้าถูกแทนที่เมื่อถึงขีดจำกัดของสมุด</p><button class="secondary" id="journalBack">กลับไปสมุดชีวิต</button></section>');$('#journalBack').onclick=open;return}
  const caption=typeof VisualMemory!=='undefined'?VisualMemory.caption(state,e):'ภาพสถานที่ประกอบ · หน้านี้ไม่ได้เก็บรูปลักษณ์ในวันนั้น';
  modal(`<article class="story-journal journal-reading tone-${tone(e)}"><button class="journal-back" id="journalBack">← กลับไปสมุดชีวิต</button><div class="eyebrow">${esc(date(e))} · ${esc(kindLabel(e.kind))}</div><h2>${esc(e.title)}</h2><p class="journal-reading-date">${esc(e.where||'')} · ${esc(e.phase||'')} · ${esc(e.season||'')}</p>${e.legacyEcologyMismatch?'<p class="legacy-age-note">บันทึกจากวิถีเผ่าเดิม · บริบทในหน้านี้อาจไม่ตรงกับรูปกายและถิ่นอาศัยในกติกาปัจจุบัน</p>':e.legacyAgeMismatch?'<p class="legacy-age-note">บันทึกจากกติกาอายุเดิม · บริบทอาจไม่ตรงช่วงวัยในกติกาปัจจุบัน</p>':''}<figure class="journal-scene"><canvas width="480" height="180" id="journalScene" role="img" aria-label="ภาพประกอบ ${esc(e.title)}"></canvas><figcaption id="journalSceneCaption">${esc(caption)}</figcaption></figure><div class="journal-prose">${(e.paragraphs||[]).map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}</div>${e.choice?`<p class="journal-stored-choice"><span>สิ่งที่คุณเลือกไว้</span><b>${esc(e.choice)}</b></p>`:''}<div class="journal-entry-nav"><button class="secondary" id="journalEarlier" ${index<=0?'disabled':''}>← เรื่องก่อนหน้านี้</button><span>${index+1} / ${source.length}</span><button class="secondary" id="journalLater" ${index>=source.length-1?'disabled':''}>เรื่องถัดจากนี้ →</button></div><p class="journal-storage-note">คุณกำลังอ่านสิ่งที่เกิดขึ้นแล้ว การเปิดหน้านี้ไม่เปลี่ยนเวลา ค่าสถานะ หรือผลที่เคยเลือก</p></article>`);
  $('#journalBack').onclick=open;$('#journalEarlier').onclick=()=>{if(index>0)entry(source[index-1].id)};$('#journalLater').onclick=()=>{if(index<source.length-1)entry(source[index+1].id)};
  if(typeof VisualMemory!=='undefined')VisualMemory.draw($('#journalScene'),state,e,0);else $('#journalScene').hidden=true;
 }
 return {open,entry};
})();
