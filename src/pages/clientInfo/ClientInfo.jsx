import './clientInfo.scss';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button } from '@material-ui/core';
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
	const { dispatch, transactions } = useContext(TransactionsContext);
	const { dispatch: dispatchClient } = useContext(ClientsContext);

	useEffect(() => {
		getTransactions(dispatch, client?._id);
	}, [dispatch, client]);

	const { dispatch: dispatchBills, bills } = useContext(BillsContext);

	useEffect(() => {
		getBills(dispatchBills);
	}, [dispatchBills]);

	// table columns
	const columns = [
		{ field: 'billNumber', headerName: 'Bill Number', width: 250 },
		{
			field: 'date',
			headerName: 'Date',
			width: 300,
		},
		{
			field: 'vers',
			headerName: 'Payment',
			width: 350,
		},

		{
			field: 'action',
			headerName: 'Action',
			width: 180,

			renderCell: (params) => {
				return (
					<div className="actionCell">
						<DeleteOutline
							className="deleteIcon"
							onClick={() => {
								console.log(params.row);
								deleteTransaction(dispatch, params.row._id);

								//update client
								updateClient(dispatchClient, {
									credit: client.credit + params.row.vers,
									_id: params.row.clientId,
								});

								//delete vers from the bill
								updateBill(dispatchBills, {
									_id: params.row.billId,
									vers: bills
										?.find((b) => b._id === params.row.billId)
										?.vers?.filter((v) => v.id !== params.row.id),
								});
							}}
						/>
					</div>
				);
			},
		},
	];

	//table styles
	const classes = useStyles();

	return (
		<div className="clients">
			<div className="wrapper">
				<div className="header">
					<h2
						className="title"
						style={{ textTransform: 'capitalize', fontSize: '24px' }}>
						{' '}
						Payments off: {client?.name}{' '}
					</h2>
					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button variant="outlined" color="secondary">
									print
								</Button>
							)}
							content={() => tabelRef.current}
						/>
					</div>
				</div>

				<div
					className="table"
					style={{ height: '145vh', width: '100%' }}
					ref={tabelRef}>
					<DataGrid
						rows={transactions}
						columns={columns}
						pageSize={14}
						checkboxSelection
						disableSelectionOnClick
						getRowId={(r) => r._id}
						className={classes.root}
					/>
				</div>
			</div>
		</div>
	);
};

export default ClientInfo;
