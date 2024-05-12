import './invoices.scss';
import { DataGrid } from '@material-ui/data-grid';
import {
	DeleteOutline,
	Add,
	Visibility,
	PrintOutlined,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { InvoicesContext } from '../../context/invoiceContext/invoiceContext';
import {
	deleteInvoice,
	getInvoices,
} from '../../context/invoiceContext/invoiceApiCalls';
import ReactToPrint from 'react-to-print';
import ActionCell from './components/actionCell/ActionCell';

const Invoices = () => {
	const { dispatch, invoices, isFetching } = useContext(InvoicesContext);
	const invoicesRef = useRef();

	useEffect(() => {
		getInvoices(dispatch);
	}, [dispatch]);

	const columns = [
		{ field: 'number', headerName: 'N°', flex: 1 },

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
				return params.row.createdAt.slice(0, 10);
			},
		},
		{
			field: 'total',
			headerName: 'Total',
			flex: 1,
			renderCell: (params) => {
				return params.row.total + ',00 DA';
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
							rows={invoices}
							columns={columns}
							pageSize={10}
							checkboxSelection
							disableSelectionOnClick
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
