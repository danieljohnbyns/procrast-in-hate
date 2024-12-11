import React from 'react';
import {
	Routes,
	Route,
	Navigate
} from 'react-router-dom';

import Swal from 'sweetalert2';

import '../styles/dashboard.css';

import globals from '../utils/globals';

import Sidebar from '../components/Sidebar';
import Tab from '../components/Tab';

import Home from './dashboard/Home';
import Invitations from './dashboard/Invitations';
import Projects from './dashboard/Projects';
import Pomodoro from './dashboard/Pomodoro';
import Connections from './dashboard/Connections';
import Profile from './dashboard/Profile';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,
			notificationGranted: false
		};
	};
	async componentDidMount() {
		const setMobile = () => {
			this.setState({
				mobile: matchMedia('screen and (max-width: 60rem)').matches
			});
		};

		window.addEventListener('resize', setMobile);
		setMobile();

		const originalFetch = window.fetch;
		window.fetch = (url, options) => new Promise((resolve, reject) => {
			const defaultHeaders = {
				'Content-Type': 'application/json',
				'Authentication': localStorage.getItem('authentication')
			};
			
			if (options) {
				options.headers = {
					...defaultHeaders,
					...options.headers
				};
			} else {
				options = {
					headers: defaultHeaders
				};
			};

			originalFetch(url, options).then(resolve).catch(reject);
		});

		window.Swal = Swal;

		this.connectToWebSocket();

		if (!localStorage.getItem('authentication')) {
			window.location.href = '/signIn';
		};

		const authenticationResponse = await fetch(`${globals.API_URL}/users/authenticate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': localStorage.getItem('authentication')
			},
			body: JSON.stringify(JSON.parse(localStorage.getItem('authentication')))
		});
		if (!authenticationResponse.ok) {
			localStorage.removeItem('authentication');
			window.location.href = '/signIn';
		};

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('message', (event) => {
				if (event.data) {
					if (event.data.type === 'TIMER_UPDATE') {
						document.title = `${event.data.minutes.toString().padStart(2, '0')}:${event.data.seconds.toString().padStart(2, '0')} - Pomodoro - Pocrast In Hate`;

						if (event.data.state === 'running') {
							document.documentElement.style.setProperty('--color-primary', '#AC9BFA');
							document.documentElement.style.setProperty('--color-secondary', '#CDC1FF');
							document.documentElement.style.setProperty('--color-tertiary', '#260351');
							document.documentElement.style.setProperty('--color-quaternary', '#705BD3');
							document.documentElement.style.setProperty('--color-quinary', '#9885F0');

							document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(45deg, #260351 0%, #705BD3 50%, #9885F0 62.5%)');

							document.documentElement.style.setProperty('--color-white', '#1F1F1F');
							document.documentElement.style.setProperty('--color-black', '#FFFFFF');
							document.documentElement.style.setProperty('--color-gray', '#260351');
						} else {
							document.documentElement.style.setProperty('--color-primary', '#260351');
							document.documentElement.style.setProperty('--color-secondary', '#705BD3');
							document.documentElement.style.setProperty('--color-tertiary', '#9885F0');
							document.documentElement.style.setProperty('--color-quaternary', '#AC9BFA');
							document.documentElement.style.setProperty('--color-quinary', '#CDC1FF');

							document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(-45deg, #9885F0 0%, #AC9BFA 50%, #CDC1FF 62.5%)');

							document.documentElement.style.setProperty('--color-white', '#FFFFFF');
							document.documentElement.style.setProperty('--color-black', '#000000');
							document.documentElement.style.setProperty('--color-gray', '#F1F1F1');
						};
					} else if (event.data.type === 'TIMER_STOP') {
						document.title = 'Pocrast In Hate';
					};
				};
			});
			try {
				console.log('Updating service worker authentication...');
				navigator.serviceWorker.controller.postMessage({
					type: 'UPDATE_AUTHENTICATION',
					authentication: JSON.parse(localStorage.getItem('authentication') || '{}')
				});
			} catch (error) { console.log('Service Worker Error:', error) };
		};

		if (!this.state.notificationGranted) {
			if ('Notification' in window) {
				if (Notification.permission === 'granted') {
					this.setState({
						notificationGranted: true
					});
				};
			};
		};
	};
	componentDidUpdate() {
		if (!this.state.notificationGranted) {
			if ('Notification' in window) {
				if (Notification.permission === 'granted') {
					this.setState({
						notificationGranted: true
					});
				};
			};

			return;
		};

		const root = document.getElementById('root');
		root.setAttribute('page', 'dashboard');

		const sidebar = document.getElementById('sidebar');
		const sidebarToggle = document.getElementById('sidebarToggle');
		const tabs = sidebar.querySelectorAll('.tab');

		sidebarToggle.onchange = () => {
			if (sidebarToggle.checked) {
				for (const tab of tabs) {
					tab.classList.add('minimized');
				};
			} else {
				for (const tab of tabs) {
					tab.classList.remove('minimized');
				};
			};
		};

		const activateTab = () => {
			for (const tab of tabs) {
				tab.classList.remove('active');
			};
			setTimeout(() => {
				try {
					const currentTab = sidebar.querySelector(`div:nth-child(2) > * > .tab[href='${window.location.pathname}']`) || sidebar.querySelector(`div:nth-child(2) > * > .tab[href='${window.location.pathname.slice(0, -1)}']`);
					currentTab.classList.add('active');
				} catch (error) {
					console.error('Error:', error);
				};
			}, 10);
		};

		for (const tab of tabs) {
			tab.addEventListener('click', activateTab);
		};
		activateTab();
	};

	connectToWebSocket = () => {
		const authentication = JSON.parse(localStorage.getItem('authentication'));

		globals.socket = new WebSocket(globals.WEBSOCKET_URL);

		globals.socket.onopen = () => {
			globals.socket.send(JSON.stringify({
				type: 'AUTHENTICATION',
				authentication: {
					...authentication,
					serviceWorker: false
				}
			}));
		};

		globals.socket.onmessage = (event) => {
			console.log('WebSocket message received:', event.data);
		};

		globals.socket.onclose = () => {
			console.log('WebSocket connection closed, retrying in 5 seconds...');
			Swal.fire({
				icon: 'error',
				title: 'WebSocket connection closed',
				text: 'Retrying in 5 seconds...',
				timer: 5000,
				timerProgressBar: true,
				showConfirmButton: false
			});
			setTimeout(this.connectToWebSocket, 5000);
		};

		globals.socket.onerror = (error) => {
			console.error('WebSocket error:', error);
			globals.socket.close();
		};
	};

	render() {
		if (!this.state.notificationGranted) {
			return (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100vh',
						textAlign: 'center',
						gap: '1rem'
					}}
				>
					<h1>Notifications</h1>
					<p>Click the button below to grant permission to show notifications.</p>
					<button
						style={{
							padding: '1rem 2rem',
							border: 'none',
							borderRadius: '0.5rem',
							backgroundColor: 'var(--color-primary)',
							color: 'var(--color-white)',
							cursor: 'pointer'
						}}
						onClick={() => {
							if ('Notification' in window) {
								Notification.requestPermission().then((permission) => {
									if (permission === 'granted') {
										window.location.reload();
									};
								});
							};
						}}
					>
						Grant Permission
					</button>
				</div>
			);
		};

		return (
			<>
				<Sidebar>
					<Tab
						href='/dashboard/home'
						icon={
							<svg viewBox='0 0 48 48' fill='transparent'>
								<path d='M18 44V24H30V44M6 18L24 4L42 18V40C42 41.0609 41.5786 42.0783 40.8284 42.8284C40.0783 43.5786 39.0609 44 38 44H10C8.93913 44 7.92172 43.5786 7.17157 42.8284C6.42143 42.0783 6 41.0609 6 40V18Z' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						}
						active
					>Home</Tab>
					<Tab
						href='/dashboard/invitations'
						icon={
							<svg viewBox='0 0 800 800' fill='transparent'>
								<path d='M300.065 566.667H186.879C144.931 566.667 123.957 566.667 119.544 563.41C114.587 559.75 113.375 557.59 112.838 551.453C112.361 545.99 125.215 524.953 150.925 482.887C177.47 439.45 200.01 376.207 200.01 286.667C200.01 237.16 221.082 189.68 258.589 154.673C296.096 119.667 346.967 100 400.01 100C453.053 100 503.923 119.667 541.43 154.673C578.94 189.68 600.01 237.16 600.01 286.667C600.01 376.207 622.55 439.45 649.097 482.887C674.803 524.953 687.66 545.99 687.183 551.453C686.647 557.59 685.433 559.75 680.477 563.41C676.063 566.667 655.09 566.667 613.143 566.667H500.01M300.065 566.667L300.01 600C300.01 655.23 344.783 700 400.01 700C455.24 700 500.01 655.23 500.01 600V566.667M300.065 566.667H500.01' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						}
					>Invitations</Tab>
					<Tab
						href='/dashboard/projects'
						icon={
							<svg viewBox='0 0 48 48' fill='transparent'>
								<path d='M44 38C44 39.0609 43.5786 40.0783 42.8284 40.8284C42.0783 41.5786 41.0609 42 40 42H8C6.93913 42 5.92172 41.5786 5.17157 40.8284C4.42143 40.0783 4 39.0609 4 38V10C4 8.93913 4.42143 7.92172 5.17157 7.17157C5.92172 6.42143 6.93913 6 8 6H18L22 12H40C41.0609 12 42.0783 12.4214 42.8284 13.1716C43.5786 13.9217 44 14.9391 44 16V38Z' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						}
					>Projects</Tab>
					<Tab
						href='/dashboard/pomodoro'
						icon={
							<svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M24 12V24L32 28M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						}
					>Pomodoro</Tab>
					<Tab
						href='/dashboard/connections'
						icon={
							<svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M34 42V38C34 35.8783 33.1571 33.8434 31.6569 32.3431C30.1566 30.8429 28.1217 30 26 30H10C7.87827 30 5.84344 30.8429 4.34315 32.3431C2.84285 33.8434 2 35.8783 2 38V42M46 42V38C45.9987 36.2275 45.4087 34.5055 44.3227 33.1046C43.2368 31.7037 41.7163 30.7031 40 30.26M32 6.26C33.7208 6.7006 35.2461 7.7014 36.3353 9.10462C37.4245 10.5078 38.0157 12.2337 38.0157 14.01C38.0157 15.7863 37.4245 17.5122 36.3353 18.9154C35.2461 20.3186 33.7208 21.3194 32 21.76M26 14C26 18.4183 22.4183 22 18 22C13.5817 22 10 18.4183 10 14C10 9.58172 13.5817 6 18 6C22.4183 6 26 9.58172 26 14Z' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						}
					>Connections</Tab>
				</Sidebar>

				<main id='dashboard'>
					<Routes>
						<Route
							path='/'
							element={<Navigate to='/dashboard/home' replace />}
						/>
						<Route
							path='/home'
							element={<Home />}
						/>
						<Route
							path='/invitations'
							element={<Invitations />}
						/>
						<Route
							path='/projects'
							element={<Projects />}
						/>
						<Route
							path='/pomodoro'
							element={<Pomodoro />}
						/>
						<Route
							path='/connections'
							element={<Connections />}
						/>

						<Route
							path='/profile'
							element={<Profile />}
						/>
					</Routes>				
				</main>
			</>
		);
	};
};