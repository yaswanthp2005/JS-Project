// Minimal implementation to satisfy the assignment tasks (no extras).
const newsData = [
  {id:1,title:"New AI model released",summary:"A new AI model promises faster training.",date:"2026-05-25T10:00:00Z",category:"Technology",image:"https://via.placeholder.com/400x240?text=AI"},
  {id:2,title:"Local sports team wins",summary:"The local team clinched the championship.",date:"2026-05-20T15:30:00Z",category:"Sports",image:"https://via.placeholder.com/400x240?text=Sports"},
  {id:3,title:"Economy shows signs of recovery",summary:"Markets respond positively to new data.",date:"2026-05-22T09:00:00Z",category:"Business",image:"https://via.placeholder.com/400x240?text=Business"},
  {id:4,title:"New movie breaks records",summary:"The latest film sets box office records.",date:"2026-05-18T12:00:00Z",category:"Entertainment",image:"https://via.placeholder.com/400x240?text=Movie"},
  {id:5,title:"Health authorities release guidelines",summary:"New health guidelines published for the public.",date:"2026-05-21T08:00:00Z",category:"Health",image:"https://via.placeholder.com/400x240?text=Health"},
  {id:6,title:"Breakthrough in renewable energy",summary:"Researchers announce a solar efficiency milestone.",date:"2026-05-23T14:00:00Z",category:"Technology",image:"https://via.placeholder.com/400x240?text=Energy"},
  {id:7,title:"Community garden initiative",summary:"Volunteers launch a community garden project.",date:"2026-05-17T09:30:00Z",category:"Lifestyle",image:"https://via.placeholder.com/400x240?text=Garden"},
  {id:8,title:"Startup raises funding",summary:"A local startup raised seed funding this week.",date:"2026-05-24T11:00:00Z",category:"Business",image:"https://via.placeholder.com/400x240?text=Startup"},
  {id:9,title:"Music festival announced",summary:"Annual music festival dates confirmed.",date:"2026-05-16T10:00:00Z",category:"Entertainment",image:"https://via.placeholder.com/400x240?text=Music"},
  {id:10,title:"Advances in medical research",summary:"Scientists publish promising clinical trial results.",date:"2026-05-19T13:00:00Z",category:"Health",image:"https://via.placeholder.com/400x240?text=Research"},
  {id:11,title:"City expands bike lanes",summary:"New lanes aim to improve commuter safety.",date:"2026-05-15T07:30:00Z",category:"Lifestyle",image:"https://via.placeholder.com/400x240?text=Bike"},
  {id:12,title:"Tech conference next month",summary:"Organizers announce keynote speakers.",date:"2026-05-14T16:00:00Z",category:"Technology",image:"https://via.placeholder.com/400x240?text=Conference"}
];

const state = {
  visibleCount: 3,
  showingAll: false,
  activeTags: new Set(['All']),
  searchTerm: ''
};

const heroEl = document.getElementById('hero');
const cardsEl = document.getElementById('cards');
const moreListEl = document.getElementById('moreList');
const tagsEl = document.getElementById('tags');
const showMoreBtn = document.getElementById('showMore');
const searchInput = document.getElementById('search');

function uniqCategories(data){
  const set = new Set(data.map(d=>d.category));
  return ['All',...Array.from(set)];
}

function escapeHtml(str){
  return str.replace(/[&<>"]+/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s]));
}

function highlightText(text, term){
  if(!term) return escapeHtml(text);
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re = new RegExp(esc,'ig');
  return escapeHtml(text).replace(re, match=>`<span class="highlight">${match}</span>`);
}

function renderTags(){
  tagsEl.innerHTML = '';
  const cats = uniqCategories(newsData);
  cats.forEach(cat=>{
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag' + (state.activeTags.has(cat)?' active':'');
    btn.textContent = cat;
    btn.addEventListener('click', ()=>{
      if(cat === 'All'){
        state.activeTags.clear();
        state.activeTags.add('All');
      } else {
        if(state.activeTags.has('All')) state.activeTags.delete('All');
        if(state.activeTags.has(cat)) state.activeTags.delete(cat);
        else state.activeTags.add(cat);
        if(state.activeTags.size === 0) state.activeTags.add('All');
      }
      renderTags();
      renderNews();
    });
    tagsEl.appendChild(btn);
  });
}

function filterAndSort(){
  // filter by tags
  const tags = state.activeTags;
  let out = newsData.slice();
  if(!tags.has('All')){
    out = out.filter(n=>tags.has(n.category));
  }
  // filter by search
  const term = state.searchTerm.trim();
  if(term){
    const lower = term.toLowerCase();
    out = out.filter(n=>n.title.toLowerCase().includes(lower) || n.summary.toLowerCase().includes(lower));
  }
  // sort latest first
  out.sort((a,b)=>new Date(b.date)-new Date(a.date));
  return out;
}

function renderNews(){
  const data = filterAndSort();
  const toShow = state.showingAll ? data : data.slice(0, state.visibleCount);

  // Hero (first item)
  if(toShow.length > 0){
    const h = toShow[0];
    heroEl.innerHTML = `
      <div class="meta">${new Date(h.date).toLocaleDateString()} • ${escapeHtml(h.category)}</div>
      <h3 class="title">${highlightText(h.title, state.searchTerm)}</h3>
      <p class="summary">${highlightText(h.summary, state.searchTerm)}</p>
    `;
  } else {
    heroEl.innerHTML = '';
  }

  // Two supporting cards (next two)
  const small = toShow.slice(1,3);
  cardsEl.innerHTML = small.map(n=>`
    <article class="card">
      <div class="meta">${new Date(n.date).toLocaleDateString()} • ${escapeHtml(n.category)}</div>
      <h4 class="title">${highlightText(n.title, state.searchTerm)}</h4>
      <p class="summary">${highlightText(n.summary, state.searchTerm)}</p>
    </article>
  `).join('');

  // Remaining items go into moreList (if showingAll, include all remaining)
  const remaining = state.showingAll ? data.slice(3) : data.slice(3, state.visibleCount);
  moreListEl.innerHTML = remaining.map(n=>`
    <article class="card">
      <div class="meta">${new Date(n.date).toLocaleDateString()} • ${escapeHtml(n.category)}</div>
      <h4 class="title">${highlightText(n.title, state.searchTerm)}</h4>
      <p class="summary">${highlightText(n.summary, state.searchTerm)}</p>
    </article>
  `).join('');

  // Show when not showing all and there are more items than the visible count
  showMoreBtn.style.display = (!state.showingAll && data.length > state.visibleCount) ? 'inline-block' : 'none';
}

function debounce(fn, wait){
  let t;
  return function(...args){
    clearTimeout(t);
    t = setTimeout(()=>fn.apply(this,args), wait);
  }
}

// events
showMoreBtn.addEventListener('click', ()=>{
  state.showingAll = true;
  renderNews();
});

searchInput.addEventListener('input', debounce((e)=>{
  state.searchTerm = e.target.value || '';
  state.showingAll = false; // reset to show first 7 when searching
  renderNews();
}, 300));

// initial render
renderTags();
renderNews();
