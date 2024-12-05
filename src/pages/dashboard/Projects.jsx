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
	};
	fetchProjects = async () => {
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;

		const response = await fetch(`${globals.API_URL}/projects/user/${_id}`);

		if (!response.ok) {
			return;
		};

		const projects = await response.json();

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
			cancelButtonText: <h6 style={{ color: 'var(--color-white)' }}>Close</h6>
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
									confirmButtonText: '<h6 style="color: var(--color-white);">Create</h6>',
									cancelButtonText: '<h6 style="color: var(--color-white);">Cancel</h6>',
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
					{this.state.data.projects.map((project, index) => (
						<div
							key={index}
							className='project'
							onClick={() => {
								this.showProject(project._id);
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
									<sub>Start: {project.dates.start}</sub>
									<sub>End: {project.dates.end}</sub>
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
					))}
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
			id: this.props.id
		};
	};
	componentDidMount() {
		this.fetchProject();
	};
	fetchProject = async () => {
		const response = await fetch(`${globals.API_URL}/projects/${this.state.id}`);

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

		const project = await response.json();

		this.setState({
			project: project
		});
	};

	render() {
		return (
			<article id='projectDetails'>
				<main>
					<header>
						<p>{this.state.project.description}</p>
						<sub>{this.state.project.label}</sub>
					</header>

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

										await this.fetchTask();
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

										if (new Date(value).getTime() > new Date(this.state.project.dates.start).getTime()) {
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

										await this.fetchTask();
									}}
								/>
							</div>
						</div>
					</footer>
				</main>
			</article>
		);
	};
};