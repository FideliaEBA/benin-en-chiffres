const RAW=[
["Alibori",521093,867463,"nord"],["Atacora",549417,772262,"nord"],["Atlantique",801683,1398229,"sud"],["Borgou",724171,1214249,"nord"],
["Collines",535923,717477,"sud"],["Couffo",524586,745328,"sud"],["Donga",350062,543130,"nord"],["Littoral",665100,679012,"sud"],
["Mono",360037,497243,"sud"],["Ouémé",730772,1100404,"sud"],["Plateau",407116,622372,"sud"],["Zou",599954,851580,"sud"]];
const YEARS=11.25;
const DATA=RAW.map(([name,p02,p13,zone])=>({name,p02,p13,zone,gain:p13-p02,pct:(p13/p02-1)*100,rate:(Math.pow(p13/p02,1/YEARS)-1)*100}));
const T02=DATA.reduce((s,d)=>s+d.p02,0), T13=DATA.reduce((s,d)=>s+d.p13,0);
const LAB={p13:"Population 2013",p02:"Population 2002",gain:"Habitants gagnés",pct:"Croissance totale (%)",rate:"Taux annuel moyen (%)"};
const nf=n=>Math.round(n).toLocaleString("fr-FR");
const pf=n=>n.toFixed(1).replace(".",",")+" %";
const fv=(m,v)=>m==="pct"||m==="rate"?pf(v):nf(v);
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const $=id=>document.getElementById(id);
let chart,sel=null,cur=[];

function view(){
  const z=$("zone").value,s=$("sort").value,m=$("metric").value,q=$("q").value.trim().toLowerCase();
  const d=DATA.filter(x=>(z==="all"||x.zone===z)&&x.name.toLowerCase().includes(q));
  d.sort((a,b)=>s==="alpha"?a.name.localeCompare(b.name,"fr"):s==="asc"?a[m]-b[m]:b[m]-a[m]);
  return d;
}
function kpis(d){
  const a=d.reduce((s,x)=>s+x.p02,0),b=d.reduce((s,x)=>s+x.p13,0);
  const top=d.length?d.reduce((u,v)=>v.rate>u.rate?v:u):null, big=d.length?d.reduce((u,v)=>v.p13>u.p13?v:u):null;
  const it=[[nf(b),"habitants en 2013 (sélection)"],[a?"+"+pf((b/a-1)*100):"—","depuis 2002"],
    [top?top.name:"—",top?"croissance la plus rapide · "+pf(top.rate)+"/an":"croissance la plus rapide"],[big?big.name:"—",big?"le plus peuplé · "+nf(big.p13):"le plus peuplé"]];
  $("kpis").innerHTML=it.map(([x,y])=>`<div class="card kpi"><b>${x}</b><span>${y}</span></div>`).join("");
}
function table(d){
  const m=$("metric").value,mx=Math.max(...d.map(x=>Math.max(x[m],0)),1);
  $("rows").innerHTML=d.map((x,i)=>`<tr class="row ${sel===x.name?"sel":""}" data-n="${x.name}"><td class="n">${i+1}</td><td>${x.name}</td><td><span class="tag ${x.zone==="nord"?"nord":""}">${x.zone==="nord"?"Nord":"Sud/centre"}</span></td><td class="n">${nf(x.p02)}</td><td class="n">${nf(x.p13)}</td><td class="n">+${pf(x.pct)}</td><td class="n">${pf(x.rate)}</td><td><div class="bar" style="width:${Math.max(x[m],0)/mx*100}%"></div></td></tr>`).join("");
  document.querySelectorAll("tr.row").forEach(r=>r.onclick=()=>pick(r.dataset.n));
}
function detail(){
  const x=DATA.find(d=>d.name===sel),el=$("detail");
  if(!x){el.hidden=true;return;}
  el.hidden=false;
  el.innerHTML=`<h3>${x.name}</h3><p>${nf(x.p02)} habitants en 2002 → ${nf(x.p13)} en 2013 (+${nf(x.gain)}, soit +${pf(x.pct)}).</p><p>Taux annuel moyen : ${pf(x.rate)} · Poids dans la population nationale : ${pf(x.p02/T02*100)} en 2002 → ${pf(x.p13/T13*100)} en 2013.</p>`;
}
function pick(n){sel=sel===n?null:n;table(cur);detail();}
function draw(d){
  const m=$("metric").value,cmp=$("cmp").checked,north=css("--north"),acc=css("--accent");
  const ds=cmp?[{label:"2002",data:d.map(x=>x.p02),backgroundColor:css("--muted"),borderRadius:3},{label:"2013",data:d.map(x=>x.p13),backgroundColor:acc,borderRadius:3}]
    :[{label:LAB[m],data:d.map(x=>x[m]),backgroundColor:d.map(x=>x.zone==="nord"?north:acc),borderRadius:4}];
  const cfg={type:"bar",data:{labels:d.map(x=>x.name),datasets:ds},
    options:{indexAxis:"y",maintainAspectRatio:false,onClick:(e,els)=>{if(els.length)pick(d[els[0].index].name);},
    plugins:{legend:{display:cmp,labels:{color:css("--text")}},title:{display:!cmp,text:LAB[m]+" — orange : Nord, bleu : Sud/centre",color:css("--muted"),font:{weight:"normal",size:12}},
      tooltip:{callbacks:{label:c=>(cmp?c.dataset.label+" : "+nf(c.parsed.x):fv(m,c.parsed.x))}}},
    scales:{x:{ticks:{color:css("--muted"),callback:v=>cmp||m==="p13"||m==="p02"||m==="gain"?nf(v):v+" %"},grid:{color:css("--line")}},y:{ticks:{color:css("--text")},grid:{display:false}}}}};
  if(chart)chart.destroy();
  chart=new Chart($("chart"),cfg);
}
function render(){cur=view();kpis(cur);table(cur);detail();draw(cur);}
["metric","sort","zone","cmp"].forEach(id=>$(id).addEventListener("change",render));
$("q").addEventListener("input",render);
$("metric").addEventListener("change",()=>{$("sort").value="desc";render();});
$("theme").onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.dataset.theme=dark?"light":"dark";render();};
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",render);
render();
