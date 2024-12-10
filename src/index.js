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
import PasswordReset from './pages/PasswordReset';
import Dashboard from './pages/Dashboard';
import OfflinePage from './pages/OfflinePage';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<LandingPage />} />
				<Route path='/signUp' element={<SignUp />} />
				<Route path='/signIn' element={<SignIn />} />
				<Route path='/passwordReset' element={<PasswordReset />} />
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
			console.log('SW registered: ', registration);
		}).catch((registrationError) => {
			console.log('SW registration failed: ', registrationError);
		});
	});
};