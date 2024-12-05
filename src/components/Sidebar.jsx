import React from 'react';

import Tab from './Tab';

import globals from '../utils/globals';

/**
 * @type {(props: {
 * 		children: React.ReactNode,
 * }) => JSX.Element}
 */
const Sidebar = ({
	children,
	...props
}) => {
	const [profile, setProfile] = React.useState();
	const [name, setName] = React.useState();
	const [email, setEmail] = React.useState();

	React.useEffect(() => {
		if (!localStorage.getItem('authentication')) {
			window.location.href = '/signIn';
		};
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;
		fetch(`${globals.API_URL}/users/${_id}`)
			.then((response) => response.json())
			.then((data) => {
				setProfile(data.profile || 'https://via.placeholder.com/200');
				setName(data.name);
				setEmail(data.email);
			}).catch((error) => {
				console.error('Error:', error);
			});
	}, []);

	return (
		<>
			<input type='checkbox' id='sidebarToggle' />
			<label id='sidebarToggleIcon' htmlFor='sidebarToggle' />

			<aside
				id='sidebar'
			>
				<div>
					<img src={profile} alt='Profile' />

					<div>
						<h6>{name}</h6>
						<p>{email}</p>
					</div>
				</div>

				<div>
					{children}
				</div>

				<div>
					<Tab
						icon={
							<svg viewBox='0 0 48 48' fill='transparent'>
								<path d='M18 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H18M32 34L42 24M42 24L32 14M42 24H18' stroke='var(--color-primary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						}
						onClick={() => {
							localStorage.removeItem('authentication');
							window.location.href = '/signIn';
						}}
					>Sign Out</Tab>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
