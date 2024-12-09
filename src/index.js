import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';

import './fonts/fontFace.css';
import './styles/index.css';

import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import OfflinePage from './pages/OfflinePage';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<LandingPage />} />
				<Route path='/signUp' element={<SignUp />} />
				<Route path='/signIn' element={<SignIn />} />
				<Route path='/dashboard/*' element={<Dashboard />} />
				<Route path='/offline' element={<OfflinePage />} />
			</Routes>
		</BrowserRouter>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js').then((registration) => {
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, (error) => {
			console.log('ServiceWorker registration failed: ', error);
		});
	});
};