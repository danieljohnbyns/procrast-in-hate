import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import '../../styles/dashboard/connections.css';

import globals from '../../utils/globals';

export default class Connections extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			data: {
				/**
				 * @type {{
				 * 		_id: String,
				 * 		name: String,
				 * 		email: String
				 * 		online: Boolean
				 * }[]}
				 */
				connections: []
			}
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

		this.fetchConnections();

		globals.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'COLLABORATOR_UPDATE') {
				this.fetchConnections();
			};
		});
	};

	fetchConnections = async () => {
		const _id = JSON.parse(localStorage.getItem('authentication'))._id;

		const response = await fetch(`${globals.API_URL}/users/${_id}/connections`);

		if (!response.ok) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to fetch connections',
				text: 'An error occurred while fetching your connections. Please try again later.'
			});

			return;
		};

		const data = await response.json();

		this.setState({
			data: {
				connections: data
			}
		});
	};

	render() {
		return (
			<div id='connections'>
				<header>
					<h1>Connections</h1>
				</header>

				<main>
					{
						this.state.data.connections.length === 0
							? (
								<div id='empty'>
									<i>No connections</i>
								</div>
							)
							: (
								<div id='connections'>
									{
										this.state.data.connections.map((connection, index) => (
											<div key={index} className={`connection ${!connection.online ? 'offline' : ''}`}>
												<img src={`https://via.placeholder.com/200`} alt='Avatar' />
												<div>
													<h6>{connection.name}</h6>
													<p>{connection.email}</p>
												</div>
											</div>
										))
									}
								</div>
							)
					}
				</main>
			</div>
		);
	};
};