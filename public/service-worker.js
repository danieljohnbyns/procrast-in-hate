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

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'UPDATE_AUTHENTICATION') {
		console.log('Updating authentication:', event.data.authentication);
		updateAuthentication(event.data.authentication);
	};
});

connectWebSocket();

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});