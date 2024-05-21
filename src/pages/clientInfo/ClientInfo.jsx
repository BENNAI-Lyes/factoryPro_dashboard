import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';

import './clientInfo.scss';
import { TransactionsContext } from '../../context/transactionContext/transactionContext';
import {
	deleteTransaction,
	getTransactions,
} from '../../context/transactionContext/transactionContextApiCalls';
import ReactToPrint from 'react-to-print';
import {
	getBills,
	updateBill,
} from '../../context/billContext/billContextApiCalls';
import { BillsContext } from '../../context/billContext/billContext';
import { updateClient } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: '90%',
		height: '80vh',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(10),
		border: 'none',
		borderRadius: '5px',
		overflowY: 'auto',
	},
}));

const ClientInfo = () => {
	const tabelRef = useRef();

	const client = useLocation().client;
	const { dispatch, transactions, isFetching } =
		useContext(TransactionsContext);
	const { dispatch: dispatchClient } = useContext(ClientsContext);

	useEffect(() => {
		getTransactions(dispatch, client?._id);
	}, [dispatch, client]);

	const { dispatch: dispatchBills, bills } = useContext(BillsContext);

	console.log('transactions===>', transactions);
	console.log(
		'bill===>',
		bills.find((bill) => bill.number === 22)
	);

	useEffect(() => {
		getBills(dispatchBills);
	}, [dispatchBills]);

	// table columns
	const columns = [
		{ field: 'billNumber', headerName: 'Bill Number', flex: 1 },
		{
			field: 'date',
			headerName: 'Date',
			flex: 1,
		},
		{
			field: 'vers',
			headerName: 'Payment',
			flex: 1,
		},

		// {
		// 	field: 'action',
		// 	headerName: 'Action',
		// 	flex: 1,
		// 	align: 'center',
		// 	headerAlign: 'center',

		// 	renderCell: (params) => {
		// 		return (
		// 			<div className="action--icons">
		// 				{/* <DeleteOutline
		// 					className="icon delete "
		// 					onClick={() => {
		// 						deleteTransaction(dispatch, params.row._id);

		// 						//update client
		// 						updateClient(dispatchClient, {
		// 							credit: client.credit + params.row.vers,
		// 							_id: params.row.clientId,
		// 						});

		// 						//delete vers from the bill
		// 						updateBill(dispatchBills, {
		// 							_id: bills.find(
		// 								(bill) => bill.number === params.row.billNumber
		// 							)._id,
		// 							vers: [
		// 								...bills.find(
		// 									(bill) => bill.number === params.row.billNumber
		// 								)?.vers,
		// 							],
		// 						});
		// 					}}
		// 				/> */}
		// 			</div>
		// 		);
		// 	},
		// },
	];

	//table styles
	const classes = useStyles();

	return (
		<div className="clientInfo">
			<div className="wrapper">
				<div className="header">
					<h2 className="title"> Payments off: {client?.name} </h2>
					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button variant="outlined" color="primary" size="small">
									print
								</Button>
							)}
							content={() => tabelRef.current}
						/>
					</div>
				</div>

				{!isFetching ? (
					<div
						className="table"
						style={{ height: '80vh', width: '100%' }}
						ref={tabelRef}>
						<DataGrid
							rows={transactions}
							columns={columns}
							pageSize={14}
							getRowId={(r) => r._id}
							className={classes.root}
						/>
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '100px',
						}}>
						<CircularProgress style={{ color: 'lightGray' }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default ClientInfo;
