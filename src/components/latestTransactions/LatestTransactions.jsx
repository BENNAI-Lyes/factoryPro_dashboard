import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './latestTransactions.scss';
import { useContext, useEffect } from 'react';
import { BillsContext } from '../../context/billContext/billContext';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { CircularProgress } from '@material-ui/core';
import {
	GET_CLIENTS_FAILURE,
	GET_CLIENTS_START,
	GET_CLIENTS_SUCCESS,
} from '../../context/clientContext/clientContextActions';
import { axiosI } from '../../config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/authContext/authContext';
import {
	GET_BILLS_FAILURE,
	GET_BILLS_START,
	GET_BILLS_SUCCESS,
} from '../../context/billContext/billContextActions';

const useStyles = makeStyles({
	table: {
		minWidth: 450,
	},
});

function createData(number, client, date, total) {
	return { number, client, date, total };
}

const LatestTransactions = () => {
	const classes = useStyles();

	//get user from the store
	const { user } = useContext(AuthContext);

	//fetch clients
	const {
		dispatch: dispatchClients,
		isFetchingClients,
		clients,
	} = useContext(ClientsContext);
	useEffect(() => {
		const fetchClients = async () => {
			dispatchClients(GET_CLIENTS_START());
			try {
				const res = await axiosI.get('client', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});
				dispatchClients(GET_CLIENTS_SUCCESS(res?.data));
			} catch (error) {
				toast.error(error?.response?.data?.message);
				dispatchClients(GET_CLIENTS_FAILURE(error));
			}
		};
		fetchClients();
	}, [user.accessToken, dispatchClients]);

	//fetching bills
	const {
		dispatch: dispatchBills,
		isFetchingBills,
		bills,
	} = useContext(BillsContext);
	useEffect(() => {
		const fetchBills = async () => {
			dispatchBills(GET_BILLS_START());
			try {
				const res = await axiosI.get('bon', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});
				dispatchBills(GET_BILLS_SUCCESS(res.data));
			} catch (error) {
				dispatchBills(GET_BILLS_FAILURE(error));
				toast.error(error?.response?.data?.message);
			}
		};
		fetchBills();
	}, [dispatchBills, user.accessToken]);

	// FORMATE DATA TABLE
	const formattedData = bills?.slice(-5)?.map((bill) => {
		const currentClient = clients?.find(
			(client) => client._id === bill.clientId
		);

		return {
			number: bill.number,
			client: currentClient?.name,
			date: bill.date,
			total:
				bill.remise !== 0 ? bill.totalRemise + ',00 DA' : bill.total + ',00 DA',
		};
	});

	const rows = formattedData?.map((data) =>
		createData(data.number, data.client, data.date, data.total)
	);

	return (
		<div className="latestTransactions">
			<h2 className="title">Latest Transactions</h2>
			{!isFetchingClients || !isFetchingBills ? (
				<TableContainer component={Paper} className="stat-table">
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Number</TableCell>
								<TableCell align="left">Client</TableCell>
								<TableCell align="left">Date</TableCell>
								<TableCell align="left">Total</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.number}>
									<TableCell align="left">{row.number}</TableCell>
									<TableCell align="left">{row.client}</TableCell>
									<TableCell align="left">{row.date}</TableCell>
									<TableCell align="left">{row.total}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress color="primary" style={{ marginTop: '50px' }} />
				</div>
			)}
		</div>
	);
};

export default LatestTransactions;
