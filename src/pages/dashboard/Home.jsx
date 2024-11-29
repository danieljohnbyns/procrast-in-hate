import React from 'react';

import '../../styles/dashboard.css';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false
		};
	};
	componentDidMount() {
		const setMobile = () => {
			this.setState({
				mobile: matchMedia('screen and (max-width: 60rem)').matches
			});
		};

		window.addEventListener('resize', setMobile);
		setMobile();

		const root = document.getElementById('root');
		root.setAttribute('page', 'dashboard');
	};
	render() {
		return (
			<div id='home'>
				<h1>Home</h1>
				<h1>Home</h1>
			</div>
		);
	};
};