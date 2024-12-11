import React from 'react';

import Swal from 'sweetalert2';

import '../styles/adminSignIn.css';

import Input from '../components/Input';
import Button from '../components/Button';

import globals from '../utils/globals';

export default class AdminSignIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,
			form: {
				username: '',
				password: ''
			}
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
		root.setAttribute('page', 'adminSignIn');

		const adminAuthentication = localStorage.getItem('adminAuthentication');
		if (adminAuthentication) {
			window.location.href = '/adminConsole';
		};
	};
	render() {
		return (
			<>
				<form id='adminSignIn'>
					<h1>Sign In</h1>
					<p>Sign in to access the admin console</p>

					<div>
						<Input
							type='text'
							name='username'
							placeholder='Username'
							value={this.state.form.username}
							onChange={e => this.setState({ form: { ...this.state.form, username: e.target.value } })}
						/>
						<Input
							type='password'
							name='password'
							placeholder='Password'
							value={this.state.form.password}
							onChange={e => this.setState({ form: { ...this.state.form, password: e.target.value } })}
						/>
						<Button
							type='button'
							filled
							onClick={async (e) => {
								e.preventDefault();

								const response = await fetch(`${globals.API_URL}/admins/`, {
									method: 'PUT',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify(this.state.form)
								});

								if (!response.ok) {
									Swal.fire({
										icon: 'error',
										title: 'Error',
										text: 'Invalid username or password'
									});
									return;
								};

								const data = await response.json();
								localStorage.setItem('adminAuthentication', JSON.stringify(data.adminAuthentication));
								window.location.reload();
							}}
						>
							Sign In
						</Button>
					</div>
				</form>
			</>
		);
	};
};