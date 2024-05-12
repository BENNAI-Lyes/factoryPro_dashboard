import { Link } from 'react-router-dom';

import { Edit, Visibility } from '@material-ui/icons';

import './actionCell.scss';
import { useState } from 'react';

const ActionCell = ({ params, isUpdate, isView }) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="actionCell">
			<span
				className="actionCell--button"
				onClick={() => setOpen((prev) => !prev)}>
				...
			</span>

			{open && (
				<ul className="actionCell--dropdown">
					{isUpdate && (
						<li className="actionCell--dropdown__item">
							<Link
								to={{
									pathname: `/order-update/${params.row._id}`,
									bill: params.row,
								}}>
								<div>
									<Edit className="icon" />
									<span>Edit</span>
								</div>
							</Link>
						</li>
					)}

					{isView && (
						<li className="actionCell--dropdown__item">
							<Link
								to={{
									pathname: `/order/${params.row._id}`,
									bill: params.row,
								}}>
								<div>
									<Visibility className="icon" />
									<span>Details</span>
								</div>
							</Link>
						</li>
					)}
				</ul>
			)}
		</div>
	);
};

export default ActionCell;
