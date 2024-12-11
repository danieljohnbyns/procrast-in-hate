/* eslint-disable no-restricted-globals */
/* eslint-disable no-lone-blocks */

const WEBSOCKET_URL = 'wss://procrast-in-hate-api.onrender.com';

let authentication = { token: '', _id: '' }; // Global variable to store the authentication

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('offline-cache').then((cache) => {
			return cache.addAll([
				'/offline.html',
				'/offline.bundle.js'
			]);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			};
			return fetch(event.request).catch(() => {
				return caches.match('/offline.html');
			});
		})
	);
});

// WebSocket connection
let socket;

// Method to update the authentication
const updateAuthentication = (newAuthentication) => {
	console.log('Updating authentication:', newAuthentication);
	authentication = newAuthentication;
	if (socket)
		socket.close();
};

const connectWebSocket = async () => {
	if (socket) {
		socket.close();
	};

	// Include the authentication token in the WebSocket URL or headers
	const wsUrl = `${WEBSOCKET_URL}`;
	if (authentication.token === '') {
		console.error('No authentication token provided');
		setTimeout(() => connectWebSocket(), 5000);
		return;
	};
	socket = new WebSocket(wsUrl);

	socket.onopen = () => {
		socket.send(JSON.stringify({
			type: 'AUTHENTICATION',
			authentication: {
				...authentication,
				serviceWorker: true
			}
		})); // Send the authentication to the server
		console.log('Authentication:', authentication);
	};

	socket.onmessage = (event) => {
		// Handle the message received from the server
		const message = JSON.parse(event.data);
		switch (message.type) {
			case 'AUTHENTICATION': {
				if (message.success) {
					console.log('Authentication successful');
				} else {
					console.error('Authentication failed');
					socket.close();
				};
				break;
			};
			case 'NOTIFICATION': {
				// Push notification for TASK_UPDATE
				self.registration.showNotification('Task Update', {
					body: message.message
				});
				break;
			};
			default: {
				console.error('Unknown message type:', message.type);
			};
		};
	};

	socket.onclose = () => {
		console.log('WebSocket connection closed, retrying in 5 seconds...');
		setTimeout(() => connectWebSocket(), 5000);
	};

	socket.onerror = (error) => {
		console.error('WebSocket error:', error);
		socket.close();
	};
};

// Pomodoro timer
const timer = {
	minutes: 25,
	seconds: 0,

	/**
	 * @type {'running' | 'paused' | 'stopped'}
	 */
	state: 'stopped',

	interval: null,

	start: () => {
		timer.state = 'running';
		// Notify the clients that the timer has started
		self.registration.showNotification('Timer Update', {
			body: 'Timer has started'
		});

		timer.interval = setInterval(() => {
			if (timer.seconds === 0) {
				if (timer.minutes === 0) {
					timer.stop();
					return;
				};
				timer.seconds = 59;
				timer.minutes--;
			} else {
				timer.seconds--;
			};

			self.clients.matchAll().then(clients => {
				clients.forEach(client => client.postMessage({
					type: 'TIMER_UPDATE',
					minutes: timer.minutes,
					seconds: timer.seconds,
					state: timer.state
				}));
			});
		}, 1000);
	},
	stop: () => {
		timer.state = 'stopped';
		clearInterval(timer.interval);

		self.clients.matchAll().then(clients => {
			clients.forEach(client => client.postMessage({
				type: 'TIMER_UPDATE',
				minutes: timer.minutes,
				seconds: timer.seconds,
				state: timer.state
			}));
		});
		self.registration.showNotification('Timer Update', {
			body: 'Timer has stopped'
		});
	},
	pause: () => {
		timer.state = 'paused';
		clearInterval(timer.interval);

		self.clients.matchAll().then(clients => {
			clients.forEach(client => client.postMessage({
				type: 'TIMER_UPDATE',
				minutes: timer.minutes,
				seconds: timer.seconds,
				state: timer.state
			}));
		});
		self.registration.showNotification('Timer Update', {
			body: 'Timer has paused'
		});
	},
	resume: () => {
		timer.state = 'running';

		timer.interval = setInterval(() => {
			if (timer.seconds === 0) {
				if (timer.minutes === 0) {
					timer.stop();
					return;
				};
				timer.seconds = 59;
				timer.minutes--;
			} else {
				timer.seconds--;
			};

			self.clients.matchAll().then(clients => {
				clients.forEach(client => client.postMessage({
					type: 'TIMER_UPDATE',
					minutes: timer.minutes,
					seconds: timer.seconds,
					state: timer.state
				}));
			});
		}, 1000);
	},
	reset: (minutes = 25, seconds = 0) => {
		timer.minutes = minutes;
		timer.seconds = seconds;
		timer.state = 'stopped';

		self.clients.matchAll().then(clients => {
			clients.forEach(client => client.postMessage({
				type: 'TIMER_UPDATE',
				minutes: timer.minutes,
				seconds: timer.seconds,
				state: timer.state
			}));
		});

		self.registration.showNotification('Timer Update', {
			body: 'Timer has reset'
		});
	}
};

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'UPDATE_AUTHENTICATION') {
		console.log('Updating authentication:', event.data.authentication);
		updateAuthentication(event.data.authentication);
	};
	if (event.data && event.data.type === 'SIGN_OUT') {
		updateAuthentication({ token: '', _id: '' });
		self.clients.matchAll().then(clients => {
			clients.forEach(client => client.postMessage({
				type: 'SIGN_OUT'
			}));
		});
	};
	if (event.data && event.data.type === 'SIGN_IN') {
		self.clients.matchAll().then(clients => {
			clients.forEach(client => client.postMessage({
				type: 'SIGN_IN'
			}));
		});
	};

	if (event.data) {
		switch (event.data.type) {
			case 'TIMER_START': {
				timer.start();
				break;
			};
			case 'TIMER_STOP': {
				timer.stop();
				break;
			};
			case 'TIMER_PAUSE': {
				timer.pause();
				break;
			};
			case 'TIMER_RESUME': {
				timer.resume();
				break;
			};
			case 'TIMER_RESET': {
				timer.reset(event.data.minutes, event.data.seconds);
				break;
			};
			default: { };
		};
	};
});

connectWebSocket();

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});