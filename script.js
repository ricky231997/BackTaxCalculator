const ids=['area','unit','adjustment','assessment','yearFrom','yearTo'];

function getAreaUnit(){
  return document.getElementById('kind').value === 'Residential'
    ? { plural: 'Square meters', short: 'sqm', decimals: 2 }
    : { plural: 'Hectares', short: 'ha', decimals: 4 };
}

function updateAreaUnit(){
  const unit = getAreaUnit();
  document.getElementById('areaHint').textContent = unit.plural;
  document.getElementById('area').placeholder =
    document.getElementById('kind').value === 'Residential' ? 'e.g. 500' : 'e.g. 0.1721';
  calculate();
}

function calculate(){
  const n=id=>{const v=Number(document.getElementById(id).value);return Number.isFinite(v)&&v>=0?v:0};
  const a=n('area'),u=n('unit'),adj=n('adjustment'),al=n('assessment');
  const unit = getAreaUnit();
  const raw=a*u*(adj/100)*(al/100);
  const rounded=Math.round(raw/10)*10;
  document.getElementById('result').textContent=rounded.toLocaleString('en-PH',{style:'currency',currency:'PHP',minimumFractionDigits:2});
  document.getElementById('formula').textContent=
    `${a.toLocaleString('en-PH',{minimumFractionDigits:unit.decimals,maximumFractionDigits:unit.decimals})} ${unit.short} × ${u.toLocaleString()} × ${adj}% × ${al}% = ${raw.toLocaleString('en-PH',{style:'currency',currency:'PHP',minimumFractionDigits:2})} → rounded to nearest ₱10`;
}

ids.forEach(id=>document.getElementById(id).addEventListener('input',calculate));
document.getElementById('kind').addEventListener('change',updateAreaUnit);

function saveData(){
 const n=id=>{const v=Number(document.getElementById(id).value);return Number.isFinite(v)&&v>=0?v:0};
 const yf=document.getElementById('yearFrom').value.trim();
 const yt=document.getElementById('yearTo').value.trim();
 const a=n('area'),u=n('unit'),adj=n('adjustment'),al=n('assessment');
 
 if(a===0 && u===0){alert('Please enter Area and Unit Value before saving.');return;}

 let coveredYear = '-';
 if(yf && yt){
   coveredYear = `${yf} - ${yt}`;
 } else if(yf){
   coveredYear = yf;
 } else if(yt){
   coveredYear = yt;
 }

 const raw=a*u*(adj/100)*(al/100);
 const rounded=Math.round(raw/10)*10;
 const body=document.getElementById('recordsBody');
 if(body.querySelector('.empty-record')) body.innerHTML='';
 
 const row=body.insertRow();
 [
   body.rows.length,
   coveredYear,
   document.getElementById('kind').value,
   a.toLocaleString('en-PH',{minimumFractionDigits:0,maximumFractionDigits:4}),
   u.toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2}),
   adj.toLocaleString('en-PH',{maximumFractionDigits:2})+'%',
   al.toLocaleString('en-PH',{maximumFractionDigits:2})+'%',
   rounded.toLocaleString('en-PH',{style:'currency',currency:'PHP',minimumFractionDigits:2,maximumFractionDigits:2})
 ].forEach(v=>{
   const c=row.insertCell();
   c.textContent=v;
 });
}

function resetCalc(){
 document.getElementById('yearFrom').value='';
 document.getElementById('yearTo').value='';
 document.getElementById('area').value='';
 document.getElementById('unit').value='';
 document.getElementById('adjustment').value='100';
 document.getElementById('assessment').value='20';
 document.getElementById('recordsBody').innerHTML='<tr><td colspan="8" class="empty-record">No saved records.</td></tr>';
 calculate();
}

calculate();