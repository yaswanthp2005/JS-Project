var STORAGE = 'task10_tasks_v1'
var form = document.getElementById('task-form')
var taskBox = document.getElementById('task-input')
var dateBox = document.getElementById('date-input')
var timeBox = document.getElementById('time-input')
var addBtn = document.getElementById('add-btn')
var searchBox = document.getElementById('search')
var dueList = document.getElementById('due-tasks-list')
var editArea = document.getElementById('edit-area')
var modal = document.getElementById('modal')
var modalText = document.getElementById('modal-text')
var modalOk = document.getElementById('modal-ok')
var modalClose = document.getElementById('modal-close')

var tasks = []
var editing = null

function loadTasks(){
  var s = localStorage.getItem(STORAGE)
  if(s){ try{ tasks = JSON.parse(s) }catch(e){ tasks = [] } }
}

function saveTasks(){ localStorage.setItem(STORAGE, JSON.stringify(tasks)) }

function today(){ return new Date().toISOString().slice(0,10) }

function showDate(d){ if(!d) return ''; var p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0] }

function showTime(t){ if(!t) return ''; var a = t.split(':'); var hh = parseInt(a[0],10); var mm = a[1]; var ap = hh<12?'AM':'PM'; var h = hh%12; if(h===0) h=12; return (h<10? '0'+h : h) + ':' + mm + ' ' + ap }

function showModal(text){ modalText.textContent = text; modal.classList.remove('hidden') }
function hideModal(){ modal.classList.add('hidden') }

function clearForm(){ taskBox.value=''; dateBox.value=''; timeBox.value=''; addBtn.textContent='Add Task'; editing = null }

function addTask(e){
  e.preventDefault()
  var t = taskBox.value.trim()
  var d = dateBox.value
  var ti = timeBox.value
  if(!t || !d || !ti){ showModal('Please fill in all fields.'); return }
  if(editing){
    for(var i=0;i<tasks.length;i++){ if(tasks[i].id===editing){ tasks[i].text=t; tasks[i].date=d; tasks[i].time=ti; break } }
    editing = null
  } else {
    tasks.push({ id: Date.now().toString(), text: t, date: d, time: ti })
  }
  saveTasks()
  clearForm()
  render()
}

function removeTask(id){ if(!confirm('Delete this task?')) return; var n = []; for(var i=0;i<tasks.length;i++){ if(tasks[i].id!==id) n.push(tasks[i]) } tasks = n; saveTasks(); render() }

function editTask(id){ editing = id; var t = null; for(var i=0;i<tasks.length;i++){ if(tasks[i].id===id){ t=tasks[i]; break } } if(!t) return; editArea.classList.remove('hidden'); editArea.innerHTML = '<div class="edit-panel"><h3>'+showDate(t.date)+'</h3><input id="edit-input" class="edit-input" value="'+t.text+'" /><div class="edit-actions"><button id="edit-save" class="btn-save">Save</button><button id="edit-cancel" class="btn-cancel">Cancel</button></div></div>'; var ei = document.getElementById('edit-input'); if(ei) ei.focus() }

function hideEdit(){ editing = null; editArea.classList.add('hidden'); editArea.innerHTML = '' }

function groupByDate(list){ var g = {}; for(var i=0;i<list.length;i++){ var it = list[i]; if(!g[it.date]) g[it.date]=[]; g[it.date].push(it) } return g }

function render(){
  var q = (searchBox.value||'').toLowerCase().trim()
  var filtered = []
  for(var i=0;i<tasks.length;i++){ var it = tasks[i]; if(!q || it.text.toLowerCase().indexOf(q)!==-1 || showDate(it.date).toLowerCase().indexOf(q)!==-1) filtered.push(it) }
  var td = today()
  var due = []
  for(var i=0;i<filtered.length;i++){ if(filtered[i].date<=td) due.push(filtered[i]) }
  due.sort(function(a,b){ if(a.date===b.date) return a.time.localeCompare(b.time); return a.date.localeCompare(b.date) })
  var groups = groupByDate(due)
  var keys = Object.keys(groups).sort()
  var html = ''
  if(keys.length===0){ html = '<div class="empty">No tasks</div>' }
  for(var k=0;k<keys.length;k++){
    var key = keys[k]
    var list = groups[key]
    html += '<div class="task-day"><h3>'+(key===td? 'Today': showDate(key))+'</h3>'
    for(var j=0;j<list.length;j++){
      var item = list[j]
      html += '<div class="task-item"><div class="left"><div class="text">'+item.text+'</div><div class="time">'+showTime(item.time)+'</div></div><div class="buttons"><button class="btn-edit" data-id="'+item.id+'">Edit</button><button class="btn-delete" data-id="'+item.id+'">Delete</button></div></div>'
    }
    html += '</div>'
  }
  dueList.innerHTML = html
}

document.body.addEventListener('click', function(e){
  var el = e.target
  if(el.classList.contains('btn-delete')) removeTask(el.getAttribute('data-id'))
  if(el.classList.contains('btn-edit')) editTask(el.getAttribute('data-id'))
  if(el.id==='edit-save'){
    var v = document.getElementById('edit-input')
    if(!v) return
    var val = v.value.trim()
    if(!val){ showModal('Please provide a task description.'); return }
    for(var i=0;i<tasks.length;i++){ if(tasks[i].id===editing){ tasks[i].text = val; break } }
    saveTasks(); render(); hideEdit()
  }
  if(el.id==='edit-cancel') hideEdit()
})

form.addEventListener('submit', addTask)
searchBox.addEventListener('input', render)
modalOk.addEventListener('click', hideModal)
modalClose.addEventListener('click', hideModal)

loadTasks()
render()
