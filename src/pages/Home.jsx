import React from 'react';

import '../styles/home.css';

import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Anchor from '../components/Anchor';
import Logo from '../components/Logo';

import BannerPerson from '../images/Banner Person.png';
import TimeTracking from '../images/Time Tracking.png';
import RealTimeSyncronozation from '../images/Real-Time Synchronozation.png';
import PomodoroTimer from '../images/Pomodoro TImer.png';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false
		};
	};
	componentDidMount() {
		const navbar = document.getElementById('navbar');
		const banner = document.getElementById('banner');

		const bannerHeightChange = () => {
			if (!matchMedia('screen and (max-width: 60rem)').matches)
				banner.style.height = `${window.innerHeight - navbar.offsetHeight}px`;
			else
				banner.style.height = 'auto';
		};
		window.addEventListener('resize', bannerHeightChange);
		bannerHeightChange();



		const setMobile = () => {
			this.setState({
				mobile: matchMedia('screen and (max-width: 60rem)').matches
			});
		};

		window.addEventListener('resize', setMobile);
		setMobile();
	};
	render() {
		return (
			<>
				<Navbar>
					<Anchor href='/' className='active'>Home</Anchor>
					<Anchor href='/about'>About</Anchor>
					<Anchor href='/contact'>Contact</Anchor>
				</Navbar>

				<main
					id='banner'
				>
					<div>
						<div>
							{
								this.state.mobile ? null : <h4>Stay on top of your tasks with</h4>
							}

							{
								this.state.mobile ? null : <Logo head='1' />
							}

							<p>An all-in-one web application for <b>task management</b>, <b>time tracking</b>, and a built-in <b>Pomodoro timer</b> to supercharge your productivity.</p>

							<div>
								<Button
									label='Get Started'
									href='/signUp'
									type='CallToAction'
									head='6'
									filled={true}
									theme='dark'
								/>
								<Button
									label='Contact Us'
									href='/contact'
									type='CallToAction'
									head='6'
									theme='dark'
								/>
							</div>
						</div>

						<img src={BannerPerson} alt='Banner Person' />

						{
							this.state.mobile ? (
								<h4>Stay on top of your tasks!</h4>
							) : null
						}
					</div>
				</main>

				<section
					id='features'
				>
					<h2>Why choose us?</h2>

					<div>
						<div>
							<img src={TimeTracking} alt='Time Tracking' />
							<p>Easily monitor task durations and track your progress with our integrated time tracker.</p>
						</div>
						<div>
							<img src={RealTimeSyncronozation} alt='Real-time Synchronization' />
							<p>Collaborate seamlessly with your team using real-time synchronization for project management.</p>
						</div>
						<div>
							<img src={PomodoroTimer} alt='Pomodoro Timer' />
							<p>Boost your focus and productivity with our built-in Pomodoro timer, designed to help you manage your time effectively.</p>
						</div>
					</div>
				</section>

				<section className='capabilities'>
					<article>
						<h1>Light</h1>
						<p>Built with a lightweight design, our web application is fast and responsive, so you can manage your tasks with ease.</p>
						<p>Our web application is accessible from any device with an internet connection, so you can manage your tasks on the go.</p>

						<div>
							<div>
								<img src='#/' />
								<h3>Lighweight Design</h3>
								<p>Our web application is designed to be lightweight and responsive, so you can manage your tasks with ease.</p>
							</div>
							<div>
								<img src='#/' />
								<h3>No Installation Required</h3>
								<p>All you need is an internet connection to access our web application, so you can manage your tasks from anywhere.</p>
							</div>
						</div>
					</article>
					<img src='#/' />
				</section>

				<section className='capabilities'>
					<article>
						<h1>Fast</h1>
						<p>Rapidly manage your tasks with our web application, designed to be fast and responsive for a seamless user experience.</p>
						<p>Our web application is optimized for speed, so you can manage your tasks efficiently and effectively.</p>

						<div>
							<div>
								<img src='#/' />
								<h3>Optimized for Speed</h3>
								<p>Our web application is designed to be fast and responsive, so you can manage your tasks efficiently.</p>
							</div>
							<div>
								<img src='#/' />
								<h3>Sleek User Interface</h3>
								<p>Maintain focus on your tasks with our sleek user interface, designed for a seamless user experience.</p>
							</div>
						</div>
					</article>
					<img src='#/' />
				</section>

				<section className='capabilities'>
					<article>
						<h1>Powerful</h1>
						<p>Take control of your tasks with our web application, designed to be powerful and feature-rich for enhanced task management.</p>

						<h1>& Secure</h1>
						<p>Designed with security in mind, so you can manage your tasks with confidence.</p>
					</article>
					<img src='#/' />
				</section>

				<section id='callToAction'>
					<h3>Are you ready?</h3>
					<p>Sign up now and start managing your tasks more efficiently.</p>
					<Button
						label='Get Started'
						href='/signUp'
						type='CallToAction'
						head='6'
						theme='light'
					/>

					<svg viewBox='0 0 1440 854'>
						<path d='M1436.04 854H-0.875604C-0.875604 765.5 -0.875702 224 -0.999505 131.265C197.162 169.746 392.739 168.245 627 100.802C1044.5 -19.3962 1416 -5.50003 1440.5 11C1465 27.5 1436.04 854 1436.04 854Z' fill='var(--color-secondary)' />
					</svg>
				</section>

				<section id='footer'>
					<div>
						<span>© 2024<br />All rights reserved.</span>

						<Logo
							head='6'
							theme='light'
						/>

						<div>
							<Anchor theme='light' href='/' className='active'>Home</Anchor>
							<Anchor theme='light' href='/about'>About</Anchor>
							<Anchor theme='light' href='/contact'>Contact</Anchor>
						</div>
					</div>

					<svg viewBox='0 0 1440 354'>
						<path d='M925.643 77C1324.92 12.212 1403.1 31.7986 1440 0V354H-1V141.949C332.005 210.771 526.366 141.788 925.643 77Z' fill='var(--color-primary)' />
					</svg>
				</section>
			</>
		);
	};
};