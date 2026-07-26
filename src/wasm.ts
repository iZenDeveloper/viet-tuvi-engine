import type {LunarDate} from './calendar.js';

interface CalendarExports extends WebAssembly.Exports{
  abiVersion():number;
  julianDay(day:number,month:number,year:number):number;
  solarToLunarPacked(day:number,month:number,year:number,timezoneHours:number):bigint;
  equationOfTimeMinutes(dayOfYear:number):number;
}

export interface WasmCalendar{
  abiVersion:number;
  julianDay(day:number,month:number,year:number):number;
  solarToLunar(day:number,month:number,year:number,timezoneHours?:number):LunarDate;
  equationOfTimeMinutes(dayOfYear:number):number;
}

export async function loadWasmCalendar(source:Response|BufferSource|WebAssembly.Module):Promise<WasmCalendar>{
  let instance:WebAssembly.Instance;
  if(source instanceof WebAssembly.Module)instance=await WebAssembly.instantiate(source,{});
  else if(typeof Response!=='undefined'&&source instanceof Response){
    const result=await WebAssembly.instantiate(await source.arrayBuffer(),{});
    instance=result instanceof WebAssembly.Instance?result:result.instance;
  }else{
    const result=await WebAssembly.instantiate(source as BufferSource,{});
    instance=result instanceof WebAssembly.Instance?result:result.instance;
  }
  const wasm=instance.exports as CalendarExports;
  const abi=wasm.abiVersion();
  if(abi!==1)throw new Error(`Unsupported WASM calendar ABI: ${abi}`);
  return {
    abiVersion:abi,
    julianDay:(day,month,year)=>wasm.julianDay(day,month,year),
    solarToLunar:(day,month,year,timezoneHours=7)=>{
      const raw=wasm.solarToLunarPacked(day,month,year,timezoneHours);
      const leap=(raw&1n)===1n,value=Number(raw>>1n);
      return {day:value%100,month:Math.floor(value/100)%100,year:Math.floor(value/10000),leap};
    },
    equationOfTimeMinutes:day=>wasm.equationOfTimeMinutes(day)
  };
}
