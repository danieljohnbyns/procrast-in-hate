import React from 'react';

import '../styles/signUp.css';

import Input from '../components/Input';
import Button from '../components/Button';

export default class Home extends React.Component {
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
		root.setAttribute('page', 'signUp');
	};
	render() {
		return (
			<>
				<div id='signUp'>
					<form>
						<h1>Create an account</h1>
						<Input
							placeholder='Name'
							type='text'
							className='name'
							required
						/>
						<Input
							placeholder='Email'
							type='email'
							className='email'
							required
						/>
						<Input
							placeholder='Password'
							type='password'
							className='password'
							required
						/>
						<Input
							placeholder='Confirm password'
							type='password'
							className='confirmPassword'
							required
						/>
						<Button
							label='Sign Up'
							type='CallToAction'
							head='6'
							filled={true}
							theme='dark'
						/>

						<p>Already have an account? <b><a href='/signIn'>Sign In</a></b></p>
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