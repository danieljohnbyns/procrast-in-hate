import React from 'react';

import Anchor from './Anchor';

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
		<div
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
				<Anchor className='active'>
					<svg viewBox='0 0 48 48' fill='transparent'>
						<path d='M18 44V24H30V44M6 18L24 4L42 18V40C42 41.0609 41.5786 42.0783 40.8284 42.8284C40.0783 43.5786 39.0609 44 38 44H10C8.93913 44 7.92172 43.5786 7.17157 42.8284C6.42143 42.0783 6 41.0609 6 40V18Z' stroke='var(--color-primary)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' />
					</svg>
					Home
				</Anchor>
				<Anchor>
					<svg viewBox='0 0 48 48' fill='transparent'>
						<path d='M18 44V24H30V44M6 18L24 4L42 18V40C42 41.0609 41.5786 42.0783 40.8284 42.8284C40.0783 43.5786 39.0609 44 38 44H10C8.93913 44 7.92172 43.5786 7.17157 42.8284C6.42143 42.0783 6 41.0609 6 40V18Z' stroke='var(--color-primary)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' />
					</svg>
					Notification
				</Anchor>
			</div>
		</div>
	);
};

export default Sidebar;
