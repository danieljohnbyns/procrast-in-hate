/* eslint-disable no-lone-blocks */
const WEBSOCKET_URL = 'ws:localhost:5050';

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
	socket = new WebSocket(wsUrl);

	socket.onopen = () => {
		socket.send(JSON.stringify({
			type: 'AUTHENTICATION',
			authentication: {
				...authentication,
				serviceWorker: true
			}
		})); // Send the authentication to the server
		console.log('authentication:', authentication);
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
		setTimeout(connectWebSocket, 5000);
	};

	socket.onerror = (error) => {
		console.error('WebSocket error:', error);
		socket.close();
	};
};

const Pomodoro = {
	timer: null,
	time: {
		minutes: 25,
		seconds: 0
	},
	/**
	 * @type {'paused' | 'running' | 'stopped'}
	 */
	state: 'stopped'
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
			case 'POMODORO_START': {
				if (Pomodoro.state === 'stopped' || Pomodoro.state === 'paused') {
					Pomodoro.state = 'running';
					self.clients.matchAll().then(clients => {
						clients.forEach(client => client.postMessage({
							type: 'POMODORO_UPDATE',
							time: Pomodoro.time,
							state: Pomodoro.state
						}));
					});

					self.registration.showNotification('Pomodoro', {
						body: 'Pomodoro started!'
					});

					Pomodoro.timer = setInterval(() => {
						if (Pomodoro.time.minutes === 0 && Pomodoro.time.seconds === 0) {
							clearInterval(Pomodoro.timer);
							Pomodoro.state = 'stopped';
							self.clients.matchAll().then(clients => {
								clients.forEach(client => client.postMessage({
									type: 'POMODORO_STOP',
									time: Pomodoro.time,
									state: Pomodoro.state
								}));
							});

							self.registration.showNotification('Pomodoro', {
								body: 'Pomodoro completed!'
							});
						} else {
							if (Pomodoro.time.seconds === 0) {
								Pomodoro.time.minutes--;
								Pomodoro.time.seconds = 59;
							} else {
								Pomodoro.time.seconds--;
							};
							self.clients.matchAll().then(clients => {
								clients.forEach(client => client.postMessage({
									type: 'POMODORO_UPDATE',
									time: Pomodoro.time,
									state: Pomodoro.state
								}));
							});
						};
					}, 1000);
				};
				break;
			};
			case 'POMODORO_PAUSE': {
				if (Pomodoro.state === 'running') {
					Pomodoro.state = 'paused';
					clearInterval(Pomodoro.timer);
					self.clients.matchAll().then(clients => {
						clients.forEach(client => client.postMessage({
							type: 'POMODORO_UPDATE',
							time: Pomodoro.time,
							state: Pomodoro.state
						}));
					});

					self.registration.showNotification('Pomodoro', {
						body: 'Pomodoro paused!'
					});
				};
				break;
			};
			case 'POMODORO_STOP': {
				if (Pomodoro.state === 'running' || Pomodoro.state === 'paused') {
					Pomodoro.state = 'stopped';
					clearInterval(Pomodoro.timer);
					Pomodoro.time = {
						minutes: 25,
						seconds: 0
					};
					self.clients.matchAll().then(clients => {
						clients.forEach(client => client.postMessage({
							type: 'POMODORO_STOP',
							time: Pomodoro.time,
							state: Pomodoro.state
						}));
					});

					self.registration.showNotification('Pomodoro', {
						body: 'Pomodoro stopped!'
					});
				};
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