import React from 'react';
import ReactDOM from 'react-dom';
import Download from './Download';
import Upload from './Upload';
import StartupError from './StartupError';

function init() {
	let jsx;

	if (window.location.hash) {
		let [hash, key] = window.location.hash.substr(1).split(':');

		if (!key) {
			jsx = <StartupError message="Key not specified" description="Did you miss the colon?" />;
		} else {
			jsx = <Download hash={hash} encryptKey={key} />;
		}
	} else {
		jsx = <Upload />;
	}

	ReactDOM.render(jsx, document.getElementById('root'));
}

init();
