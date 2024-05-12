import React from 'react';

import TextField from '@material-ui/core/TextField';
import { getDate } from '../../helpers/getDate';

export default function DatePicker({ value, onChange }) {
	const currentDate = getDate();

	return (
		<form noValidate>
			<TextField
				id="date"
				defaultValue={currentDate}
				label=""
				type="date"
				size="small"
				InputLabelProps={{
					shrink: true,
				}}
				value={value}
				onChange={onChange}
				format="D/M/YYYY"
			/>
		</form>
	);
}
