import React from 'react';

import Logo from './Logo';
import Button from './Button';
import Anchor from './Anchor';

const Navbar = (props) => {
	return (
		<header id='navbar'>
			<Logo head='5' />

			<input id='navbarToggle' type='checkbox' />
			<label htmlFor='navbarToggle'>
				<div />
			</label>

			<nav>
				<menu>
					{props.children}
				</menu>

				<menu>
					{!JSON.parse(localStorage.getItem('authentication'))?._id ? <>
						<Anchor
							href='/signIn'
						>
							Sign In
						</Anchor>
						<Button
							label='Sign Up'
							href='/signUp'
						/>
					</> : <>
						<Button
							label='Go to your dashboard'
							href='/dashboard'
						/>
					</>}
				</menu>
			</nav>
		</header>
	);
};

export default Navbar;
