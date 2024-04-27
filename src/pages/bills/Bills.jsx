import './bills.scss';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Visibility, Edit } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { BillsContext } from '../../context/billContext/billContext';
import {
	// deleteBill,
	getBills,
} from '../../context/billContext/billContextApiCalls';
import ReactToPrint from 'react-to-print';
// import { ClientsContext } from '../../context/clientContext/clientContext';
// import {
//   getClient,
//   updateClient,
// } from '../../context/clientContext/clientApiCalls';
import {
	// deleteReturnedProduct,
	getReturnProducts,
} from '../../context/returnProductContext/returnProductContextApiCalls';
import { ReturnProductsContext } from '../../context/returnProductContext/returnProductContext';

const Bills = () => {
	const invoicesRef = useRef();
	const { dispatch, bills, isFetching } = useContext(BillsContext);

	useEffect(() => {
		getBills(dispatch);
	}, [dispatch]);

	//return product
	const { dispatch: dispatchReturnProduct } = useContext(ReturnProductsContext);

	useEffect(() => {
		getReturnProducts(dispatchReturnProduct);
	}, [dispatchReturnProduct]);

	const columns = [
		{ field: 'number', headerName: 'N°', width: 100 },
		{
			field: 'clientName',
			headerName: 'client',
			width: 200,
		},
		{
			field: 'date',
			headerName: 'Date',
			width: 200,
		},
		{
			field: 'total',
			headerName: 'Total',
			width: 160,
			renderCell: (params) => {
				return params.row.remise !== 0
					? params.row.totalRemise + ',00 DA'
					: params.row.total + ',00 DA';
			},
		},
		{
			field: 'credit',
			headerName: 'Debt ',
			width: 160,
			renderCell: (params) => {
				return params.row.credit + ',00 DA';
			},
		},
		{
			field: 'oldCredit',
			headerName: 'Old Debt',
			width: 170,
			renderCell: (params) => {
				return params.row.oldCredit + ',00 DA';
			},
		},

		{
			field: 'action',
			headerName: 'Action',
			width: 100,
			renderCell: (params) => {
				return (
					<div className="actionCell">
						<Link
							to={{
								pathname: `/order-update/${params.row._id}`,
								bill: params.row,
							}}>
							<Edit className="editIcon" />
						</Link>
						<Link
							to={{
								pathname: `/order/${params.row._id}`,
								bill: params.row,
							}}>
							<Visibility className="editIcon" style={{ color: 'blue' }} />
						</Link>
					</div>
				);
			},
		},
	];

	return (
		<div className="bills">
			<div className="wrapper">
				<div className="header">
					<h2 className="title">Orders list</h2>
					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button variant="contained" size="small">
									Print
								</Button>
							)}
							content={() => invoicesRef.current}
						/>
						<Link to="/new-order">
							<Button
								variant="contained"
								color="primary"
								startIcon={<Add />}
								className="button"
								size="small">
								New Order
							</Button>
						</Link>
					</div>
				</div>
				{!isFetching ? (
					<div
						className="table"
						style={{ height: '250vh', width: '100%', paddingTop: '20px' }}
						ref={invoicesRef}>
						<DataGrid
							rows={bills}
							columns={columns}
							pageSize={28}
							checkboxSelection
							disableSelectionOnClick
							getRowId={(r) => r._id || Math.random()}
						/>
					</div>
				) : (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress color="primary" style={{ marginTop: '50px' }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Bills;
