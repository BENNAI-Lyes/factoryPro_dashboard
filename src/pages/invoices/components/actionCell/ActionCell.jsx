import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	DeleteOutline,
	Edit,
	Visibility,
	VisibilityOutlined,
} from '@material-ui/icons';

import './actionCell.scss';
import { deleteInvoice } from '../../../../context/invoiceContext/invoiceApiCalls';
import { InvoicesContext } from '../../../../context/invoiceContext/invoiceContext';

const ActionCell = ({ params }) => {
	const dropdownRef = useRef(null);
	const [open, setOpen] = useState(false);

	const { dispatch } = useContext(InvoicesContext);

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
								pathname: `/invoice/${params.row._id}`,
								invoice: params.row,
							}}>
							<div>
								<VisibilityOutlined className="icon" />
								<span>Details</span>
							</div>
						</Link>
					</li>

					<li
						className="actionCell--dropdown__item"
						onClick={() => setOpen(false)}>
						<div
							onClick={() => {
								deleteInvoice(dispatch, params.row._id);
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
