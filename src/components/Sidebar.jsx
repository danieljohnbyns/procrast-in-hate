import React from 'react';

import Tab from './Tab';

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
		setProfile('https://via.placeholder.com/200');
		setName('Random na pangalan');
		setEmail('random@na.email');
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
						href='/logout'
						icon={
							<svg viewBox='0 0 48 48' fill='transparent'>
								<path d='M18 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H18M32 34L42 24M42 24L32 14M42 24H18' stroke='var(--color-primary)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' />
							</svg>
						}
					>Logout</Tab>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
