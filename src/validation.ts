import { calculateTuVi } from './calculate.js';
import type { CalculateInput } from './types.js';

export function engineErrorCode(error:unknown){
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
