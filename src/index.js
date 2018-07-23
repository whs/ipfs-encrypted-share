import React from 'react';
import ReactDOM from 'react-dom';

if (window.location.hash) {
	import('./Downloader').then((Component) => {
		let [hash, key] = window.location.hash.substr(1).split(':');
		ReactDOM.render(
			<Component.default hash={hash} encryptKey={key} />,
			document.getElementById('root')
		);
	});
} else {
	import('./Uploader').then((Component) => {
		ReactDOM.render(<Component.default />, document.getElementById('root'));
	});
}
