import React from 'react';

const Anchor = (props) => {
	return (
		<h6>
			<a
				href={props.href}
				target={props.target}
				rel={props.rel}
				className={`anchor ${props.className}`}
			>
				{props.children}
			</a>
		</h6>
	);
};

export default Anchor;
