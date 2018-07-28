import { css } from 'emotion';

export const outer = css`
	padding-left: 10px;
	padding-right: 10px;
`;
export const inner = css`
	max-width: 460px;
	padding-top: 100px;
	margin: auto;

	@media (max-width: 768px) {
		padding-top: 10px;
	}
`;
