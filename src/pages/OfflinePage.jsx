import React from 'react';
import ReactDOM from 'react-dom/client';

import Pomodoro from './dashboard/Pomodoro';

class OfflinePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			online: navigator.onLine
		};
	};

	componentDidMount() {
		window.addEventListener('online', () => {
			this.setState({
				online: true
			});
		});
		window.addEventListener('offline', () => {
			this.setState({
				online: false
			});
		})
	};

	render() {
		return (
			!this.state.online ? <Pomodoro offline={true} /> : null
		);
	};
}

export default OfflinePage;

// Mount the component to the DOM
if (typeof document !== 'undefined') {
	const root = ReactDOM.createRoot(document.getElementById('root'));
	root.render(<OfflinePage />);
};