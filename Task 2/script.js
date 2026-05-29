const input = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const notesContainer = document.getElementById('notes');

let nextColorToggle = false;

function createNote(text) {
  const note = document.createElement('div');
  note.className = 'note ' + (nextColorToggle ? 'color-a' : 'color-b');
  nextColorToggle = !nextColorToggle;

  const del = document.createElement('button');
  del.className = 'delete';
  del.textContent = 'X';
  del.addEventListener('click', () => note.remove());

  const p = document.createElement('p');
  p.textContent = text;

  note.appendChild(del);
  note.appendChild(p);
  notesContainer.appendChild(note);
}

addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;
  createNote(text);
  input.value = '';
  input.focus();
});

// Allow Ctrl+Enter / Cmd+Enter to add quickly
input.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    addBtn.click();
  }
});
