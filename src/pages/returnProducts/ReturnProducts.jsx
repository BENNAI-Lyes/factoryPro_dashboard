import './returnProducts.scss';
import { DataGrid } from '@material-ui/data-grid';

import { useContext, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { CircularProgress } from '@material-ui/core';
import { BillsContext } from '../../context/billContext/billContext';
import { getBills } from '../../context/billContext/billContextApiCalls';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 800,
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ccc',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '8px',
	},
}));

const ReturnProducts = () => {
	const { dispatch, bills, isFetching } = useContext(BillsContext);

	const [rp, setRp] = useState([]);

	useEffect(() => {
		getBills(dispatch);
	}, [dispatch]);

	//TODO:
	// const handelShowProductsClick = (id) => {
	// 	handleOpen();
	// 	const p = returnProducts.find((rp) => rp._id === id);
	// 	setRp(p.products);
	// };

	const columns = [
		{ field: 'billNumber', headerName: 'bill Number', width: 150 },
		{
			field: 'clientName',
			headerName: 'Client Name',
			width: 200,
		},
		{
			field: 'rDate',
			headerName: 'Return Date',
			width: 200,
		},
		{
			field: 'bDate',
			headerName: 'Bill Date',
			width: 200,
		},
		{
			field: 'products',
			headerName: 'Products',
			width: 200,
			renderCell: (params) => {
				return (
					<div
						className="editIcon"
						style={{ color: 'blue' }}
						//TODO:
						// onClick={() => handelShowProductsClick(params.row._id)}
					>
						View Products
					</div>
				);
			},
		},
	];

	//modal
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className="returnedProducts">
			<div className="wrapper">
				<div className="header">
					<h2 className="title">Returned Products:</h2>
				</div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description">
					{/* body */}
					<div style={modalStyle} className={classes.paper}>
						<h2 id="simple-modal-title" style={{ marginBottom: '10px' }}>
							Products:
						</h2>
						<div id="simple-modal-description">
							{rp.map((p, index) => (
								<div key={index}>
									<h3 style={{ marginTop: '12px', marginBottom: '7px' }}>
										{index + 1} :
									</h3>
									<p
										style={{
											display: 'flex',
											justifyContent: 'space-between',
										}}>
										<span>
											<strong>Name: </strong> {p?.name}{' '}
										</span>{' '}
										<span>
											{' '}
											<strong>Quantity: </strong> {p?.quantity}{' '}
										</span>
									</p>
									<hr style={{ marginTop: '10px' }} />
								</div>
							))}
						</div>
					</div>
				</Modal>
				{isFetching ? (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress color="primary" style={{ marginTop: '50px' }} />
					</div>
				) : (
					<div className="table" style={{ height: '210vh', width: '100%' }}>
						<DataGrid
							rows={[]}
							columns={columns}
							pageSize={10}
							checkboxSelection
							disableSelectionOnClick
							getRowId={(r) => r._id || Math.random()}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default ReturnProducts;
