import React from 'react';
import ReactDOM from 'react-dom';

function init() {
	if (window.location.hash) {
		let [hash, key] = window.location.hash.substr(1).split(':');

		if (!key) {
			document.getElementById('root').textContent = 'Key not specified. Did you miss the colon?';
			return;
		}

		import('./Downloader').then((Component) => {
			ReactDOM.render(<Component.default hash={hash} encryptKey={key} />, document.getElementById('root'));
		});
	} else {
		import('./Uploader').then((Component) => {
			ReactDOM.render(<Component.default />, document.getElementById('root'));
		});
	}
}

init();
