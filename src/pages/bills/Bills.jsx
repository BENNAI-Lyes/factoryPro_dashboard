import { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { CircularProgress, Button } from '@material-ui/core';
import ReactToPrint from 'react-to-print';
import {
	Add,
	EditOutlined,
	PrintOutlined,
	VisibilityOutlined,
} from '@material-ui/icons';

import { BillsContext } from '../../context/billContext/billContext';
import { getBills } from '../../context/billContext/billContextApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { getClients } from '../../context/clientContext/clientApiCalls';

import './bills.scss';
import { formatDate } from '../../helpers/getDate';

const Bills = () => {
	const billsRef = useRef();

	const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

	// FETCH BILLS
	const { dispatch, bills, isFetching } = useContext(BillsContext);
	useEffect(() => {
		getBills(dispatch);
	}, [dispatch]);

	console.log('last bill===>', bills[bills.length - 1]);

	// FETCH CLIENTS
	const { dispatch: dispatchClients, clients } = useContext(ClientsContext);
	useEffect(() => {
		getClients(dispatchClients);
	}, [dispatchClients]);

	// FORMATE DATA TABLE
	const formattedData = bills?.map((bill) => {
		const currentClient = clients?.find(
			(client) => client._id === bill.clientId
		);

		return {
			...bill,
			clientName: currentClient?.name,
		};
	});

	const columns = [
		{
			field: 'number',
			headerName: 'Number',
			flex: 1,
		},
		{
			field: 'clientName',
			headerName: 'client',
			flex: 1,
		},
		{
			field: 'date',
			headerName: 'Date',
			flex: 1,
			renderCell: (params) => {
				return DATE_PATTERN.test(params.row.date)
					? formatDate(params.row.date)
					: params.row.date;
			},
		},
		{
			field: 'total',
			headerName: 'Total',
			flex: 1,
			renderCell: (params) => {
				return params.row.remise !== 0
					? params.row.totalRemise + ',00 DA'
					: params.row.total + ',00 DA';
			},
		},
		{
			field: 'oldSold',
			headerName: 'Old Sold',
			flex: 1,
			renderCell: (params) => {
				return params.row.oldSold + ',00 DA';
			},
		},
		{
			field: 'newSold',
			headerName: 'New Sold',
			flex: 1,
			renderCell: (params) => {
				return params.row.newSold + ',00 DA';
			},
		},

		{
			field: 'id',
			headerName: 'Actions',
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="action--icons">
						<Link
							to={{
								pathname: `/order-update/${params.row._id}`,
							}}>
							<EditOutlined className="icon edit " />
						</Link>
						<Link
							to={{
								pathname: `/order/${params.row._id}`,
							}}>
							<VisibilityOutlined className="icon view " />
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
								<Button
									variant="outlined"
									size="small"
									color="primary"
									startIcon={<PrintOutlined />}>
									Print
								</Button>
							)}
							content={() => billsRef.current}
						/>
						<Link to="/new-order">
							<Button
								variant="contained"
								size="small"
								color="primary"
								startIcon={<Add />}>
								New order
							</Button>
						</Link>
					</div>
				</div>
				{!isFetching ? (
					<div
						className="table"
						style={{ height: '80vh', width: '100%', paddingTop: '20px' }}
						ref={billsRef}>
						<DataGrid
							rows={formattedData}
							columns={columns}
							pageSize={10}
							getRowId={(r) => r._id || Math.random()}
							sx={{ textAlign: 'center' }}
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

export default Bills;
