import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @type {(props: {
 * 		href: String,
 * 		head: '6' | '5' | '4' | '3' | '2' | '1',
 * 		theme: 'dark' | 'light',
 * 		className: String,
 * 		active: Boolean,
 *		icon?: JSX.Element,
 *		minimized?: Boolean,
 * 		children: JSX.Element
 * }) => JSX.Element}
 */
const Tab = ({
	href,
	head = '6',
	theme,
	className,
	active,
	icon,
	minimized,
	children,
	...props
}) => {
	const tab = (
		<Link
			href={href}
			to={href}
			className={`tab ${className} ${theme === 'light' ? 'light' : 'dark'} ${active ? 'active' : ''} ${minimized ? 'minimized' : ''}`}
		>
			{icon}
			<span>{children}</span>
		</Link>
	);

	return (
		<>
			{
				head === '6' ? <h6>{tab}</h6> :
					head === '5' ? <h5>{tab}</h5> :
						head === '4' ? <h4>{tab}</h4> :
							head === '3' ? <h3>{tab}</h3> :
								head === '2' ? <h2>{tab}</h2> :
									head === '1' ? <h1>{tab}</h1> :
										<h5>{tab}</h5>
			}
		</>
	);
};

export default Tab;