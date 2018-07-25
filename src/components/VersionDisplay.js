import React from 'react';
import { css } from 'emotion';

const versionDisplay = css`
	position: absolute;
	bottom: 10px;
	right: 10px;
	color: #ccc;
`;

export default () => (
	<a href="https://github.com/whs/ipfs-encrypted-share" className={versionDisplay}>
		IPFS Encrypted Share v{process.env.VERSION}
	</a>
);
