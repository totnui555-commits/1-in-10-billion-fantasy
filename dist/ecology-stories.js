'use strict';
(()=>{
 Ecology.installCareers();
 const nativeItems=[
 ['reed-rest','แปลงอ้อและโคลนพักกีบ',8,'home','reed-marsh',{health:.14,joy:.06},['marsh']],
 ['water-shelter','โพรงหินบังกระแสน้ำ',12,'home',null,{health:.14,bond:.04},['river','reef','ocean']],
 ['scent-trail','หินแร่บอกทางด้วยกลิ่น',7,'hobby',null,{wisdom:.1,joy:.06},['cave','marsh','steppe','glade','tree','dune']],
 ['roost-branch','กิ่งรับรังและแนวฝึกทรงตัว',10,'hobby','cliff-roost',{health:.1,joy:.08},['cliff']],
 ['warm-mineral','หินเก็บความร้อน',11,'home',null,{health:.14},['ember','cave','dune']],
 ['anchor-crystal','ผลึกยึดแกนและเก็บสัญญาณ',14,'hobby',null,{magic:.12,joy:.05},['stone','spirit','frost','ember','dune']],
 ['root-garden','แหล่งดินชื้นสำหรับหน่อใหม่',9,'hobby','root-hollow',{health:.1,bond:.08},['root','glade','tree']],
 ['web-anchor','หลักธรรมชาติสำหรับแนวใย',10,'home',null,{health:.1,bond:.06},['web','root','cave']],
 ['current-chimes','แนวเปลือกหอยรับกระแส',8,'hobby',null,{joy:.12,wisdom:.05},['river','reef','ocean','marsh']]
 ];
 for(const [id,name,cost,category,scene,effects,ecologyHabitats] of nativeItems)LifeChoices.registerItems([{id,name,label:name,cost,category,minAge:6,scene,effects,ecologyHabitats,prop:id,description:'จัดสภาพถิ่นให้เหมาะกับร่างและใช้ฝึกในช่วงพัก'}]);
 const nativeBusinesses=[
 {id:'native-routes',name:'บริการเส้นทางและสัญญาณในถิ่น',description:'รับส่งสัญญาณ เตือนสภาพถิ่น และนำทางตามรูปกายของผู้เดินทาง',cost:38,stat:'wisdom',minimum:16,revenue:19,costs:11},
 {id:'native-refuge',name:'เขตพักร่วมของหลายเผ่า',description:'ดูแลแหล่งดำรงชีวิตและพื้นที่พักที่แต่ละรูปกายใช้ได้ โดยร่วมงานกับผู้ดูแลประจำถิ่น',cost:48,stat:'bond',minimum:20,revenue:23,costs:15},
 {id:'native-signals',name:'วงฝึกสัญญาณของถิ่น',description:'ถ่ายทอดวิธีรับรู้และสื่อสาร โดยฝึกในสภาพแวดล้อมจริงของแต่ละเผ่า',cost:42,stat:'magic',minimum:18,revenue:21,costs:13}
 ];
 for(const b of nativeBusinesses)Livelihood.businessCatalog.push({...b,ecology:true,realms:Array(KINGDOMS.length).fill(1)});
 const choice=(label,effect,success,extra={})=>({label,effect,success,risk:0,...extra});
 ev('ecology-family','สมาชิกที่ขอร่วมถิ่น','สมาชิกอายุน้อยที่พลัดจากกลุ่มมาถึงแนวพัก คุณกับผู้เฝ้าถิ่นตรวจว่าพื้นที่และแหล่งดำรงชีวิตรองรับร่างของเขาได้ก่อน', [choice('รับดูแลเป็นสมาชิกของกลุ่ม',{gold:-6,bond:8,child:true},'กลุ่มจัดเขตพักและแบ่งเวรดูแลสมาชิกใหม่ คุณส่งสัญญาณเรียกจนเขาเริ่มจำได้'),choice('ช่วยตามหากลุ่มเดิม',{wisdom:5,bond:5},'ผู้รู้เส้นทางรับข่าวไปตามถิ่นข้างเคียง ระหว่างนี้เขาพักกับผู้เฝ้าถิ่น'),choice('ช่วยดูแลที่เขตพักร่วมก่อน',{gold:-3,bond:5},'คุณแบ่งแหล่งดำรงชีวิตและช่วยเฝ้าเขตพัก โดยยังไม่รับภาระเกินสิ่งที่ทำได้')],20,{ecologyNative:true,ecology:true,once:true,certain:true,lifeOpportunity:true,max:65});
 const hazards={tree:['กิ่งทางผ่านเริ่มปริ','ฝนทำให้กิ่งซึ่งกลุ่มใช้ผ่านอ่อนตัวลง'],cave:['เสียงหินที่เปลี่ยนไป','ทางลมในช่องพักเงียบลงหลังหินชิ้นหนึ่งเคลื่อน'],marsh:['แอ่งพักกำลังแห้ง','น้ำลดจนโคลนเริ่มดึงร่างของสมาชิกที่อ่อนแรง'],river:['ตะกอนจากต้นน้ำ','กระแสน้ำพาตะกอนขุ่นเข้าสู่แอ่งที่สมาชิกใหม่กำลังฝึก'],reef:['แนวปะการังหลังพายุ','กิ่งปะการังซึ่งบังกระแสให้กลุ่มหักลงหลังพายุ'],ocean:['เสียงตอบที่หายไป','กระแสพาฝูงแยกเป็นสองกลุ่ม เสียงเรียกจากอีกฝั่งเบาลง'],cliff:['ลมเปลี่ยนหน้ารัง','ลมยกหายไปก่อนสมาชิกที่ยังบินไม่คล่องจะกลับถึงรัง'],dune:['เงาร่มที่สั้นลง','ความร้อนลามถึงโพรงพักเร็วกว่าฤดูก่อน แหล่งน้ำอยู่ไกลขึ้น'],steppe:['ทางฝูงซึ่งถูกปิด','แหล่งดำรงชีวิตลดลง ขณะที่ฝูงข้างเคียงมาถึงทางผ่านเดียวกัน'],frost:['รอยอุ่นในเขตพัก','อุณหภูมิสูงขึ้นจนพื้นโพรงเริ่มเสียรูป'],ember:['รังที่ไฟเริ่มอ่อน','รอยอุ่นของรังลดลงในคืนที่สมาชิกใหม่ยังเก็บพลังเองไม่ได้'],spirit:['จุดยึดซึ่งถูกรบกวน','แรงจากภายนอกทำให้สัญญาณของผู้ที่เพิ่งก่อรูปขาดช่วง'],stone:['รอยร้าวรอบแกนพัก','แรงสั่นใหม่ทำให้จุดพักซึ่งเคยมั่นคงเริ่มแตกร้าว'],web:['สายใยรับแรงขาด','เส้นหลักขาดหลังฝนหนัก สมาชิกอีกฝั่งส่งสัญญาณขอทางกลับ'],root:['ดินชื้นที่เริ่มเสีย','น้ำขังพาสิ่งระคายรากเข้าสู่เขตที่เพิ่งแตกหน่อ'],glade:['ลานมอสที่ถูกเหยียบ','ทางของสัตว์ใหญ่ตัดผ่านเขตพักและแหล่งอาหารอ่อนของกลุ่ม']};
 for(const p of Ecology.profiles.slice(1)){
  const race=RACES[p.race][0],tag={ecologyOnly:p.race,ecology:true,once:true,certain:true,lifeOpportunity:true,scene:p.scene};
  ev('ecology-learn-'+p.race,'บทเรียนของ'+race,'ผู้ดูแลชวนคุณฝึก'+p.learningSkill+'ที่'+p.learning+' คุณอยากเริ่มอย่างไร',[
   choice('ฝึกกับผู้ชำนาญในถิ่น',{wisdom:4,bond:3},'คุณลอง'+p.learningSkill+'ทีละช่วง มีผู้ชำนาญคอยส่งสัญญาณเมื่อควรหยุดพัก',{ecologyLearning:'native'}),
   choice('ลองในเขตคุ้นเคยด้วยวิธีของตน',{wisdom:5,joy:2},'คุณใช้'+p.sense+'หาวิธีฝึกที่ร่างของตนรับไหว',{ecologyLearning:'native'}),
   choice('แลกเปลี่ยนวิธีกับชุมชนต่างเผ่า',{bond:5,wisdom:2},'คุณพบผู้ฝึกต่างเผ่าที่จุดติดต่อริมถิ่น แต่ละฝ่ายแสดงวิธีรับรู้ของตนโดยไม่บังคับให้อีกฝ่ายใช้ร่างเหมือนกัน',{ecologyLearning:'exchange'})
  ],6,{...tag,max:17});
  const [title,text]=hazards[p.habitat];
  ev('ecology-home-'+p.race,title,text+' คุณสังเกตความเปลี่ยนแปลงผ่าน'+p.sense+' และต้องเลือกว่าจะช่วยอย่างไร',[
   choice('แบ่งกำลังและเสบียงช่วยฟื้นเขตพัก',{gold:-8,bond:7,health:-2},'กลุ่มเริ่มฟื้น'+p.label+'จากส่วนที่เสียหายน้อย คุณช่วยเท่าที่ร่างรับไหว ก่อนให้ผู้อื่นรับช่วง'),
   choice('สำรวจที่พักสำรองกับกลุ่ม',{wisdom:6,bond:3},'คุณใช้วิธี'+p.learningSkill+'ตรวจทางใหม่ ยังไม่ย้ายทุกคนจนรู้ว่ามีจุดพักระหว่างทาง'),
   choice('ประสานกลุ่มข้างเคียงให้แบ่งพื้นที่',{bond:6,fame:3},'ผู้เฝ้าถิ่นข้างเคียงยอมเปิดเขตพักชั่วคราว แลกกับการช่วยดูแลพื้นที่เมื่อสภาพกลับเป็นปกติ')
  ],18,{...tag,max:80});
 }
})();
