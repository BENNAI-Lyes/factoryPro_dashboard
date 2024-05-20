import './expenses.scss';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { DataGrid } from '@material-ui/data-grid';
import {
	Add,
	AddOutlined,
	DeleteOutline,
	PrintOutlined,
} from '@material-ui/icons';

import { useContext, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { ExpensesContext } from '../../context/expenseContext/expenseContext';
import {
	deleteExpense,
	getExpenses,
} from '../../context/expenseContext/expenseContextApiCalls';
import {
	ADD_EXPENSE_FAILURE,
	ADD_EXPENSE_START,
	ADD_EXPENSE_SUCCESS,
} from '../../context/expenseContext/expenseContextActions';

import { toast } from 'react-toastify';
import { axiosI } from '../../config';
import ReactToPrint from 'react-to-print';

import { formatDate } from '../../helpers/getDate';
import { AuthContext } from '../../context/authContext/authContext';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

//TODO: FIX MODAL STYLES
const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: '45%',
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ccc',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '5px',
	},
}));

const Expenses = () => {
	const expenseRef = useRef();
	const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

	const { user } = useContext(AuthContext);

	const { dispatch, expenses, isFetching } = useContext(ExpensesContext);

	const [name, setName] = useState('');
	const [price, setPrice] = useState('');

	useEffect(() => {
		getExpenses(dispatch);
	}, [dispatch]);

	const columns = [
		{
			field: 'createdAt',
			headerName: 'Date',
			flex: 1,
			renderCell: (params) => {
				return DATE_PATTERN.test(params.row.createdAt.slice(0, 10))
					? formatDate(params.row.createdAt.slice(0, 10))
					: params.row.createdAt.slice(0, 10);
			},
		},
		{
			field: 'name',
			headerName: 'Description',
			flex: 1,
		},
		{
			field: 'price',
			headerName: 'Amount',
			flex: 1,
			renderCell: (params) => {
				return params.row.price + ',00 DA';
			},
		},

		{
			field: 'action',
			headerName: 'Actions',
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="action--icons">
						<DeleteOutline
							onClick={() => {
								deleteExpense(dispatch, params.row._id);
							}}
							className="icon delete"
						/>
					</div>
				);
			},
		},
	];

	//modal
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handelSubmit = async (e) => {
		e.preventDefault();

		dispatch(ADD_EXPENSE_START());
		try {
			const res = await axiosI.post(
				'expense',
				{
					name,
					price,
				},
				{
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				}
			);
			dispatch(ADD_EXPENSE_SUCCESS(res.data));
			toast.success('Expense Added successfully.');

			//clean modal
			setName('');
			setPrice('');
		} catch (error) {
			toast.error(error?.response?.data?.message);
			dispatch(ADD_EXPENSE_FAILURE(error));
		}
	};

	return (
		<div className="expenses">
			<div className="wrapper">
				<div className="header">
					<h3 className="title"> Expenses list </h3>
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
							content={() => expenseRef.current}
						/>
						<Button
							onClick={handleOpen}
							variant="contained"
							startIcon={<Add />}
							size="small"
							color="primary">
							New expense
						</Button>
					</div>
				</div>

				{!isFetching ? (
					<div
						className="table"
						style={{ height: '80vh', width: '100%', paddingTop: '20px' }}
						ref={expenseRef}>
						<DataGrid
							rows={expenses}
							columns={columns}
							pageSize={10}
							getRowId={(r) => r._id}
						/>
					</div>
				) : (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress color="primary" style={{ marginTop: '50px' }} />
					</div>
				)}

				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description">
					<div style={modalStyle} className={classes.paper}>
						<h2
							id="simple-modal-title"
							style={{
								marginBottom: '12px',
								fontSize: '18px',
								color: '#333',
								fontWeight: 600,
							}}>
							New Expense
						</h2>
						<div id="simple-modal-description">
							<form className="newTransactionForm" onSubmit={handelSubmit}>
								<div className="formGroup">
									<label htmlFor="name" className="label">
										Description
									</label>
									<textarea
										type="string"
										name="name"
										id="name"
										placeholder="Expense for a ... "
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="textarea"></textarea>
								</div>
								<div className="formGroup">
									<label htmlFor="price" className="label">
										Amount:
									</label>
									<input
										type="number"
										name="price"
										id="price"
										placeholder="Amount"
										className="input"
										value={price}
										onChange={(e) => setPrice(e.target.value)}
									/>
								</div>

								<div className="formGroup">
									<Button
										type="submit"
										color="primary"
										variant="contained"
										size="large"
										startIcon={<AddOutlined />}>
										add
									</Button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default Expenses;
