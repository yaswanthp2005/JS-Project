var notesBox = document.getElementById('notes');

var STORAGE = 'sticky-notes-v1';

var startNotes = [
  { text: 'Learn HTML from BigBinary academy', color: 'blue', tall: true },
  { text: 'Go for a run', color: 'white' },
  { text: 'Build a personal resume', color: 'white' },
  { text: 'Buy milk', color: 'blue', tall: true }
];

var data = [];

function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify(data)); } catch (e) { }
}

function load() {
  try {
    var raw = localStorage.getItem(STORAGE);
    if (raw) {
      data = JSON.parse(raw);
      return;
    }
  } catch (e) { }
  data = startNotes.slice();
  save();
}

function pickColor(i) {
  if (i % 2 === 0) return 'blue';
  return 'white';
}

function addNote(it, i) {
  var note = document.createElement('div');
  note.className = 'note ' + (it.color || pickColor(i)) + (it.tall ? ' tall' : '');

  var del = document.createElement('button');
  del.className = 'delete';
  del.textContent = '✕';
  del.addEventListener('click', function() {
    data.splice(i, 1);
    save();
    render();
  });

  var p = document.createElement('p');
  p.textContent = it.text;

  note.appendChild(del);
  note.appendChild(p);

  notesBox.appendChild(note);
}

function addComposer() {
  var comp = document.createElement('div');
  comp.className = 'note yellow composer';

  var ta = document.createElement('textarea');
  ta.className = 'composer-input';
  ta.placeholder = 'Try a new note...';
  comp.appendChild(ta);

  var plus = document.createElement('button');
  plus.className = 'plus add';
  plus.textContent = '+';
  plus.addEventListener('click', function() {
    var text = ta.value.trim();
    if (!text) return;
    var n = { text: text, color: pickColor(data.length), tall: text.length > 120 };
    data.push(n);
    save();
    render();
  });
  comp.appendChild(plus);

  ta.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      plus.click();
    }
  });

  notesBox.appendChild(comp);
}

function render() {
  notesBox.innerHTML = '';
  for (var i = 0; i < data.length; i++) {
    addNote(data[i], i);
  }
  addComposer();
}

load();
render();
