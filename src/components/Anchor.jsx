import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @type {(props: {
 * 		href: String,
 * 		target: '_blank' | '_self',
 * 		rel: 'noopener noreferrer' | 'noreferrer',
 * 		head: '6' | '5' | '4' | '3' | '2' | '1',
 * 		theme: 'dark' | 'light',
 * 		active: Boolean,
 * 		className: String,
 * 		children: JSX.Element
 * }) => JSX.Element}
 */
const Anchor = ({
	href,
	target,
	rel,
	head = '6',
	theme,
	active,
	className,
	children
}) => {
	const anchor = (
		<Link
			href={href}
			target={target}
			rel={rel}
			className={`anchor ${className} ${theme === 'light' ? 'light' : 'dark'} ${active ? 'active' : ''}`}

			style={{
				fontFamily: active ? 'Montserrat, sans-serif !important' : 'inhert'
			}}
		>
			{children}
		</Link>
	);

	return (
		<>
			{
				head === '6' ? <h6>{anchor}</h6> :
					head === '5' ? <h5>{anchor}</h5> :
						head === '4' ? <h4>{anchor}</h4> :
							head === '3' ? <h3>{anchor}</h3> :
								head === '2' ? <h2>{anchor}</h2> :
									head === '1' ? <h1>{anchor}</h1> :
										<h5>{anchor}</h5>
			}
		</>
	);
};

export default Anchor;
