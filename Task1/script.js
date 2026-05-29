document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('event-form');
	const formWrapper = document.querySelector('.form-wrapper');
	const message = document.getElementById('message');
	const messageClose = document.getElementById('message-close');
	const inviteSection = document.getElementById('invite-section');

	function showMessage(text) {
		document.getElementById('message-text').textContent = text;
		message.classList.remove('hidden');
	}

	function hideMessage() {
		message.classList.add('hidden');
	}

	messageClose.addEventListener('click', hideMessage);

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const name = document.getElementById('event-name').value.trim();
		const date = document.getElementById('event-date').value.trim();
		const start = document.getElementById('start-time').value.trim();
		const end = document.getElementById('end-time').value.trim();
		const desc = document.getElementById('description').value.trim();
		const location = document.getElementById('location').value.trim();

		if (!name || !date || !start || !end || !desc || !location) {
			showMessage('Please fill in all fields');
			return;
		}

		// Hide the full form block so only the result remains
		formWrapper.classList.add('hidden');
		hideMessage();

		// Build invite card
		inviteSection.classList.remove('hidden');
		inviteSection.innerHTML = '';

		function formatDateString(d) {
			const dt = new Date(d);
			if (isNaN(dt)) return d;
			return dt.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
		}

		function formatTime(t) {
			if (!t) return '';
			const [h, m] = t.split(':');
			const dt = new Date();
			dt.setHours(parseInt(h, 10), parseInt(m || '0', 10));
			return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
		}

		const top = document.createElement('div');
		top.className = 'invite-top';

		const main = document.createElement('h3');
		main.className = 'invite-main';
		main.textContent = 'YOU ARE INVITED';

		const sub = document.createElement('div');
		sub.className = 'invite-sub';
		sub.textContent = 'TO JOIN THE';

		top.appendChild(main);
		top.appendChild(sub);

		const eventName = document.createElement('div');
		eventName.className = 'invite-event-name';
		eventName.textContent = name;

		const dateEl = document.createElement('div');
		dateEl.className = 'invite-date';
		dateEl.textContent = formatDateString(date);

		const timeEl = document.createElement('div');
		timeEl.className = 'invite-time';
		timeEl.textContent = `${formatTime(start)} - ${formatTime(end)}`;

		const locEl = document.createElement('div');
		locEl.className = 'invite-location';
		locEl.textContent = location;

		const descLine = document.createElement('p');
		descLine.className = 'invite-desc';
		descLine.textContent = desc;

		inviteSection.appendChild(top);
		inviteSection.appendChild(eventName);
		inviteSection.appendChild(dateEl);
		inviteSection.appendChild(timeEl);
		inviteSection.appendChild(locEl);
		inviteSection.appendChild(descLine);
	});
});
