import React from 'react';
import ReactDOM from 'react-dom/client';

const OfflinePage = () => {
	return (
		<div>
			<h1>You are offline</h1>
			<p>Please check your internet connection.</p>
		</div>
	);
};

export default OfflinePage;

// Mount the component to the DOM
if (typeof document !== 'undefined') {
	const root = ReactDOM.createRoot(document.getElementById('root'));
	root.render(<OfflinePage />);
};