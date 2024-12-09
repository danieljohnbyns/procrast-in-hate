import React from 'react';

import '../../styles/dashboard/pomodoro.css';

export default class Pomodoro extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			time: {
				minutes: 25,
				seconds: 0
			},
			timer: null,
			/**
			 * @type {'paused' | 'running' | 'stopped'}
			 */
			state: 'stopped'
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
	};

	handleStart = () => {
		const timer = setInterval(() => {
			let minutes = this.state.time.minutes;
			let seconds = this.state.time.seconds;

			if (minutes === 0 && seconds === 0) {
				clearInterval(timer);
				this.setState({
					timer: null,
					time: {
						minutes: 25,
						seconds: 0
					}
				});
			} else {
				if (seconds === 0) {
					minutes--;
					seconds = 59;
				} else {
					seconds--;
				};

				this.setState({
					time: {
						minutes: minutes,
						seconds: seconds
					}
				});

				document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Procrast In Hate`;
			};
		}, 1000);

		this.setState({
			timer: timer,
			state: 'running'
		});

		try {
			const sidebarToggle = document.getElementById('sidebarToggle');
			sidebarToggle.checked = true;
			sidebarToggle.onchange();

			document.documentElement.style.setProperty('--color-primary', '#AC9BFA');
			document.documentElement.style.setProperty('--color-secondary', '#CDC1FF');
			document.documentElement.style.setProperty('--color-tertiary', '#260351');
			document.documentElement.style.setProperty('--color-quaternary', '#705BD3');
			document.documentElement.style.setProperty('--color-quinary', '#9885F0');

			document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(-45deg, #9885F0 0%, #AC9BFA 50%, #CDC1FF 62.5%)');

			document.documentElement.style.setProperty('--color-white', '#1F1F1F');
			document.documentElement.style.setProperty('--color-black', '#FFFFFF');
			document.documentElement.style.setProperty('--color-gray', '#260351');
		} catch (error) {
			console.error(error);
		};
	};

	handlePause = () => {
		clearInterval(this.state.timer);
		this.setState({
			timer: null,
			state: 'paused'
		});
	};

	handleReset = () => {
		clearInterval(this.state.timer);
		this.setState({
			timer: null,
			time: {
				minutes: 25,
				seconds: 0
			},
			state: 'stopped'
		});

		document.title = 'Procrast In Hate';
	};

	render() {
		return (
			<div id='pomodoro'>
				<header>
					<h1>Pomodoro</h1>
				</header>

				<main>
					<div id='timer'>
						<div id='time'>
							<h1 id='minutes'>{this.state.time.minutes.toString().padStart(2, '0')}</h1>
							<h1>:</h1>
							<h1 id='seconds'>{this.state.time.seconds.toString().padStart(2, '0')}</h1>
						</div>
						<div id='controls'>
							{
								this.state.state === 'stopped' ?
									<button onClick={this.handleStart}><h3>Start</h3></button>
									: this.state.state === 'running' ?
										<button onClick={this.handlePause}><h3>Pause</h3></button>
										: this.state.state === 'paused' ?
											<>
												<button onClick={this.handleStart}><h3>Resume</h3></button>
												<button onClick={this.handleReset}><h3>Reset</h3></button>
											</>
											: null
							}
						</div>
					</div>

					<div id='instructions'>
						<h2>Instructions</h2>
						<p>1. Work for 25 minutes.</p>
						<p>2. Take a 5 minute break.</p>
						<p>3. Repeat steps 1 and 2 three more times.</p>
						<p>4. Take a 15 minute break.</p>
					</div>
				</main>
			</div>
		);
	};
};