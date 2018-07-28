import React from 'react';
import { css } from 'emotion';
import { Input, Form, Popover, Button, Spin, Alert } from 'antd';
import VersionDisplay from './components/VersionDisplay';
import Uploader from './components/Uploader';
import { outer, inner } from './style';
import { getVersion } from './lib/ipfs';

const IPFS_KEY = 'ipfsenc_ipfs';
const STATE_CHECK = 0;
const STATE_ACTIVE = 1;
const STATE_ERROR = 2;

const settings = css`
	float: right;
	margin-top: 10px;
	margin-right: 10px;
`;

export default class Upload extends React.Component {
	state = {
		ipfsState: STATE_CHECK,
		ipfsDaemon: localStorage[IPFS_KEY] || 'http://127.0.0.1:5001',
	};

	componentDidMount() {
		this.checkIpfsActive();
	}

	render() {
		return (
			<div className={outer}>
				<div className={settings}>
					<Popover
						content={this.renderSettings()}
						trigger="click"
						placement="bottomRight"
						onVisibleChange={this.onSettingsPop}>
						<Button icon="setting" size="large" type="default" shape="circle" />
					</Popover>
				</div>
				<div className={inner}>
					<h1>IPFS Encrypted Share</h1>
					{this.state.ipfsState === STATE_CHECK && (
						<div>
							<Spin size="large" /> <span css="margin-left: 10px;">Looking for IPFS API</span>
						</div>
					)}
					{this.state.ipfsState === STATE_ERROR && (
						<Alert
							message="Cannot connect to IPFS API"
							description={this.renderIpfsError()}
							type="error"
							showIcon
						/>
					)}
					{this.state.ipfsState === STATE_ACTIVE && <Uploader daemon={this.state.ipfsDaemon} />}
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
						type="url"
						required
					/>
				</Form.Item>
			</div>
		);
	}

	renderIpfsError() {
		let corsOrigin = JSON.stringify(JSON.stringify([window.location.origin]));
		return (
			<div>
				<p>
					Your IPFS API is located at <strong>{this.state.ipfsDaemon}</strong>.
					<div>Change it in the options menu at top right.</div>
				</p>
				<p>
					Have you configured CORS for IPFS?
					<pre>
						<code>
							ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin {corsOrigin}
							<br />
							ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
						</code>
					</pre>
				</p>
				<p css="margin-top: 10px;">
					<Button type="default" onClick={this.checkIpfsActive}>
						Retry
					</Button>
				</p>
			</div>
		);
	}

	onDaemonChange = (e) => {
		this.setState({
			ipfsDaemon: e.target.value,
		});
		localStorage[IPFS_KEY] = e.target.value;
	};

	checkIpfsActive = () => {
		this.setState({ ipfsState: STATE_CHECK });
		getVersion(this.state.ipfsDaemon).then(
			() => {
				this.setState({ ipfsState: STATE_ACTIVE });
			},
			(e) => {
				this.setState({ ipfsState: STATE_ERROR });
			}
		);
	};

	onSettingsPop = (visible) => {
		if (!visible) {
			this.checkIpfsActive();
		}
	};
}
