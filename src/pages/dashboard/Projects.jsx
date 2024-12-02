import React from 'react';
import Swal from 'sweetalert2';

import '../../styles/dashboard/project.css';

export default class Projects extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			data: {
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

		try {
			const projects = document.querySelectorAll('.project');
			projects[Math.floor(Math.random() * projects.length)].click();
		} catch (error) { };
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
								Swal.fire({
									title: 'Create Project',
									html: `
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
												<input type='date' id='projectStartDate' required />
											</div>
											<div>
												<label for='projectEndDate'>End Date</label>
												<input type='date' id='projectEndDate' required />
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
														onclick="(() => {
															const input = document.getElementById('projectCollaborators');
															const value = input.value.trim();
															if (value) {
																const list = document.getElementById('collaboratorsList');
																const item = document.createElement('div');
																item.innerHTML = value;
																list.appendChild(item);
																input.value = '';
															};
														})()"
													>
														Add
													</button>
													<div id='collaboratorsList'></div>
												</div>
											</div>
										</form>
									`,
									showClass: {
										popup: `fadeIn`
									},
									hideClass: {
										popup: `fadeOut`
									},
									showCancelButton: true,
									confirmButtonText: '<h6 style="color: var(--color-white);">Create</h6>',
									cancelButtonText: '<h6 style="color: var(--color-white);">Cancel</h6>',
									preConfirm: () => {
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
								Swal.fire({
									title: project.title,
									html: `
									<div class='projectDetails'>
										<p>${project.description}</p>
									</div>
									`,
									showClass: {
										popup: `fadeIn`
									},
									hideClass: {
										popup: `fadeOut`
									},
									showCancelButton: true,
									confirmButtonText: '<h6 style="color: var(--color-white);">Close</h6>',
									cancelButtonText: '<h6 style="color: var(--color-white);">Delete</h6>',
									preConfirm: () => {
									}
								});
							}}
						>
							<header>
								<h6>{project.title}</h6>
								<span>{project.completed ? 'Completed' : 'In Progress'}</span>
							</header>

							<main>
								<p>{project.description}</p>

								<div>
									<progress value={project.progress} max='100'></progress>
									<h6>{project.progress}% complete</h6>
								</div>
							</main>

							<footer>
								<div>
									<span>
										Start: {project.dates.start}
									</span>
									<span>
										End: {project.dates.end}
									</span>
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