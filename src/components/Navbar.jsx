import React from 'react';

import Logo from './Logo';
import Button from './Button';
import Anchor from './Anchor';

const Navbar = (props) => {
	return (
		<header id='navbar'>
			<Logo head='5' />

			<nav>
				<menu>
					{props.children}
				</menu>

				<menu>
					<Anchor href='/signIn'>
						Sign In
					</Anchor>
					<Button
						label='Sign Up'
						href='/signUp'
					/>
				</menu>
			</nav>
		</header>
	);
};

export default Navbar;
