const PI = Math.PI;

function jdFromDate(day:number, month:number, year:number) {
  const a=Math.floor((14-month)/12), y=year+4800-a, m=month+12*a-3;
  let jd=day+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
  if (jd<2299161) jd=day+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-32083;
  return jd;
}
function newMoon(k:number) {
  const t=k/1236.85,t2=t*t,t3=t2*t,dr=PI/180;
  let jd=2415020.75933+29.53058868*k+0.0001178*t2-0.000000155*t3+0.00033*Math.sin((166.56+132.87*t-0.009173*t2)*dr);
  const m=359.2242+29.10535608*k-0.0000333*t2-0.00000347*t3;
  const mp=306.0253+385.81691806*k+0.0107306*t2+0.00001236*t3;
  const f=21.2964+390.67050646*k-0.0016528*t2-0.00000239*t3;
  let c=(0.1734-0.000393*t)*Math.sin(m*dr)+0.0021*Math.sin(2*m*dr)-0.4068*Math.sin(mp*dr)+0.0161*Math.sin(2*mp*dr)-0.0004*Math.sin(3*mp*dr)+0.0104*Math.sin(2*f*dr)-0.0051*Math.sin((m+mp)*dr)-0.0074*Math.sin((m-mp)*dr)+0.0004*Math.sin((2*f+m)*dr)-0.0004*Math.sin((2*f-m)*dr)-0.0006*Math.sin((2*f+mp)*dr)+0.001*Math.sin((2*f-mp)*dr)+0.0005*Math.sin((2*mp+m)*dr);
  const delta=t< -11 ? 0.001+0.000839*t+0.0002261*t2-0.00000845*t3-0.000000081*t*t3 : -0.000278+0.000265*t+0.000262*t2;
  return jd+c-delta;
}
function sunLongitude(jdn:number) {
  const t=(jdn-2451545)/36525,t2=t*t,dr=PI/180;
  const m=357.5291+35999.0503*t-0.0001559*t2-0.00000048*t*t2;
  const l0=280.46645+36000.76983*t+0.0003032*t2;
  const dl=(1.9146-0.004817*t-0.000014*t2)*Math.sin(dr*m)+(0.019993-0.000101*t)*Math.sin(2*dr*m)+0.00029*Math.sin(3*dr*m);
  const l=(l0+dl)*dr; return l-PI*2*Math.floor(l/(PI*2));
}
const newMoonDay=(k:number,tz:number)=>Math.floor(newMoon(k)+0.5+tz/24);
const sunSector=(day:number,tz:number)=>Math.floor(sunLongitude(day-0.5-tz/24)/PI*6);
function month11(year:number,tz:number) {
  const off=jdFromDate(31,12,year)-2415021,k=Math.floor(off/29.530588853),nm=newMoonDay(k,tz);
  return sunSector(nm,tz)>=9 ? newMoonDay(k-1,tz) : nm;
}
function leapOffset(a11:number,tz:number) {
  const k=Math.floor((a11-2415021.076998695)/29.530588853+0.5); let last=0,i=1,arc=sunSector(newMoonDay(k+i,tz),tz);
  do { last=arc; i++; arc=sunSector(newMoonDay(k+i,tz),tz); } while(arc!==last&&i<14);
  return i-1;
}
export interface LunarDate { day:number; month:number; year:number; leap:boolean }
export function solarToVietnameseLunar(day:number,month:number,year:number,timezoneHours=7):LunarDate {
  const dayNumber=jdFromDate(day,month,year),k=Math.floor((dayNumber-2415021.076998695)/29.530588853);
  let monthStart=newMoonDay(k+1,timezoneHours); if(monthStart>dayNumber) monthStart=newMoonDay(k,timezoneHours);
  let a11=month11(year,timezoneHours),b11=a11,lunarYear:number;
  if(a11>=monthStart){ lunarYear=year;a11=month11(year-1,timezoneHours); } else { lunarYear=year+1;b11=month11(year+1,timezoneHours); }
  const lunarDay=dayNumber-monthStart+1,diff=Math.floor((monthStart-a11)/29),leapYear=b11-a11>365;
  let lunarMonth=diff+11,leap=false;
  if(leapYear){ const leapDiff=leapOffset(a11,timezoneHours); if(diff>=leapDiff){lunarMonth=diff+10;if(diff===leapDiff)leap=true;} }
  if(lunarMonth>12) lunarMonth-=12; if(lunarMonth>=11&&diff<4) lunarYear--;
  return {day:lunarDay,month:lunarMonth,year:lunarYear,leap};
}
