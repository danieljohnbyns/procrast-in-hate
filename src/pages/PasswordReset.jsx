import React from 'react';

import Swal from 'sweetalert2';

import '../styles/passwordReset.css';

import Input from '../components/Input';
import Button from '../components/Button';

import globals from '../utils/globals';

export default class PasswordReset extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,
			requestForm: {
				email: '',
				code: ''
			},
			resetForm: {
				password: '',
				confirmPassword: ''
			},
			/**
			 * @type {'request' | 'confirm' | 'reset'}
			 */
			state: 'request'
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
		root.setAttribute('page', 'passwordReset');
	};
	render() {
		return (
			<>
				<div id='passwordReset'>
					<form>
						<h1>Reset Password</h1>
						{this.state.state  === 'request' ? (
							<>
								<p>Enter your email address and we'll send you a code to reset your password.</p>
								<Input
									placeholder='Email'
									type='email'
									className='email'
									id='email'
									required

									onChange={e => this.setState({ requestForm: { ...this.state.requestForm, email: e.target.value } })}
								/>
								<Button
									type='button'
									className='submit'
									onClick={async (e) => {
										e.preventDefault();
										const response = await fetch(`${globals.API_URL}/users/passwordReset/request`, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json'
											},
											body: JSON.stringify(this.state.requestForm)
										});

										if (!response.ok) {
											const data = await response.json();
											Swal.fire({
												icon: 'error',
												title: 'Error',
												text: data.message
											});
											return;
										};

										await Swal.fire({
											icon: 'success',
											title: 'Success',
											text: 'Password reset code sent.'
										});

										this.setState({ state: 'confirm' });

										setTimeout(() => {
											document.getElementById('code').value = '';
											document.getElementById('code').focus();
										}, 100);
									}}
								>
									Submit
								</Button>
							</>
						) : this.state.state === 'confirm' ? (
							<>
								<p>Enter the code we sent you to reset your password.</p>
								<Input
									placeholder='Code'
									type='text'
									id='code'
									className='code'
									required
									onChange={e => this.setState({ requestForm: { ...this.state.requestForm, code: e.target.value } })}
								/>
								<Button
									type='button'
									className='submit'
									onClick={async (e) => {
										e.preventDefault();
										const response = await fetch(`${globals.API_URL}/users/passwordReset/confirm`, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json'
											},
											body: JSON.stringify(this.state.requestForm)
										});

										if (!response.ok) {
											const data = await response.json();
											Swal.fire({
												icon: 'error',
												title: 'Error',
												text: data.message
											});
											return;
										};

										await Swal.fire({
											icon: 'success',
											title: 'Success',
											text: 'Password reset confirmed.'
										});

										this.setState({ state: 'reset' });
									}}
								>
									Submit
								</Button>
							</>
						) : this.state.state === 'reset' ? (
							<>
								<p>Enter your new password.</p>
								<Input
									placeholder='Password'
									type='password'
									className='password'
									required

									onChange={e => this.setState({ resetForm: { ...this.state.resetForm, password: e.target.value } })}
								/>
								<Input
									placeholder='Confirm Password'
									type='password'
									className='confirmPassword'
									required

									onChange={e => this.setState({ resetForm: { ...this.state.resetForm, confirmPassword: e.target.value } })}
								/>
								<Button
									type='button'
									className='submit'
									onClick={async (e) => {
										e.preventDefault();
										if (this.state.resetForm.password !== this.state.resetForm.confirmPassword) {
											Swal.fire({
												icon: 'error',
												title: 'Error',
												text: 'Passwords do not match.'
											});
											return;
										};

										const response = await fetch(`${globals.API_URL}/users/passwordReset/reset`, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json'
											},
											body: JSON.stringify({
												...this.state.requestForm,
												password: this.state.resetForm.password
											})
										});

										if (!response.ok) {
											const data = await response.json();
											Swal.fire({
												icon: 'error',
												title: 'Error',
												text: data.message
											});
											return;
										};

										await Swal.fire({
											icon: 'success',
											title: 'Success',
											text: 'Password reset.'
										});

										window.location.href = '/signIn';
									}}
								>
									Submit
								</Button>
							</>
						) : null}
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