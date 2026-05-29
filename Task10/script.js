const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const tasksContainer = document.getElementById('tasks');
const search = document.getElementById('search');
const messageBox = document.getElementById('message');
const addBtn = document.getElementById('add-btn');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let editingId = null;

function save(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatTime(t){
  if(!t) return '';
  const [hh,mm] = t.split(':').map(Number);
  const date = new Date();
  date.setHours(hh,mm);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2,'0');
  const ampm = hours>=12? 'PM':'AM';
  hours = hours%12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function showMessage(text){
  messageBox.innerHTML = `<span>${text}</span><button id="close-msg">×</button>`;
  messageBox.classList.remove('hidden');
  document.getElementById('close-msg').addEventListener('click', ()=>{
    messageBox.classList.add('hidden');
  });
}

function clearForm(){
  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
  editingId = null;
  addBtn.textContent = 'Add Task';
}

function addTask(e){
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  if(!text || !date || !time){
    showMessage('Please fill in all fields');
    return;
  }

  if(editingId){
    const idx = tasks.findIndex(t=>t.id===editingId);
    if(idx>-1){
      tasks[idx].text = text;
      tasks[idx].date = date;
      tasks[idx].time = time;
    }
    editingId = null;
    addBtn.textContent = 'Add Task';
  } else {
    tasks.push({id:Date.now().toString(),text,date,time});
  }
  save();
  clearForm();
  render();
}

function editTask(id){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  taskInput.value = t.text;
  dateInput.value = t.date;
  timeInput.value = t.time;
  editingId = id;
  addBtn.textContent = 'Update Task';
}

function deleteTask(id){
  tasks = tasks.filter(t=>t.id!==id);
  save();
  render();
}

function groupByDate(list){
  const map = {};
  list.forEach(t=>{
    map[t.date] = map[t.date] || [];
    map[t.date].push(t);
  });
  return map;
}

function render(){
  const q = search.value.trim().toLowerCase();
  const filtered = tasks.filter(t=>t.text.toLowerCase().includes(q));
  if(filtered.length===0){
    tasksContainer.innerHTML = `<div class="empty">No tasks found</div>`;
    return;
  }

  const grouped = groupByDate(filtered);
  const keys = Object.keys(grouped).sort();
  const todayKey = new Date().toISOString().slice(0,10);

  let html = '';

  // render today's section first if present
  if(grouped[todayKey]){
    const todays = grouped[todayKey];
    html += `<div class="task-day"><h3>Today</h3>`;
    // split into Due and Upcoming based on current time
    const now = new Date();
    const due = [];
    const upcoming = [];
    todays.forEach(t=>{
      const [hh,mm] = t.time.split(':').map(Number);
      const d = new Date(); d.setHours(hh,mm,0,0);
      if(d<=now) due.push(t); else upcoming.push(t);
    });

    if(due.length){
      html += `<h4 style="color:#3f51b5;margin:8px 0">Due Tasks</h4>`;
      due.forEach(t=>{
        html += renderTaskHtml(t);
      });
    }
    if(upcoming.length){
      html += `<h4 style="color:#3f51b5;margin:8px 0">Upcoming Tasks</h4>`;
      upcoming.forEach(t=>{
        html += renderTaskHtml(t);
      });
    }
    html += `</div>`;
  }

  // render other dates
  keys.forEach(key=>{
    if(key===todayKey) return;
    const list = grouped[key];
    const d = new Date(key + 'T00:00');
    const title = d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
    html += `<div class="task-day"><h3>${title}</h3>`;
    list.forEach(t=>{ html += renderTaskHtml(t); });
    html += `</div>`;
  });

  tasksContainer.innerHTML = html;
  // attach event listeners
  document.querySelectorAll('.btn-edit').forEach(btn=>btn.addEventListener('click',e=>{
    editTask(e.target.dataset.id);
  }));
  document.querySelectorAll('.btn-delete').forEach(btn=>btn.addEventListener('click',e=>{
    deleteTask(e.target.dataset.id);
  }));
}

function renderTaskHtml(t){
  return `<div class="task-item">
    <div class="left">
      <div class="text">${escapeHtml(t.text)}</div>
      <div class="time">${formatTime(t.time)}</div>
    </div>
    <div class="buttons">
      <button class="btn-edit" data-id="${t.id}">Edit</button>
      <button class="btn-delete" data-id="${t.id}">Delete</button>
    </div>
  </div>`;
}

function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

form.addEventListener('submit', addTask);
search.addEventListener('input', render);

render();
