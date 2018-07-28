import React from 'react';
import { Alert } from 'antd';
import VersionDisplay from './components/VersionDisplay';
import { outer, inner } from './style';

export default class StartupError extends React.PureComponent {
	render() {
		return (
			<div className={outer}>
				<div className={inner}>
					<h1>IPFS Encrypted Share</h1>
					<Alert type="error" showIcon {...this.props} />
				</div>
				<VersionDisplay />
			</div>
		);
	}
}
