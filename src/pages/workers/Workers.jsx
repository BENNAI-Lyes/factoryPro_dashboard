import { DataGrid } from '@material-ui/data-grid';
import { Edit, DeleteOutline, Add, PrintOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import ReactToPrint from 'react-to-print';

import './workers.scss';
import { WorkersContext } from '../../context/workerContext/workerContext';
import {
	deleteWorker,
	getWorkers,
} from '../../context/workerContext/workerApiCalls';

const Workers = () => {
	const { dispatch, workers, isFetching } = useContext(WorkersContext);

	const workerRef = useRef();

	useEffect(() => {
		getWorkers(dispatch);
	}, [dispatch]);

	const columns = [
		{
			field: 'détails',
			headerName: 'Account Balance',
			flex: 1,
			renderCell: (params) => {
				return (
					<div className="actionCell">
						<Link
							to={{
								pathname: `/worker-account/${params.row._id}`,
								worker: params.row,
							}}>
							<p style={{ textDecoration: 'underline' }}>Account Balance</p>
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
								pathname: `/worker/${params.row._id}`,
								worker: params.row,
							}}>
							<Edit className="icon edit" />
						</Link>
						<div>
							<DeleteOutline
								className="icon delete"
								onClick={() => {
									deleteWorker(dispatch, params.row._id);
								}}
							/>
						</div>
					</div>
				);
			},
		},
	];
	return (
		<div className="workers">
			<div className="wrapper">
				<div className="header">
					<h2 className="title">Workers list</h2>
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
							content={() => workerRef.current}
						/>
						<Link to="/new-worker">
							<Button
								variant="contained"
								color="primary"
								startIcon={<Add />}
								className="button"
								size="small">
								new Worker
							</Button>
						</Link>
					</div>
				</div>
				{!isFetching ? (
					<div
						className="table"
						style={{ height: '80vh', width: '100%', paddingTop: '20px' }}
						ref={workerRef}>
						<DataGrid
							rows={workers}
							columns={columns}
							pageSize={10}
							getRowId={(r) => r._id || Math.random()}
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

export default Workers;
