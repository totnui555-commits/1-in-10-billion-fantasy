'use strict';
LifeHazards.install();
const LifeHazardUI=(()=>{
 function panel(s){const h=LifeHazards.ensure(s),a=h.active;if(s.dead)return '';if(!a){if(h.convalescentUntil>(s.calendar?.count||0))return '<section class="panel hazard-note"><b>กำลังพักฟื้นจากเหตุร้าย</b><p>คุณผ่านช่วงอันตรายมาแล้ว และยังค่อย ๆ ฟื้นกำลัง</p></section>';return ''}const d=LifeHazards.get(a.id),q=s.calendar?.count||0;return `<section class="panel hazard-note critical" role="status"><span class="eyebrow">${a.stage?'อาการต่อเนื่อง':'เหตุอันตรายใกล้ตัว'}</span><h3>${esc(d.title)}</h3><p>${a.stage?'คุณรอดจากเหตุครั้งก่อน แต่ยังต้องรับมือกับอาการที่ตามมา':'เลือกทางรับมือในเหตุการณ์สำคัญ แต่ละทางมีความเสี่ยงต่างกัน'}</p>${a.due>q?'<small>จะติดตามอาการในช่วงถัดไป</small>':''}</section>`}
 return {panel};
})();
