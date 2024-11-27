import React from 'react';

/**
 * @type {(props: {
 * 		children: React.ReactNode,
 * 		placeholder: String,
 * 		type: 'text' | 'password' | 'email' | 'number',
 * 		className: String,
 * 		value: String,
 * 		onChange: Function,
 * 		required: Boolean
 * }) => JSX.Element}
 */
const Input = ({
	children,
	placeholder,
	type,
	className,
	value,
	onChange,
	required,
	...props
}) => {
	return (
		<input
			placeholder={placeholder}
			type={type}
			className={`input ${className}`}
			value={value}
			onChange={onChange}
			required={required}
		/>
	);
};

export default Input;
