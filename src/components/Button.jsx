import React from 'react';

/**
 * @type {(props: {
 * 		children: React.ReactNode,
 * 		label: React.ReactNode | String,
 * 		type: 'button' | 'callToAction' | 'link',
 * 		head: '6' | '5' | '4' | '3' | '2' | '1',
 * 		href?: String,
 * 		className: String,
 * 		theme: 'light' | 'dark'
 * }) => JSX.Element}
 */
const Button = ({
	children,
	label,
	type,
	head = '6',
	className,
	...props
}) => {
	if (props.href || type === 'link') {
		return (
			<a
				href={props.href}
				className={`button ${className} ${props.theme === 'light' ? 'light' : 'dark'}`}
			>
				{
					head === '6' ? <h6>{children ? children : label}</h6> :
						head === '5' ? <h5>{children ? children : label}</h5> :
							head === '4' ? <h4>{children ? children : label}</h4> :
								head === '3' ? <h3>{children ? children : label}</h3> :
									head === '2' ? <h2>{children ? children : label}</h2> :
										head === '1' ? <h1>{children ? children : label}</h1> :
											<h6>{children ? children : label}</h6>
				}
			</a>
		);
	};
	return (
		<button
			className={`button ${className} ${props.theme === 'light' ? 'light' : 'dark'}`}
		>
			{
				head === '6' ? <h6>{children ? children : label}</h6> :
					head === '5' ? <h5>{children ? children : label}</h5> :
						head === '4' ? <h4>{children ? children : label}</h4> :
							head === '3' ? <h3>{children ? children : label}</h3> :
								head === '2' ? <h2>{children ? children : label}</h2> :
									head === '1' ? <h1>{children ? children : label}</h1> :
										<h6>{children ? children : label}</h6>
			}
		</button>
	);
};

export default Button;
