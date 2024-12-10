import React from 'react';

import '../../styles/index.css';
import '../../styles/dashboard.css'
import '../../styles/dashboard/pomodoro.css';

import Button from '../../components/Button';

export default class Pomodoro extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			pomodoro: {
				time: {
					minutes: 25,
					seconds: 0
				},
				/**
				 * @type {'paused' | 'running' | 'stopped'}
				 */
				state: 'stopped'
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
		root.setAttribute('page', 'dashboard');

		try {
			navigator.serviceWorker.controller.postMessage({
				type: 'POMODORO_GET'
			});
		} catch (error) {
			console.error(error);
		};

		navigator.serviceWorker.addEventListener('message', (event) => {
			if (event.data) {
				if (event.data.type === 'POMODORO_UPDATE') {
					this.setState({
						pomodoro: {
							time: event.data.time,
							state: event.data.state
						}
					});

					if (event.data.state === 'running') {
						document.documentElement.style.setProperty('--color-primary', '#AC9BFA');
						document.documentElement.style.setProperty('--color-secondary', '#CDC1FF');
						document.documentElement.style.setProperty('--color-tertiary', '#260351');
						document.documentElement.style.setProperty('--color-quaternary', '#705BD3');
						document.documentElement.style.setProperty('--color-quinary', '#9885F0');

						document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(-45deg, #9885F0 0%, #AC9BFA 50%, #CDC1FF 62.5%)');

						document.documentElement.style.setProperty('--color-white', '#1F1F1F');
						document.documentElement.style.setProperty('--color-black', '#FFFFFF');
						document.documentElement.style.setProperty('--color-gray', '#260351');
					} else {
						document.documentElement.style.setProperty('--color-primary', '#260351');
						document.documentElement.style.setProperty('--color-secondary', '#705BD3');
						document.documentElement.style.setProperty('--color-tertiary', '#9885F0');
						document.documentElement.style.setProperty('--color-quaternary', '#AC9BFA');
						document.documentElement.style.setProperty('--color-quinary', '#CDC1FF');

						document.documentElement.style.setProperty('--gradient-primary', 'linear-gradient(-45deg, #9885F0 0%, #AC9BFA 50%, #CDC1FF 62.5%)');

						document.documentElement.style.setProperty('--color-white', '#FFFFFF');
						document.documentElement.style.setProperty('--color-black', '#000000');
						document.documentElement.style.setProperty('--color-gray', '#F1F1F1');
					};
				} else if (event.data.type === 'POMODORO_STOP') {
					this.setState({
						pomodoro: {
							time: event.data.time,
							state: event.data.state
						}
					});
				};
			};
		});
	};

	Pomodoro_HandleStart = () => {
		navigator.serviceWorker.controller.postMessage({
			type: 'POMODORO_START'
		});
	};
	Pomodoro_HandlePause = () => {
		navigator.serviceWorker.controller.postMessage({
			type: 'POMODORO_PAUSE'
		});
	};
	Pomodoro_HandleReset = () => {
		navigator.serviceWorker.controller.postMessage({
			type: 'POMODORO_STOP'
		});
	};

	render() {
		return (
			<div id='pomodoro'>
				<header>
					{
						!this.props.offline ?
							<h1>Pomodoro</h1>
							: <h1>Offline</h1>
					}
				</header>

				<main>
					<div id='timer'>
						<div id='time'>
							<h1 id='minutes'>{this.state.pomodoro.time.minutes.toString().padStart(2, '0')}</h1>
							<h1>:</h1>
							<h1 id='seconds'>{this.state.pomodoro.time.seconds.toString().padStart(2, '0')}</h1>
						</div>
						<div id='controls'>
							{
								this.state.pomodoro.state === 'stopped' ?
									<button onClick={this.Pomodoro_HandleStart}><h3>Start</h3></button>
									: this.state.pomodoro.state === 'running' ?
										<button onClick={this.Pomodoro_HandlePause}><h3>Pause</h3></button>
										: this.state.pomodoro.state === 'paused' ?
											<>
												<button onClick={this.Pomodoro_HandleStart}><h3>Resume</h3></button>
												<button onClick={this.Pomodoro_HandleReset}><h3>Reset</h3></button>
											</>
											: null
							}
						</div>
					</div>

					<div id='instructions'>
						{this.props.offline ?
							<>
								<h2>Offline</h2>
								<p>You are currently offline. Please check your internet connection and try again.</p>
								<Button
									text='Try Again'
									onClick={() => window.location.reload()}
								>Retry</Button>
								<p>For the meantime, here are the instructions for the Pomodoro Technique:</p>
							</>
							: null}
						<h2>Instructions</h2>
						<p>1. Work for 25 minutes.</p>
						<p>2. Take a 5 minute break.</p>
						<p>3. Repeat.</p>
					</div>
				</main>
			</div>
		);
	};
};