import React from 'react';

import Swal from 'sweetalert2';

import Button from '../components/Button';

import '../styles/adminConsole.css';

import globals from '../utils/globals';

export default class AdminConsole extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false,

			/**
			 * @type {{
			 * 		command: Srting,
			 * 		response: String
			 * }}
			 */
			commands: []
		};
	};
	async componentDidMount() {
		const setMobile = () => {
			this.setState({
				mobile: matchMedia('screen and (max-width: 60rem)').matches
			});
		};

		window.addEventListener('resize', setMobile);
		setMobile();

		const originalFetch = window.fetch;
		window.fetch = (url, options) => new Promise((resolve, reject) => {
			const defaultHeaders = {
				'Content-Type': 'application/json',
				'Authentication': localStorage.getItem('adminAuthentication')
			};

			if (options) {
				options.headers = {
					...defaultHeaders,
					...options.headers
				};
			} else {
				options = {
					headers: defaultHeaders
				};
			};

			originalFetch(url, options).then(resolve).catch(reject);
		});
	};
	componentDidUpdate() {
	};

	render() {
		return (
			<article id='adminConsole'>
				<header>
					<h4>Admin Console</h4>

					<div>
						<Button
							onClick={() => {
								Swal.fire({
									title: 'Are you sure?',
									text: 'You are about to log out of the admin console.',
									icon: 'warning',
									showCancelButton: true,
									confirmButtonText: 'Log Out',
									cancelButtonText: 'Cancel'
								}).then(result => {
									if (result.isConfirmed) {
										localStorage.removeItem('adminAuthentication');
										window.location.href = '/';
									};
								});
							}}
							theme='dark'
							filled
						>Sign Out</Button>
					</div>
				</header>

				<main>
					<pre>{'<system_message> $ '} Welcome to the admin console!</pre>
					<pre>{'<system_message> $ '} Here you can manage the website's content.</pre>
					<pre>{'<system_message> $ '} Type `procrast` to use the console.</pre>
					{
						this.state.commands.map((command, index) => (
							<>
								<pre key={index}>{`<you> $ ${command.command}`}</pre>
								<pre key={index + 1} style={{ opacity: '0.75' }}>{`${command.response}`}</pre>
							</>
						))
					}
					<div>
						<pre>{`<you> $ `} </pre>
						<textarea
							type='text'
							placeholder='Enter command or script...'
							onKeyDown={async (e) => {
								e.target.style.height = `auto`;
								e.target.style.height = `calc(${e.target.scrollHeight}px + 1rem)`;

								if (e.key === 'Enter' && !e.shiftKey) {
									const command = e.target.value.trim();
									e.target.value = '';

									const response = await fetch(`${globals.API_URL}/admins/command`, {
										method: 'POST',
										body: JSON.stringify({ content: command })
									});
									if (!response.ok) {
										const data = await response.json();
										const commands = [...this.state.commands, { command, response: data.output }];
										this.setState({ commands });
										return;
									};

									const data = await response.json();
									if (typeof data.output === 'object') {
										data.output = JSON.stringify(data.output, null, 2);
									};
									const commands = [...this.state.commands, { command, response: data.output }];
									this.setState({ commands });
									e.target.value = '';
								} else if (e.key === 'ArrowUp') {
									if (this.state.commands.length) {
										e.target.value = this.state.commands[this.state.commands.length - 1].command;
									};
								} else if (e.key === 'ArrowDown') {
									e.target.value = '';
								};
							}} />
					</div>
				</main>
			</article>
		);
	};
};