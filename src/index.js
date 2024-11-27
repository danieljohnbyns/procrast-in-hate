import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	BrowserRouter,
	HashRouter,
	Routes,
	Route,
} from 'react-router-dom';

import './fonts/fontFace.css';
import './styles/index.css';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Home />} />

			<Route path='/signUp' element={<SignUp />} />
			<Route path='/signIn' element={<SignIn />} />
		</Routes>
	</BrowserRouter>
);