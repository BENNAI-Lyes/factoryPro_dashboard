import './clients.scss';
import { DataGrid } from '@material-ui/data-grid';
import { Edit, DeleteOutline, Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { ClientsContext } from '../../context/clientContext/clientContext';
import {
	deleteClient,
	getClients,
} from '../../context/clientContext/clientApiCalls';
import ReactToPrint from 'react-to-print';

const Clients = () => {
	const { dispatch, clients, isFetching } = useContext(ClientsContext);

	const clientRef = useRef();

	useEffect(() => {
		getClients(dispatch);
	}, [dispatch]);

	const columns = [
		{
			field: 'détails',
			headerName: 'Transactions',
			width: 130,
			renderCell: (params) => {
				return (
					<div className="actionCell">
						<Link
							to={{
								pathname: `/customer-transactions/${params.row._id}`,
								client: params.row,
							}}>
							<p style={{ textDecoration: 'underline' }}>Transactions</p>
						</Link>
					</div>
				);
			},
		},
		{
			field: 'name',
			headerName: 'Name',
			width: 230,
		},
		{
			field: 'address',
			headerName: 'Address',
			width: 230,
		},
		{
			field: 'phone',
			headerName: 'Phone Number',
			width: 240,
		},
		{
			field: 'credit',
			headerName: 'Total Debt',
			width: 230,
			renderCell: (params) => {
				return params.row.credit + ',00 DA';
			},
		},

		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			renderCell: (params) => {
				return (
					<div className="actionCell">
						<Link
							to={{
								pathname: `/customer/${params.row._id}`,
								client: params.row,
							}}>
							<Edit className="editIcon" />
						</Link>

						<DeleteOutline
							className="deleteIcon"
							onClick={() => {
								deleteClient(dispatch, params.row._id);
							}}
						/>
					</div>
				);
			},
		},
	];
	return (
		<div className="clients">
			<div className="wrapper">
				<div className="header">
					<h3 className="title">Clients</h3>
					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button variant="contained" size="small">
									print
								</Button>
							)}
							content={() => clientRef.current}
						/>
						<Link to="/new-customer">
							<Button
								variant="contained"
								color="primary"
								startIcon={<Add />}
								className="button"
								size="small">
								new client
							</Button>
						</Link>
					</div>
				</div>
				{!isFetching ? (
					<div
						className="table"
						style={{ height: '250vh', width: '100%', paddingTop: '20px' }}
						ref={clientRef}>
						<DataGrid
							rows={clients}
							columns={columns}
							pageSize={28}
							checkboxSelection
							disableSelectionOnClick
							getRowId={(r) => r._id}
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

export default Clients;
