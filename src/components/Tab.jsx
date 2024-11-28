import React from 'react';

/**
 * @type {(props: {
 * 		href: String,
 * 		head: '6' | '5' | '4' | '3' | '2' | '1',
 * 		theme: 'dark' | 'light',
 * 		className: String,
 * 		active: Boolean,
 *		icon?: JSX.Element,
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
	children,
	...props
}) => {
	const tab = (
		<a
			href={href}
			className={`tab ${className} ${theme === 'light' ? 'light' : 'dark'} ${active ? 'active' : ''}`}
		>
			{icon}
			<span>{children}</span>
		</a>
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