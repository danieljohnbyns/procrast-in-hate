import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

import '../../styles/dashboard/home.css';

import globals from '../../utils/globals';

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
				tasks: [],
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
								label: ['Personal', 'Work', 'School'][Math.floor(Math.random() * 3)],
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

		this.fetchTasks();

		window.showTask = this.showTask;
	};

	fetchTasks = async () => {
		if (!localStorage.getItem('authentication')) {
			window.location.href = '/signIn';
		};
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;
		fetch(`${globals.API_URL}/tasks/user/${_id}`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({
					data: {
						...this.state.data,
						tasks: data
					}
				});
			});
	};

	showTask = async (id, silent) => {
		const response = await fetch(`${globals.API_URL}/tasks/${id}`);
		if (!response.ok) {
			Swal.fire({
				icon: 'error',
				title: '<h1>Error</h1>',
				text: 'An error occurred while fetching the task',
				showClass: {
					popup: `fadeIn`
				},
				hideClass: {
					popup: `fadeOut`
				}
			});
			console.error(response);
			return;
		};
		/**
		 * @type {{
		 * 		title: String,
		 * 		description: String,
		 * 		dates: {
		 * 			start: String,
		 * 			end: String,
		 * 			create: String
		 * 		},
		 * 		completed: Boolean,
		 * 		label: String,
		 * 		creatorId: String,
		 * 		collaborators: {
		 * 			_id: String,
		 * 			accepted: Boolean
		 * 		}[],
		 * 		checklists: {
		 * 			id: Number,
		 * 			item: String,
		 * 			completed: Boolean
		 * 		}[],
		 * 		project: String
		 * }}
		 */
		const task = await response.json();

		withReactContent(Swal).fire({
			title: <h1>{task.title}</h1>,
			html: <TaskDetails task={task} id={id} />,
			showClass: {
				popup: silent ? '' : `fadeIn`
			},
			hideClass: {
				popup: silent ? '' : `fadeOut`
			},
			confirmButtonText: <h6 style={{ color: 'var(--color-white)' }}>Mark as Done</h6>,
			denyButtonText: <h6 style={{ color: 'var(--color-white)' }}>Delete</h6>,
			cancelButtonText: <h6 style={{ color: 'var(--color-white)' }}>Close</h6>,
			showDenyButton: true,
			showCancelButton: true
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
						
						<div
							id='createButton'
							onClick={() => {
								withReactContent(Swal).fire({
									title: <h1>Create Task</h1>,
									html: (
										<form id='createTaskForm'>
											<div>
												<label htmlFor='taskTitle'>Title</label>
												<input type='text' id='taskTitle' required />
											</div>
											<div>
												<label htmlFor='taskDescription'>Description</label>
												<textarea id='taskDescription' required></textarea>
											</div>
											<div>
												<label htmlFor='taskStartDate'>Start Date</label>
												<input type='datetime-local' id='taskStartDate' required />
											</div>
											<div>
												<label htmlFor='taskEndDate'>End Date</label>
												<input type='datetime-local' id='taskEndDate' required />
											</div>
											<div>
												<label htmlFor='taskLabel'>Label</label>
												<input type='text' id='taskLabel' required />
											</div>
											<div>
												<label htmlFor='taskProject'>Project</label>
												<input type='text' id='taskProject' />
											</div>
											<div>
												<label htmlFor='taskChecklist'>Checklist</label>
												<div>
													<input type='text' id='taskChecklist' />
													<button
														type='button'
														id='addChecklistButton'
														onClick={() => {
															const input = document.getElementById('taskChecklist');
															const value = input.value.trim();
															if (value) {
																const list = document.getElementById('checklistList');
																const item = document.createElement('div');
																item.innerHTML = value;
																list.appendChild(item);
																input.value = '';
															};
														}}
													>
														Add
													</button>
													<div id='checklistList'></div>
												</div>
											</div>
											<div>
												<label htmlFor='taskCollaborators'>Collaborators</label>
												<div>
													<input type='text' id='taskCollaborators' />
													<button
														type='button'
														id='addCollaboratorButton'
														onClick={() => {
															const input = document.getElementById('taskCollaborators');
															const value = input.value.trim();
															if (value) {
																const list = document.getElementById('collaboratorsList');
																const item = document.createElement('div');
																item.innerHTML = value;
																list.appendChild(item);
																input.value = '';
															};
														}}
													>
														Add
													</button>
													<div id='collaboratorsList'></div>
												</div>
											</div>
										</form>
									),
									showClass: {
										popup: `fadeIn`
									},
									hideClass: {
										popup: `fadeOut`
									},
									showCancelButton: true,
									confirmButtonText: <h6 style={{ color: 'var(--color-white)' }}>Create</h6>,
									cancelButtonText: <h6 style={{ color: 'var(--color-white)' }}>Cancel</h6>,
									preConfirm: async () => {
										const form = document.getElementById('createTaskForm');
										const title = form.querySelector('#taskTitle').value;
										const description = form.querySelector('#taskDescription').value;
										const startDate = form.querySelector('#taskStartDate').value;
										const endDate = form.querySelector('#taskEndDate').value;
										const label = form.querySelector('#taskLabel').value;
										const project = form.querySelector('#taskProject').value;
										const checklist = Array.from(form.querySelector('#checklistList').children).map(item => item.innerHTML);
										const collaborators = Array.from(form.querySelector('#collaboratorsList').children).map(item => item.innerHTML);

										if (!title || !description || !startDate || !endDate || !label) {
											Swal.showValidationMessage('All fields are required');
											return;
										};

										const _id = JSON.parse(localStorage.getItem('authentication'))._id;

										const response = await fetch(`${globals.API_URL}/tasks/`, {
											method: 'PUT',
											headers: {
												'Content-Type': 'application/json'
											},
											body: JSON.stringify({
												title,
												description,
												dates: {
													start: startDate,
													end: endDate
												},
												label,
												project,
												checklist,
												collaborators,
												creatorId: _id
											})
										});
										if (response.ok) {
											const data = await response.json();
											console.log(data);
											this.fetchTasks();
										} else {
											const error = await response.json();
											console.error(error);
											Swal.fire({
												icon: 'error',
												title: '<h1>Error</h1>',
												text: error.message,
												showClass: {
													popup: `fadeIn`
												},
												hideClass: {
													popup: `fadeOut`
												}
											});
										};
									}
								});
							}}
						/>
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
											<div
												key={i}
												data-start={new Date(task.dates.start).toDateString()}
												data-end={new Date(task.dates.end).toDateString()}
												data-completed={task.completed}
												onClick={() => this.showTask(task._id)}
											>
												<div>
													<input
														type='checkbox'
														id={`task${task._id}`}
														disabled
														defaultChecked={task.completed}
													/>
													<label htmlFor={`task${task._id}`}>{task.title}</label>
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

													<div>
														{project.label}
													</div>
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
											<div
												key={i}
												className='taskCard'
												onClick={() => this.showTask(task._id)}
											>
												<header>
													<div>
														<input
															type='checkbox'
															id={`task${task._id}`}
															defaultChecked={task.completed}
															disabled
														/>
														<label htmlFor={`task${task._id}`}><h6>{task.title}</h6></label>
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
													</div>
												</header>

												<div>
													<p>{task.description}</p>
												</div>

												<div>
													<h6>Checklist</h6>

													{
														task.checklists?.map((item, j) => (
															<div key={j}>
																<input
																	type='checkbox'
																	id={`task${task._id}Checklist${item.id}`}
																	defaultChecked={item.completed}
																	disabled
																/>
																<label htmlFor={`task${task._id}Checklist${item.id}`}>{item.item}</label>
															</div>
														))
													}
												</div>

												<footer>
													<div>
														<sub>Start: {new Date(task.dates.start).toDateString()}</sub>
														<sub>End: {new Date(task.dates.end).toDateString()}</sub>
													</div>

													<div>
														{
															task.collaborators?.slice(0, 3).map((collaborator, j) => (
																<img key={j} src={`https://randomuser.me/api/portraits/${Math.floor(Math.random() * 2) % 2 === 1 ? 'men' : 'women'}/${collaborator + Math.floor(Math.random() * 50)}.jpg`} alt='Collaborator' />
															))
														}
														{
															task.collaborators.length > 3 ? (
																<span>+{task.collaborators.length - 3}</span>
															) : null
														}
													</div>
												</footer>
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

class TaskDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			
			/**
			 * @type {{
			 * 		title: String,
			 * 		description: String,
			 * 		dates: {
			 * 			start: String,
			 * 			end: String,
			 * 			create: String
			 * 		},
			 * 		completed: Boolean,
			 * 		label: String,
			 * 		creatorId: String,
			 * 		collaborators: {
			 * 			_id: String,
			 * 			accepted: Boolean
			 * 		}[],
			 * 		checklists: {
			 * 			id: Number,
			 * 			item: String,
			 * 			completed: Boolean
			 * 		}[],
			 * 		project: String
			 * }}
			 */
			task: {
				title: null,
				description: null,
				dates: {
					start: null,
					end: null,
					create: null
				},
				completed: null,
				label: null,
				creatorId: null,
				collaborators: [],
				checklists: [],
				project: null
			},
			id: props.id
		};
	};

	async componentDidMount() {
		this.fetchTask();
	};

	fetchTask = async () => {
		const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}`);
		if (!response.ok) {
			Swal.fire({
				icon: 'error',
				title: '<h1>Error</h1>',
				text: 'An error occurred while fetching the task',
				showClass: {
					popup: `fadeIn`
				},
				hideClass: {
					popup: `fadeOut`
				}
			});
			console.error(response);
			return;
		};

		this.setState({
			task: await response.json()
		});
	};

	render() {
		return (
			<article id='taskDetails'>
				<header>
					<p>{this.state.task.description}</p>
					<sub>{this.state.task.label}</sub>
				</header>

				<div id='taskChecklists'>
					<header>
						<h6>Checklist</h6>

						<div>
							<input type='text' id='taskChecklistInput' placeholder='Add item' />
							<button
								type='button'
								id='taskChecklistButton'
								onClick={async () => {
									const input = document.getElementById('taskChecklistInput');
									const value = input.value.trim();
									if (!value) return;

									const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/checklists`, {
										method: 'PUT',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											item: value
										})
									});
									if (!response.ok) {
										const error = await response.json();
										console.error(error);
										Swal.fire({
											icon: 'error',
											title: '<h1>Error</h1>',
											text: error.message,
											showClass: {
												popup: `fadeIn`
											},
											hideClass: {
												popup: `fadeOut`
											}
										});
										return;
									};
									await this.fetchTask();
									input.value = '';
								}}
							>
								Add
							</button>
						</div>
					</header>
					<div id='checklistList'>
						{
							this.state.task.checklists.length ? this.state.task.checklists.map((item, i) => (
								<div key={i}>
									<input
										type='checkbox'
										id={`checklistItem${item.id}`}
										defaultChecked={item.completed}
										onChange={async () => {
											const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/checklists/${item.id}`, {
												method: 'PATCH',
												headers: {
													'Content-Type': 'application/json'
												},
												body: JSON.stringify({
													completed: document.getElementById(`checklistItem${item.id}`).checked
												})
											});
											if (!response.ok) {
												const error = await response.json();
												console.error(error);
												Swal.fire({
													icon: 'error',
													title: '<h1>Error</h1>',
													text: error.message,
													showClass: {
														popup: `fadeIn`
													},
													hideClass: {
														popup: `fadeOut`
													}
												});
												return;
											};

											await this.fetchTask();
										}}
									/>
									<label htmlFor={`checklistItem${item.id}`}><p>{item.item}</p></label>
									<button
										type='button'
										onClick={async () => {
											const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/checklists/${item.id}`, {
												method: 'DELETE'
											});
											if (!response.ok) {
												const error = await response.json();
												console.error(error);
												Swal.fire({
													icon: 'error',
													title: '<h1>Error</h1>',
													text: error.message,
													showClass: {
														popup: `fadeIn`
													},
													hideClass: {
														popup: `fadeOut`
													}
												});
												return;
											};

											await this.fetchTask();
										}}
									>
										Remove
									</button>
								</div>
							)) : <i>No items</i>
						}
					</div>
				</div>
				<div id='taskCollaborators'>
					<header>
						<h6>Collaborators</h6>

						<div>
							<input type='text' id='taskCollaboratorInput' placeholder='Add collaborator' />
							<button
								type='button'
								id='taskCollaboratorButton'
								onClick={async () => {
									const input = document.getElementById('taskCollaboratorInput');
									const value = input.value.trim();
									if (!value) return;

									const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/collaborators`, {
										method: 'PUT',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											collaboratorId: value
										})
									});
									if (!response.ok) {
										const error = await response.json();
										console.error(error);
										Swal.fire({
											icon: 'error',
											title: '<h1>Error</h1>',
											text: error.message,
											showClass: {
												popup: `fadeIn`
											},
											hideClass: {
												popup: `fadeOut`
											}
										});
										return;
									};

									await this.fetchTask();
									input.value = '';
								}}
							>
								Add
							</button>
						</div>
					</header>
					<div id='collaboratorsList'>
						{
							this.state.task.collaborators.length ? this.state.task.collaborators.map((collaborator, i) => (
								<div key={i}>
									<p>{collaborator.name}</p>
									<sub>{collaborator._id}</sub>
									<button
										type='button'
										onClick={async () => {
											const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/collaborators/${collaborator._id}`, {
												method: 'DELETE'
											});
											if (!response.ok) {
												const error = await response.json();
												console.error(error);
												Swal.fire({
													icon: 'error',
													title: '<h1>Error</h1>',
													text: error.message,
													showClass: {
														popup: `fadeIn`
													},
													hideClass: {
														popup: `fadeOut`
													}
												});
												return;
											};

											await this.fetchTask();
										}}
									>
										Remove
									</button>
								</div>
							)) : <i>No collaborators</i>
						}
					</div>
				</div>
				<footer id='taskDates'>
					<header><h6>Time Frame</h6></header>
					<div id='taskDatesDisplay'>
						{(() => {
							const today = new Date();
							const taskStartDate = new Date(this.state.task.dates.start);
							const taskEndDate = new Date(this.state.task.dates.end);

							today.setSeconds(0);
							taskStartDate.setSeconds(0);
							taskEndDate.setSeconds(0);

							const difference = taskEndDate.getTime() - taskStartDate.getTime();
							return <>
								<progress value={today.getTime() - taskStartDate.getTime()} max={difference} />
								<h6>
									{(() => {
										const remaining = taskEndDate.getTime() - today.getTime();
										const remainingDays = Math.floor(remaining / 86400000);
										const remainingHours = Math.floor(remaining / 3600000);
										const remainingWeeks = Math.floor(remaining / 604800000);

										if (today.getTime() > taskEndDate.getTime()) {
											if (remainingWeeks > 0) {
												return `${remainingWeeks} ${remainingWeeks === 1 ? 'week' : 'weeks'} overdue`;
											} else if (remainingDays > 0) {
												return `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} overdue`;
											} else if (remainingHours > 0) {
												return `${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'} overdue`;
											};
										} else {
											if (remainingWeeks > 0) {
												return `${remainingWeeks} ${remainingWeeks === 1 ? 'week' : 'weeks'} remaining`;
											} else if (remainingDays > 0) {
												return `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} remaining`;
											} else if (remainingHours > 0) {
												return `${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'} remaining`;
											};
										};
									})()}
								</h6>
							</>;
						})()}
					</div>
					<div id='taskDatesEdit'>
						<div>
							<label htmlFor='taskStartDate'>Start Date</label>
							<input
								type='datetime-local'
								id='taskStartDate'
								defaultValue={this.state.task.dates.start?.split('.')[0]}
								onBlur={async () => {
									const input = document.getElementById('taskStartDate');
									const value = input.value;

									const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/dates/start`, {
										method: 'PATCH',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											date: value
										})
									});
									if (!response.ok) {
										const error = await response.json();
										console.error(error);
										Swal.fire({
											icon: 'error',
											title: '<h1>Error</h1>',
											text: error.message,
											showClass: {
												popup: `fadeIn`
											},
											hideClass: {
												popup: `fadeOut`
											}
										});
										return;
									};

									await this.fetchTask();
								}}
							/>
						</div>
						<div>
							<label htmlFor='taskEndDate'>End Date</label>
							<input
								type='datetime-local'
								id='taskEndDate'
								defaultValue={this.state.task.dates.end?.split('.')[0]}
								onBlur={async () => {
									const input = document.getElementById('taskEndDate');
									const value = input.value;

									const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/dates/end`, {
										method: 'PATCH',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											date: value
										})
									});
									if (!response.ok) {
										const error = await response.json();
										console.error(error);
										Swal.fire({
											icon: 'error',
											title: '<h1>Error</h1>',
											text: error.message,
											showClass: {
												popup: `fadeIn`
											},
											hideClass: {
												popup: `fadeOut`
											}
										});
										return;
									};

									await this.fetchTask();
								}}
							/>
						</div>
					</div>
				</footer>
			</article>
		)
	};
};