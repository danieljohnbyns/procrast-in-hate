import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import '../../styles/dashboard/invitations.css';

import globals from '../../utils/globals';

export default class Invitations extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			data: {
				/**
				 * @type {{
				 * 		type: 'task',
				 * 		_id: String,
				 * 		title: String,
				 * 		description: String,
				 * 		dates: {
				 * 			start: Date,
				 * 			end: Date,
				 * 			create: Date
				 * 		},
				 * 		completed: Boolean,
				 * 		label: String,
				 * 		creatorId: String,
				 * 		collaborators: {
				 * 			_id: String,
				 * 			accepted: Boolean
				 * 		}[],
				 * 		checklist: {
				 * 			id: String,
				 * 			item: String,
				 * 			completed: Boolean
				 * 		}[],
				 * 		projectId: String
				 * }[] || {
				 * 		type: 'project',
				 * 		_id: String,
				 * 		title: String,
				 * 		description: String,
				 * 		dates: {
				 * 			start: Date,
				 * 			end: Date,
				 * 			create: Date
				 * 		},
				 * 		label: String,
				 * 		creatorId: String,
				 * 		collaborators: {
				 * 			_id: String,
				 * 			accepted: Boolean
				 * 		}[],
				 * 		completed: Boolean
				 * }[]
				 * }
				 */
				invitations: []
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
			this.fetchInvitations();
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error fetching invitations',
				text: error.message
			});
		};

		globals.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'UPDATE_DATA') {
				try {
					this.fetchInvitations();
				} catch (error) { };
			};
		});
	};

	fetchInvitations = async () => {
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;
		const response = await fetch(`${globals.API_URL}/users/${_id}/invitations`);

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.message);
		};

		const data = await response.json();

		this.setState({
			data: {
				invitations: data
			}
		});
	};

	render() {
		return (
			<div id='invitations'>
				<header>
					<h1>Invitations</h1>
				</header>

				<main>
					{this.state.data.invitations.length > 0 ? (this.state.data.invitations.map((invitation, index) => {
						return (
							<article key={index}>
								<header>
									<h2>{invitation.title}</h2>
									<p>{invitation.description}</p>
								</header>

								<main>
									<button onClick={async () => {
										withReactContent(Swal).fire({
											title: 'Accept Invitation',
											html: <p>Are you sure you want to accept the invitation to <strong>{invitation.title}</strong>?</p>,
											icon: 'question',
											showCancelButton: true,
											confirmButtonText: 'Accept',
											cancelButtonText: 'Cancel'
										}).then(async (result) => {
											if (!result.isConfirmed) return;

											const _id = JSON.parse(localStorage.getItem('authentication'))._id;
											const response = await fetch(`${globals.API_URL}/users/${_id}/invitations/${invitation.type}/${invitation._id}`, {
												method: 'POST'
											});
	
											if (!response.ok) {
												Swal.fire({
													icon: 'error',
													title: 'Error',
													text: 'An error occurred while accepting the invitation.'
												});
												return;
											};
	
											Swal.fire({
												icon: 'success',
												title: 'Success',
												text: 'The invitation has been accepted.'
											});
	
											this.fetchInvitations();
										});
									}}>Accept</button>
									<button onClick={async () => {
										withReactContent(Swal).fire({
											title: 'Reject Invitation',
											html: <p>Are you sure you want to reject the invitation to <strong>{invitation.title}</strong>?</p>,
											icon: 'question',
											showCancelButton: true,
											confirmButtonText: 'Reject',
											cancelButtonText: 'Cancel'
										}).then(async (result) => {
											const _id = JSON.parse(localStorage.getItem('authentication'))._id;
											const response = await fetch(`${globals.API_URL}/users/${_id}/invitations/${invitation.type}/${invitation._id}`, {
												method: 'DELETE'
											});
	
											if (!response.ok) {
												Swal.fire({
													icon: 'error',
													title: 'Error',
													text: 'An error occurred while rejecting the invitation.'
												});
												return;
											};
	
											Swal.fire({
												icon: 'success',
												title: 'Success',
												text: 'The invitation has been rejected.'
											});
	
											this.fetchInvitations();
										});
									}}>Reject</button>
								</main>

								<footer>
									<img src={`${globals.API_URL}/users/${invitation.creatorId}/profilePicture`} alt='Profile' />
									<p>{invitation.creatorId}</p>
								</footer>
							</article>
						);
					})) : <i>No invitations found</i>}
				</main>
			</div>
		);
	};
};