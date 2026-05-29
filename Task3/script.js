document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('grid');
  const resetBtn = document.getElementById('reset');
  const totalShips = 5;
  const maxClicks = 8;
  let shipPositions = [];
  let shipsFound = 0;
  let clicks = 0;

  function init(){
    grid.innerHTML = '';
    shipPositions = [];
    shipsFound = 0;
    clicks = 0;

    const indices = Array.from({length:16}, (_,i)=>i);
    for(let i=indices.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    shipPositions = indices.slice(0, totalShips);

    for(let i=0;i<16;i++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;

      const span = document.createElement('span');
      span.className = 'hidden';
      span.textContent = shipPositions.includes(i) ? '🚢' : '💧';

      cell.appendChild(span);
      cell.addEventListener('click', onCellClick);
      grid.appendChild(cell);
    }
  }

  function onCellClick(e){
    const cell = e.currentTarget;
    if(cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');

    const span = cell.querySelector('.hidden');
    span.style.display = 'block';

    clicks++;
    const idx = Number(cell.dataset.index);
    if(shipPositions.includes(idx)){
      shipsFound++;
    }

    if(shipsFound === totalShips){
      if(clicks <= maxClicks) alert('You Won!');
      else alert('You Lost!');
      disableAll();
      return;
    }

    if(clicks >= maxClicks && shipsFound < totalShips){
      alert('You Lost!');
      disableAll();
    }
  }

  function disableAll(){
    const cells = document.querySelectorAll('.cell');
    cells.forEach(c => c.removeEventListener('click', onCellClick));
  }

  resetBtn.addEventListener('click', init);
  init();
});