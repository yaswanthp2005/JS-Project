document.addEventListener('DOMContentLoaded',()=>{
  const passwordInput = document.getElementById('password');
  const copyBtn = document.getElementById('copyBtn');
  const lengthRange = document.getElementById('lengthRange');
  const lengthValue = document.getElementById('lengthValue');
  const num = document.getElementById('num');
  const lower = document.getElementById('lower');
  const upper = document.getElementById('upper');
  const punct = document.getElementById('punct');
  const clipboardAlert = document.getElementById('clipboardAlert');
  const optionsAlert = document.getElementById('optionsAlert');

  const nums = '0123456789';
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const puncts = '!@#$%^&*()_+[]{};:,.<>?/`~\\-=';

  function showAlert(el){
    el.style.display='block';
    setTimeout(()=>el.style.display='none',3000);
  }

  function generatePassword(){
    const length = Number(lengthRange.value);
    lengthValue.textContent = length;

    let charset = '';
    if(num.checked) charset += nums;
    if(lower.checked) charset += lowers;
    if(upper.checked) charset += uppers;
    if(punct.checked) charset += puncts;

    if(!charset){
      passwordInput.value = '';
      showAlert(optionsAlert);
      return;
    }

    let pw = '';
    for(let i=0;i<length;i++) pw += charset[Math.floor(Math.random()*charset.length)];
    passwordInput.value = pw;
  }

  // initial generate
  generatePassword();

  // events
  lengthRange.addEventListener('input',generatePassword);
  [num,lower,upper,punct].forEach(c=>c.addEventListener('change',generatePassword));

  copyBtn.addEventListener('click',async()=>{
    const val = passwordInput.value;
    if(!val) return;
    try{
      await navigator.clipboard.writeText(val);
      showAlert(clipboardAlert);
    }catch(e){
      // fallback
      passwordInput.select();
      document.execCommand('copy');
      showAlert(clipboardAlert);
    }
  });
});
