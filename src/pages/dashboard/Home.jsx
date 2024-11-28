import React from 'react';

import '../../styles/dashboard/home.css';

import Sidebar from '../../components/Sidebar';

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
		root.classList.add('dashboard');
		root.setAttribute('page', 'home');
	};
	render() {
		return (
			<>
				<Sidebar />
			</>
		);
	};
};