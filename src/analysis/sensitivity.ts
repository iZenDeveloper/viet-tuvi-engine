import { calculateTuVi } from '../calculate.js';
import { branches } from '../domain.js';
import type { CalculateInput } from '../types.js';

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
