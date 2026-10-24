'use strict';
// Editorial rules operate on prose, never on developmental gates or rewards.
const NarrativeVoice=(()=>{
 const filler=[
  'คุณยังไม่ได้รับหน้าที่ของผู้ใหญ่','คุณยังต้องอาศัยผู้ใหญ่คอยช่วย',
  'ไม่ต้องรับผิดชอบงานหาเงินหรือเรื่องของผู้ใหญ่แทนคนในบ้าน',
  'โดยยังมีผู้ใหญ่คอยดูแล','โดยยังไม่ต้องรับผิดชอบรายจ่ายของบ้าน',
  'คุณเปลี่ยนแผนได้ในสมุดแผนชีวิต โดยผลของแต่ละช่วงที่ผ่านไปจะคงอยู่',
  'กิจวัตรที่ทำซ้ำอย่างตั้งใจทำให้ทักษะ ความสัมพันธ์ และสุขภาวะค่อย ๆ เปลี่ยนไป ไม่จำเป็นต้องเกิดเรื่องใหญ่ทุกครั้ง',
  'การเลือกครั้งนี้จะส่งผลต่อความสัมพันธ์และทางเลือกที่เปิดขึ้นต่อไป',
  'สิ่งที่ตั้งใจยังไม่สำเร็จทั้งหมด แต่ผู้คนในเหตุการณ์จะจำสิ่งที่คุณพยายามทำ',
  'เรื่องเก่าไม่ได้หายไปเพียงเพราะผ่านหน้าถัดมาแล้ว'
 ];
 function clean(text){let out=String(text||'');for(const line of filler)out=out.replaceAll(line,'');return out.replace(/ {2,}/g,' ').trim()}
 function paragraphs(lines){return [...new Set((lines||[]).map(clean).filter(Boolean))]}
 function pick(s,list,salt=0){if(!list.length)return null;const entries=s.diary?.entries||[],score=item=>{const title=Array.isArray(item)?item[0]:'',body=Array.isArray(item)?item[1]:item;let total=0;entries.forEach((e,i)=>{if(title&&e.title===title||typeof body==='string'&&e.paragraphs?.some(p=>p.includes(body)))total+=i<24?100-i:1});return total};const scores=list.map(score),least=Math.min(...scores),pool=list.filter((_,i)=>scores[i]===least);let h=Math.imul((s.seed^(s.diary?.sequence||0)^salt)>>>0,2654435761);h=Math.imul(h^(h>>>16),2246822507);return pool[(h>>>0)%pool.length]}
 function prepare(s,entry){entry.paragraphs=paragraphs(entry.paragraphs);if(!entry.paragraphs.length)return false;if(['automatic','home','daily','focus','training','heritage'].includes(entry.kind)&&entry.key!=='birth'){const recent=(s.diary?.entries||[]).slice(0,24);if(recent.some(e=>e.title===entry.title&&e.paragraphs?.[0]===entry.paragraphs[0]))return false;const repeated=new Set(recent.slice(0,10).flatMap(e=>e.paragraphs||[]));entry.paragraphs=entry.paragraphs.filter((p,i)=>i===0||!repeated.has(p))}return true}
 function migrate(s){if(s.proseVersion===1)return;const d=s.diary;if(d?.entries){const removed=new Set();d.entries=d.entries.filter(e=>{if(e.kind==='focus'&&e.paragraphs?.length>=2){if(e.paragraphs.length>2){e.paragraphs=e.paragraphs.slice(2);e.title='ข่าวจากช่วงชีวิตนั้น'}else{removed.add(e.id);return false}}e.paragraphs=paragraphs(e.paragraphs);return true});if(removed.size)s.log=s.log.filter(l=>!removed.has(l.entryId));for(const l of s.log)l.text=clean(l.text)}s.proseVersion=1}

 return {pick,clean,paragraphs,prepare,migrate};
})();
