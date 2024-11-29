import React from 'react';

import '../../styles/dashboard.css';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,
			/** @type {'summary' | 'list' | 'calendar'} */
			view: 'summary'
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
	render() {
		return (
			<div id='home'>
				<header>
					<h1>My Tasks</h1>

					<div>
						<h6>
							{
								this.state.view === 'summary' ? 'Summary' :
									this.state.view === 'list' ? 'List' :
										this.state.view === 'calendar' ? 'Calendar' :
											''
							}
						</h6>
						<div>
							<input type='radio' id='summaryView' name='taskView' defaultChecked />
							<label htmlFor='summaryView'>
								<svg viewBox='0 0 43 38' fill='transparent'>
									<path d='M18.5 1H4.5C3.57174 1 2.6815 1.37753 2.02513 2.04953C1.36875 2.72154 1 3.63297 1 4.58333V33.25C1 34.2004 1.36875 35.1118 2.02513 35.7838C2.6815 36.4558 3.57174 36.8333 4.5 36.8333H25.5C26.4283 36.8333 27.3185 36.4558 27.9749 35.7838C28.6312 35.1118 29 34.2004 29 33.25V23.175M18.5 1L29 11.75M18.5 1V11.75H29M29 11.75V12.0629M22 20.7083H8M22 27.875H8M11.5 13.5417H8M38.8528 17.1257L33.7088 10.6763M38.8528 17.1257L41.6168 14.9211L36.4729 8.47173L33.7088 10.6763M38.8528 17.1257L38.118 16.2044M33.7088 10.6763L34.4437 11.5976M34.4437 11.5976L38.118 16.2044M34.4437 11.5976L29 12.0629M23.8427 23.8215L28.0931 12.1404L29 12.0629M23.8427 23.8215L29 23.175M23.8427 23.8215L29 19.7081L30.832 18.2469M38.118 16.2044L36.1765 22.2752L29 23.175M30.832 18.2469C30.566 17.9135 30.4271 17.4787 30.4786 17.0214M30.832 18.2469C31.0979 18.5804 31.4909 18.8125 31.9483 18.864M31.9483 18.864C32.863 18.967 33.688 18.309 33.791 17.3943C33.894 16.4796 33.2359 15.6546 32.3213 15.5516C31.4066 15.4486 30.5816 16.1067 30.4786 17.0214M31.9483 18.864C31.0336 18.761 30.3756 17.936 30.4786 17.0214' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</label>

							<input type='radio' id='listView' name='taskView' />
							<label htmlFor='listView'>
								<svg viewBox='0 0 35 39' fill='transparent'>
									<path d='M24.2083 2V8.83333M10.5417 2V8.83333M2 15.6667H32.75M5.41667 5.41667H29.3333C31.2203 5.41667 32.75 6.94636 32.75 8.83333V32.75C32.75 34.637 31.2203 36.1667 29.3333 36.1667H5.41667C3.52969 36.1667 2 34.637 2 32.75V8.83333C2 6.94636 3.52969 5.41667 5.41667 5.41667Z' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</label>
							<input type='radio' id='calendarView' name='taskView' />
							<label htmlFor='calendarView'>
								<svg viewBox='0 0 41 25' fill='transparent'>
									<path d='M12.2083 2H38.75M12.2083 12.5H38.75M12.2083 23H38.75M2 2H2.02042M2 12.5H2.02042M2 23H2.02042' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</label>
						</div>
					</div>
				</header>
			</div>
		);
	};
};