import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import globals from '../../utils/globals';

import '../../styles/dashboard/project.css';

export default class Projects extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			data: {
				projects: []
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

		this.fetchProjects();

		window.showProject = this.showProject;
	};
	fetchProjects = async () => {
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;

		const response = await fetch(`${globals.API_URL}/projects/user/${_id}`);

		if (!response.ok) {
			return;
		};

		const projects = await response.json();

		const withProgress = [];

		for (const project of projects) {
			const response = await fetch(`${globals.API_URL}/projects/${project._id}/progress`);
			if (!response.ok) {
				return;
			};

			const progress = (await response.json()).progress;
			withProgress.push({
				...project,
				progress: progress
			});
		};
		console.log(withProgress);

		this.setState({
			data: {
				projects: projects
			}
		});
	};

	showProject = async (id) => {
		const response = await fetch(`${globals.API_URL}/projects/${id}`);

		if (!response.ok) {
			return;
		};
		const project = await response.json();

		withReactContent(Swal).fire({
			title: project.title,
			html: <ProjectDetails id={id} />,
			heightAuto: false,
			showClass: {
				popup: `fadeIn`
			},
			hideClass: {
				popup: `fadeOut`
			},
			showCloseButton: true,
			showCancelButton: true,
			showDenyButton: true,
			confirmButtonText: !project.completed ? <h6 style={{ color: 'var(--color-white)' }}>Mark as Complete</h6> : <h6 style={{ color: 'var(--color-white)' }}>Mark as Incomplete</h6>,
			denyButtonText: <h6 style={{ color: 'var(--color-white)' }}>Delete</h6>,
			cancelButtonText: <h6 style={{ color: 'var(--color-white)' }}>Close</h6>,
			preDeny: async () => {
				const response = await fetch(`${globals.API_URL}/projects/${id}`, {
					method: 'DELETE'
				});
				if (response.ok) {
					Swal.fire({
						icon: 'success',
						title: '<h1>Success</h1>',
						text: 'Project deleted',
						showClass: {
							popup: `fadeIn`
						},
						hideClass: {
							popup: `fadeOut`
						},
						timer: 2000,
						timerProgressBar: true
					});
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
			},
			preConfirm: async () => {
				const response = await fetch(`${globals.API_URL}/projects/${id}/${project.completed ? 'false' : 'true'}`, {
					method: 'PATCH'
				});

				if (!response.ok) {
					Swal.showValidationMessage('An error occurred');
					return;
				};
			}
		}).then((result) => {
			this.fetchProjects();
		});
	};

	render() {
		return (
			<div id='projects'>
				<header>
					<h1>{this.state.mobile ? 'Projects' : 'My Projects'}</h1>

					<div>
						<div
							id='createButton'
							onClick={() => {
								withReactContent(Swal).fire({
									title: 'Create Project',
									html: (
										<form id='createProjectForm'>
											<div>
												<label for='projectTitle'>Title</label>
												<input type='text' id='projectTitle' required />
											</div>
											<div>
												<label for='projectDescription'>Description</label>
												<textarea id='projectDescription' required></textarea>
											</div>
											<div>
												<label for='projectStartDate'>Start Date</label>
												<input type='datetime-local' id='projectStartDate' required />
											</div>
											<div>
												<label for='projectEndDate'>End Date</label>
												<input type='datetime-local' id='projectEndDate' required />
											</div>
											<div>
												<label for='projectLabel'>Label</label>
												<input type='text' id='projectLabel' required />
											</div>
											<div>
												<label for='projectCollaborators'>Collaborators</label>
												<div>
													<input type='text' id='projectCollaborators' />
													<button
														type='button'
														id='addCollaboratorButton'
														onClick={() => {
															const input = document.getElementById('projectCollaborators');
															const value = input.value.trim();
															if (value) {
																const list = document.getElementById('collaboratorsList');
																const item = document.createElement('p');
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
									confirmButtonText: <h6 style={{ color: 'var(--color - white);' }}>Create</h6>,
									cancelButtonText: <h6 style={{ color: 'var(--color-white);' }}>Cancel</h6>,
									preConfirm: async () => {
										const title = document.getElementById('projectTitle').value.trim();
										const description = document.getElementById('projectDescription').value.trim();
										const startDate = document.getElementById('projectStartDate').value.trim();
										const endDate = document.getElementById('projectEndDate').value.trim();
										const label = document.getElementById('projectLabel').value.trim();
										const collaborators = Array.from(document.getElementById('collaboratorsList').children).map(collaborator => collaborator.innerHTML);

										if (!(title && description && startDate && endDate && label)) {
											Swal.showValidationMessage('All fields are required');
											return;
										};

										const start = new Date(startDate);
										const end = new Date(endDate);

										if (start >= end) {
											Swal.showValidationMessage('End date must be after start date');
											return;
										};

										const _id = JSON.parse(localStorage.getItem('authentication'))._id;

										const project = {
											title: title,
											description: description,
											dates: {
												start: start.toDateString(),
												end: end.toDateString()
											},
											label: label,
											creatorId: _id,
											collaborators: collaborators
										};

										const response = await fetch(`${globals.API_URL}/projects`, {
											method: 'PUT',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify(project)
										});

										if (!response.ok) {
											Swal.showValidationMessage('An error occurred');
											return;
										};

										this.fetchProjects();
									}
								});
							}}
						/>
					</div>
				</header>

				<main>
					{
						this.state.data.projects.map((project, index) => (
							<div
								key={index}
								className='project'
								onClick={() => {
									window.showProject(project._id);
								}}
							>
								<header>
									<h6>{project.title}</h6>
									<span>{project.completed ? 'Completed' : 'In Progress'}</span>
								</header>

								<main>
									<p>{project.description}</p>
								</main>

								<footer>
									<div>
										<sub>Start: {new Date(project.dates.start).toDateString()}</sub>
										<sub>End: {new Date(project.dates.end).toDateString()}</sub>
									</div>

									<div>
										{
											project.collaborators.slice(0, 3).map((collaborator, j) => (
												<img key={j} src={`https://randomuser.me/api/portraits/${Math.floor(Math.random() * 2) % 2 === 1 ? 'men' : 'women'}/${collaborator + Math.floor(Math.random() * 50)}.jpg`} alt='Collaborator' />
											))
										}
										{
											project.collaborators.length > 3 ? (
												<span>+{project.collaborators.length - 3}</span>
											) : null
										}
									</div>
								</footer>
							</div>
						))
					}
				</main>
			</div>
		);
	};
};

class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			/**
			 * @type {{
			 * 		_id: String,
			 * 		title: String,
			 * 		description: String,
			 * 		dates: {
			 * 			start: String,
			 * 			end: String,
			 * 			create: String
			 * 		},
			 * 		label: String,
			 * 		creatorId: String,
			 * 		collaborators: {
			 * 			_id: String,
			 * 			name: String
			 * 		}[],
			 * 		completed: Boolean,
			 * 		progress?: Number
			 * }}
			 */
			project: {
				_id: '',
				title: '',
				description: '',
				dates: {
					start: '',
					end: '',
					create: ''
				},
				label: '',
				creatorId: '',
				collaborators: [],
				completed: false,
				progress: 0
			},
			tasks: [],
			id: this.props.id
		};
	};
	componentDidMount() {
		this.fetchProject();
		this.fetchTask();
	};
	fetchProject = async () => {
		const projectResponse = await fetch(`${globals.API_URL}/projects/${this.state.id}`);

		if (!projectResponse.ok) {
			Swal.fire({
				icon: 'error',
				title: '<h1>Error</h1>',
				text: 'An error occurred',
				showClass: {
					popup: `fadeIn`
				},
				hideClass: {
					popup: `fadeOut`
				}
			});
			return;
		};

		const project = await projectResponse.json();

		const progressResponse = await fetch(`${globals.API_URL}/projects/${this.state.id}/progress`);

		if (!progressResponse.ok) {
			Swal.fire({
				icon: 'error',
				title: '<h1>Error</h1>',
				text: 'An error occurred',
				showClass: {
					popup: `fadeIn`
				},
				hideClass: {
					popup: `fadeOut`
				}
			});
			return;
		};

		const progress = (await progressResponse.json()).progress;
		project.progress = progress;

		this.setState({
			project: project
		});
	};
	fetchTask = async () => {
		const response = await fetch(`${globals.API_URL}/projects/${this.state.id}/tasks`);

		if (!response.ok) {
			Swal.fire({
				icon: 'error',
				title: '<h1>Error</h1>',
				text: 'An error occurred',
				showClass: {
					popup: `fadeIn`
				},
				hideClass: {
					popup: `fadeOut`
				}
			});
			return;
		};

		const tasks = await response.json();

		this.setState({
			tasks: tasks
		});
	};

	
	showTask = async (id, projectId) => {
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
		 * 		projectId: String
		 * }}
		 */
		const task = await response.json();

		withReactContent(Swal).fire({
			title: <h1>{task.title}</h1>,
			html: <TaskDetails task={task} id={id} />,
			showClass: {
				popup: `fadeIn`
			},
			hideClass: {
				popup: `fadeOut`
			},
			confirmButtonText: !task.completed ? <h6 style={{ color: 'var(--color-white)' }}>Mark as Complete</h6> : <h6 style={{ color: 'var(--color-white)' }}>Mark as Incomplete</h6>,
			denyButtonText: <h6 style={{ color: 'var(--color-white)' }}>Delete</h6>,
			cancelButtonText: <h6 style={{ color: 'var(--color-white)' }}>Close</h6>,
			showDenyButton: true,
			showCancelButton: true,
			preDeny: async () => {
				const response = await fetch(`${globals.API_URL}/tasks/${id}`, {
					method: 'DELETE'
				});
				if (response.ok) {
					Swal.fire({
						icon: 'success',
						title: '<h1>Success</h1>',
						text: 'Task deleted',
						showClass: {
							popup: `fadeIn`
						},
						hideClass: {
							popup: `fadeOut`
						},
						timer: 2000,
						timerProgressBar: true
					});
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
			},
			preConfirm: async () => {
				const response = await fetch(`${globals.API_URL}/tasks/${id}/${task.completed ? 'false' : 'true'}`, {
					method: 'PATCH'
				});

				if (!response.ok) {
					Swal.showValidationMessage('An error occurred');
					return;
				};
			}
		}).then((result) => {
			window.showProject(projectId);
		});
	};

	render() {
		return (
			<article id='projectDetails'>
				<aside>
					<header>
						<p>{this.state.project.description}</p>
						<sub>{this.state.project.label}</sub>
					</header>

					<div id='projectProgress'>
						<progress value={this.state.project.progress} max='100' />
						<h6>{this.state.project.progress}%</h6>
					</div>

					<div id='projectCollaborators'>
						<header>
							<h6>Collaborators</h6>

							<div>
								<input type='text' disabled={this.state.project.completed} id='projectCollaboratorInput' placeholder='Add collaborator' />
								<button
									type='button'
									disabled={this.state.project.completed}
									id='projectCollaboratorButton'
									onClick={async () => {
										const input = document.getElementById('projectCollaboratorInput');
										const value = input.value.trim();
										if (!value) return;

										const response = await fetch(`${globals.API_URL}/projects/${this.state.id}/collaborators`, {
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

										await this.fetchProject();
										input.value = '';
									}}
								>
									Add
								</button>
							</div>
						</header>
						<div id='collaboratorsList'>
							{
								this.state.project.collaborators?.length ? this.state.project.collaborators?.map((collaborator, i) => (
									<div key={i}>
										<p>{collaborator.name}</p>
										<sub>{collaborator._id}</sub>
										{(() => {
											const _id = JSON.parse(localStorage.getItem('authentication'))._id;

											if (!this.state.project.collaborators?.find(collab => collab._id === _id)) {
												return (
													<button
														type='button'
														disabled={this.state.project.completed}
														onClick={async () => {
															const response = await fetch(`${globals.API_URL}/projects/${this.state.id}/collaborators/${collaborator._id}`, {
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

															await this.fetchProject();
														}}
													>
														Remove
													</button>
												);
											};
										})()}
									</div>
								)) : <i>No collaborators</i>
							}
						</div>
					</div>
					<footer id='projectDates'>
						<header><h6>Time Frame</h6></header>
						<div id='projectDatesDisplay'>
							{(() => {
								const today = new Date();
								const projectStartDate = new Date(this.state.project.dates.start);
								const projectEndDate = new Date(this.state.project.dates.end);

								today.setSeconds(0);
								projectStartDate.setSeconds(0);
								projectEndDate.setSeconds(0);

								const difference = projectEndDate.getTime() - projectStartDate.getTime();
								return <>
									<progress value={today.getTime() - projectStartDate.getTime()} max={difference} />
									<h6>
										{(() => {
											const remaining = projectEndDate.getTime() - today.getTime();
											const remainingDays = Math.floor(remaining / 86400000);
											const remainingHours = Math.floor(remaining / 3600000);
											const remainingWeeks = Math.floor(remaining / 604800000);

											if (today.getTime() > projectEndDate.getTime()) {
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
						<div id='projectDatesEdit'>
							<div>
								<label htmlFor='projectStartDate'>Start Date</label>
								<input
									type='datetime-local'
									disabled={this.state.project.completed}
									id='projectStartDate'
									defaultValue={this.state.project.dates.start?.split('.')[0]}
									onBlur={async (e) => {
										const input = document.getElementById('projectStartDate');
										const value = input.value;

										if (new Date(value).getTime() > new Date(this.state.project.dates.end).getTime()) {
											Swal.showValidationMessage('Start date cannot be after end date');
											e.target.value = this.state.project.dates.start?.split('.')[0];
											return;
										};

										if (input.value === this.state.project.dates.start) return;

										const response = await fetch(`${globals.API_URL}/projects/${this.state.id}/dates/start`, {
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

										await this.fetchProject();
									}}
								/>
							</div>
							<div>
								<label htmlFor='projectEndDate'>End Date</label>
								<input
									type='datetime-local'
									disabled={this.state.project.completed}
									id='projectEndDate'
									defaultValue={this.state.project.dates.end?.split('.')[0]}
									onBlur={async (e) => {
										const input = document.getElementById('projectEndDate');
										const value = input.value;

										if (new Date(value).getTime() < new Date(this.state.project.dates.start).getTime()) {
											Swal.showValidationMessage('End date cannot be before start date');
											e.target.value = this.state.project.dates.end?.split('.')[0];
											return;
										};

										if (input.value === this.state.project.dates.end) return;

										const response = await fetch(`${globals.API_URL}/projects/${this.state.id}/dates/end`, {
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

										await this.fetchProject();
									}}
								/>
							</div>
						</div>
					</footer>
				</aside>
				<main>
					<header>
						<h6>Tasks</h6>
						<div>
							<div
								id='createTaskButton'
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
													<input type='text' id='taskProject' value={this.state.id} disabled />
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
																	const item = document.createElement('p');
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
														<select id='taskCollaborators'>
															<option value=''>Select a collaborator</option>
															{
																this.state.project.collaborators.map((collaborator, i) => (
																	<option key={i} value={collaborator._id}>{collaborator.name}</option>
																))
															}
														</select>
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
											const projectId = form.querySelector('#taskProject').value;
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
													projectId,
													checklist,
													collaborators,
													creatorId: _id
												})
											});
											if (response.ok) {
												const data = await response.json();
												console.log(data);
												this.fetchProject();
											} else {
												const error = await response.json();
												console.error(error);
												Swal.showValidationMessage(error.message);
											};
										}
									});
								}}
							/>
						</div>
					</header>
					<div id='projectTasks'>
						{
							this.state.tasks.map((task, i) => (
								<div
									key={i}
									className='taskCard'
									onClick={() => this.showTask(task._id, this.state.id)}
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

														// Label with 'Today' 'Tomorrow' 'Yesterday' 'This week' 'Next week' 'Last week' 'This month' 'Next month' 'Last month' 'Long time ago' 'Soon'
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
				</main>
			</article>
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
			 * 		projectId: String
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
				projectId: null
			},
			/**
			 * @type {{
			 * 		_id: String,
			 * 		title: String,
			 * 		description: String,
			 * 		dates: {
			 * 			start: String,
			 * 			end: String,
			 * 			create: String
			 * 		},
			 * 		label: String,
			 * 		creatorId: String,
			 * 		collaborators: {
			 * 			_id: String,
			 * 			name: String
			 * 		}[],
			 * 		completed: Boolean
			 * }}
			 */
			project: {
				_id: '',
				title: '',
				description: '',
				dates: {
					start: '',
					end: '',
					create: ''
				},
				label: '',
				creatorId: '',
				collaborators: [],
				completed: false
			},
			id: props.id
		};
	};

	async componentDidMount() {
		await this.fetchTask();
	};

	fetchTask = async () => {
		const taskResponse = await fetch(`${globals.API_URL}/tasks/${this.state.id}`);
		if (!taskResponse.ok) {
			const error = await taskResponse.json();
			Swal.showValidationMessage(error.message);
			console.error(taskResponse);
			return;
		};

		const taskData = await taskResponse.json();

		if (!taskData.projectId) {
			this.setState({
				task: await taskResponse.json()
			});
			return;
		};

		const projectResponse = await fetch(`${globals.API_URL}/projects/${taskData.projectId}`);
		if (!projectResponse.ok) {
			const error = await projectResponse.json();
			Swal.showValidationMessage(error.message);
			console.error(projectResponse);
			return;
		};

		const projectData = await projectResponse.json();

		this.setState({
			task: taskData,
			project: projectData
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
							<input type='text' disabled={this.state.task.completed} id='taskChecklistInput' placeholder='Add item' />
							<button
								type='button'
								disabled={this.state.task.completed}
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
										Swal.showValidationMessage(error.message);
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
										disabled={this.state.task.completed}
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
												Swal.showValidationMessage(error.message);
												return;
											};

											await this.fetchTask();
										}}
									/>
									<label htmlFor={`checklistItem${item.id}`}><p>{item.item}</p></label>
									<button
										type='button'
										disabled={this.state.task.completed}
										onClick={async () => {
											const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/checklists/${item.id}`, {
												method: 'DELETE'
											});
											if (!response.ok) {
												const error = await response.json();
												console.error(error);
												Swal.showValidationMessage(error.message);
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
							<select id='taskCollaboratorInput' disabled={this.state.task.completed}>
								<option value=''>Add collaborator</option>
								{(() => {
									return this.state.project.collaborators.map((collaborator, i) => (
										this.state.task.collaborators.find(collab => collab._id === collaborator._id) ? null : <option key={i} value={collaborator._id}>{collaborator.name}</option>
									));
								})()}
							</select>
							<button
								type='button'
								disabled={this.state.task.completed}
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
										Swal.showValidationMessage(error.message);
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
									{(() => {
										const _id = JSON.parse(localStorage.getItem('authentication'))._id;

										if (!this.state.task.collaborators?.find(collab => collab._id === _id)) {
											return (
												<button
													type='button'
													disabled={this.state.task.completed}
													onClick={async () => {
														const response = await fetch(`${globals.API_URL}/tasks/${this.state.id}/collaborators/${collaborator._id}`, {
															method: 'DELETE'
														});
														if (!response.ok) {
															const error = await response.json();
															console.error(error);
															Swal.showValidationMessage(error.message);
															return;
														};

														await this.fetchTask();
													}}
												>
													Remove
												</button>
											);
										};
									})()}
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
								disabled={this.state.task.completed}
								id='taskStartDate'
								defaultValue={this.state.task.dates.start?.split('.')[0]}
								onBlur={async (e) => {
									const input = document.getElementById('taskStartDate');
									const value = input.value;

									if (new Date(value).getTime() > new Date(this.state.task.dates.end).getTime()) {
										Swal.showValidationMessage('Start date cannot be after end date');
										e.target.value = this.state.task.dates.start?.split('.')[0];
										return;
									};

									if (input.value === this.state.task.dates.start) return;

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
										Swal.showValidationMessage(error.message);
										this.fetchTask();
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
								disabled={this.state.task.completed}
								id='taskEndDate'
								defaultValue={this.state.task.dates.end?.split('.')[0]}
								onBlur={async (e) => {
									const input = document.getElementById('taskEndDate');
									const value = input.value;

									if (new Date(value).getTime() > new Date(this.state.task.dates.start).getTime()) {
										Swal.showValidationMessage('End date cannot be before start date');
										e.target.value = this.state.task.dates.end?.split('.')[0];
										return;
									};

									if (input.value === this.state.task.dates.end) return;

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
										Swal.showValidationMessage(error.message);
										this.fetchTask();
										return;
									};

									await this.fetchTask();
								}}
							/>
						</div>
					</div>
				</footer>
			</article>
		);
	};
};