// FILE: public/service-worker.js
const CACHE_NAME = 'offline-cache';
const OFFLINE_URL = 'offline.html';
const WEBSOCKET_URL = 'ws:localhost:5050';

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

	socket = new WebSocket(WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('WebSocket connection established');
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

self.addEventListener('activate', (event) => {
	event.waitUntil(connectWebSocket());
});