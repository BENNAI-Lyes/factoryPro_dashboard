import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutline, Edit } from '@material-ui/icons';

import './actionCell.scss';
import { ClientsContext } from '../../../../context/clientContext/clientContext';
import { deleteClient } from '../../../../context/clientContext/clientApiCalls';

const ActionCell = ({ params }) => {
	const dropdownRef = useRef(null);
	const [open, setOpen] = useState(false);
	const { dispatch } = useContext(ClientsContext);

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
					<li className="actionCell--dropdown__item">
						<Link
							to={{
								pathname: `/customer/${params.row._id}`,
								client: params.row,
							}}>
							<div>
								<Edit className="icon" />
								<span>Edit</span>
							</div>
						</Link>
					</li>

					<li className="actionCell--dropdown__item">
						<div
							onClick={() => {
								deleteClient(dispatch, params.row._id);
							}}>
							<DeleteOutline className="icon" />
							<span>Delete</span>
						</div>
					</li>
				</ul>
			)}
		</div>
	);
};

export default ActionCell;
