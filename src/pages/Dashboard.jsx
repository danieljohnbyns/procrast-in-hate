import React from 'react';
import {
	Routes,
	Route
} from 'react-router-dom';

import '../styles/dashboard.css';

import Sidebar from '../components/Sidebar';
import Tab from '../components/Tab';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false
		};
	};
	componentDidMount() {
		const setMobile = () => {
			this.setState({
				mobile: matchMedia('screen and (max-width: 60rem)').matches
			});
		};

		window.addEventListener('resize', setMobile);
		setMobile();

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
		
		for (const tab of tabs) {
			tab.onclick = () => {
				for (const tab of tabs) {
					tab.classList.remove('active');
				};
				tab.classList.add('active');
			};
		};
	};
	render() {
		return (
			<>
				<Sidebar>
					<Tab
						href='/dashboard'
						icon={
							<svg viewBox='0 0 48 48' fill='transparent'>
								<path d='M18 44V24H30V44M6 18L24 4L42 18V40C42 41.0609 41.5786 42.0783 40.8284 42.8284C40.0783 43.5786 39.0609 44 38 44H10C8.93913 44 7.92172 43.5786 7.17157 42.8284C6.42143 42.0783 6 41.0609 6 40V18Z' stroke='var(--color-primary)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' />
							</svg>
						}
						active
					>Home</Tab>
					<Tab
						href='/dashboard/notification'
						icon={
							<svg width="57" height="53" viewBox="0 0 57 53" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9.5 41.9582V37.5415H14.25V22.0832C14.25 19.0283 15.2396 16.3231 17.2188 13.9675C19.1979 11.5752 21.7708 10.0109 24.9375 9.27484V7.729C24.9375 6.80886 25.274 6.03595 25.9469 5.41025C26.6594 4.74775 27.5104 4.4165 28.5 4.4165C29.4896 4.4165 30.3208 4.74775 30.9938 5.41025C31.7063 6.03595 32.0625 6.80886 32.0625 7.729V9.27484C35.2292 10.0109 37.8021 11.5752 39.7812 13.9675C41.7604 16.3231 42.75 19.0283 42.75 22.0832V37.5415H47.5V41.9582H9.5ZM28.5 48.5832C27.1938 48.5832 26.0656 48.1599 25.1156 47.3134C24.2052 46.43 23.75 45.3811 23.75 44.1665H33.25C33.25 45.3811 32.775 46.43 31.825 47.3134C30.9146 48.1599 29.8062 48.5832 28.5 48.5832ZM19 37.5415H38V22.0832C38 19.654 37.0698 17.5745 35.2094 15.8446C33.349 14.1148 31.1125 13.2498 28.5 13.2498C25.8875 13.2498 23.651 14.1148 21.7906 15.8446C19.9302 17.5745 19 19.654 19 22.0832V37.5415Z" fill="#260351" />
							</svg>
						}
					>Notification</Tab>
					<Tab
						href='/dashboard/projects'
						icon={
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M44 38C44 39.0609 43.5786 40.0783 42.8284 40.8284C42.0783 41.5786 41.0609 42 40 42H8C6.93913 42 5.92172 41.5786 5.17157 40.8284C4.42143 40.0783 4 39.0609 4 38V10C4 8.93913 4.42143 7.92172 5.17157 7.17157C5.92172 6.42143 6.93913 6 8 6H18L22 12H40C41.0609 12 42.0783 12.4214 42.8284 13.1716C43.5786 13.9217 44 14.9391 44 16V38Z" stroke="#260351" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						}
					>Projects</Tab>
					<Tab
						href='/dashboard/pomodoro'
						icon={
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M24 12V24L32 28M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="#260351" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						}
					>Pomodoro</Tab>
					<Tab
						href='/dashboard/connections'
						icon={
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M34 42V38C34 35.8783 33.1571 33.8434 31.6569 32.3431C30.1566 30.8429 28.1217 30 26 30H10C7.87827 30 5.84344 30.8429 4.34315 32.3431C2.84285 33.8434 2 35.8783 2 38V42M46 42V38C45.9987 36.2275 45.4087 34.5055 44.3227 33.1046C43.2368 31.7037 41.7163 30.7031 40 30.26M32 6.26C33.7208 6.7006 35.2461 7.7014 36.3353 9.10462C37.4245 10.5078 38.0157 12.2337 38.0157 14.01C38.0157 15.7863 37.4245 17.5122 36.3353 18.9154C35.2461 20.3186 33.7208 21.3194 32 21.76M26 14C26 18.4183 22.4183 22 18 22C13.5817 22 10 18.4183 10 14C10 9.58172 13.5817 6 18 6C22.4183 6 26 9.58172 26 14Z" stroke="#260351" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						}
					>Connections</Tab>
				</Sidebar>

				<main id='dashboard'>
					<Routes>
						<Route
							path='/'
							element={
								<div>
									<h1>Dashboard</h1>
								</div>
							}
						/>
						<Route
							path='/notification'
							element={
								<div>
									<h1>Notification</h1>
								</div>
							}
						/>
						<Route
							path='/projects'
							element={
								<div>
									<h1>Projects</h1>
								</div>
							}
						/>
						<Route
							path='/pomodoro'
							element={
								<div>
									<h1>Pomodoro</h1>
								</div>
							}
						/>
						<Route
							path='/connections'
							element={
								<div>
									<h1>Connections</h1>
								</div>
							}
						/>
					</Routes>				
				</main>
			</>
		);
	};
};