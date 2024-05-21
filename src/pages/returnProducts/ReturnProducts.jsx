import './returnProducts.scss';
import { DataGrid } from '@material-ui/data-grid';

import { useContext, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { CircularProgress } from '@material-ui/core';
import { BillsContext } from '../../context/billContext/billContext';
import { getBills } from '../../context/billContext/billContextApiCalls';
import { VisibilityOutlined } from '@material-ui/icons';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { getClients } from '../../context/clientContext/clientApiCalls';

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
		width: 600,
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ccc',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '5px',
	},
}));

const ReturnProducts = () => {
	const [rp, setRp] = useState();

	const { dispatch, bills, isFetching } = useContext(BillsContext);

	useEffect(() => {
		getBills(dispatch);
	}, [dispatch]);

	// FETCH CLIENTS
	const { dispatch: dispatchClients, clients } = useContext(ClientsContext);
	useEffect(() => {
		getClients(dispatchClients);
	}, [dispatchClients]);

	// FORMATE DATA TABLE
	const formattedData = bills
		?.map((bill) => {
			if (bill?.productsReturned?.length === 0) return null;

			const currentClient = clients?.find(
				(client) => client._id === bill.clientId
			);

			return {
				billNumber: bill.number,
				returnDate: bill.productsReturned[0]?.date,
				orderDate: bill.date,
				products: bill.productsReturned,
				clientName: currentClient?.name,
			};
		})
		.filter((data) => data !== null);

	const handelShowProductsClick = (products) => {
		handleOpen();
		setRp(products);
	};

	const columns = [
		{ field: 'billNumber', headerName: 'bill Number', flex: 1 },
		{
			field: 'clientName',
			headerName: 'Client Name',
			flex: 1,
		},
		{
			field: 'returnDate',
			headerName: 'Return Date',
			flex: 1,
		},
		{
			field: 'orderDate',
			headerName: 'Bill Date',
			flex: 1,
		},
		{
			field: 'products',
			headerName: 'Products',
			flex: 1,
			align: 'center',
			headerAlign: 'center',

			renderCell: (params) => {
				return (
					<div
						className="action--icons"
						onClick={() => handelShowProductsClick(params.row.products)}>
						<VisibilityOutlined className="icon view" />
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
					<h2 className="title">Returned products list</h2>
				</div>

				{isFetching ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '100px',
						}}>
						<CircularProgress style={{ color: 'lightGray' }} />
					</div>
				) : (
					<div
						className="table"
						style={{ height: '80vh', width: '100%', paddingTop: '20px' }}>
						<DataGrid
							rows={formattedData}
							columns={columns}
							pageSize={10}
							getRowId={(r) => r._id || Math.random()}
						/>
					</div>
				)}

				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description">
					{/* body */}
					<div style={modalStyle} className={classes.paper}>
						<h2
							id="simple-modal-title"
							style={{
								marginBottom: '12px',
								fontSize: '18px',
								color: '#333',
								fontWeight: 600,
							}}>
							Returned Products
						</h2>
						<div id="simple-modal-description">
							{rp?.map((p, index) => (
								<div key={index}>
									<p
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginBottom: '12px',
										}}>
										<span>
											<strong>- Product: </strong> {p?.name}{' '}
										</span>{' '}
										<span>
											{' '}
											<strong>Quantity: </strong> {p?.quantity}{' '}
										</span>
									</p>
								</div>
							))}
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default ReturnProducts;
