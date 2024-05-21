import { CircularProgress } from '@material-ui/core';
import React from 'react';

const Loading = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: 'auto',
				minWidth: '300px',
				height: '446px',
			}}>
			<CircularProgress style={{ color: 'lightGray' }} />
		</div>
	);
};

export default Loading;
