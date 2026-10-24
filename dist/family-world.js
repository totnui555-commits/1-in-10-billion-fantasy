'use strict';
const FamilyWorld=(()=>{
const temperaments=['อดทนและจำรายละเอียดเล็ก ๆ ได้','ชอบหัวเราะก่อนจะรู้ว่ามุกจบอย่างไร','เก็บความกังวลไว้หลังมือที่ลงมือทำ','เชื่อว่าทุกคนควรมีที่นั่งบนโต๊ะอาหาร','ฟังมากกว่าพูด แต่ไม่ลืมคำสัญญา','ชอบซ่อมของที่คนอื่นคิดว่าพังแล้ว','เคร่งครัดกับกฎและอ่อนโยนกับคน','ฝันถึงสถานที่ที่ยังไม่เคยไป'];
const occupations=[
 ['คนทำขนมปัง','ช่างซ่อมเกวียน','คนดูแลแปลงถั่ว','ผู้ช่วยหมอยา'],
 ['ช่างย้อมผ้า','ผู้เก็บภาษีตลาด','คนจูงสัตว์บรรทุก','ผู้คัดลอกเอกสาร'],
 ['ช่างแกะตรา','คนดูแลร้านเครื่องมือ','นักปรุงหมึก','ช่างซ่อมเครื่องราง'],
 ['ผู้คุมบัญชีคาราวาน','คนจัดเส้นทางเรือ','เจ้าของแผงเครื่องเทศ','ผู้ต่อรองค่าผ่านทาง'],
 ['อดีตบรรณารักษ์','ผู้ตรวจอักขระ','หมอสอนหนังสือ','ผู้แปลจารึกเก่า'],
 ['ผู้เฝ้าประตูชายแดน','คนฝึกม้า','ผู้ส่งสารของป้อม','หมอสนาม'],
 ['ผู้ดูแลที่ดินตระกูล','ผู้ร่างฎีกา','ผู้แทนสภาเมือง','ผู้จัดงานเลี้ยงการทูต'],
 ['ผู้รักษาหอจดหมายเหตุ','ช่างดูแลตราราชวงศ์','ผู้สอนมารยาทในวัง','ผู้เฝ้าสวนต้องห้าม'],
 ['ผู้ดูแลครัววิหาร','ครูสอนเด็กกำพร้า','คนทำโคมพิธี','ผู้เย็บเสื้อคลุมผู้แสวงบุญ'],
 ['ผู้นำทางในป่า','ช่างซ่อมรถบ้าน','คนตามหาน้ำสะอาด','นักเล่านิทานริมกองไฟ']
];
const types=[
 {adults:[['มารดา','ผู้เป็นหลักของบ้าน'],['บิดา','ผู้คอยเปิดประตูรับทุกคน']],siblings:1,kin:'ครอบครัวฐานะเรียบง่าย'},
 {adults:[['แม่บุญธรรม','ผู้พาคุณเข้าบ้าน'],['พ่อบุญธรรม','ผู้สอนธรรมเนียมของบ้าน']],siblings:1,kin:'ครอบครัวบุญธรรมต่างเผ่า'},
 {adults:[['มารดา','ผู้สืบความลับเก่า'],['บิดา','ผู้คอยกันภัยจากคำสาป']],siblings:0,elder:'ป้า',kin:'ตระกูลที่เก็บงำคำสาป'},
 {adults:[['มารดา','ผู้แทนสภาฝั่งตะวันออก'],['บิดา','ผู้แทนสภาฝั่งตะวันตก']],siblings:1,kin:'บ้านที่การเมืองอยู่บนโต๊ะอาหาร'},
 {adults:[['มารดา','ผู้แบ่งงานบ้านอย่างยุติธรรม'],['บิดา','ผู้จำวันเกิดลูกทุกคนได้']],siblings:5,kin:'ครอบครัวใหญ่ที่มีพี่น้องห้าคน'},
 {adults:[['ผู้ปกครองวิหารคนแรก','ผู้ดูแลเปลและห้องนอน'],['ผู้ปกครองวิหารคนที่สอง','ผู้เล่านิทานก่อนนอน']],siblings:2,kin:'ครอบครัวที่เลือกกันในวิหาร'},
 {adults:[['มารดา','ผู้นำทางของคาราวาน'],['บิดา','ผู้ซ่อมบ้านระหว่างทาง']],siblings:1,kin:'ครอบครัวนักเดินทางไร้แผ่นดิน'},
 {adults:[['บิดา','ผู้เลี้ยงดูคุณเพียงลำพัง']],siblings:0,elder:'ย่า',kin:'บ้านของพ่อเลี้ยงเดี่ยว'},
 {adults:[['มารดา','ผู้เก็บความลับจากชาติก่อน']],siblings:0,elder:'น้า',kin:'บ้านของแม่ผู้เก็บความลับเรื่องชาติก่อน'},
 {adults:[['มารดา','ผู้ปกป้องชื่อของตระกูล'],['บิดา','ผู้สอนประวัติศาสตร์ที่ไม่มีในตำรา']],siblings:1,elder:'ยาย',kin:'ตระกูลที่ครั้งหนึ่งเคยโค่นราชา'}
];
function mix(n){n=Math.imul(n^(n>>>16),2246822507);n=Math.imul(n^(n>>>13),3266489909);return (n^(n>>>16))>>>0}
function pick(seed,list,salt){return list[mix((seed^Math.imul(salt+1,2654435761))>>>0)%list.length]}
function ensure(s){
 if(!s.household){
  const typeIndex=Math.max(0,FAMILIES.indexOf(s.family)),t=types[typeIndex]||types[0],identity=s.identity||FantasyNames.generate(s.seed,s.race,s.kingdom),surname=identity.family;
  let slot=0;
  const make=(id,role,traitIndex,race=s.race,jobIndex=typeIndex)=>{if(typeof Ecology!=='undefined')race=Ecology.kinRace(s,race,slot);const slotId=170+slot++,g=race===0&&s.humanOrigin&&typeof HumanOrigins!=='undefined'?HumanOrigins.given(s,slotId):FantasyNames.generate(s.seed,race,s.kingdom,slotId).given;const h=(s.seed+slot*151)>>>0,isElder=id==='elder',isParent=id==='guardian'||id.startsWith('parent-'),isSibling=id.startsWith('sibling-'),siblingIndex=isSibling?Number(id.slice(8))||1:1,bioAge=isElder?60+h%15:isParent?27+h%11:isSibling?Math.max(3,19-siblingIndex*3+h%3):0,ageAtBirth=Math.round(Engine.ageFromEquivalent(bioAge,race)),lifeExpectancy=Math.round(RACES[race][2]*(.88+(mix(h+47)%25)/100));return {id,name:g+' '+surname,role,race,occupation:pick(h,occupations[(jobIndex+typeIndex)%occupations.length],slot+3),trait:pick(h,temperaments,slot+17),trust:id==='guardian'?74:62,look:{hair:h%5,coat:(h>>>4)%6,eyes:(h>>>7)%3},ageAtBirth,lifeExpectancy,alive:true}};
  const adults=t.adults.map((a,i)=>make(i===0?'guardian':'parent-'+(i+1),a[0]+' · '+a[1],i,typeIndex===1&&i===1?(s.race+1)%RACES.length:s.race,i+typeIndex));
  const siblings=[];for(let i=0;i<t.siblings;i++)siblings.push(make('sibling-'+(i+1),i===0&&typeIndex===4?'พี่คนโต':'พี่น้องร่วมบ้าน',i+3,(s.race+(i+1)%4)%RACES.length,typeIndex+i+2));
  if(t.elder)adults.push(make('elder',t.elder+' · ผู้เก็บเรื่องของบ้าน',6,(s.race+3)%RACES.length,typeIndex+4));
  if(!adults.length)adults.push(make('guardian','ผู้เลี้ยงดู',0));
  adults[0].id='guardian';adults[0].trust=74;
  s.household={version:1,typeIndex,title:s.family,surname,homeKingdom:s.kingdom,members:[...adults,...siblings],originNote:t.kin};
 }
 if(!Number.isInteger(s.homeKingdom))s.homeKingdom=s.household.homeKingdom??s.kingdom;
 if(!Array.isArray(s.route)||!s.route.length)s.route=[s.homeKingdom];
 if(!s.route.includes(s.kingdom))s.route.push(s.kingdom);
 while(s.route.length>24)s.route.shift();
 for(const member of s.household.members){
  if(!member.adultOccupation)member.adultOccupation=member.occupation;const memberBio=Engine.ageEquivalent(age(s,member),member.race);if(member.id.startsWith('child-')&&memberBio>=18&&member.adultOccupation==='กำลังค้นพบสิ่งที่รัก')member.adultOccupation=pick(s.seed+member.id.length,occupations[(s.rank+member.id.length)%occupations.length],Number(member.id.slice(6))||0);
  if(member.alive){const bioAge=Engine.ageEquivalent(age(s,member),member.race);member.occupation=typeof Ecology!=='undefined'&&Ecology.profile(member.race).strict?(bioAge<18?'กำลังฝึก'+Ecology.profile(member.race).learningSkill:member.nativeOccupation||member.adultOccupation):bioAge<4?'เรียนรู้และเติบโตในบ้าน':bioAge<13?'เรียนหนังสือและช่วยงานเล็กน้อย':bioAge<18?'เรียนและลองฝึกงาน':bioAge>=65?'ลดงานจาก'+member.adultOccupation:member.adultOccupation;}
 }
 return s.household;
}
function list(s){return ensure(s).members}
function primary(s){return list(s).find(m=>m.id==='guardian')||list(s)[0]}
function chooseRelative(s,index=0){const all=list(s),living=all.filter(x=>x.alive),m=living.filter(x=>x.id!=='guardian');return m.length?m[((index>>>0)%m.length)]:living[0]||primary(s)}
function age(s,m){return Math.max(0,Math.floor((m.ageAtBirth||0)+(s.age||0)))}
function partnerAlive(s){return list(s).some(m=>m.id==='partner'&&m.alive)}
function advance(s){const lost=[];for(const m of list(s)){if(m.alive&&age(s,m)>=(m.lifeExpectancy||RACES[m.race][2])){m.alive=false;m.deathAge=age(s,m);lost.push(m)}}return lost}
function addChild(s,index,options={}){const h=ensure(s);const id='child-'+index;if(h.members.some(m=>m.id===id))return h.members.find(m=>m.id===id);const originalRace=Number.isInteger(options.race)?options.race:s.race,race=typeof Ecology==='undefined'?originalRace:Ecology.kinRace(s,originalRace,800+index),name=(race===0&&s.humanOrigin&&typeof HumanOrigins!=='undefined'?HumanOrigins.given(s,800+index):FantasyNames.generate(s.seed,race,s.kingdom,800+index).given)+' '+h.surname;const child={id,name,role:(options.adopted?'ลูกบุญธรรม':'ลูก')+' · สมาชิกคนใหม่ของบ้าน',race,occupation:'กำลังค้นพบสิ่งที่รัก',trait:'ช่างสงสัยและชอบเก็บของชิ้นเล็ก',trust:65,look:{hair:(s.seed+index)%5,coat:(s.seed>>>4+index)%6,eyes:(s.seed>>>7+index)%3},ageAtBirth:-(s.age||0)+(options.adopted?Math.round(Engine.ageFromEquivalent(3,race)):0),lifeExpectancy:Math.round(RACES[race][2]),alive:true};h.members.push(child);return child}
function addPartner(s,given){const h=ensure(s),existing=h.members.find(m=>m.id==='partner');if(existing)return existing;const bio=Engine.biological(s),gap=(mix((s.seed+s.turn*31)>>>0)%9)-4,race=s.race,generated=FantasyNames.generate(s.seed,race,s.kingdom,1500+s.turn),surname=generated.family;const m={id:'partner',name:given&&String(given).includes(' ')?String(given):(given||generated.given)+' '+surname,role:'คู่ชีวิต · ผู้ร่วมสร้างบ้าน',race,occupation:pick(s.seed,occupations[(s.rank+5)%occupations.length],s.turn+41),trait:pick(s.seed,temperaments,s.turn+57),trust:Math.min(100,s.bond),look:{hair:(s.seed+s.turn)%5,coat:(s.seed>>>4)%6,eyes:(s.seed>>>7)%3},ageAtBirth:Math.round((gap*RACES[race][2])/85),lifeExpectancy:Math.round(RACES[race][2]*(.9+(mix(s.seed+s.turn)%21)/100)),alive:true};h.members.push(m);return m}
function adjust(s,id,amount){const m=list(s).find(x=>x.id===id)||primary(s);m.trust=Math.max(0,Math.min(100,m.trust+amount));return m}
function valid(h){return !h||(h.version===1&&Number.isInteger(h.typeIndex)&&h.typeIndex>=0&&h.typeIndex<FAMILIES.length&&Array.isArray(h.members)&&h.members.length>=2&&h.members.length<=110&&h.members.every(m=>m&&typeof m.id==='string'&&typeof m.name==='string'&&m.name.length<100&&typeof m.role==='string'&&typeof m.occupation==='string'&&(!m.adultOccupation||typeof m.adultOccupation==='string'&&m.adultOccupation.length<200)&&Number.isFinite(m.trust)&&m.trust>=0&&m.trust<=100&&Number.isInteger(m.race)&&m.race>=0&&m.race<RACES.length&&Number.isFinite(m.ageAtBirth)&&m.ageAtBirth<=100000&&Number.isFinite(m.lifeExpectancy)&&m.lifeExpectancy>0&&typeof m.alive==='boolean'))}
return {ensure,list,primary,chooseRelative,addChild,addPartner,partnerAlive,adjust,age,advance,valid,types,occupations};
})();
