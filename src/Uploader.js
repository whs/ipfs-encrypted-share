import React from 'react';
import { css } from 'emotion';
import { Input, Form, Upload, Icon } from 'antd';
import browserEncrypt from './lib/browserencrypt';
import { upload } from './lib/ipfs';
import VersionDisplay from './components/VersionDisplay';

const IPFS_KEY = 'ipfsenc_ipfs';
const IPFS_VIEWER_BASE = window.location;

const outer = css`
	padding-top: 100px;
	padding-left: 10px;
	padding-right: 10px;

	@media (max-width: 768px) {
		padding-top: 10px;
	}
`;
const inner = css`
	max-width: 360px;
	margin: auto;
`;

export default class Uploader extends React.Component {
	state = {
		ipfsDaemon: localStorage[IPFS_KEY] || 'http://127.0.0.1:5001',
		fileList: [],
	};

	render() {
		return (
			<div className={outer}>
				<div className={inner}>
					<h1>IPFS Encrypted Share</h1>
					<Form.Item label="IPFS daemon address" required>
						<Input
							value={this.state.ipfsDaemon}
							placeholder="http://127.0.0.1:5001"
							onChange={this.onDaemonChange}
							required
						/>
					</Form.Item>
					<Upload.Dragger
						action=""
						customRequest={this.onUpload}
						onChange={this.onUploadChange}
						fileList={this.state.fileList}>
						<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="ant-upload-text">Click or drag file to this area to upload</p>
					</Upload.Dragger>
				</div>
				<VersionDisplay />
			</div>
		);
	}

	onDaemonChange = (e) => {
		this.setState({
			ipfsDaemon: e.target.value,
		});
		localStorage[IPFS_KEY] = e.target.value;
	};

	onUpload = (param) => {
		let encryptedResponse;
		let endpoint = this.state.ipfsDaemon;
		browserEncrypt(param.file, (percent) => {
			param.onProgress({ percent: percent / 10 });
		})
			.then((res) => {
				encryptedResponse = res;
				param.onProgress({ percent: 10 });
				return res;
			})
			.then((res) => {
				let fileList = [
					{
						path: 'file/metadata.json',
						content: JSON.stringify(res.metadata),
					},
				];

				for (let i = 0; i < res.pieces.length; i++) {
					fileList.push({
						path: `file/pieces/${i}`,
						content: new Blob([res.pieces[i]]),
					});
				}

				return upload(endpoint, fileList, (percent) => {
					percent = percent * 0.9 + 10;
					param.onProgress({ percent });
				});
			})
			.then(
				(res) => {
					let rootNode = res[res.length - 1];
					param.onSuccess({
						ipfs: rootNode.Hash,
						key: encryptedResponse.key,
					});
				},
				(err) => {
					console.error(err);
					param.onError(err);
				}
			);
	};

	onUploadChange = ({ file, fileList, e }) => {
		if (file.status === 'done') {
			for (let item of fileList) {
				if (item.uid === file.uid) {
					item.url = IPFS_VIEWER_BASE + '#' + file.response.ipfs + ':' + file.response.key;
				}
			}
		}

		this.setState({ fileList });
	};
}
