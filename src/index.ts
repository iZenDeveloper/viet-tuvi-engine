import { calculateTuVi } from './calculate.js';
import { branches } from './domain.js';
import { listVietnamCities, vietnamCities } from './locations.js';
import { capabilities, getEngineCapabilities, getMethodologyManifest, methodologyResourceText } from './methodology.js';
import { createGroundedPrompt } from './prompts/grounded.js';
import { listMajorStars } from './stars/major.js';
import { renderSvg } from './svg/render.js';
import type {
  CalculateInput,
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
  calculateTuVi,
  capabilities,
  createGroundedPrompt,
  getEngineCapabilities,
  getMethodologyManifest,
  listMajorStars,
  listVietnamCities,
  renderSvg,
  vietnamCities
};

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
