import {calculateTuVi,listVietnamCities,renderSvg} from '../dist/index.js';

const city=document.querySelector('#city');
for(const item of listVietnamCities()){
  const option=document.createElement('option');
  option.value=item.code;option.textContent=item.nameVi;
  city.append(option);
}
const form=document.querySelector('#form');
let currentChart;
function calculate(){
  const chart=calculateTuVi({
    localDateTime:document.querySelector('#datetime').value.length===16?`${document.querySelector('#datetime').value}:00`:document.querySelector('#datetime').value,
    timezoneOffsetMinutes:420,gender:document.querySelector('#gender').value,
    trueSolarTime:document.querySelector('#solar').checked,location:{city:city.value},
    tradition:'vietnamese',asOfYear:Number(document.querySelector('#year').value),
    asOfDate:document.querySelector('#asof').value,
    include:{daiHan:true,tieuHan:true,luuNien:true,luuNguyet:true,luuNhat:true,phiHoa:document.querySelector('#phihoa').checked}
  });
  currentChart=chart;
  document.querySelector('#cuc').textContent=chart.cuc.nameVi;
  document.querySelector('#meta').textContent=`${chart.metadata.ruleSetVersion} · ${chart.audit.find(x=>x.rule==='lunar-date').value} âm lịch`;
  document.querySelector('#chart').innerHTML=renderSvg(chart);
  document.querySelector('#json').textContent=JSON.stringify(chart,null,2);
  document.querySelector('#warnings').replaceChildren(...chart.warnings.map(w=>{const div=document.createElement('div');div.className='warning';div.textContent=w.message.vi;return div;}));
}
function download(name,type,text){
  const url=URL.createObjectURL(new Blob([text],{type}));
  const link=document.createElement('a');link.href=url;link.download=name;link.click();
  URL.revokeObjectURL(url);
}
form.addEventListener('submit',event=>{event.preventDefault();calculate();});
document.querySelector('#download-svg').addEventListener('click',()=>download('la-so-tu-vi.svg','image/svg+xml',renderSvg(currentChart)));
document.querySelector('#download-json').addEventListener('click',()=>download('la-so-tu-vi.json','application/json',JSON.stringify(currentChart,null,2)));
document.querySelector('#copy-json').addEventListener('click',async event=>{
  await navigator.clipboard.writeText(JSON.stringify(currentChart,null,2));
  const button=event.currentTarget,previous=button.textContent;button.textContent='Đã sao chép';
  setTimeout(()=>{button.textContent=previous;},1200);
});
calculate();
