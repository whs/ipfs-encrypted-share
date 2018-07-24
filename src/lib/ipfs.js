import { from_string } from 'libsodium-wrappers';
import axios from 'axios';

export const upload = (endpoint, files, onProgress = () => {}) => {
	let body = new FormData();

	for (let item of files) {
		if (item.content instanceof Blob) {
			body.append(item.path, item.content, item.path);
		} else {
			body.append(item.path, new Blob([from_string(item.content)]), item.path);
		}
	}

	return axios({
		method: 'POST',
		url: '/api/v0/add',
		baseURL: endpoint,
		params: {
			recursive: 'true',
		},
		data: body,
		responseType: 'text',
		onUploadProgress: (progress) => {
			onProgress((progress.loaded / progress.total) * 100);
		},
	}).then((res) => {
		let body = res.data
			.trim()
			.split('\n')
			.map((line) => JSON.parse(line));

		if (body[body.length - 1].Type === 'error') {
			throw new Error(body[body.length - 1].Message);
		}

		return body;
	});
};
