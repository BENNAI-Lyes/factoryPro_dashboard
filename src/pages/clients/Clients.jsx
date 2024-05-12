import './clients.scss';
import { DataGrid } from '@material-ui/data-grid';
import { Add, PrintOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { getClients } from '../../context/clientContext/clientApiCalls';
import ReactToPrint from 'react-to-print';
import ActionCell from './components/actionCell/ActionCell';

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
			flex: 1,
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
			flex: 1,
		},
		{
			field: 'address',
			headerName: 'Address',
			flex: 1,
		},
		{
			field: 'phone',
			headerName: 'Phone Number',
			flex: 1,
		},
		{
			field: 'credit',
			headerName: 'Total Debt',
			flex: 1,
			renderCell: (params) => {
				return params.row.credit + ',00 DA';
			},
		},
		{
			field: 'action',
			headerName: 'Action',
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				return <ActionCell params={params} />;
			},
		},
	];
	return (
		<div className="clients">
			<div className="wrapper">
				<div className="header">
					<h3 className="title">Customers list</h3>
					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button
									variant="outlined"
									size="small"
									color="primary"
									startIcon={<PrintOutlined />}>
									{' '}
									Print{' '}
								</Button>
							)}
							content={() => clientRef.current}
						/>
						<Link to="/new-customer">
							<Button
								variant="contained"
								startIcon={<Add />}
								size="small"
								color="primary">
								{' '}
								New client{' '}
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
