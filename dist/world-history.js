'use strict';
const WorldHistory=(()=>{
 const milestones=HISTORY_CHRONICLE,houseRecords=new Map(HISTORY_HOUSES.map(h=>[h.id,h]));
 const founding=c=>houseRecords.get(c.id)?.founded??500;
 const rise=c=>houseRecords.get(c.id)?.recognized??1000;
 const birth=s=>s.worldTimeline?.birthYear??1000;
 function house(c,y){if(!c||y>=rise(c))return c;const t=HumanOrigins.types.find(t=>t.id===(['crown','royal','sovereign','noble'].includes(c.type)?'ordinary':c.type));return {...c,...t,id:c.id,type:t.id,name:c.name,realm:c.realm,motto:c.motto,story:'บ้านสกุล'+c.name+'เพิ่งตั้งหลักใน'+KINGDOMS[c.realm][0]+' คนในบ้านยังต้องทำงานหาเลี้ยงกันเอง',burden:'ชื่อสกุลยังไม่ได้เปิดประตูให้ใคร คนในบ้านหวังว่าจะมีงานพอถึงฤดูหน้า'};}
 const visible=(y)=>milestones.filter(m=>m.year<=y);
 const period=y=>visible(y).at(-1)||milestones[0];
 function install(s,y){WorldTimeline.ensure(s);s.worldTimeline.birthYear=y;s.worldTimeline.lastYear=y-1;s.worldTimeline.lastEra=WorldTimeline.era(s);}
 function next(s){if(s.race!==0||!s.humanOrigin||s.humanOrigin.migrated)return null;const c=HumanOrigins.clan(s.humanOrigin.clanId),y=WorldTimeline.year(s);if(birth(s)>=rise(c)||y<rise(c)||s.flags['history-house-rise']||Engine.biological(s)<18)return null;return makeEvent(s);}
 function makeEvent(s){const c=HumanOrigins.clan(s.humanOrigin.clanId);return {id:'history-house-rise',title:'ชื่อสกุลที่คนเริ่มรู้จัก',text:'บ้านสกุล'+c.name+'ได้รับสิทธิและหน้าที่ใหม่ใน'+KINGDOMS[c.realm][0]+' ญาติส่งข่าวมาถามว่าคุณอยากกลับไปรับส่วนในงานของบ้านหรือไม่',min:18,humanOnly:true,certain:true,once:true,choices:[{label:'กลับไปร่วมรับหน้าที่',hint:'สถานะเปลี่ยนตามสิทธิของตระกูล · ความสุข −4',effect:{joy:-4,flag:'history-house-recognized'},acceptHouse:true,success:'คุณรับหน้าที่ต่อหน้าพยาน ชื่อสกุลช่วยให้คุณเข้าถึงคนและงานมากขึ้น แต่เงินของเรือนยังแยกจากเงินส่วนตัว'},{label:'ช่วยอยู่ห่าง ๆ และใช้ชีวิตของตนต่อ',hint:'สายสัมพันธ์ +6',effect:{bond:6},success:'คุณส่งคำยินดีไปให้ญาติ และบอกว่าชีวิตที่สร้างอยู่ตรงนี้ก็สำคัญกับคุณเหมือนกัน'}]};}
 function matches(s,e){if(e.id!=='history-house-rise')return true;const c=HumanOrigins.clan(s.humanOrigin?.clanId);return s.race===0&&!!c&&!s.humanOrigin.migrated&&birth(s)<rise(c)&&WorldTimeline.year(s)>=rise(c);}
 function observe(s,e,c,ok){if(ok&&c.acceptHouse)s.rank=HumanOrigins.clan(s.humanOrigin.clanId).rank;}
 function quarter(s){const y=WorldTimeline.year(s);const m=milestones.find(m=>m.year===y);if(!m||s.diary?.entries.some(e=>e.key==='chronicle-'+y)||s.flags['chronicle-'+y])return;s.flags['chronicle-'+y]=true;Narrative.append(s,{title:'ปี '+y+' · '+m.title,paragraphs:[m.text],key:'chronicle-'+y,kind:'world',tone:m.price>.1?'important':undefined,scene:Ecology.native(s)?Ecology.profile(s).scene:'market'});}
 function impact(s,k){const y=WorldTimeline.year(s),p=period(y),local=1+((k*7)%9-4)*.08,fade=Math.max(0,1-(y-p.year)/12);return {price:p.price*local*fade,jobs:p.jobs*local*fade};}
 function familyNote(s){const c=HumanOrigins.clan(s.humanOrigin?.clanId);if(!c)return '';return 'บ้านสกุล'+c.name+'เริ่มมีชื่อในบันทึกปี '+founding(c)+(birth(s)<rise(c)?' ในปีที่คุณเกิด บ้านนี้ยังไม่ได้มีตำแหน่งและอำนาจอย่างที่คนยุคหลังรู้จัก':' เมื่อคุณเกิด บ้านนี้ผ่านช่วงตั้งตัวมาแล้ว คนในบ้านยังต้องรักษาทั้งงานและความไว้ใจของคนรอบข้าง');}
 function panel(s){const y=WorldTimeline.year(s),p=period(y);return `<section class="panel history-panel"><small>ปฏิทินโลก · ปี ${y} · เกิดปี ${birth(s)}</small><h3>${p.title}</h3><p>${p.text}</p>${familyNote(s)?`<p>${familyNote(s)}</p>`:''}${y<1000?'<p>ชื่อดินแดนบนแผนที่ใช้ชื่อที่คนยุคปัจจุบันรู้จัก ในยุคนี้หลายแห่งยังเป็นชุมชนและเขตของกลุ่มต่าง ๆ</p>':''}<details><summary>เรื่องที่เกิดขึ้นก่อนหน้านี้</summary>${visible(y).slice().reverse().map(m=>`<article><b>ปี ${m.year} · ${m.title}</b><p>${m.text}</p></article>`).join('')}</details></section>`;}
 EVENTS.push(makeEvent({humanOrigin:{clanId:'human-house-0'}}));
 return {matches,makeEvent,milestones,founding,rise,house,birth,visible,period,install,next,observe,quarter,impact,panel};
})();
