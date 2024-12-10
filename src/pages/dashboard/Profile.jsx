import React from 'react';
import Swal from 'sweetalert2';

import '../../styles/index.css';
import '../../styles/dashboard.css'
import '../../styles/dashboard/profile.css';

import globals from '../../utils/globals';

export default class Profile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			user: {
				profilePicture: null,
				name: '',
				email: ''
			},

			toggle: {
				editName: false,
				editEmail: false
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

		this.fetchUser();
	};

	fetchUser = async () => {
		if (!localStorage.getItem('authentication')) {
			window.location.href = '/signIn';
		};
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;
		const response = await fetch(`${globals.API_URL}/users/${_id}`);
		const data = await response.json();

		this.setState({
			user: {
				profile: data.profilePicture || null,
				name: data.name,
				email: data.email
			}
		});
	};

	updateUser = async () => {
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;
		const response = await fetch(`${globals.API_URL}/users/${_id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': localStorage.getItem('authentication')
			},
			body: JSON.stringify({
				name: this.state.user.name,
				email: this.state.user.email
			})
		});

		if (!response.ok) {
			const data = await response.json();
			await Swal.fire({
				icon: 'error',
				title: 'Error updating user',
				text: data.message
			});
			window.location.reload();
			return;
		};

		await Swal.fire({
			icon: 'success',
			title: 'User updated',
			text: 'Your user has been updated successfully!'
		});
		window.location.reload();
	};

	render() {
		return (
			<div id='profile'>
				<header>
					<h1>Profile</h1>
				</header>

				<main>
					<div id='userProfile'>
						<input
							id='profilePicture'
							type='file'
							accept='image/*'
							onChange={async (e) => {
								const file = e.target.files[0];
								const reader = new FileReader();

								reader.onload = async () => {
									const _id = JSON.parse(localStorage.getItem('authentication'))._id;
									const response = await fetch(`${globals.API_URL}/users/${_id}/profilePicture`, {
										method: 'PATCH',
										headers: {
											'Content-Type': 'application/json',
											'Authentication': localStorage.getItem('authentication')
										},
										body: JSON.stringify({
											image: reader.result
										})
									});

									if (!response.ok) {
										const data = await response.json();
										await Swal.fire({
											icon: 'error',
											title: 'Error updating profile picture',
											text: data.message
										});
										window.location.reload();
										return;
									};

									await Swal.fire({
										icon: 'success',
										title: 'Profile picture updated',
										text: 'Your profile picture has been updated successfully!'
									});
									window.location.reload();
								};

								reader.readAsDataURL(file);
							}}
						/>
						<img src={
							`${globals.API_URL}/users/${JSON.parse(localStorage.getItem('authentication'))._id}/profilePicture`
						} alt='Profile' onClick={() => document.getElementById('profilePicture').click()} />
						<div>
							<h4
								onClick={() => this.setState({
									toggle: {
										...this.state.toggle,
										editName: true
									}
								})}
							>
								{!this.state.toggle.editName ?
									this.state.user.name :
									<input
										type='text'
										defaultValue={this.state.user.name}
										onBlur={async (e) => {
											await this.setState({
												toggle: {
													...this.state.toggle,
													editName: false
												},
												user: {
													...this.state.user,
													name: e.target.value
												}
											});

											this.updateUser();
										}}
										onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
									/>}
							</h4>
							<p
								onClick={() => this.setState({
									toggle: {
										...this.state.toggle,
										editEmail: true
									}
								})}
							>
								{!this.state.toggle.editEmail ?
									this.state.user.email :
									<input
										type='email'
										defaultValue={this.state.user.email}
										onBlur={async (e) => {
											await this.setState({
												toggle: {
													...this.state.toggle,
													editEmail: false
												},
												user: {
													...this.state.user,
													email: e.target.value
												}
											});

											this.updateUser();
										}}
										onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
									/>}
							</p>
						</div>
						<sub><i>Click to field edit</i></sub>
					</div>
				</main>
			</div>
		);
	};
};