document.addEventListener('DOMContentLoaded', function () {
	const eventForm = document.getElementById('event-form');
	const eventFormWrapper = document.querySelector('.form-wrapper');
	const modalOverlay = document.getElementById('message');
	const modalCloseButton = document.getElementById('message-close');
	const inviteContainer = document.getElementById('invite-section');

	function openModal(text) {
		document.getElementById('message-text').textContent = text;
		modalOverlay.setAttribute('aria-hidden', 'false');
		modalOverlay.classList.remove('hidden');
		modalCloseButton.focus();
	}

	function closeModal() {
		modalOverlay.classList.add('hidden');
		modalOverlay.setAttribute('aria-hidden', 'true');
	}

	modalCloseButton.addEventListener('click', closeModal);

	modalOverlay.addEventListener('click', function (e) {
		if (e.target === modalOverlay) closeModal();
	});

	eventForm.addEventListener('submit', function (e) {
		e.preventDefault();

		const eventTitle = document.getElementById('event-name').value.trim();
		const eventDateVal = document.getElementById('event-date').value.trim();
		const startTimeVal = document.getElementById('start-time').value.trim();
		const endTimeVal = document.getElementById('end-time').value.trim();
		const descriptionText = document.getElementById('description').value.trim();
		const eventLocation = document.getElementById('location').value.trim();

		if (!eventTitle || !eventDateVal || !startTimeVal || !endTimeVal || !descriptionText || !eventLocation) {
			openModal('Please fill in all fields');
			return;
		}

		eventFormWrapper.classList.add('hidden');
		closeModal();

		inviteContainer.classList.remove('hidden');
		inviteContainer.innerHTML = '';

		function formatEventDate(d) {
			const dt = new Date(d);
			if (isNaN(dt)) return d;
			return dt.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
		}

		function formatEventTime(t) {
			if (!t) return '';
			const [h, m] = t.split(':');
			const dt = new Date();
			dt.setHours(parseInt(h, 10), parseInt(m || '0', 10));
			return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
		}

		const header = document.createElement('div');
		header.className = 'invite-top';

		const headerTitle = document.createElement('h3');
		headerTitle.className = 'invite-main';
		headerTitle.textContent = 'YOU ARE INVITED';

		const headerSubtitle = document.createElement('div');
		headerSubtitle.className = 'invite-sub';
		headerSubtitle.textContent = 'TO JOIN THE';

		header.appendChild(headerTitle);
		header.appendChild(headerSubtitle);

		const eventTitleEl = document.createElement('div');
		eventTitleEl.className = 'invite-event-name';
		eventTitleEl.textContent = eventTitle;

		const dateEl = document.createElement('div');
		dateEl.className = 'invite-date';
		dateEl.textContent = formatEventDate(eventDateVal);

		const timeEl = document.createElement('div');
		timeEl.className = 'invite-time';
		timeEl.textContent = `${formatEventTime(startTimeVal)} - ${formatEventTime(endTimeVal)}`;

		const locationEl = document.createElement('div');
		locationEl.className = 'invite-location';
		locationEl.textContent = eventLocation;

		const descriptionEl = document.createElement('p');
		descriptionEl.className = 'invite-desc';
		descriptionEl.textContent = descriptionText;

		inviteContainer.appendChild(header);
		inviteContainer.appendChild(eventTitleEl);
		inviteContainer.appendChild(dateEl);
		inviteContainer.appendChild(timeEl);
		inviteContainer.appendChild(locationEl);
		inviteContainer.appendChild(descriptionEl);
	});
});
