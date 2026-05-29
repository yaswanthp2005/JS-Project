const amountEl = document.getElementById('amount');
const fromEl = document.getElementById('fromCurrency');
const toEl = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultEl = document.getElementById('result');
const errorEl = document.getElementById('error');
const flagFrom = document.getElementById('flag-from');
const flagTo = document.getElementById('flag-to');

// Map currency code -> { name, flag }
const currencyMap = {};

document.addEventListener('DOMContentLoaded', () => {
  fetchCountriesAndPopulate();
});

async function fetchCountriesAndPopulate(){
  try{
    const res = await fetch('https://restcountries.com/v2/all?fields=name,alpha2Code,currencies,flags');
    const data = await res.json();

    data.forEach(country =>{
      if(!country.currencies) return;
      country.currencies.forEach(c =>{
        if(!c || !c.code) return;
        if(!currencyMap[c.code]){
          currencyMap[c.code] = { name: c.name || c.code, flag: country.flags && (country.flags.svg || country.flags.png) };
        }
      })
    })

    // Populate selects (sorted)
    const codes = Object.keys(currencyMap).sort();
    fromEl.innerHTML = '';
    toEl.innerHTML = '';
    codes.forEach(code =>{
      const optText = `${code} - ${currencyMap[code].name}`;
      const o1 = document.createElement('option'); o1.value = code; o1.textContent = optText; fromEl.appendChild(o1);
      const o2 = document.createElement('option'); o2.value = code; o2.textContent = optText; toEl.appendChild(o2);
    })

    // Set defaults if available
    if(currencyMap['USD']) fromEl.value = 'USD';
    if(currencyMap['INR']) toEl.value = 'INR';

    updateFlags();
  }catch(err){
    console.error('Failed to fetch countries', err);
  }
}

function updateFlags(){
  const f1 = currencyMap[fromEl.value] && currencyMap[fromEl.value].flag;
  const f2 = currencyMap[toEl.value] && currencyMap[toEl.value].flag;
  flagFrom.src = f1 || '';
  flagTo.src = f2 || '';
}

fromEl.addEventListener('change', updateFlags);
toEl.addEventListener('change', updateFlags);

convertBtn.addEventListener('click', async () =>{
  const amount = parseFloat(amountEl.value) || 0;
  const from = fromEl.value;
  const to = toEl.value;
  resultEl.hidden = true;
  errorEl.hidden = true;

  if(!amount || amount <= 0){
    showError('Please enter a valid amount');
    return;
  }
  if(!from || !to){
    showError('Please select currencies');
    return;
  }

  // NOTE: Replace 'yourApiKey' with your real API key from the ExchangeRate API service.
  const apiKey = 'yourApiKey';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('Network response not ok');
    const json = await res.json();
    if(json && json.conversion_rate){
      const converted = json.conversion_rate * amount;
      resultEl.textContent = `${formatNumber(amount)} ${from} = ${formatNumber(converted)} ${to}`;
      resultEl.hidden = false;
    }else{
      throw new Error('Invalid API response');
    }
  }catch(err){
    console.error(err);
    showError('An error occurred, please try again later');
  }
});

function formatNumber(n){
  return Number(n).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}

function showError(msg){
  errorEl.textContent = msg;
  errorEl.hidden = false;
  setTimeout(()=>{ errorEl.hidden = true }, 4000);
}
