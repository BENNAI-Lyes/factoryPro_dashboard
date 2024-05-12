import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Visibility } from '@material-ui/icons';

import './actionCell.scss';

const ActionCell = ({ params }) => {
	const dropdownRef = useRef(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="actionCell" ref={dropdownRef}>
			<span
				className="actionCell--button"
				onClick={() => setOpen((prev) => !prev)}>
				...
			</span>

			{open && (
				<ul className="actionCell--dropdown">
					<li
						className="actionCell--dropdown__item"
						onClick={() => setOpen(false)}>
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

					<li
						className="actionCell--dropdown__item"
						onClick={() => setOpen(false)}>
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
				</ul>
			)}
		</div>
	);
};

export default ActionCell;
