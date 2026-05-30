document.addEventListener('DOMContentLoaded',()=>{
  const pw = document.getElementById('pw');
  const copy = document.getElementById('copy');
  const len = document.getElementById('len');
  const lenVal = document.getElementById('lenVal');
  const n = document.getElementById('n');
  const l = document.getElementById('l');
  const u = document.getElementById('u');
  const p = document.getElementById('p');
  const ok = document.getElementById('clipboardAlert');
  const bad = document.getElementById('optionsAlert');

  const nums = '0123456789';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const punct = '!@#$%^&*()_+[]{};:,.<>?/`~\\-=';

  function msg(el){
    el.style.display = 'block';
    setTimeout(function(){
      el.style.display = 'none';
    }, 3000);
  }

  function make(){
    const size = Number(len.value);
    lenVal.textContent = size;

    let all = '';
    if(n.checked) all += nums;
    if(l.checked) all += lower;
    if(u.checked) all += upper;
    if(p.checked) all += punct;

    if(all === ''){
      pw.value = '';
      msg(bad);
      return;
    }

    let text = '';
    for(let i = 0; i < size; i++){
      text += all[Math.floor(Math.random() * all.length)];
    }

    pw.value = text;
  }

  make();

  len.addEventListener('input', make);
  [n, l, u, p].forEach(function(box){
    box.addEventListener('change', make);
  });

  copy.addEventListener('click', async()=>{
    const val = pw.value;
    if(val === '') return;

    try{
      await navigator.clipboard.writeText(val);
      msg(ok);
    }catch(e){
      pw.select();
      document.execCommand('copy');
      msg(ok);
    }
  });
});
