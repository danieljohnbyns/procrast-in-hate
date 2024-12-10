import React from 'react';
import ReactDOM from 'react-dom/client';

import Pomodoro from './dashboard/Pomodoro';

const OfflinePage = () => {
	return (
		<Pomodoro offline={true} />
	);
};

export default OfflinePage;

// Mount the component to the DOM
if (typeof document !== 'undefined') {
	const root = ReactDOM.createRoot(document.getElementById('root'));
	root.render(<OfflinePage />);
};