import React from 'react';

/**
 * @type {(props: {
 * 		children: React.ReactNode,
 * 		placeholder: String,
 * 		type: 'text' | 'password' | 'email' | 'number',
 * 		className: String,
 * 		id: String,
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
	id,
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
			id={id}
			value={value}
			onChange={onChange}
			required={required}
		/>
	);
};

export default Input;
