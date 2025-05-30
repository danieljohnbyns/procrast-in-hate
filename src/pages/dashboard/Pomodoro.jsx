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

			timer: {
				minutes: 25,
				seconds: 0,

				/**
				 * @type {'running' | 'paused' | 'stopped'}
				 */
				state: 'stopped'
			},

			pomodoro: {
				minutes: 25,
				seconds: 0
			},

			shortBreak: {
				minutes: 5,
				seconds: 0
			},

			longBreak: {
				minutes: 15,
				seconds: 0
			},

			/**
			 * @type {'pomodoro' | 'shortBreak' | 'longBreak'}
			 */
			mode: 'pomodoro'
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

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker?.addEventListener('message', event => {
				if (event.data.type === 'TIMER_UPDATE') {
					this.setState({
						timer: {
							...this.state.timer,
							minutes: event.data.minutes,
							seconds: event.data.seconds,
							state: event.data.state
						}
					});
				};
			});
		};
	};

	handleStart() {
		this.setState({
			timer: {
				...this.state.timer,
				state: 'running'
			}
		});

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker?.controller.postMessage({
				type: 'TIMER_START'
			});
		};
	};

	handlePause() {
		this.setState({
			timer: {
				...this.state.timer,
				state: 'paused'
			}
		});

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker?.controller.postMessage({
				type: 'TIMER_PAUSE'
			});
		};
	};

	handleResume() {
		this.setState({
			timer: {
				...this.state.timer,
				state: 'running'
			}
		});

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker?.controller.postMessage({
				type: 'TIMER_RESUME'
			});
		};
	};

	handleReset() {
		this.setState({
			timer: {
				...this.state.timer,
				state: 'stopped'
			}
		});

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker?.controller.postMessage({
				type: 'TIMER_RESET'
			});
		};
	};

	handleSetMode(mode) {
		this.setState({
			mode
		});

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker?.controller.postMessage({
				type: 'TIMER_RESET',
				minutes: this.state[mode].minutes,
				seconds: this.state[mode].seconds
			});
		};
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
					<div id='mode'>
						<h6>Mode</h6>
						<select
							value={this.state.mode}
							onChange={async (e) => {
								await this.setState({ mode: e.target.value })
								
								this.handleSetMode(this.state.mode);
							}}

							disabled={this.state.timer.state !== 'stopped'}
						>
							<option value='pomodoro'>Pomodoro</option>
							<option value='shortBreak'>Short Break</option>
							<option value='longBreak'>Long Break</option>
						</select>
					</div>

					<div id='timer'>
						<div id='time'>
							<h1 id='minutes'>{this.state.timer.minutes.toString().padStart(2, '0')}</h1>
							<h1>:</h1>
							<h1 id='seconds'>{this.state.timer.seconds.toString().padStart(2, '0')}</h1>
						</div>
						<div id='controls'>
							{
								this.state.timer.state === 'stopped' ?
									<Button
										text='Start'
										head='4'
										onClick={() => { this.handleStart() }}
									>Start</Button>
									: this.state.timer.state === 'running' ?
										<Button
											text='Pause'
											head='4'
											onClick={() => { this.handlePause() }}
										>Pause</Button>
										: this.state.timer.state === 'paused' ?
											<>
												<Button
													text='Resume'
													head='4'
													onClick={() => { this.handleResume() }}
												>Resume</Button>
												<Button
													text='Reset'
													head='4'
													onClick={() => { this.handleReset() }}
												>Reset</Button>
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
						<p>3. Repeat steps 1 and 2 three more times.</p>
						<p>4. Take a 15 minute break.</p>
					</div>
				</main>
			</div>
		);
	};
};