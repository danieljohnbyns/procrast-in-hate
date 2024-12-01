import React from 'react';

import '../../styles/dashboard.css';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,
			/** @type {'summary' | 'calendar' | 'list'} */
			view: 'summary',

			data: {
				calendar: {
					year: new Date().getFullYear(),
					month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()],
					days: [
						{ date: 1, day: 0 },
					]
				},
				tasks: [
					...(() => {
						const tasks = [];
						for (let i = 1; i <= 50; i++) {
							const start = new Date(`${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/2024`);
							const end = new Date(`${start.getMonth() + Math.floor(Math.random() * 2) + 1}/${start.getDate() + Math.floor(Math.random() * 10) + 1}/${start.getFullYear()}`);
							const createDate = new Date(`${new Date().getMonth() - Math.floor(Math.random() * 2) + 1}/${new Date().getDate() - Math.floor(Math.random() * 10) + 1}/${new Date().getFullYear()}`);
							tasks.push({
								id: i,
								title: `Task ${i}`,
								description: `Task ${i} description`,
								dates: {
									start: start.toDateString(),
									end: end.toDateString(),
									create: createDate.toDateString()
								},
								completed: false,
								priority: Math.floor(Math.random() * 3) + 1, // 1, 2, 3
								creatorId: Math.floor(Math.random() * 10) + 1,
								collaborators: [
									...(() => {
										const collaborators = [];
										for (let j = 1; j <= Math.floor(Math.random() * 5) + 1; j++) {
											collaborators.push(Math.floor(Math.random() * 10) + 1);
										};
										return collaborators;
									})()
								],
								checklists: [
									...(() => {
										const items = [];
										for (let j = 1; j <= Math.floor(Math.random() * 5) + 1; j++) {
											items.push({
												id: j,
												item: `Task ${i} checklist item ${j}`,
												completed: Math.random() < 0.5
											});
										};
										return items;
									})()
								],
								project: Math.floor(Math.random() * 1) % 2 === 0 ? null : Math.floor(Math.random() * 10) + 1
							});
						};
						return tasks;
					})()
				],
				projects: [
					...(() => {
						const projects = [];
						for (let i = 1; i <= 10; i++) {
							const start = new Date(`${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/2024`);
							const end = new Date(`${start.getMonth() + Math.floor(Math.random() * 2) + 1}/${start.getDate() + Math.floor(Math.random() * 10) + 1}/${start.getFullYear()}`);
							const createDate = new Date(`${new Date().getMonth() - Math.floor(Math.random() * 2) + 1}/${new Date().getDate() - Math.floor(Math.random() * 10) + 1}/${new Date().getFullYear()}`);
							projects.push({
								id: i,
								title: `Project ${i}`,
								description: `Project ${i} description`,
								dates: {
									start: start.toDateString(),
									end: end.toDateString(),
									create: createDate.toDateString()
								},
								progress: (Math.floor(Math.random() * 100) + 1),
								completed: false,
								priority: Math.floor(Math.random() * 3) + 1, // 1, 2, 3
								creatorId: Math.floor(Math.random() * 10) + 1,
								collaborators: [
									...(() => {
										const collaborators = [];
										for (let j = 1; j <= Math.floor(Math.random() * 5) + 1; j++) {
											collaborators.push(Math.floor(Math.random() * 10) + 1);
										};
										return collaborators;
									})()
								]
							});
						};
						return projects;
					})()
				]
			}
		};
	};
	componentDidMount() {
		console.log(this.state);
		const setMobile = () => {
			this.setState({
				mobile: matchMedia('screen and (max-width: 60rem)').matches
			});
		};

		window.addEventListener('resize', setMobile);
		setMobile();

		const root = document.getElementById('root');
		root.setAttribute('page', 'dashboard');

		const days = [];
		const month = this.state.data.calendar.month;
		const year = this.state.data.calendar.year;
		const firstDay = new Date(`${month} 1, ${year}`).getDay();
		const lastDate = new Date(year, ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month) + 1, 0).getDate();
		const lastDay = new Date(`${month} ${lastDate}, ${year}`).getDay();

		for (let i = 0; i < firstDay; i++) {
			days.push({ date: '', day: i });
		};
		for (let i = 1; i <= lastDate; i++) {
			days.push({ date: i, day: (firstDay + i - 1) % 7 });
		};
		for (let i = 0; i < 6 - lastDay; i++) {
			days.push({ date: '', day: (firstDay + lastDate + i) % 7 });
		};

		this.setState({
			data: {
				...this.state.data,
				calendar: {
					...this.state.data.calendar,
					days
				}
			}
		});
	};
	render() {
		return (
			<div id='home'>
				<header>
					<h1>{this.state.mobile ? 'Tasks' : 'My Tasks'}</h1>

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
							<input
								type='radio'
								id='summaryView'
								name='taskView'
								onChange={() => this.setState({ view: 'summary' })}
								defaultChecked
							/>
							<label htmlFor='summaryView'>
								<svg viewBox='0 0 43 38' fill='transparent'>
									<path d='M18.5 1H4.5C3.57174 1 2.6815 1.37753 2.02513 2.04953C1.36875 2.72154 1 3.63297 1 4.58333V33.25C1 34.2004 1.36875 35.1118 2.02513 35.7838C2.6815 36.4558 3.57174 36.8333 4.5 36.8333H25.5C26.4283 36.8333 27.3185 36.4558 27.9749 35.7838C28.6312 35.1118 29 34.2004 29 33.25V23.175M18.5 1L29 11.75M18.5 1V11.75H29M29 11.75V12.0629M22 20.7083H8M22 27.875H8M11.5 13.5417H8M38.8528 17.1257L33.7088 10.6763M38.8528 17.1257L41.6168 14.9211L36.4729 8.47173L33.7088 10.6763M38.8528 17.1257L38.118 16.2044M33.7088 10.6763L34.4437 11.5976M34.4437 11.5976L38.118 16.2044M34.4437 11.5976L29 12.0629M23.8427 23.8215L28.0931 12.1404L29 12.0629M23.8427 23.8215L29 23.175M23.8427 23.8215L29 19.7081L30.832 18.2469M38.118 16.2044L36.1765 22.2752L29 23.175M30.832 18.2469C30.566 17.9135 30.4271 17.4787 30.4786 17.0214M30.832 18.2469C31.0979 18.5804 31.4909 18.8125 31.9483 18.864M31.9483 18.864C32.863 18.967 33.688 18.309 33.791 17.3943C33.894 16.4796 33.2359 15.6546 32.3213 15.5516C31.4066 15.4486 30.5816 16.1067 30.4786 17.0214M31.9483 18.864C31.0336 18.761 30.3756 17.936 30.4786 17.0214' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</label>

							<input
								type='radio'
								id='calendarView'
								name='taskView'
								onChange={() => this.setState({ view: 'calendar' })}
							/>
							<label htmlFor='calendarView'>
								<svg viewBox='0 0 35 39' fill='transparent'>
									<path d='M24.2083 2V8.83333M10.5417 2V8.83333M2 15.6667H32.75M5.41667 5.41667H29.3333C31.2203 5.41667 32.75 6.94636 32.75 8.83333V32.75C32.75 34.637 31.2203 36.1667 29.3333 36.1667H5.41667C3.52969 36.1667 2 34.637 2 32.75V8.83333C2 6.94636 3.52969 5.41667 5.41667 5.41667Z' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</label>
							<input
								type='radio'
								id='listView'
								name='taskView'
								onChange={() => this.setState({ view: 'list' })}
							/>
							<label htmlFor='listView'>
								<svg viewBox='0 0 41 25' fill='transparent'>
									<path d='M12.2083 2H38.75M12.2083 12.5H38.75M12.2083 23H38.75M2 2H2.02042M2 12.5H2.02042M2 23H2.02042' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</label>
						</div>
						
						<div id='createButton' />
					</div>
				</header>

				{
					this.state.view === 'summary' ? (
						<main id='summaryViewPanel'>
							<div id='summaryCalendarPanel'>
								<header id='summaryCalendarHeader'>
									<h5>{this.state.data.calendar.month} {this.state.data.calendar.year}</h5>

									<div>
										<span
											onClick={() => {
												const monthName = this.state.data.calendar.month;
												const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);

												const days = [];
												const year = this.state.data.calendar.year;
												const firstDay = new Date(`${monthName} 1, ${year}`).getDay();
												const lastDate = new Date(year, month, 0).getDate();
												const lastDay = new Date(`${monthName} ${lastDate}, ${year}`).getDay();

												for (let i = 0; i < firstDay; i++) {
													days.push({ date: '', day: i });
												};
												for (let i = 1; i <= lastDate; i++) {
													days.push({ date: i, day: (firstDay + i - 1) % 7 });
												};
												for (let i = 0; i < 6 - lastDay; i++) {
													days.push({ date: '', day: (firstDay + lastDate + i) % 7 });
												};

												this.setState({
													data: {
														...this.state.data,
														calendar: {
															...this.state.data.calendar,
															month: month === 0 ? 'December' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1],
															year: month === 0 ? this.state.data.calendar.year - 1 : this.state.data.calendar.year,
															days
														}
													}
												});
											}}
										>
											<svg viewBox='0 0 13 14'>
												<path d='M0 6.70222L12.1265 -0.000102353L12.1265 13.4045L0 6.70222Z' fill='var(--color-primary)' />
											</svg>
										</span>
										<span
											onClick={() => {
												const monthName = this.state.data.calendar.month;
												const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);

												const days = [];
												const year = this.state.data.calendar.year;
												const firstDay = new Date(`${monthName} 1, ${year}`).getDay();
												const lastDate = new Date(year, month + 1, 0).getDate();
												const lastDay = new Date(`${monthName} ${lastDate}, ${year}`).getDay();

												for (let i = 0; i < firstDay; i++) {
													days.push({ date: '', day: i });
												};
												for (let i = 1; i <= lastDate; i++) {
													days.push({ date: i, day: (firstDay + i - 1) % 7 });
												};
												for (let i = 0; i < 6 - lastDay; i++) {
													days.push({ date: '', day: (firstDay + lastDate + i) % 7 });
												};

												this.setState({
													data: {
														...this.state.data,
														calendar: {
															...this.state.data.calendar,
															month: month === 11 ? 'January' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month + 1],
															year: month === 11 ? this.state.data.calendar.year + 1 : this.state.data.calendar.year,
															days
														}
													}
												});
											}}
										>
											<svg viewBox='0 0 13 14'>
												<path d='M13 7.29754L0.873493 13.9999L0.873493 0.595215L13 7.29754Z' fill='var(--color-primary)' />
											</svg>
										</span>
									</div>
								</header>

								<div id='summaryCalendarDaysLabel'>
									<span><b>Sun</b></span>
									<span><b>Mon</b></span>
									<span><b>Tue</b></span>
									<span><b>Wed</b></span>
									<span><b>Thu</b></span>
									<span><b>Fri</b></span>
									<span><b>Sat</b></span>
								</div>

								<div id='summaryCalendarDays'>
									{
										this.state.data.calendar.days.map((day, i) => {
											const isToday = new Date().toDateString() === new Date(`${this.state.data.calendar.month} ${day.date}, ${this.state.data.calendar.year}`).toDateString();
											return (
												<span key={i} className={`${isToday ? 'today' : ''} ${day.date === '' ? 'empty' : ''}`} data-day={day.day}>
													<b>{day.date}</b>
												</span>
											);
										})
									}
								</div>
							</div>



							<div id='summaryListPanel'>
								<header id='summaryListHeader'>
									<h5>Tasks</h5>
								</header>

								<div id='summaryListTasks'>
									{
										this.state.data.tasks.slice(0, 6).map((task, i) => (
											<div key={i} data-start={task.dates.start} data-end={task.dates.end} data-priority={task.priority} data-completed={task.completed} data-index={i}>
												<div>
													<input
														type='checkbox'
														id={`task${task.id}`}
														onChange={() => {
															const tasks = this.state.data.tasks.map(t => {
																if (t.id === task.id) {
																	return {
																		...t,
																		completed: !t.completed
																	};
																} else {
																	return t;
																};
															});

															this.setState({
																data: {
																	...this.state.data,
																	tasks
																}
															});
														}}
														defaultChecked={task.completed}
													/>
													<label htmlFor={`task${task.id}`}>{task.title}</label>
												</div>

												<div>
													<span>
														<b>
															{(() => {
																const today = new Date();
																const taskDate = new Date(task.dates.end);

																// Label with "Today" "Tomorrow" "Yesterday" "This week" "Next week" "Last week" "This month" "Next month" "Last month" "Long time ago" "Soon"
																if (today.toDateString() === taskDate.toDateString()) {
																	return 'Today';
																} else if (today.toDateString() === new Date(taskDate.getTime() - 86400000).toDateString()) {
																	return 'Yesterday';
																} else if (today.toDateString() === new Date(taskDate.getTime() + 86400000).toDateString()) {
																	return 'Tomorrow';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() && today.getDate() < taskDate.getDate() && taskDate.getDate() - today.getDate() <= 6) {
																	return 'This week';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() && today.getDate() > taskDate.getDate() && today.getDate() - taskDate.getDate() <= 6) {
																	return 'Last week';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() && today.getDate() < taskDate.getDate() && taskDate.getDate() - today.getDate() <= 13) {
																	return 'Next week';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth()) {
																	return 'This month';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() - 1) {
																	return 'Last month';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() + 1) {
																	return 'Next month';
																} else if (today.getFullYear() === taskDate.getFullYear()) {
																	return 'Soon';
																} else {
																	return 'Long time ago';
																};
															})()}
														</b>
													</span>
												</div>
											</div>
										))
									}
								</div>

								<div
									style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 0' }}
								>
									<h6
										style={{ cursor: 'pointer' }}
										onClick={() => {
											const listView = document.getElementById('listView');
											listView.click()
										}}
									>
										View ALl Tasks
									</h6>
								</div>
							</div>



							<div id='summaryProjectPanel'>
								<header id='summaryProjectListHeader'>
									<h5>Projects</h5>
								</header>

								<div id='summaryProjectList'>
									{
										this.state.data.projects.map((project, i) => (
											<article key={i}>
												<header>
													<h6>{project.title}</h6>

													<span>
														{project.completed ? 'Completed' : 'In progress'}
													</span>
												</header>

												<div>
													<p>{project.description}</p>

													<div>
														<progress value={project.progress} max='100' />
														<h6>{project.progress}% complete</h6>
													</div>
												</div>

												<footer>
													<span>
														<b>
															Due {(() => {
																const today = new Date();
																const projectDate = new Date(project.dates.end);

																// Label with "Today" "Tomorrow" "Yesterday" "This week" "Next week" "Last week" "This month" "Next month" "Last month" "Long time ago" "Soon"
																if (today.toDateString() === projectDate.toDateString()) {
																	return 'today';
																} else if (today.toDateString() === new Date(projectDate.getTime() - 86400000).toDateString()) {
																	return 'yesterday';
																} else if (today.toDateString() === new Date(projectDate.getTime() + 86400000).toDateString()) {
																	return 'tomorrow';
																} else if (today.getFullYear() === projectDate.getFullYear() && today.getMonth() === projectDate.getMonth() && today.getDate() < projectDate.getDate() && projectDate.getDate() - today.getDate() <= 6) {
																	return 'this week';
																} else if (today.getFullYear() === projectDate.getFullYear() && today.getMonth() === projectDate.getMonth() && today.getDate() > projectDate.getDate() && today.getDate() - projectDate.getDate() <= 6) {
																	return 'last week';
																} else if (today.getFullYear() === projectDate.getFullYear() && today.getMonth() === projectDate.getMonth() && today.getDate() < projectDate.getDate() && projectDate.getDate() - today.getDate() <= 13) {
																	return 'next week';
																} else if (today.getFullYear() === projectDate.getFullYear() && today.getMonth() === projectDate.getMonth()) {
																	return 'this month';
																} else if (today.getFullYear() === projectDate.getFullYear() && today.getMonth() === projectDate.getMonth() - 1) {
																	return 'last month';
																} else if (today.getFullYear() === projectDate.getFullYear() && today.getMonth() === projectDate.getMonth() + 1) {
																	return 'next month';
																} else if (today.getFullYear() === projectDate.getFullYear()) {
																	return 'soon';
																} else {
																	return 'long time ago';
																};
															})()}
														</b>
													</span>
												</footer>
											</article>
										))
									}
								</div>
							</div>
						</main>
					) : null
				}

				{
					this.state.view === 'calendar' ? (
						<main id='calendarViewPanel'>
							<div id='calendarPanel'>
								<header id='calendarHeader'>
									<h5>{this.state.data.calendar.month} {this.state.data.calendar.year}</h5>

									<div>
										<span
											onClick={() => {
												const monthName = this.state.data.calendar.month;
												const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);

												const days = [];
												const year = this.state.data.calendar.year;
												const firstDay = new Date(`${monthName} 1, ${year}`).getDay();
												const lastDate = new Date(year, month, 0).getDate();
												const lastDay = new Date(`${monthName} ${lastDate}, ${year}`).getDay();

												for (let i = 0; i < firstDay; i++) {
													days.push({ date: '', day: i });
												};
												for (let i = 1; i <= lastDate; i++) {
													days.push({ date: i, day: (firstDay + i - 1) % 7 });
												};
												for (let i = 0; i < 6 - lastDay; i++) {
													days.push({ date: '', day: (firstDay + lastDate + i) % 7 });
												};

												this.setState({
													data: {
														...this.state.data,
														calendar: {
															...this.state.data.calendar,
															month: month === 0 ? 'December' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1],
															year: month === 0 ? this.state.data.calendar.year - 1 : this.state.data.calendar.year,
															days
														}
													}
												});
											}}
										>
											<svg viewBox='0 0 13 14'>
												<path d='M0 6.70222L12.1265 -0.000102353L12.1265 13.4045L0 6.70222Z' fill='var(--color-primary)' />
											</svg>
										</span>
										<span
											onClick={() => {
												const monthName = this.state.data.calendar.month;
												const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);

												const days = [];
												const year = this.state.data.calendar.year;
												const firstDay = new Date(`${monthName} 1, ${year}`).getDay();
												const lastDate = new Date(year, month + 1, 0).getDate();
												const lastDay = new Date(`${monthName} ${lastDate}, ${year}`).getDay();

												for (let i = 0; i < firstDay; i++) {
													days.push({ date: '', day: i });
												};
												for (let i = 1; i <= lastDate; i++) {
													days.push({ date: i, day: (firstDay + i - 1) % 7 });
												};
												for (let i = 0; i < 6 - lastDay; i++) {
													days.push({ date: '', day: (firstDay + lastDate + i) % 7 });
												};

												this.setState({
													data: {
														...this.state.data,
														calendar: {
															...this.state.data.calendar,
															month: month === 11 ? 'January' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month + 1],
															year: month === 11 ? this.state.data.calendar.year + 1 : this.state.data.calendar.year,
															days
														}
													}
												});
											}}
										>
											<svg viewBox='0 0 13 14'>
												<path d='M13 7.29754L0.873493 13.9999L0.873493 0.595215L13 7.29754Z' fill='var(--color-primary)' />
											</svg>
										</span>
									</div>
								</header>

								<div id='calendarDaysLabel'>
									<span><b>Sun</b></span>
									<span><b>Mon</b></span>
									<span><b>Tue</b></span>
									<span><b>Wed</b></span>
									<span><b>Thu</b></span>
									<span><b>Fri</b></span>
									<span><b>Sat</b></span>
								</div>

								<div id='calendarDays'>
									{
										this.state.data.calendar.days.map((day, i) => {
											const isToday = new Date().toDateString() === new Date(`${this.state.data.calendar.month} ${day.date}, ${this.state.data.calendar.year}`).toDateString();
											return (
												<span key={i} className={`${isToday ? 'today' : ''} ${day.date === '' ? 'empty' : ''}`} data-day={day.day}>
													<b>{day.date}</b>
												</span>
											);
										})
									}
								</div>
							</div>
						</main>
					) : null
				}

				{
					this.state.view === 'list' ? (
						<main id='listViewPanel'>
							<div id='listPanel'>
								<header id='listViewHeader'>
									<h5>Tasks</h5>
								</header>

								<div id='listViewTasks'>
									{
										this.state.data.tasks.map((task, i) => (
											<div key={i} data-start={task.dates.start} data-end={task.dates.end} data-priority={task.priority} data-completed={task.completed} data-index={i}>
												<div>
													<input
														type='checkbox'
														id={`task${task.id}`}
														onChange={() => {
															const tasks = this.state.data.tasks.map(t => {
																if (t.id === task.id) {
																	return {
																		...t,
																		completed: !t.completed
																	};
																} else {
																	return t;
																};
															});

															this.setState({
																data: {
																	...this.state.data,
																	tasks
																}
															});
														}}
														defaultChecked={task.completed}
													/>
													<label htmlFor={`task${task.id}`}><h6>{task.title}</h6></label>
												</div>

												<div>
													<span>
														<i>
															{task.description}
														</i>
													</span>
												</div>

												<div>
													<span>
														<b>
															Due {(() => {
																const today = new Date();
																const taskDate = new Date(task.dates.end);

																// Label with "Today" "Tomorrow" "Yesterday" "This week" "Next week" "Last week" "This month" "Next month" "Last month" "Long time ago" "Soon"
																if (today.toDateString() === taskDate.toDateString()) {
																	return 'today';
																} else if (today.toDateString() === new Date(taskDate.getTime() - 86400000).toDateString()) {
																	return 'yesterday';
																} else if (today.toDateString() === new Date(taskDate.getTime() + 86400000).toDateString()) {
																	return 'tomorrow';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() && today.getDate() < taskDate.getDate() && taskDate.getDate() - today.getDate() <= 6) {
																	return 'this week';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() && today.getDate() > taskDate.getDate() && today.getDate() - taskDate.getDate() <= 6) {
																	return 'last week';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() && today.getDate() < taskDate.getDate() && taskDate.getDate() - today.getDate() <= 13) {
																	return 'next week';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth()) {
																	return 'this month';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() - 1) {
																	return 'last month';
																} else if (today.getFullYear() === taskDate.getFullYear() && today.getMonth() === taskDate.getMonth() + 1) {
																	return 'next month';
																} else if (today.getFullYear() === taskDate.getFullYear()) {
																	return 'soon';
																} else {
																	return 'long time ago';
																};
															})()}
														</b>
													</span>

													<span>
														<b>
															{(() => {
																const today = new Date();
																const taskDate = new Date(task.dates.end);

																const diffTime = Math.abs(taskDate - today);
																const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

																return `${diffDays} days left`;
															})()}
														</b>
													</span>
												</div>
											</div>
										))
									}
								</div>
							</div>
						</main>
					) : null
				}
			</div>
		);
	};
};