import React from 'react';
import { css } from 'emotion';
import { Input, Form, Popover, Button } from 'antd';
import VersionDisplay from './components/VersionDisplay';
import Uploader from './components/Uploader';

const IPFS_KEY = 'ipfsenc_ipfs';

const outer = css`
	padding-left: 10px;
	padding-right: 10px;
`;
const inner = css`
	max-width: 360px;
	padding-top: 100px;
	margin: auto;

	@media (max-width: 768px) {
		padding-top: 10px;
	}
`;
const settings = css`
	float: right;
	margin-top: 10px;
	margin-right: 10px;
`;

export default class Upload extends React.Component {
	state = {
		ipfsDaemon: localStorage[IPFS_KEY] || 'http://127.0.0.1:5001',
	};

	render() {
		return (
			<div className={outer}>
				<div className={settings}>
					<Popover content={this.renderSettings()} trigger="click" placement="bottomRight">
						<Button icon="setting" size="large" type="default" shape="circle" />
					</Popover>
				</div>
				<div className={inner}>
					<h1>IPFS Encrypted Share</h1>
					<Uploader daemon={this.state.ipfsDaemon} />
				</div>
				<VersionDisplay />
			</div>
		);
	}

	renderSettings() {
		return (
			<div>
				<Form.Item label="IPFS daemon address" required>
					<Input
						value={this.state.ipfsDaemon}
						placeholder="http://127.0.0.1:5001"
						onChange={this.onDaemonChange}
						required
					/>
				</Form.Item>
			</div>
		);
	}

	onDaemonChange = (e) => {
		this.setState({
			ipfsDaemon: e.target.value,
		});
		localStorage[IPFS_KEY] = e.target.value;
	};
}
