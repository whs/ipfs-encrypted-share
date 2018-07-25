import React from 'react';
import { Upload, Icon } from 'antd';
import browserEncrypt from '../lib/browserencrypt';
import { upload, getSelfIpfs } from '../lib/ipfs';

export default class Uploader extends React.Component {
	state = {
		fileList: [],
	};

	render() {
		return (
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
		);
	}

	onUpload = async (param) => {
		let encryptedResponse;
		let endpoint = this.props.daemon;
		let downloader = await getSelfIpfs();
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
						downloader: downloader,
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
					item.url = file.response.downloader + '#' + file.response.ipfs + ':' + file.response.key;
				}
			}
		}

		this.setState({ fileList });
	};
}
