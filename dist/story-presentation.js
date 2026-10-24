'use strict';
const StoryPresentation=(()=>{
 function short(text,limit=130){text=String(text||'').replace(/\s+/g,' ').trim();if(text.length<=limit)return text;let out='';if(typeof Intl.Segmenter==='function'){for(const part of new Intl.Segmenter('th',{granularity:'word'}).segment(text)){if((out+part.segment).length>limit-1)break;out+=part.segment}}else out=Array.from(text).slice(0,limit-1).join('');return out.trimEnd()+'…'}
 function summary(e){let text=e.paragraphs?.[0]||e.text||'';const action=text.indexOf(' คุณ');if(['automatic','daily','home','training','heritage'].includes(e.kind)&&action>0&&action<85)text=text.slice(action+1);return short(text,110)}
 function tone(e){if(!e)return 'neutral';if(['loss','critical','important'].includes(e.tone))return e.tone;const key=e.key||'';if(e.kind==='loss'||/^family-loss-|^business-closed-|^life-end$/.test(key)||/^(วันอำลา|อำลาสัตว์เลี้ยง|วันที่ต้องปิดร้าน|ขาดทุน)/.test(e.title||''))return 'loss';if(['decision','growth'].includes(e.kind)||e.kind==='project'&&/พร้อม|จบ|เลือก/.test(e.title||''))return 'important';return 'neutral'}
 const label=e=>({loss:'การสูญเสีย',critical:'เหตุการณ์ร้ายแรง',important:'จุดเปลี่ยน'})[tone(e)]||'';
 return {short,summary,tone,label};
})();
