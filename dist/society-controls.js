'use strict';
SpeciesSociety.install();
const SocietyUI=(()=>{
 function rows(s){const a=SpeciesSociety.metrics(s),m=SpeciesSociety.profile(s);return [['resources',m.res],['access',m.access],['duty',m.duty],['voice',m.voice]].map(([key,label])=>`<div class="society-metric"><div><span>${esc(label)}</span><b>${a[key]}</b></div><progress max="100" value="${a[key]}" aria-label="${esc(label)}"></progress></div>`).join('')}
 function birth(s){if(!SpeciesSociety.is(s))return '';return `<section class="society-birth"><span class="eyebrow">สิ่งที่${esc(SpeciesSociety.profile(s).group)}รักษาร่วมกัน</span><div class="society-grid">${rows(s)}</div></section>`}
 function social(s){const a=SpeciesSociety.ensure(s),m=SpeciesSociety.profile(s);modal(`<section class="life-dialog"><span class="eyebrow">${esc(m.title)}</span><h2>${esc(SpeciesSociety.label(s))}</h2>${TierUI.compact(s)}<p>${esc(SpeciesSociety.note(s))}</p><p class="society-origin">จุดเริ่มต้น: ${esc(m.origins[a.origin])}</p><div class="society-grid">${rows(s)}</div><p>${esc(m.group)}จดจำสิ่งที่คุณทำ การแบ่งใช้ทรัพยากร การรับหรือปฏิเสธพันธะ และความไว้ใจทำให้สิทธิและบทบาทเปลี่ยนไปได้</p>${!RaceDrives.cashless(s)?`<p class="society-money">เงินส่วนตัวสำหรับแลกเปลี่ยน: ${s.gold.toLocaleString('th-TH',{maximumFractionDigits:2})} ทอง</p>`:''}<h3>สิ่งที่เคยเลือกต่อกลุ่ม</h3>${a.history.length?a.history.map(h=>`<p>อายุ ${h.age} · ${esc(h.text)}</p>`).join(''):'<p>เส้นทางของคุณยังเลือกได้</p>'}</section>`);TierUI.bind()}
 return {birth,social};
})();
