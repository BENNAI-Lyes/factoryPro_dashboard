import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { DataGrid } from '@material-ui/data-grid';
import {
	DeleteOutline,
	Add,
	PrintOutlined,
	AccountBalanceOutlined,
	AddOutlined,
} from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import ReactToPrint from 'react-to-print';

import './workerInfo.scss';
import { PayrollsContext } from '../../context/payrollContext/payrollContext';
import {
	deletePayroll,
	getPayrolls,
} from '../../context/payrollContext/payrollContextApiCalls';
import {
	ADD_PAYROLL_FAILURE,
	ADD_PAYROLL_START,
	ADD_PAYROLL_SUCCESS,
	DELETE_ALL_PAYROLL_FAILURE,
	DELETE_ALL_PAYROLL_START,
	DELETE_ALL_PAYROLL_SUCCESS,
} from '../../context/payrollContext/payrollContextActions';
import { axiosI } from '../../config';
import { getDate } from '../../helpers/getDate';
import { AuthContext } from '../../context/authContext/authContext';

//MODAL STYLES
function getModalStyle() {
	const top = 50;
	const left = 50;
	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: '45%',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		border: 'none',
		borderRadius: '5px',
	},
}));

const WorkerInfo = () => {
	const workerRef = useRef();
	const worker = useLocation().worker;

	const { user } = useContext(AuthContext);
	const { dispatch, payrolls, isFetching } = useContext(PayrollsContext);

	const [desc, setDesc] = useState('');
	const [total, setTotal] = useState(0);
	const [payment, setPayment] = useState(0);

	//calc state
	let calcTotal = 0;
	let calcPayment = 0;
	let calcCredit = 0;
	payrolls.forEach((p) => {
		calcTotal = calcTotal + p.total;
		calcPayment = calcPayment + p.payment;
		calcCredit = calcCredit + p.credit;
	});

	//fetch payrolls
	useEffect(() => {
		getPayrolls(dispatch, worker._id);
	}, [dispatch, worker._id]);

	const columns = [
		{ field: 'date', headerName: 'Date', flex: 1 },
		{
			field: 'desc',
			headerName: 'Description',
			flex: 1,
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
			field: 'payment',
			headerName: 'Payment',
			flex: 1,
			renderCell: (params) => {
				return params.row.payment + ',00 DA';
			},
		},
		{
			field: 'credit',
			headerName: 'Debt',
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
				return (
					<div className="action--icons">
						<DeleteOutline
							className="icon delete"
							onClick={() => {
								deletePayroll(dispatch, params.row._id);
							}}
						/>
					</div>
				);
			},
		},
	];

	//modal
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(false);
	const [copen, setCopen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleCopen = () => {
		setCopen(true);
	};

	const handleCclose = () => {
		setCopen(false);
	};

	//date
	const date = getDate();

	//add payroll
	const handelSubmit = async (e) => {
		e.preventDefault();

		dispatch(ADD_PAYROLL_START());
		try {
			const res = await axiosI.post(
				'payroll',
				{
					workerId: worker._id,
					date,
					desc,
					total,
					payment,
					credit: total - payment,
				},
				{
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				}
			);
			dispatch(ADD_PAYROLL_SUCCESS(res.data));
			toast.success('Work Added successfully.');

			//clean modal
			setDesc('');
			setTotal(0);
			setPayment(0);
		} catch (error) {
			toast.error(error?.response?.data?.message);
			dispatch(ADD_PAYROLL_FAILURE(error));
		}
	};

	/* FIXME */
	const handleDeleteAll = async () => {
		dispatch(DELETE_ALL_PAYROLL_START());
		try {
			await axiosI.delete('/payroll/all/' + worker._id, {
				headers: {
					token: 'Bearer ' + user.accessToken,
				},
			});
			dispatch(DELETE_ALL_PAYROLL_SUCCESS());
			toast.success('payrolls has been deleted.');
		} catch (error) {
			dispatch(DELETE_ALL_PAYROLL_FAILURE());
		}
	};

	return (
		<div className="workerInfo">
			<div className="wrapper">
				<div className="header workerInfoHeader">
					<h3 className="title">{worker?.name} Daily Work</h3>
					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button
									variant="outlined"
									size="small"
									color="primary"
									startIcon={<PrintOutlined />}>
									print
								</Button>
							)}
							content={() => workerRef.current}
						/>
						<Button
							size="small"
							variant="contained"
							color="default"
							className="button"
							startIcon={<AccountBalanceOutlined />}
							onClick={() => handleCopen()}>
							account balance
						</Button>

						<Button
							size="small"
							variant="contained"
							color="primary"
							startIcon={<Add />}
							className="button"
							onClick={handleOpen}>
							New work
						</Button>

						<Button
							size="small"
							variant="contained"
							color="secondary"
							startIcon={<DeleteOutline />}
							className="button"
							onClick={handleDeleteAll}>
							Delete all Works
						</Button>
					</div>
				</div>

				{!isFetching ? (
					<div
						className="table"
						style={{ height: '80vh', width: '100%', paddingTop: '20px' }}
						ref={workerRef}>
						<DataGrid
							rows={payrolls}
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
					{/* body */}
					<div style={modalStyle} className={classes.paper}>
						<h2
							id="simple-modal-title"
							style={{
								marginBottom: '12px',
								fontSize: '18px',
								color: '#333',
								fontWeight: 600,
							}}>
							New work day
						</h2>
						<div id="simple-modal-description">
							<form className="newTransactionForm" onSubmit={handelSubmit}>
								<div className="formGroup">
									<label htmlFor="desc" className="label">
										Description
									</label>
									<textarea
										type="string"
										name="desc"
										id="desc"
										placeholder="Entre Description"
										className="textarea"
										value={desc}
										onChange={(e) => setDesc(e.target.value)}></textarea>
								</div>
								<div className="formGroup">
									<label htmlFor="total" className="label">
										Total
									</label>
									<input
										type="number"
										name="total"
										id="total"
										placeholder="Enter Total"
										className="input"
										value={total}
										onChange={(e) => setTotal(e.target.value)}
									/>
								</div>
								<div className="formGroup">
									<label htmlFor="payment" className="label">
										{' '}
										withdrawal
									</label>
									<input
										type="number"
										name="payment"
										id="payment"
										placeholder="Enter withdrawal"
										className="input"
										value={payment}
										onChange={(e) => setPayment(e.target.value)}
									/>
								</div>

								<div className="formGroup">
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
								</div>
							</form>
						</div>
					</div>
				</Modal>

				<Modal
					open={copen}
					onClose={handleCclose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description">
					<div style={modalStyle} className={classes.paper}>
						<h2
							id="simple-modal-title"
							style={{
								marginBottom: '25px',
								fontSize: '20px',
								color: '#333',
								fontWeight: 600,
							}}>
							Calculation
						</h2>
						<div className="calculation">
							<div className="calculation--item total">
								<span className="calculation--item__title">Total</span>
								<span className="calculation--item__value">
									{calcTotal},00 DA
								</span>
							</div>
							<div className="calculation--item withdrawal">
								<span className="calculation--item__title">Withdrawal</span>
								<span className="calculation--item__value">
									{calcPayment},00 DA
								</span>
							</div>
							<div className="calculation--item rest">
								<span className="calculation--item__title">Rest</span>
								<span className="calculation--item__value">
									{calcCredit},00 DA
								</span>
							</div>
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default WorkerInfo;
