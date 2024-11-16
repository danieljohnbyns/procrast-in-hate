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
	componentDidMount() {

		const navbar = document.getElementById('navbar');
		const banner = document.getElementById('banner');

		const bannerHeightChange = () => {
			banner.style.height = `${window.innerHeight - navbar.offsetHeight}px`;
		};
		window.addEventListener('resize', bannerHeightChange);
		bannerHeightChange();
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
							<h4>Stay on top of your tasks with</h4>

							<Logo head='1' />

							<h5>
								<p>Integrated task management, Pomdoro timer, and time tracking—All in one Web Application!</p>
							</h5>

							<Button
								label='Get Started'
								href='/signUp'
								type='CallToAction'
								head='1'
								theme='dark'
							/>
						</div>

						<img src={BannerPerson} alt='Banner Person' />
					</div>
				</main>

				<section
					id='features'
				>
					<h2>Why choose us?</h2>

					<div>
						<div>
							<img src={TimeTracking} alt='Time Tracking' />
							<p>Integrated time tracker for monitoring task duration and progress tracking.</p>
						</div>
						<div>
							<img src={RealTimeSyncronozation} alt='Real-time Synchronization' />
							<p>Reat-time synchronization for team collaboration and project management.</p>
						</div>
						<div>
							<img src={PomodoroTimer} alt='Pomodoro Timer' />
							<p>Built-in Pomodoro timer to enhance focus and time management.</p>
						</div>
					</div>
				</section>
			</>
		);
	};
};