import React from 'react';
import { css } from 'emotion';
import { Collapse } from 'antd';
import { getSelfHash } from '../lib/ipfs';

const pinGuide = css`
	margin-top: 30px;
`;
const pinContainer = css`
	border-bottom: none !important;

	.ant-collapse-content-box {
		padding: 0;
	}
`;
const pre = css`
	margin-bottom: 0;
`;

export default class PinGuide extends React.Component {
	state = {
		page: null,
	};

	componentDidMount() {
		getSelfHash().then((hash) => {
			this.setState({
				page: hash,
			});
		});
	}

	render() {
		if (!this.state.page) {
			return null;
		}

		return (
			<Collapse className={pinGuide} bordered={false}>
				<Collapse.Panel key="1" header="Pinning this file" className={pinContainer}>
					<p>Both the file and this downloader must be pinned recursively</p>
					<pre className={pre}>
						<code>
							ipfs pin add {this.state.page}
							{'\n'}
							ipfs pin add {this.props.hash}
						</code>
					</pre>
				</Collapse.Panel>
			</Collapse>
		);
	}
}
