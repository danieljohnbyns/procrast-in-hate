import React from 'react';

import Logo from './Logo';
import Button from './Button';
import Anchor from './Anchor';

const Navbar = (props) => {
	return (
		<header id='navbar'>
			<Logo />

			<nav>
				{props.children}
			</nav>

			<nav>
				<Anchor href='/signIn'>
					Sign In
				</Anchor>
				<Button
					label='Sign Up'
					href='/signUp'
				/>
			</nav>
		</header>
	);
};

export default Navbar;
