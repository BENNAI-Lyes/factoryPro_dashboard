import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './newCustomers.scss';
import { useContext, useEffect } from 'react';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { getClients } from '../../context/clientContext/clientApiCalls';

const useStyles = makeStyles({});

function createData(name, address, phoneNumber, discount) {
	return { name, address, phoneNumber, discount };
}

const NewCustomers = () => {
	const classes = useStyles();

	const { dispatch: dispatchClients, clients } = useContext(ClientsContext);
	useEffect(() => {
		getClients(dispatchClients);
	}, [dispatchClients]);

	// FORMATE DATA TABLE
	const formattedData = clients?.slice(-5)?.map((client) => {
		return {
			name: client.name,
			address: client?.name,
			phoneNumber: client.phone,
			discount: client.remise,
		};
	});

	const rows = formattedData?.map((data) =>
		createData(data.name, data.address, data.phoneNumber, data.discount)
	);

	return (
		<div className="newCustomers">
			<h2 className="title">New Customers</h2>
			<div className="stat-table">
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell align="left">Address</TableCell>
								<TableCell align="left">Phone Number</TableCell>
								<TableCell align="left">Discount</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.name}>
									<TableCell>{row.name}</TableCell>
									<TableCell align="left">{row.address}</TableCell>
									<TableCell align="left">{row.phoneNumber}</TableCell>
									<TableCell align="left">{row.discount}%</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default NewCustomers;
