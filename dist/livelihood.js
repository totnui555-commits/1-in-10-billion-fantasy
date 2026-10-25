'use strict';
const Livelihood=(()=>{
const levels=['ผู้เริ่มต้น','ผู้มีประสบการณ์','ผู้ชำนาญ','ผู้เชี่ยวชาญ','อาวุโสในสายงาน'];
const professions=[
 ['คนทำขนมปัง','wisdom',12,7,['ชั่งธัญพืชที่ดูดน้ำต่างจากเมื่อวาน ก่อนปรับเวลาพักแป้ง','แยกขนมปังที่อบเกินไปไว้ทำซุปแทนการปะปนกับของขาย','จดจำนวนที่ขายไม่หมดเพื่อไม่อบเกินในวันรุ่งขึ้น']],
 ['ผู้ช่วยผู้รักษา','bond',18,8,['เปลี่ยนผ้าปูให้คนไข้และตรวจว่าน้ำดื่มยังอยู่ในระยะเอื้อม','อ่านคำสั่งผู้รักษาซ้ำก่อนจัดสมุนไพรให้ตรงคน','อธิบายวิธีดูแลแผลให้ญาติฟังแล้วให้ลองทำต่อหน้า']],
 ['ช่างตัดเสื้อ','wisdom',20,9,['เผื่อแนวตะเข็บให้ลูกค้าที่มีปีกโดยขอให้ลองขยับก่อนเย็บจริง','เลาะด้ายที่ตึงเกินไปแล้วเย็บซ้ำจนเนื้อผ้าไม่รั้ง','ตรวจบันทึกขนาดของลูกค้าประจำแทนการเดาจากความจำ']],
 ['คนส่งสารประจำเมือง','health',25,8,['แยกจดหมายตามเส้นทางก่อนออกเดินเพื่อให้คนรอไม่เสียทั้งวัน','ห่อจดหมายด้วยผ้ากันฝนและตรวจตราผนึกต่อหน้าผู้รับ','ย้อนกลับไปถามเลขบ้านแทนการฝากเอกสารสำคัญกับคนแปลกหน้า']],
 ['ครูโรงเรียนชุมชน','wisdom',32,11,['เปลี่ยนโจทย์นับเลขเป็นการแบ่งขนมให้เด็กที่ยังอ่านไม่คล่อง','คุยกับผู้ปกครองถึงเหตุที่เด็กขาดเรียนโดยไม่สรุปว่าเขาเกียจคร้าน','ทำสื่อการเรียนให้ทั้งเด็กที่มองในที่มืดและเด็กที่แพ้แสงเวทใช้ได้']],
 ['เสมียนกิลด์','wisdom',23,10,['เทียบบัญชีค่าจ้างกับชื่อคนที่กลับจากภารกิจจริง','เขียนเงื่อนไขงานที่เจ้าของประกาศพูดไว้ให้ชัดก่อนติดกระดาน','พักงานรับเรื่องเพื่อช่วยผู้สมัครที่เขียนภาษากลางไม่คล่อง']],
 ['ช่างไม้','power',22,10,['ตรวจแนวไม้ที่ชื้นก่อนเลือกใช้ทำพื้นซึ่งต้องรับน้ำหนัก','เจาะร่องใหม่ให้ประตูที่บวมจากฝนยังปิดได้โดยไม่ฝืนบานพับ','เก็บเศษไม้คมออกจากพื้นที่ก่อนส่งบ้านคืนเจ้าของ']],
 ['คนทำเครื่องปั้น','wisdom',18,8,['ค่อย ๆ เพิ่มความร้อนเตาเพื่อไม่ให้ถ้วยชุดใหม่ร้าว','เลือกใช้ดินคนละสูตรสำหรับภาชนะเก็บยาและภาชนะใส่อาหาร','ทำเครื่องหมายชิ้นงานที่เคลือบไม่สมบูรณ์ไว้ใช้เอง']],
 ['คนขับเกวียน','health',30,10,['ชั่งน้ำหนักสินค้าใหม่ก่อนให้สัตว์ลากขึ้นทางลาด','ตรวจล้อและสลักทีละตัวก่อนพาผู้โดยสารออกจากเมือง','เผื่อเวลาหยุดพักแทนการเร่งสัตว์ให้ถึงปลายทางก่อนมืด']],
 ['พนักงานท่าเรือ','power',25,10,['ผูกเชือกตามน้ำหนักตู้สินค้าและตรวจซ้ำกับคู่ทำงาน','ย้ายของที่กลัวความชื้นขึ้นชั้นสูงก่อนน้ำทะเลหนุน','แบ่งทางเดินให้คนยกของไม่สวนกับผู้โดยสารที่เพิ่งลงเรือ']],
 ['นักแปลภาษาต่างเผ่า','wisdom',40,14,['ถามความหมายคำเรียกญาติที่ไม่มีคำตรงในภาษากลางก่อนแปลสัญญา','ส่งร่างคำแปลให้เจ้าของเรื่องตรวจน้ำเสียงที่อาจทำให้เสียหน้า','แยกสิ่งที่ผู้พูดกล่าวจริงออกจากสิ่งที่คนฟังคาดเดา']],
 ['ผู้ตรวจคุณภาพเสบียง','wisdom',35,12,['เปิดตรวจของจากหลายกระสอบแทนการดูเพียงกระสอบบนสุด','บันทึกวันที่และสถานที่เก็บของก่อนตัดสินว่าเสบียงยังปลอดภัย','กักล็อตที่สงสัยไว้ก่อนแม้ผู้ส่งของจะขอให้รีบลงชื่อรับ']],
 ['ช่างซ่อมอักขระบ้าน','magic',25,11,['ตัดวงจรเวทก่อนเปลี่ยนอักขระที่ร้าวอยู่ในกำแพง','อธิบายให้เจ้าของบ้านรู้ว่าอุปกรณ์ส่วนไหนยังต้องซ่อมภายหลัง','ตรวจรอยต่อเก่าที่ทำให้โคมเวทกินพลังเกินความจำเป็น']],
 ['ผู้ดูแลแหล่งน้ำ','wisdom',22,9,['จดระดับน้ำเทียบฝนของสัปดาห์ก่อนแล้วปรับเวลาเปิดร่อง','คุยกับบ้านปลายคลองที่มักได้น้ำช้าก่อนตกลงแบ่งรอบใหม่','หยุดการสูบน้ำชั่วคราวเมื่อพบกลิ่นผิดปกติและเก็บตัวอย่าง']],
 ['นักเพาะเห็ดใต้ดิน','wisdom',15,8,['แยกถาดที่มีเชื้อราออกจากถาดอ่อนทันที','เปิดทางลมให้โรงเรือนก่อนวัดความชื้นซ้ำ','เก็บดอกที่พร้อมขายโดยเหลือหัวเชื้อไว้สำหรับรุ่นต่อไป']],
 ['เจ้าหน้าที่ดูแลสุสาน','bond',18,8,['ถามญาติถึงธรรมเนียมของผู้ล่วงลับก่อนจัดพื้นที่พิธี','บันทึกตำแหน่งหลุมด้วยเครื่องหมายที่คนต่างภาษายังอ่านเข้าใจ','ซ่อมทางลาดให้ญาติสูงวัยมาเยี่ยมได้ด้วยตนเอง']],
 ['นักบัญชีสหกรณ์','wisdom',38,13,['เทียบเงินสดกับสมุดรับจ่ายและไล่หาความต่างทีละรายการ','อธิบายต้นทุนให้สมาชิกฟังด้วยตัวอย่างสินค้าที่ขายจริง','ตั้งเงินสำรองก่อนแบ่งกำไรเพื่อไม่ให้ต้องกู้เมื่อเครื่องมือพัง']],
 ['ผู้ช่วยห้องสมุด','wisdom',18,8,['ซ่อมสันหนังสือโดยไม่ปิดทับข้อความเดิม','ช่วยคนอ่านช้าหาหนังสือด้วยคำที่เขาจำได้เพียงครึ่งประโยค','ทำป้ายแยกชั้นตามตัวอักษรหลายเผ่าแทนการบังคับให้อ่านภาษากลาง']],
 ['พ่อครัวประจำโรงครัว','wisdom',24,11,['แยกอาหารที่ใช้เกลือแร่ซึ่งบางเผ่ากินไม่ได้ออกจากหม้อกลาง','คำนวณจำนวนมื้อจากคนที่มาจริงก่อนสั่งวัตถุดิบวันถัดไป','จัดเวรล้างและเตรียมอาหารให้คนในครัวได้พักผลัดกัน']],
 ['ผู้ไกล่เกลี่ยชุมชน','bond',42,14,['ให้แต่ละฝ่ายเล่าเหตุการณ์จนจบก่อนทวนสิ่งที่ทั้งคู่เห็นตรงกัน','เขียนข้อตกลงเป็นขั้นเล็ก ๆ ที่คนในชุมชนตรวจสอบได้','นัดติดตามผลแทนการคิดว่าคำขอโทษครั้งเดียวทำให้ทุกอย่างจบ']]
];
for(const [name,stat,min,income,tasks] of professions){let i=JOBS.findIndex(j=>j[0]===name);if(i<0){i=JOBS.length;JOBS.push([name,stat,min,income])}if(typeof LifeContent!=='undefined'&&!LifeContent.jobs[i])LifeContent.jobs[i]=tasks}
const businessCatalog=[
 {id:'bakery',name:'ร้านขนมปัง',cost:45,stat:'wisdom',minimum:18,description:'เตรียมวัตถุดิบ อบตามยอดขาย และดูแลลูกค้าประจำ',revenue:23,costs:15,realms:[1.2,.9,.85,1.1,1.15,.95,.65,1.1]},
 {id:'herbs',name:'แปลงสมุนไพร',cost:40,stat:'wisdom',minimum:15,description:'เพาะปลูกตามฤดูกาลและส่งให้ผู้รักษา',revenue:20,costs:12,realms:[1.05,1.3,.95,.85,1,.95,1.1,1.2]},
 {id:'tailor',name:'ร้านตัดเสื้อ',cost:65,stat:'wisdom',minimum:25,description:'รับวัดตัวและซ่อมเสื้อผ้าสำหรับคนต่างเผ่า',revenue:27,costs:17,realms:[1.15,1.05,1.15,1,1.1,1.25,.85,.9]},
 {id:'repair',name:'ร้านซ่อมเครื่องมือ',cost:70,stat:'power',minimum:25,description:'รับซ่อมเครื่องมือแทนการผลิตของใหม่ทั้งชิ้น',revenue:28,costs:17,realms:[1.1,.85,1.1,1.3,1.2,.9,.85,1.2]},
 {id:'tea',name:'ร้านชาและอาหาร',cost:60,stat:'bond',minimum:25,description:'จัดที่พักให้คนเดินทางและรักษาคุณภาพอาหาร',revenue:26,costs:17,realms:[1.1,1.15,1,.9,1.25,1.25,.8,1]},
 {id:'pottery',name:'โรงเครื่องปั้น',cost:55,stat:'wisdom',minimum:22,description:'ผลิตภาชนะและรับความเสี่ยงจากเตาเผา',revenue:25,costs:16,realms:[1.2,1,.9,1.1,1.1,1,.85,1.1]},
 {id:'caravan',name:'กิจการขนส่ง',cost:120,stat:'wisdom',minimum:35,description:'ดูแลเกวียน เส้นทาง และค่าจ้างคนร่วมทาง',revenue:42,costs:28,realms:[1.2,1,1.1,1.15,1.3,1,.75,1.2]},
 {id:'runes',name:'ร้านอักขระใช้ในบ้าน',cost:100,stat:'magic',minimum:35,description:'ติดตั้งแสงสว่างและเครื่องมือเวทที่ซ่อมบำรุงได้',revenue:36,costs:23,realms:[1.1,1.2,1.3,1.15,1,1.15,1.1,.85]},
 {id:'mushrooms',name:'โรงเพาะเห็ด',cost:42,stat:'wisdom',minimum:16,description:'คุมความชื้นและเชื้อราเพื่อส่งอาหารสม่ำเสมอ',revenue:21,costs:13,realms:[.95,1.1,1.2,1.3,1,.95,.9,1.1]},
 {id:'boarding',name:'เรือนพักคนเดินทาง',cost:150,stat:'bond',minimum:35,description:'ดูแลห้องพัก อาหาร และค่าจ้างผู้ช่วย',revenue:49,costs:33,realms:[1.15,1,.9,1.1,1.3,1.1,.75,1.15]},
 {id:'books',name:'ร้านหนังสือและงานคัดลอก',cost:85,stat:'wisdom',minimum:32,description:'คัดลอกเอกสารและรับสั่งหนังสือหลายภาษา',revenue:31,costs:20,realms:[1.2,1.2,1.15,1,.95,1.15,1.05,.8]},
 {id:'marine',name:'โรงเพาะสาหร่าย',cost:80,stat:'wisdom',minimum:28,description:'เพาะสาหร่ายในถังน้ำควบคุมและส่งวัตถุดิบอาหาร',revenue:31,costs:20,realms:[.8,.85,.85,.75,1.25,.9,1.45,.8]}
];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const round=x=>Math.round(x*100)/100;
const bio=s=>Engine.biological(s);
const normal=s=>85/RACES[s.race][2];
function hash(s,salt){let x=(s.seed^Math.imul((s.calendar?.count??0)+1,2654435761)^salt)>>>0;x=Math.imul(x^(x>>>16),2246822507);return (x^(x>>>13))>>>0}
function history(s,text){const l=ensure(s);l.history.unshift({age:s.age,text});l.history.length=Math.min(30,l.history.length)}
function ensure(s){
 if(!s.livelihood)s.livelihood={version:1,job:s.job,tenure:0,proficiency:0,level:0,business:null,history:[],lastQuarter:-1,lastActionQuarter:-1,changes:0};
 const l=s.livelihood;
 if(l.lastActionQuarter===undefined)l.lastActionQuarter=-1;
 if(l.changes===undefined)l.changes=0;if(l.workload===undefined)l.workload=1;if(l.lastIncome===undefined)l.lastIncome=0;if(l.lastHouseholdCost===undefined)l.lastHouseholdCost=0;
 return l;
}
function careerChanged(s,oldJob){const l=ensure(s);if(s.job===oldJob&&l.job===s.job)return false;const previous=l.level;l.job=s.job;l.tenure=0;l.proficiency=previous>0?Math.min(20,previous*4):0;l.level=0;l.changes++;history(s,(s.job===null?'พักจากงานประจำ':'เริ่มอาชีพ '+JOBS[s.job][0])+(oldJob!==null&&JOBS[oldJob]?' หลังทำงานเป็น'+JOBS[oldJob][0]:''));return true}
function canCareer(s,index){
 const j=JOBS[index],age=bio(s);if(typeof RaceDrives!=='undefined'&&RaceDrives.cashless(s))return false;if(typeof Ecology!=='undefined'&&!Ecology.allowedCareer(s,index))return false;if(!j||s.dead||age<16||!Number.isFinite(s[j[1]])||s[j[1]]<j[2])return false;
 const school=s.growth?.education||'home',studied=school==='academy'||school==='apprentice'||!!s.flags?.academy;
 const stages={15:21,4:22,10:22,11:21,12:28,14:25,19:28,20:28,21:35,23:19,28:20,34:20,35:19,36:19,40:22,43:24};
 const addedMinimum=typeof ContentExpansion!=='undefined'?ContentExpansion.jobMinimumAges?.[index]:null;if(age<(addedMinimum||stages[index]||16))return false;const addedRule=typeof ContentExpansion!=='undefined'?ContentExpansion.jobRequirements?.[index]:null;if(addedRule?.formal&&!studied&&s.wisdom<j[2]+10)return false;
 if(index===21&&(s.fame<35||s.wisdom<40))return false;
 if(index===19&&(s.fame<20||s.wisdom<30))return false;
 if(index===12&&(s.fame<15||s.bond<25))return false;
 if(index===10&&s.fame<15)return false;
 if([14,20].includes(index)&&!studied&&s.wisdom<45)return false;
 if([28,34,40].includes(index)&&!studied&&s.wisdom<j[2]+8)return false;
 return true;
}
function salaryMultiplier(s){const l=ensure(s);return (1+l.level*.2)*(l.workload??1)}
function open(s,id){const l=ensure(s),def=businessCatalog.find(b=>b.id===id);if(!def||typeof Ecology!=='undefined'&&!Ecology.businessAllowed(s,def)||s.dead||bio(s)<18||l.business||s.gold<def.cost||s[def.stat]<def.minimum)return false;s.gold-=def.cost;l.business={id,openedAge:s.age,kingdom:s.kingdom,age:0,cash:round(def.cost*.35),quality:35,loyalty:25,reputation:20,staff:0,debt:0,lastRevenue:0,lastCosts:0,lastProfit:0,totalProfit:0,lastDemand:1,badQuarters:0,mode:'steady',lastQuarter:-1,ownerDraw:0};l.lastActionQuarter=s.calendar?.count??0;history(s,'เปิด'+def.name+'ใน'+KINGDOMS[s.kingdom][0]+' ลงทุน '+def.cost+' ทอง');return true}
function manage(s,action){const l=ensure(s),b=l.business,def=b&&businessCatalog.find(x=>x.id===b.id),q=s.calendar?.count??0;if(!b||!def||s.dead||l.lastActionQuarter===q)return false;const prices={quality:1200,marketing:800,train:1500,reserve:1000,close:0};if(!(action in prices)||s.gold<prices[action])return false;l.lastActionQuarter=q;
 if(action==='close'){const recovered=Math.max(0,Math.floor(b.cash+def.cost*.2));s.gold=clamp(s.gold+recovered,0,1e9);history(s,'ปิด'+def.name+' รับคืนเงินทุนหมุนเวียนและขายอุปกรณ์ได้ '+recovered+' ทอง');l.business=null;return true}
 s.gold-=prices[action];
 if(action==='quality'){b.quality=Math.min(100,b.quality+12);b.reputation=Math.min(100,b.reputation+3)}
 if(action==='marketing'){b.loyalty=Math.min(100,b.loyalty+8);b.reputation=Math.min(100,b.reputation+6)}
 if(action==='train'){b.staff=Math.min(3,b.staff+1);b.quality=Math.min(100,b.quality+7)}
 if(action==='reserve')b.cash=round(Math.min(1e7,b.cash+1000));
 history(s,({quality:'ปรับปรุงคุณภาพ',marketing:'แนะนำร้านกับคนในชุมชน',train:'ฝึกและจ้างผู้ช่วย',reserve:'เพิ่มเงินทุนหมุนเวียน'})[action]+'ของ'+def.name);return true;
}
function quarter(s){const l=ensure(s),q=s.calendar?.count??0;if(s.dead||l.lastQuarter===q)return null;l.lastQuarter=q;const k=normal(s),age=bio(s);let entry=null;
 if(l.job!==s.job)careerChanged(s,l.job);
 if(s.job!==null&&age>=16){
  l.tenure=round(l.tenure+k/4*(l.workload??1));l.proficiency=round(clamp(l.proficiency+k*(l.workload??1)*(.7+(s[JOBS[s.job][1]]||0)/200),0,100));
  const before=l.level,thresholds=[0,2,5,10,18];let level=0;for(let i=1;i<5;i++)if(l.tenure>=thresholds[i]&&l.proficiency>=i*13)level=i;l.level=Math.max(l.level,level);
  if(l.level>before){const job=JOBS[s.job];history(s,'ก้าวสู่ระดับ'+levels[l.level]+'ในอาชีพ'+job[0]);s.fame=Math.min(100,s.fame+2);entry={title:'คนในที่ทำงานเริ่มฝากงานสำคัญให้คุณ',kind:'work',key:'career-level-'+s.job+'-'+l.level,paragraphs:['หลังทำงานเป็น'+job[0]+'มาระยะหนึ่ง คุณได้รับการยอมรับในระดับ'+levels[l.level]+' ไม่ใช่เพราะเวลาผ่านไปอย่างเดียว แต่เพราะงานที่ส่งกลับมีข้อผิดพลาดน้อยลง','คนร่วมงานบอกว่า “งานชิ้นนี้ช่วยตรวจให้หน่อยได้ไหม เราเชื่อมือเธอ” ความรับผิดชอบและค่าตอบแทนเพิ่มขึ้นพร้อมกัน']}}
 }
 const b=l.business;if(!b)return entry;const def=businessCatalog.find(x=>x.id===b.id);if(!def)return entry;
 const seasonal=[1,.95,.82,1.12][s.calendar?.quarter??0],luck=(hash(s,823)%101)/100,market=.8+luck*.4,skill=(s[def.stat]||0)/100;
 b.age=round(b.age+k/4);
 const relocation=s.kingdom!==b.kingdom ? .95 : 1;
 const demand=clamp(def.realms[b.kingdom]*seasonal*market*(.66+b.reputation/200+b.loyalty/250)*relocation,.25,1.85);
 const marketWorld=typeof WorldTimeline==='undefined'?{jobs:1,price:1}:WorldTimeline.impact({...s,kingdom:b.kingdom});
 const revenue=round(def.revenue*marketWorld.jobs*demand*(.75+skill*.35+b.quality/250)*(1+b.staff*.4)/4);
 const costs=round((def.costs*marketWorld.price+b.staff*18000)*(.92+(1-skill)*.15)/4);
 const incident=luck<.045?round((400+def.cost*.035)):0;
 const profit=round(revenue-costs-incident);
 b.cash=round(clamp(b.cash+profit,0,1e7));b.lastRevenue=revenue;b.lastCosts=round(costs+incident);b.lastProfit=profit;b.totalProfit=round(clamp(b.totalProfit+profit,-1e7,1e7));b.lastDemand=round(demand);b.lastQuarter=q;
 b.loyalty=round(clamp(b.loyalty+(b.quality>=50?.3:.1)*k,0,100));
 b.reputation=round(clamp(b.reputation+(.1+(b.quality-40)/300)*k,0,100));
 const draw=profit>0?round(Math.min(b.cash,profit*.65)):0;if(draw>0){b.cash=round(Math.max(0,b.cash-draw));const ownerTax=Math.round(draw*.18*100)/100;s.gold=clamp(s.gold+draw-ownerTax,0,1e9);if(typeof Economy!=='undefined'){Economy.record(s,'gross',draw);Economy.record(s,'tax',ownerTax)}b.ownerDraw=round(b.ownerDraw+draw)}
 if(b.cash<=.01&&profit<0)b.badQuarters=round(b.badQuarters+k/4);else b.badQuarters=0;
 if(b.badQuarters>=1){history(s,def.name+'หยุดกิจการหลังเงินหมุนเวียนไม่พอจ่ายต้นทุน');l.business=null;s.joy=Math.max(0,s.joy-5);return {title:'วันที่ต้องปิดร้านชั่วคราว',tone:'loss',kind:'work',key:'business-closed-'+def.id+'-'+q,paragraphs:['เงินหมุนเวียนของ'+def.name+'ไม่พอจ่ายต้นทุนต่อ คุณชำระสิ่งที่จ่ายได้แล้วแจ้งลูกค้าและผู้ช่วยว่าจะหยุดรับงานใหม่','คุณเก็บบัญชีครั้งนี้ไว้ดูว่าเงินหมดที่ส่วนใด การเปิดร้านอีกครั้งจะต้องใช้เงินทุนใหม่และแผนที่ต่างจากเดิม']}}
 if(entry)return entry;
 // Finance always runs; a detailed business scene appears once per biological year.
 if(Math.floor(b.age)!==Math.floor(Math.max(0,b.age-k/4))){const where=KINGDOMS[b.kingdom][0],outcome=profit>=0?'รายรับพอจ่ายค่าใช้จ่ายและยังเหลือเก็บ':'รายรับยังไม่พอต้นทุน ต้องใช้เงินสำรองที่กันไว้';return {title:'ตรวจบัญชีของ'+def.name,kind:'work',key:'business-account-'+def.id+'-'+Math.floor(b.age),paragraphs:['ที่'+where+' คุณตรวจรายการรับจ่ายทีละบรรทัด '+outcome+' ช่วงล่าสุดมีรายรับ '+revenue.toFixed(2)+' ทอง และต้นทุน '+b.lastCosts.toFixed(2)+' ทอง',b.staff?'ผู้ช่วยนำยอดงานที่ยังค้างมาเทียบกับเวลาที่รับปากลูกค้า คุณทั้งคู่ตกลงว่าจะรับงานเพิ่มเท่าที่ทำไหว':'คุณสลับเวลารับลูกค้ากับการเตรียมสินค้า ถ้าจะขยายร้านจำเป็นต้องคิดทั้งค่าจ้างและเวลาสอนงาน',demand<.85?'คนซื้อของน้อยลงในฤดูนี้ คุณจึงลดของที่เตรียมล่วงหน้าและถามลูกค้าประจำว่าต้องการอะไร':b.quality>=60?'ลูกค้าประจำแนะนำคนรู้จักมาเพราะคุณภาพที่สม่ำเสมอ คุณจดคำสั่งซื้อไว้และไม่รับปากเกินกำลัง':'คุณจดข้อเสนอแนะจากลูกค้าไว้ปรับงานครั้งหน้า การรักษาคนที่กลับมาซื้อซ้ำสำคัญพอ ๆ กับหาลูกค้าใหม่']}}
 return null;
}
function valid(s){const l=s.livelihood;if(l===undefined)return true;const n=(v,a=0,b=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
 if(!l||l.version!==1||!n(l.workload??1,.4,1)||!n(l.lastIncome??0,0,1e9)||!n(l.lastHouseholdCost??0,0,1e9)||(l.job!==null&&(!Number.isInteger(l.job)||!JOBS[l.job]))||!n(l.tenure,0,10000)||!n(l.proficiency,0,100)||!Number.isInteger(l.level)||l.level<0||l.level>4||!n(l.lastQuarter,-1,20000)||!n(l.lastActionQuarter,-1,20000)||!n(l.changes,0,10000)||!Array.isArray(l.history)||l.history.length>30||l.history.some(e=>!n(e.age,0,10000)||typeof e.text!=='string'||e.text.length>400))return false;
 const b=l.business;if(b===null)return true;
 return !!b&&businessCatalog.some(x=>x.id===b.id)&&Number.isInteger(b.kingdom)&&b.kingdom>=0&&b.kingdom<KINGDOMS.length&&n(b.openedAge,0,10000)&&n(b.age,0,10000)&&n(b.cash,0,1e7)&&n(b.quality,0,100)&&n(b.loyalty,0,100)&&n(b.reputation,0,100)&&Number.isInteger(b.staff)&&n(b.staff,0,3)&&n(b.debt,0,1e7)&&n(b.lastRevenue,0,1e7)&&n(b.lastCosts,0,1e7)&&n(b.lastProfit,-1e7,1e7)&&n(b.totalProfit,-1e7,1e7)&&n(b.lastDemand,0,3)&&n(b.badQuarters,0,10000)&&b.mode==='steady'&&n(b.lastQuarter,-1,20000)&&n(b.ownerDraw,0,1e9);
}
return {ensure,valid,quarter,open,manage,careerChanged,salaryMultiplier,businessCatalog,levels,canCareer};
})();
