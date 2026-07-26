import { solarToVietnameseLunar, type LunarDate } from './calendar.js';
import { findCity, listVietnamCities, vietnamCities } from './locations.js';
import { capabilities, getEngineCapabilities, getMethodologyManifest, methodologyResourceText } from './methodology.js';
import { createGroundedPrompt } from './prompts/grounded.js';
import { buildRelations } from './relations.js';
import { calculateCuc, menhStem, stems } from './rules/cuc.js';
import {
  bacSiCycle,
  groupStarBranch,
  khoiVietBranches,
  lifeCycle,
  lifeStart,
  locTonBranch,
  thaiTueCycle
} from './stars/auxiliary.js';
import { listMajorStars, majorMetadata, majors, majorStarBranches, tuViBranch } from './stars/major.js';
import { hoaByCan } from './stars/transformations.js';
import { renderSvg } from './svg/render.js';
import { minorLimitStart } from './timeline/rules.js';
import type {
  CalculateInput,
  ChartFact,
  ChartWarning,
  Palace,
  PhiHoaFlight,
  Star,
  TuViChart
} from './types.js';

export type {
  CalculateInput,
  ChartFact,
  ChartWarning,
  Gender,
  Palace,
  PhiHoaFlight,
  ProvenanceSource,
  Star,
  Tradition,
  TuViChart
} from './types.js';
export {
  capabilities,
  createGroundedPrompt,
  getEngineCapabilities,
  getMethodologyManifest,
  listMajorStars,
  listVietnamCities,
  renderSvg,
  vietnamCities
};

const branches = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const palaceNames = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ'];
function parseLocal(input:CalculateInput){
  if(!Number.isInteger(input.timezoneOffsetMinutes)||input.timezoneOffsetMinutes < -840||input.timezoneOffsetMinutes > 840) throw new Error('timezoneOffsetMinutes must be an integer from -840 to 840');
  const match = input.localDateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/);
  if (!match) throw new Error('localDateTime must be ISO-8601 local wall-clock');
  const [,y,mo,day,hh,mm,ss='0',ms='0'] = match;
  const wall = Date.UTC(+y,+mo-1,+day,+hh,+mm,+ss,+(ms+'00').slice(0,3));
  const check=new Date(wall);
  if(check.getUTCFullYear()!==+y||check.getUTCMonth()!==+mo-1||check.getUTCDate()!==+day||check.getUTCHours()!==+hh||check.getUTCMinutes()!==+mm||check.getUTCSeconds()!==+ss) throw new Error('localDateTime contains an invalid calendar date or time');
  const d = new Date(wall);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid localDateTime');
  return d;
}
function hourBranch(d:Date){ return Math.floor(((d.getUTCHours()+1)%24)/2); }
function equationOfTimeMinutes(d:Date) {
  const start = Date.UTC(d.getUTCFullYear(),0,1);
  const day = Math.floor((d.getTime()-start)/86400000)+1;
  const b = 2*Math.PI*(day-81)/364;
  return 9.87*Math.sin(2*b)-7.53*Math.cos(b)-1.5*Math.sin(b);
}

export function calculateTuVi(input: CalculateInput): TuViChart {
  if (!input||typeof input!=='object'||typeof input.localDateTime!=='string'||!input.localDateTime||!input.gender) throw new Error('localDateTime and gender are required');
  const inputKeys=['localDateTime','timezoneOffsetMinutes','gender','trueSolarTime','location','tradition','asOfYear','asOfDate','include'];
  for(const key of Object.keys(input)) if(!inputKeys.includes(key)) throw new Error(`input.${key} is not supported`);
  if(input.gender!=='male'&&input.gender!=='female') throw new Error('gender must be male or female');
  if(input.trueSolarTime!==undefined&&typeof input.trueSolarTime!=='boolean') throw new Error('trueSolarTime must be boolean');
  if(input.tradition&&!['vietnamese','trung-chau','custom'].includes(input.tradition)) throw new Error('tradition is not supported');
  if(input.asOfYear!==undefined&&(!Number.isInteger(input.asOfYear)||input.asOfYear<1||input.asOfYear>9999)) throw new Error('asOfYear must be an integer from 1 to 9999');
  if(input.asOfDate!==undefined&&(typeof input.asOfDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(input.asOfDate))) throw new Error('asOfDate must use YYYY-MM-DD');
  if(input.location!==undefined&&(typeof input.location!=='object'||input.location===null)) throw new Error('location must be an object');
  for(const key of Object.keys(input.location??{})) if(!['city','longitude'].includes(key)) throw new Error(`location.${key} is not supported`);
  if(input.location?.city!==undefined&&typeof input.location.city!=='string') throw new Error('location.city must be a string');
  if(input.location?.longitude!==undefined&&(!Number.isFinite(input.location.longitude)||input.location.longitude < -180||input.location.longitude > 180)) throw new Error('location.longitude must be from -180 to 180');
  if(input.include!==undefined&&(typeof input.include!=='object'||input.include===null)) throw new Error('include must be an object');
  for(const [key,value] of Object.entries(input.include??{})) if(!['daiHan','tieuHan','luuNien','luuNguyet','luuNhat','phiHoa'].includes(key)||typeof value!=='boolean') throw new Error(`include.${key} is not a supported boolean flag`);
  const date = parseLocal(input);
  const instant=new Date(date.getTime()-input.timezoneOffsetMinutes*60000);
  const catalogCity=findCity(input.location?.city);
  const longitude = input.location?.longitude ?? catalogCity?.longitude;
  const standardMeridian=input.timezoneOffsetMinutes/4;
  const longitudeCorrection = input.trueSolarTime && longitude !== undefined ? (longitude-standardMeridian)*4 : 0;
  const equationCorrection = input.trueSolarTime && longitude !== undefined ? equationOfTimeMinutes(date) : 0;
  const solarCorrection = longitudeCorrection + equationCorrection;
  const effectiveDate = new Date(date.getTime() + solarCorrection * 60000);
  const year = effectiveDate.getUTCFullYear(); const h = hourBranch(effectiveDate);
  const lunar = solarToVietnameseLunar(effectiveDate.getUTCDate(),effectiveDate.getUTCMonth()+1,effectiveDate.getUTCFullYear(),input.timezoneOffsetMinutes/60);
  const menhRaw=2+(lunar.month-1)-h, menh=((menhRaw%12)+12)%12;
  const than=(2+(lunar.month-1)+h)%12;
  const {yearStemIndex:can,palaceStemIndex:palaceStem,cuc}=calculateCuc(lunar.year,menh);
  const starBranches=majorStarBranches(tuViBranch(lunar.day,cuc.number));
  const stars:Star[] = majors.map(([code,name])=>({code,nameVi:name,kind:'major',palaceIndex:((starBranches.get(code) ?? 0)-menh+12)%12,...majorMetadata[code]}));
  const auxiliary:[string,string,number][]=[
    ['van-xuong','Văn Xương',(10-h+12)%12],['van-khuc','Văn Khúc',(4+h)%12],
    ['ta-phu','Tả Phù',(4+lunar.month-1)%12],['huu-bat','Hữu Bật',(10-(lunar.month-1)+12)%12],
    ['loc-ton','Lộc Tồn',locTonBranch[can]],['kinh-duong','Kình Dương',(locTonBranch[can]+1)%12],
    ['da-la','Đà La',(locTonBranch[can]+11)%12]
  ];
  auxiliary.forEach(([code,name,branch])=>stars.push({code,nameVi:name,kind:'auxiliary',palaceIndex:(branch-menh+12)%12}));
  const lifeForward=(can%2===0&&input.gender==='male')||(can%2===1&&input.gender==='female');
  lifeCycle.forEach(([code,name],i)=>{
    const branch=(lifeStart[cuc.element]+(lifeForward?i:-i)+120)%12;
    stars.push({code,nameVi:name,kind:'auxiliary',palaceIndex:(branch-menh+12)%12});
  });
  const yearBranch=((lunar.year-4)%12+12)%12;
  thaiTueCycle.forEach(([code,name],i)=>stars.push({code,nameVi:name,kind:'auxiliary',palaceIndex:(yearBranch+i-menh+12)%12}));
  bacSiCycle.forEach(([code,name],i)=>{
    const branch=(locTonBranch[can]+(lifeForward?i:-i)+120)%12;
    stars.push({code,nameVi:name,kind:'auxiliary',palaceIndex:(branch-menh+12)%12});
  });
  const [khoiBranch,vietBranch]=khoiVietBranches[can],hongLoanBranch=(3-yearBranch+12)%12;
  const annualAuxiliary:[string,string,number][]=[
    ['thien-khoi','Thiên Khôi',khoiBranch],['thien-viet','Thiên Việt',vietBranch],
    ['thien-ma','Thiên Mã',groupStarBranch(yearBranch,'thien-ma')],
    ['dao-hoa','Đào Hoa',groupStarBranch(yearBranch,'dao-hoa')],
    ['hong-loan','Hồng Loan',hongLoanBranch],['thien-hy','Thiên Hỷ',(hongLoanBranch+6)%12]
  ];
  annualAuxiliary.forEach(([code,name,branch])=>stars.push({code,nameVi:name,kind:'auxiliary',palaceIndex:(branch-menh+12)%12}));
  const hoaNames=['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ']; (hoaByCan[can]||[]).forEach((code,i)=>{ const s=stars.find(x=>x.code===code); if(s) stars.push({code:`${code}-hoa-${['loc','quyen','khoa','ky'][i]}`,nameVi:`${s.nameVi} ${hoaNames[i]}`,kind:'transformation',palaceIndex:s.palaceIndex,element:s.element,yinYang:s.yinYang,group:'tu-hoa'}); });
  const palaces:Palace[] = palaceNames.map((name,i)=>({code:name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-'),nameVi:name,index:i,branch:branches[(menh+i)%12],isMenh:i===0,isThan:i===((than-menh+12)%12),stars:stars.filter(s=>s.palaceIndex===i).map(s=>s.code)}));
  const phiHoa:PhiHoaFlight[]|undefined=input.include?.phiHoa?palaces.flatMap(p=>{
    const branch=(menh+p.index)%12,stem=menhStem(can,branch);
    return hoaByCan[stem].flatMap((starCode,i)=>{
      const target=stars.find(s=>s.code===starCode&&s.kind!=='transformation');
      if(!target)return[];
      const transformation=(['loc','quyen','khoa','ky'] as const)[i];
      return [{code:`phi-hoa.${p.index}.${transformation}.${starCode}.${target.palaceIndex}`,sourcePalaceIndex:p.index,targetPalaceIndex:target.palaceIndex,sourceStem:stems[stem],starCode,transformation}];
    });
  }):undefined;
  const relations=buildRelations(menh);
  let asOfLunar:LunarDate|undefined,asOfYearBranch:number|undefined,dauQuanBranch:number|undefined,luuNguyetBranch:number|undefined,luuNhatBranch:number|undefined;
  if(input.asOfDate){
    const [ay,am,ad]=input.asOfDate.split('-').map(Number);
    const check=new Date(Date.UTC(ay,am-1,ad));
    if(check.getUTCFullYear()!==ay||check.getUTCMonth()!==am-1||check.getUTCDate()!==ad) throw new Error('asOfDate contains an invalid calendar date');
    asOfLunar=solarToVietnameseLunar(ad,am,ay,input.timezoneOffsetMinutes/60);
    asOfYearBranch=((asOfLunar.year-4)%12+12)%12;
    dauQuanBranch=(asOfYearBranch-(lunar.month-1)+h+120)%12;
    luuNguyetBranch=(dauQuanBranch+asOfLunar.month-1)%12;
    luuNhatBranch=(luuNguyetBranch+asOfLunar.day-1)%12;
  }
  const limitYear=asOfLunar?.year??input.asOfYear;
  const nominalAge=limitYear!==undefined?limitYear-lunar.year+1:undefined;
  const tieuHanBranch=nominalAge!==undefined&&nominalAge>0?((minorLimitStart(yearBranch)+(input.gender==='male'?nominalAge-1:-(nominalAge-1)))%12+12)%12:undefined;
  const limitYearBranch=asOfYearBranch??(input.asOfYear!==undefined?((input.asOfYear-4)%12+12)%12:undefined);
  const timeline = { ...(input.include?.daiHan ? {daiHan:Array.from({length:12},(_,i)=>({startAge:cuc.number+i*10,endAge:cuc.number+i*10+9,palaceIndex:(lifeForward?i:(12-i)%12)}))}:{ }),
    ...(input.include?.tieuHan&&input.asOfYear&&nominalAge&&tieuHanBranch!==undefined?{tieuHan:{year:input.asOfYear,nominalAge,palaceIndex:(tieuHanBranch-menh+12)%12}}:{}),
    ...(input.include?.luuNien&&input.asOfYear&&limitYearBranch!==undefined ? {luuNien:[{year:input.asOfYear,palaceIndex:(limitYearBranch-menh+12)%12}]}:{}),
    ...(input.include?.luuNguyet&&input.asOfDate&&asOfLunar&&luuNguyetBranch!==undefined?{luuNguyet:{asOfDate:input.asOfDate,lunarMonth:asOfLunar.month,palaceIndex:(luuNguyetBranch-menh+12)%12}}:{}),
    ...(input.include?.luuNhat&&input.asOfDate&&asOfLunar&&luuNhatBranch!==undefined?{luuNhat:{asOfDate:input.asOfDate,lunarDay:asOfLunar.day,palaceIndex:(luuNhatBranch-menh+12)%12}}:{}) };
  const audit = [{rule:'lunar-date',value:`${lunar.year}-${lunar.month}-${lunar.day}${lunar.leap?'-leap':''}`,source:'Vietnamese astronomical lunar calendar'},{rule:'menh-branch-index',value:String(menh),source:'lunar month and hour branch'},{rule:'menh-stem-branch',value:`${stems[palaceStem]} ${branches[menh]}`,source:'Ngũ hổ độn palace stem rule'},{rule:'cuc-na-yin-element',value:cuc.element,source:'60 Jiazi Na Yin table'},{rule:'trang-sinh-direction',value:lifeForward?'forward':'reverse',source:'year yin-yang and gender'},{rule:'tu-vi-branch-index',value:String(starBranches.get('tu-vi')),source:'lunar day and Cục placement rule'},{rule:'year-can',value:String(can),source:'sexagenary lunar year'}, ...(input.trueSolarTime ? [
    {rule:'longitude-correction-minutes',value:String(longitudeCorrection),source:longitude === undefined ? 'longitude unavailable' : `longitude vs ${standardMeridian}° standard meridian`},
    {rule:'equation-of-time-minutes',value:String(equationCorrection),source:longitude === undefined ? 'not applied without longitude' : 'NOAA-style day-of-year approximation'},
    {rule:'true-solar-correction-minutes',value:String(solarCorrection),source:'longitude correction plus equation of time'}
  ] : [])];
  if(input.include?.daiHan) audit.push({rule:'dai-han-direction',value:lifeForward?'forward':'reverse',source:'year yin-yang and gender'});
  if(input.include?.tieuHan&&nominalAge&&tieuHanBranch!==undefined) audit.push({rule:'tieu-han-position',value:`age-${nominalAge}:${branches[tieuHanBranch]}`,source:'year-branch trine start and male-forward/female-reverse'});
  if(input.include?.luuNien&&limitYearBranch!==undefined) audit.push({rule:'luu-nien-year-branch',value:branches[limitYearBranch],source:asOfLunar?'asOfDate Vietnamese lunar year branch':'asOfYear sexagenary branch'});
  if(input.include?.luuNguyet&&asOfLunar&&dauQuanBranch!==undefined) audit.push({rule:'luu-nguyet-dau-quan',value:`${branches[dauQuanBranch]}:${asOfLunar.month}`,source:'annual branch, birth lunar month and birth hour'});
  if(input.include?.luuNhat&&asOfLunar) audit.push({rule:'luu-nhat-lunar-day',value:String(asOfLunar.day),source:'asOfDate Vietnamese lunar day'});
  if(input.include?.phiHoa) audit.push({rule:'phi-hoa-palace-stems',value:String(phiHoa?.length??0),source:'palace heavenly stem transformation table'});
  const versionForRule=(rule:string)=>{
    if(rule==='lunar-date')return'vn-astronomical-lunar-1';
    if(rule.includes('solar')||rule.includes('longitude')||rule.includes('equation-of-time'))return'longitude-eot-approx-1';
    if(rule.includes('cuc')||rule==='menh-stem-branch')return'jiazi-nayin-2';
    if(rule==='tu-vi-branch-index')return'tuvi-thienphu-groups-1';
    if(rule.startsWith('phi-hoa'))return'palace-stem-phi-hoa-1';
    if(rule.includes('han')||rule.startsWith('luu-'))return'daihan-luunien-baseline-1';
    return'menh-than-lunar-month-hour-1';
  };
  const versionedAudit=audit.map(entry=>({...entry,version:versionForRule(entry.rule)}));
  const menhPalace=palaces[0],menhStars=stars.filter(s=>s.palaceIndex===0&&s.kind==='major');
  const facts:ChartFact[]=[
    {code:'chart.menh.location',text:{vi:`Cung Mệnh an tại ${menhPalace.branch}.`,en:`The Life palace is located at ${menhPalace.branch}.`},evidence:['audit:menh-branch-index','palace:menh']},
    {code:'chart.cuc',text:{vi:`Lá số thuộc ${cuc.nameVi}.`,en:`The chart uses ${cuc.code}.`},evidence:['audit:cuc-na-yin-element',`cuc:${cuc.code}`]},
    {code:'chart.menh.major-stars',text:{vi:`Chính tinh tại Mệnh: ${menhStars.map(s=>s.nameVi).join(', ')||'Vô chính diệu'}.`,en:`Major stars in Life palace: ${menhStars.map(s=>s.code).join(', ')||'none'}.`},evidence:menhStars.map(s=>`star:${s.code}`)}
  ];
  const warnings:ChartWarning[]=[];
  if(input.tradition&&input.tradition!=='vietnamese') warnings.push({code:'tradition.baseline-fallback',severity:'warning',message:{vi:`Profile ${input.tradition} chưa có rule table riêng; kết quả dùng baseline Vietnamese.`,en:`The ${input.tradition} profile has no dedicated rule table; Vietnamese baseline rules were used.`}});
  if(input.trueSolarTime&&longitude===undefined) warnings.push({code:'solar-time.longitude-missing',severity:'warning',message:{vi:'Không có kinh độ nên chưa áp dụng hiệu chỉnh giờ Mặt Trời thật.',en:'True solar time correction was not applied because longitude is unavailable.'}});
  if(catalogCity&&input.timezoneOffsetMinutes!==catalogCity.timezoneOffsetMinutes) warnings.push({code:'location.timezone-mismatch',severity:'warning',message:{vi:`Timezone input không khớp catalog ${catalogCity.nameVi}.`,en:`The input timezone does not match the catalog timezone for ${catalogCity.nameEn}.`}});
  if((input.include?.luuNguyet||input.include?.luuNhat)&&!input.asOfDate) warnings.push({code:'timeline.as-of-date-missing',severity:'warning',message:{vi:'Cần asOfDate để tính Lưu Nguyệt hoặc Lưu Nhật.',en:'asOfDate is required to calculate monthly or daily limits.'}});
  if(input.include?.phiHoa) warnings.push({code:'feature.phi-hoa-baseline',severity:'info',message:{vi:'Phi Hóa dùng bảng can cung của profile Vietnamese baseline; trường phái khác có thể dùng quy ước khác.',en:'Flying transformations use the Vietnamese baseline palace-stem table; other schools may differ.'}});
  if(lunar.leap) warnings.push({code:'calendar.leap-month',severity:'info',message:{vi:'Ngày sinh nằm trong tháng âm lịch nhuận.',en:'The birth date falls in a leap lunar month.'}});
  return {input,palaces,stars,cuc,metadata:{engine:'viet-tuvi-engine',version:'0.1.0',schemaVersion:'0.1.0',ruleSetVersion:'vn-popular-0.2',methodology:`${input.tradition||'vietnamese'} deterministic baseline`,calculatedAt:instant.toISOString(),capabilities:['palaces','14-major-stars','tu-hoa','cuc','relations','audit','localized-facts','warnings','phi-hoa'],sources:getMethodologyManifest().sources},audit:versionedAudit,timeline,relations,facts,warnings,...(phiHoa?{phiHoa}:{})};
}

export function serializeChart(chart: TuViChart): string {
  return JSON.stringify(chart);
}
export function compareChartFixture(input:CalculateInput,expected:Partial<TuViChart>){
  const actual=calculateTuVi(input),diffs:{path:string;expected:unknown;actual:unknown}[]=[];
  const check=(path:string,want:unknown,got:unknown)=>{if(JSON.stringify(want)!==JSON.stringify(got))diffs.push({path,expected:want,actual:got});};
  if(expected.cuc?.code!==undefined)check('cuc.code',expected.cuc.code,actual.cuc.code);
  if(expected.palaces) for(const palace of expected.palaces){
    const got=actual.palaces.find(p=>p.index===palace.index);
    if(!got)diffs.push({path:`palaces[${palace.index}]`,expected:palace,actual:undefined});
    else {
      if(palace.branch!==undefined)check(`palaces[${palace.index}].branch`,palace.branch,got.branch);
      if(palace.isMenh!==undefined)check(`palaces[${palace.index}].isMenh`,palace.isMenh,got.isMenh);
      if(palace.isThan!==undefined)check(`palaces[${palace.index}].isThan`,palace.isThan,got.isThan);
      if(palace.stars!==undefined)check(`palaces[${palace.index}].stars`,[...palace.stars].sort(),[...got.stars].sort());
    }
  }
  if(expected.stars) for(const star of expected.stars){
    const got=actual.stars.find(s=>s.code===star.code);
    if(!got)diffs.push({path:`stars.${star.code}`,expected:star,actual:undefined});
    else if(star.palaceIndex!==undefined)check(`stars.${star.code}.palaceIndex`,star.palaceIndex,got.palaceIndex);
  }
  return {match:diffs.length===0,diffs,actual,methodology:'stable-field fixture comparison'};
}
function engineErrorCode(error:unknown){
  const message=error instanceof Error?error.message:String(error);
  if(message.includes('localDateTime'))return'input.local-date-time';
  if(message.includes('timezoneOffsetMinutes'))return'input.timezone-offset';
  if(message.includes('gender'))return'input.gender';
  if(message.includes('trueSolarTime'))return'input.true-solar-time';
  if(message.includes('location.longitude'))return'input.location.longitude';
  if(message.includes('location.city'))return'input.location.city';
  if(message.includes('location'))return'input.location';
  if(message.includes('asOfDate'))return'input.as-of-date';
  if(message.includes('asOfYear'))return'input.as-of-year';
  if(message.includes('include.'))return'input.include';
  if(message.includes('tradition'))return'input.tradition';
  if(message.includes('not supported'))return'input.additional-property';
  return'engine.invalid-input';
}
export function validateInput(input: unknown) {
  try {
    calculateTuVi(input as CalculateInput);
    return {valid:true,issues:[] as {code:string;message:string}[]};
  } catch(error) {
    return {valid:false,issues:[{code:engineErrorCode(error),message:error instanceof Error?error.message:'Invalid input'}]};
  }
}

export function sensitivity(input: CalculateInput) {
  const base = calculateTuVi(input);
  const datePart=input.localDateTime.slice(0,10);
  const hourBranches=Array.from({length:12},(_,branch)=>{
    const hour=branch===0?0:branch*2;
    const chart=calculateTuVi({...input,localDateTime:`${datePart}T${String(hour).padStart(2,'0')}:00:00`});
    return {hourBranch:branches[branch],localHour:hour,menhBranch:chart.palaces[0].branch,
      thanPalace:chart.palaces.find(p=>p.isThan)?.code??'unknown',cuc:chart.cuc.code,
      majorStarsAtMenh:chart.stars.filter(s=>s.kind==='major'&&s.palaceIndex===0).map(s=>s.code)};
  });
  const variants = [-1, 0, 1].map(delta => {
    const d = new Date(`${input.localDateTime}Z`);
    d.setUTCHours(d.getUTCHours() + delta);
    const chart = calculateTuVi({...input, localDateTime: d.toISOString().slice(0,19)});
    return { deltaHours: delta, menhBranch: chart.palaces[0].branch, palaceIndex: chart.palaces[0].index,
      changed: chart.palaces[0].branch !== base.palaces[0].branch };
  });
  const baselineSignature=`${base.palaces[0].branch}|${base.cuc.code}|${base.stars.filter(s=>s.kind==='major'&&s.palaceIndex===0).map(s=>s.code).join(',')}`;
  const stableCount=hourBranches.filter(v=>`${v.menhBranch}|${v.cuc}|${v.majorStarsAtMenh.join(',')}`===baselineSignature).length;
  return { baseline: { menhBranch: base.palaces[0].branch, palaceIndex: base.palaces[0].index },
    variants,hourBranches,stabilityScore:stableCount/12,
    methodology:'adjacent-hour perturbation plus twelve birth-hour branch sweep' };
}

export function calculateTimeline(input:CalculateInput){
  const chart=calculateTuVi({...input,include:{...input.include,daiHan:true,tieuHan:true,luuNien:true,...(input.asOfDate?{luuNguyet:true,luuNhat:true}:{})}});
  return {
    input:chart.input,timeline:chart.timeline,
    audit:chart.audit.filter(entry=>entry.rule.includes('han')||entry.rule.startsWith('luu-')),
    warnings:chart.warnings.filter(warning=>warning.code.startsWith('timeline.')),
    metadata:{engine:chart.metadata.engine,version:chart.metadata.version,ruleSetVersion:chart.metadata.ruleSetVersion}
  };
}

export function compatibility(a: CalculateInput, b: CalculateInput) {
  const left = calculateTuVi(a), right = calculateTuVi(b);
  const li=branches.indexOf(left.palaces[0].branch),ri=branches.indexOf(right.palaces[0].branch);
  const distance=Math.min((li-ri+12)%12,(ri-li+12)%12);
  const lucHop=[[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]].some(([x,y])=>(li===x&&ri===y)||(li===y&&ri===x));
  const branchRelation=li===ri?'same':distance===4?'tam-hop':lucHop?'luc-hop':distance===6?'xung':'neutral';
  const branchPoints={same:8,'tam-hop':15,'luc-hop':12,xung:-18,neutral:0}[branchRelation];
  const elements=['moc','hoa','tho','kim','thuy'],le=elements.indexOf(left.cuc.element),re=elements.indexOf(right.cuc.element);
  const elementRelation=le===re?'same':(le+1)%5===re||(re+1)%5===le?'productive':(le+2)%5===re||(re+2)%5===le?'controlling':'neutral';
  const elementPoints={same:10,productive:14,controlling:-12,neutral:0}[elementRelation];
  const score=Math.max(0,Math.min(100,60+branchPoints+elementPoints));
  return { score, grade: score >= 75 ? 'favorable' : score >= 50 ? 'mixed' : 'challenging',
    aspects:[
      {code:'compatibility.menh-branch',relation:branchRelation,score:branchPoints,evidence:[`left:${left.palaces[0].branch}`,`right:${right.palaces[0].branch}`]},
      {code:'compatibility.cuc-element',relation:elementRelation,score:elementPoints,evidence:[`left:${left.cuc.element}`,`right:${right.cuc.element}`]}
    ],
    evidence: [{code:'menh-branch-relation', value:branchRelation}, {code:'cuc-element-relation', value:elementRelation}],
    methodology: 'structural baseline; not predictive advice' };
}

export function handleMcpMessage(message: unknown): Record<string, unknown>|null {
  const m = message as { id?: string|number; method?: string; params?: any };
  if(m?.id===undefined&&m?.method?.startsWith('notifications/')) return null;
  const id = m.id ?? null;
  try {
    if(m.method==='initialize') return {jsonrpc:'2.0',id,result:{protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false},resources:{subscribe:false,listChanged:false}},serverInfo:{name:'viet-tuvi-engine',version:'0.1.0'}}};
    if(m.method==='resources/list') return {jsonrpc:'2.0',id,result:{resources:[
      {uri:'tuvi://methodology',name:'Methodology manifest',description:'Versioned calculation rules and provenance',mimeType:'application/json'},
      {uri:'tuvi://sources/trung-chau',name:'Trung Châu research sources',description:'Public comparison and reference sources',mimeType:'text/markdown'}
    ]}};
    if(m.method==='resources/read'){
      const uri=m.params?.uri;
      if(uri==='tuvi://methodology') return {jsonrpc:'2.0',id,result:{contents:[{uri,mimeType:'application/json',text:methodologyResourceText()}]}};
      if(uri==='tuvi://sources/trung-chau') return {jsonrpc:'2.0',id,result:{contents:[{uri,mimeType:'text/markdown',text:'# Trung Châu sources\n\n- https://tuvibacphai.com/tuvi (comparison oracle)\n- https://tuvivietnam.vn/so-luoc-ve-lich-su-tu-vi-trung-hoa-noi-chung-va-trung-chau-phai-noi-rieng/ (historical reference)\n- https://tuvivietnam.vn/trung-chau-phai/ (auxiliary-star reference)\n- https://tuvitrungchau.com (school bibliography)\n\nThese are reference/comparison sources, not claims of conformance.'}]}};
      return {jsonrpc:'2.0',id,error:{code:-32602,message:'Unknown resource URI'}};
    }
    if(m.method==='tools/list') return {jsonrpc:'2.0',id,result:{tools:[
      {name:'capabilities',description:'Discover engine features and versions',inputSchema:{type:'object',additionalProperties:false}},
      {name:'cities',description:'List supported Vietnamese city locations',inputSchema:{type:'object',additionalProperties:false}},
      {name:'major-stars',description:'List stable metadata for the fourteen major stars',inputSchema:{type:'object',additionalProperties:false}},
      {name:'methodology',description:'Return versioned calculation methodology manifest',inputSchema:{type:'object',additionalProperties:false}},
      {name:'validate-input',description:'Validate calculation input without throwing',inputSchema:{type:'object'}},
      {name:'calculate',description:'Calculate a structured Tu Vi chart',inputSchema:{type:'object',required:['localDateTime','timezoneOffsetMinutes','gender']}},
      {name:'compare-fixture',description:'Compare a chart against stable expected fields',inputSchema:{type:'object',required:['input','expected']}},
      {name:'timeline',description:'Calculate major, minor, annual, monthly, and daily limits',inputSchema:{type:'object',required:['localDateTime','timezoneOffsetMinutes','gender','asOfYear']}},
      {name:'sensitivity',description:'Compare nearby birth-hour variants',inputSchema:{type:'object',required:['localDateTime','timezoneOffsetMinutes','gender']}},
      {name:'compatibility',description:'Compare two chart inputs',inputSchema:{type:'object',required:['a','b']}},
      {name:'grounded-prompt',description:'Create an evidence-grounded interpretation prompt',inputSchema:{type:'object',required:['chart']}}
      ,{name:'render-svg',description:'Render an accessible high-contrast SVG chart',inputSchema:{type:'object',required:['chart']}}
    ]}};
    if(m.method==='tools/call'){
      const name=m.params?.name,args=m.params?.arguments??{};
      let result:unknown;
      if(name==='capabilities') result=capabilities();
      else if(name==='cities') result={cities:listVietnamCities()};
      else if(name==='major-stars') result={stars:listMajorStars()};
      else if(name==='methodology') result=getMethodologyManifest();
      else if(name==='validate-input') result=validateInput(args);
      else if(name==='calculate') result=calculateTuVi(args);
      else if(name==='compare-fixture') result=compareChartFixture(args.input,args.expected);
      else if(name==='timeline') result=calculateTimeline(args);
      else if(name==='sensitivity') result=sensitivity(args);
      else if(name==='compatibility') result=compatibility(args.a,args.b);
      else if(name==='grounded-prompt') result=createGroundedPrompt(args.chart,args.locale);
      else if(name==='render-svg') result={svg:renderSvg(args.chart)};
      else return {jsonrpc:'2.0',id,error:{code:-32602,message:`Unknown tool: ${String(name)}`}};
      return {jsonrpc:'2.0',id,result:{content:[{type:'text',text:JSON.stringify(result)}],structuredContent:result}};
    }
    if (m.method === 'capabilities') return {jsonrpc:'2.0', id, result:capabilities()};
    if (m.method === 'calculate') return {jsonrpc:'2.0', id, result:calculateTuVi(m.params)};
    if (m.method === 'sensitivity') return {jsonrpc:'2.0', id, result:sensitivity(m.params)};
    if (m.method === 'compatibility') return {jsonrpc:'2.0', id, result:compatibility(m.params.a, m.params.b)};
    if (m.method === 'grounded-prompt') return {jsonrpc:'2.0', id, result:createGroundedPrompt(m.params.chart, m.params.locale)};
    return {jsonrpc:'2.0', id, error:{code:-32601, message:'Method not found'}};
  } catch (error) {
    return {jsonrpc:'2.0', id, error:{code:-32602, message:error instanceof Error ? error.message : 'Invalid params',data:{engineCode:engineErrorCode(error)}}};
  }
}
