import React from 'react';
import { css } from 'emotion';
import { Icon } from 'antd';
import filesize from 'filesize';

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
			<span className={filename}>{props.metadata.filename}</span> ({filesize(props.metadata.size)})
		</div>
	</div>
);
