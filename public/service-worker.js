const CACHE_NAME = 'offline-cache';
const OFFLINE_URL = 'offline.html';
const WEBSOCKET_URL = 'ws:localhost:5050';

let authentication = { token: '', _id: '' }; // Global variable to store the authentication

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
				OFFLINE_URL,
				// Add other assets you want to cache
			]);
		})
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request).catch(() => {
				return caches.open(CACHE_NAME).then((cache) => {
					return cache.match(OFFLINE_URL);
				});
			})
		);
	}
});

// WebSocket connection
let socket;
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
	};

	socket.onmessage = (event) => {
		console.log('WebSocket message received:', event.data);
		// Handle incoming messages
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

// Method to update the authentication
const updateAuthentication = (newAuthentication) => {
	authentication = newAuthentication;
	socket.close();
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