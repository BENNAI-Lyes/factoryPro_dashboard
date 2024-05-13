import './invoices.scss';
import { DataGrid } from '@material-ui/data-grid';
import {
	DeleteOutline,
	Add,
	PrintOutlined,
	VisibilityOutlined,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import ReactToPrint from 'react-to-print';

import { InvoicesContext } from '../../context/invoiceContext/invoiceContext';
import {
	deleteInvoice,
	getInvoices,
} from '../../context/invoiceContext/invoiceApiCalls';
import { formatDate } from '../../helpers/getDate';
import { getClients } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';

const Invoices = () => {
	const invoicesRef = useRef();
	const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

	const { dispatch, invoices, isFetching } = useContext(InvoicesContext);

	// FETCH CLIENTS
	const { dispatch: dispatchClients, clients } = useContext(ClientsContext);
	useEffect(() => {
		getClients(dispatchClients);
	}, [dispatchClients]);

	// FORMATE DATA TABLE
	const formattedData = invoices?.map((invoice) => {
		const currentClient = clients?.find(
			(client) => client._id === invoice.clientId
		);

		return {
			...invoice,
			clientName: currentClient?.name,
		};
	});

	useEffect(() => {
		getInvoices(dispatch);
	}, [dispatch]);

	const columns = [
		{ field: 'number', headerName: 'Number', flex: 1 },
		{
			field: 'clientName',
			headerName: 'client',
			flex: 1,
		},
		{
			field: 'createdAt',
			headerName: 'Date',
			flex: 1,
			renderCell: (params) => {
				return DATE_PATTERN.test(params.row.date)
					? formatDate(params.row.date)
					: params.row.date;
			},
		},
		{
			field: 'totalPrice',
			headerName: 'Total',
			flex: 1,
			renderCell: (params) => {
				return params.row.totalPrice + ',00 DA';
			},
		},
		{
			field: 'action',
			headerName: 'Action',
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="action--icons">
						<Link
							to={{
								pathname: `/invoice/${params.row._id}`,
								invoice: params.row,
							}}>
							<VisibilityOutlined className="icon view " />
						</Link>
						<div
							onClick={() => {
								deleteInvoice(dispatch, params.row._id);
							}}>
							<DeleteOutline className="icon delete " />
						</div>
					</div>
				);
			},
		},
	];
	return (
		<div className="invoices">
			<div className="wrapper">
				<div className="header">
					<h2 className="title">Invoices list</h2>
					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button
									variant="outlined"
									size="small"
									color="primary"
									startIcon={<PrintOutlined />}>
									Print{' '}
								</Button>
							)}
							content={() => invoicesRef.current}
						/>
						<Link to="/new-invoice">
							<Button
								variant="contained"
								size="small"
								color="primary"
								startIcon={<Add />}>
								{' '}
								New invoice{' '}
							</Button>
						</Link>
					</div>
				</div>

				{!isFetching ? (
					<div
						className="table"
						style={{ height: '80vh', width: '100%', paddingTop: '20px' }}
						ref={invoicesRef}>
						<DataGrid
							rows={formattedData}
							columns={columns}
							pageSize={10}
							getRowId={(row) => row._id}
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

export default Invoices;
