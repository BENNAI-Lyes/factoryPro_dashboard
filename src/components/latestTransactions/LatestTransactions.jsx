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
import { getBills } from '../../context/billContext/billContextApiCalls';
import { BillsContext } from '../../context/billContext/billContext';
import { getClients } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { CircularProgress } from '@material-ui/core';

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

	const { dispatch, bills, isFetching } = useContext(BillsContext);
	useEffect(() => {
		getBills(dispatch);
	}, [dispatch]);

	const { dispatch: dispatchClients, clients } = useContext(ClientsContext);
	useEffect(() => {
		getClients(dispatchClients);
	}, [dispatchClients]);

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
			{!isFetching ? (
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
