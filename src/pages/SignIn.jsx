import React from 'react';

import '../styles/signIn.css';

import Input from '../components/Input';
import Button from '../components/Button';

import globals from '../utils/globals';

export default class SignIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,
			form: {
				email: '',
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
		root.setAttribute('page', 'signIn');
	};
	render() {
		return (
			<>
				<div id='signIn'>
					<form>
						<h1>Welcome</h1>
						<Input
							placeholder='Email'
							type='email'
							className='email'
							required

							onChange={e => this.setState({ form: { ...this.state.form, email: e.target.value } })}
						/>
						<Input
							placeholder='Password'
							type='password'
							className='password'
							required

							onChange={e => this.setState({ form: { ...this.state.form, password: e.target.value } })}
						/>
						<div>
							<Button
								label='Sign In'
								type='CallToAction'
								head='6'
								filled={true}
								theme='dark'

								onClick={async (e) => {
									e.preventDefault();
									if (!this.state.form.email || !this.state.form.password) {
										alert('Please fill in all fields');
										return;
									};

									const response = await fetch(`${globals.API_URL}/users`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify(this.state.form)
									});

									if (response.status === 200) {
										const data = await response.json();
										const authentication = data.authentication;
										
										localStorage.setItem('authentication', JSON.stringify(authentication));
										window.location.href = '/';
									} else {
										alert('Invalid email or password');
									};
								}}
							/>
							<p><a href='/forgotPassword'>Forgot your password?</a></p>
						</div>

						<p>Don't have an account? <b><a href='/signUp'>Sign up</a></b></p>
					</form>

					<svg viewBox='0 0 1440 406'>
						<path d='M1451 436.528H0.123104C0.123104 404.428 0.123007 208.023 0 174.387C196.886 188.345 364.5 318.528 651 203.028C937.5 87.5282 1451 -17.1451 1451 2.35468V436.528Z' fill='var(--color-secondary)' />
					</svg>
				</div>
				<svg viewBox='0 0 1438 231'>
					<path d='M912.5 67.8662C1241 -50.1337 1401.13 27.0685 1438 2.36622V277.366H-2V112.638C330.774 166.101 584 185.866 912.5 67.8662Z' fill='var(--color-primary)' />
				</svg>
			</>
		);
	};
};