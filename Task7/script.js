const a = document.getElementById("amount");
const frm = document.getElementById("fromCurrency");
const to = document.getElementById("toCurrency");
const b = document.getElementById("convertBtn");
const r = document.getElementById("result");
const er = document.getElementById("error");
const f1 = document.getElementById("flag1");
const f2 = document.getElementById("flag2");

let lst = [];
let fl = {};
const pref = {USD:'us',INR:'in',EUR:'eu',GBP:'gb',JPY:'jp',AUD:'au',CAD:'ca',CHF:'ch',CNY:'cn',SGD:'sg'};
const key = "dc060b105a381280af2fe01b";

document.addEventListener("DOMContentLoaded", init);

async function init(){
  try{
    let res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags,currencies");
    let data = await res.json();
    let m = {};
    for(let i=0;i<data.length;i++){
      let c = data[i];
      if(!c.currencies) continue;
      let codes = Object.keys(c.currencies);
      for(let j=0;j<codes.length;j++){
        let code = codes[j];
        if(!m[code]){
          let url = "";
          if(pref[code]) url = "https://flagcdn.com/w40/"+pref[code]+".png";
          else if(c.flags && c.flags.png) url = c.flags.png;
          m[code] = {code:code, name: c.currencies[code] && c.currencies[code].name ? c.currencies[code].name : code, flag: url};
        }
      }
    }
    lst = Object.values(m).sort((x,y)=>x.code.localeCompare(y.code));
    fl = m;
    fill();
    frm.value = "USD";
    to.value = "INR";
    setF();
  }catch(e){
    showE("An error occurred, please try again later");
  }
}

function fill(){
  frm.innerHTML = "";
  to.innerHTML = "";
  for(let i=0;i<lst.length;i++){
    let it = lst[i];
    let o1 = document.createElement("option");
    o1.value = it.code;
    o1.textContent = it.code + " - " + it.name;
    frm.appendChild(o1);
    let o2 = document.createElement("option");
    o2.value = it.code;
    o2.textContent = it.code + " - " + it.name;
    to.appendChild(o2);
  }
}

function setF(){
  f1.src = fl[frm.value] ? fl[frm.value].flag : "";
  f2.src = fl[to.value] ? fl[to.value].flag : "";
}

frm.addEventListener("change", setF);
to.addEventListener("change", setF);
b.addEventListener("click", convert);

async function convert(){
  let v = Number(a.value);
  if(!v || v<=0){ showE("Please enter a valid amount"); return; }
  if(!frm.value || !to.value){ showE("Please select currencies"); return; }
  try{
    let url = "https://v6.exchangerate-api.com/v6/"+key+"/pair/"+frm.value+"/"+to.value;
    let res = await fetch(url);
    let d = await res.json();
    if(d.result !== "success"){ showE("An error occurred, please try again later"); return; }
    let rate = d.conversion_rate;
    let tot = v * rate;
    r.textContent = Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})+" "+frm.value+" = "+Number(tot).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})+" "+to.value;
    r.hidden = false;
    er.hidden = true;
  }catch(e){ showE("An error occurred, please try again later"); }
}

function showE(m){ er.textContent = m; er.hidden = false; r.hidden = true; }
