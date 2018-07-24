import React from 'react';
import { css } from 'emotion';
import { Icon } from 'antd';

const title = css`
	display: flex;
	margin-bottom: 10px;
`;
const fileTitle = css`
	margin-left: 10px;
	font-size: 16pt;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;
const filename = css`
	font-weight: bold;
`;

export default (props) => (
	<div className={title}>
		<Icon type="file" style={{ fontSize: 24 }} />
		<div className={fileTitle}>
			<span className={filename}>{props.metadata.filename}</span> ({props.metadata.size} bytes)
		</div>
	</div>
);
