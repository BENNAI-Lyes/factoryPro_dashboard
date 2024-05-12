import { useContext, useEffect, useRef, useState } from 'react';
import {
	Button,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ReactToPrint from 'react-to-print';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
	Add,
	KeyboardReturnOutlined,
	PrintOutlined,
	SaveOutlined,
} from '@material-ui/icons';
import nextId from 'react-id-generator';

import './updateBill.scss';
import logo from '../../assets/img/logo.png';
import { getProducts } from '../../context/productContext/productApiCalls';
import { ProductsContext } from '../../context/productContext/productContext';
import { BillsContext } from '../../context/billContext/billContext';
import {
	getBill,
	updateBill,
} from '../../context/billContext/billContextApiCalls';
import { updateClient } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import {
	ADD_TRANSACTION_FAILURE,
	ADD_TRANSACTION_START,
	ADD_TRANSACTION_SUCCESS,
} from '../../context/transactionContext/transactionContextActions';
import { axiosI } from '../../config';
import { getDate } from '../../helpers/getDate';

//MODEL STYLES
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
		width: '30%',
		height: '30vh',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
		border: 'none',
		borderRadius: '10px',
		overflowY: 'auto',
	},
}));

const UpdateBill = () => {
	const bonRef = useRef();
	const billId = useParams().id;
	const date = getDate();

	// FETCH ORDERS
	const { dispatch: dispatchBill, bills } = useContext(BillsContext);
	useEffect(() => {
		getBill(dispatchBill, billId);
	}, [dispatchBill, billId]);

	//fetch products
	const { dispatch, products } = useContext(ProductsContext);
	useEffect(() => {
		getProducts(dispatch);
	}, [dispatch]);

	// set autoCompleat data format
	const autoCompleatProducts = products.map((p) => ({
		title: p.name,
		price: p.price,
		quantity: p.quantity,
	}));

	//get the client
	const [client, setClient] = useState({});

	const { dispatch: dispatchClient } = useContext(ClientsContext);
	useEffect(() => {
		const getClient = async () => {
			if (bills.length === 0) return;

			try {
				const res = await axiosI.get('client/find/' + bills[0].clientId, {
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				});

				setClient(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		getClient();
	}, [bills]);

	const [returnQuantity, setReturnQuantity] = useState(0);
	const [returnProduct, setReturnProduct] = useState('');
	const [returnInputValue, setReturnInputValue] = useState('');
	const [returnProductValue, setReturnProductValue] = useState(null);
	const [returnedProducts, setReturnedProducts] = useState([]);

	useEffect(() => {
		if (bills.length === 0) return;
		setReturnedProducts(bills[0].productsReturned);
	}, [bills]);

	const [moneyMin, setMoneyMin] = useState(0);

	const handelReturnAutoCompleatChange = (event, newValue) => {
		setReturnProduct(newValue.title);
		setReturnProductValue(newValue);
	};

	//modal
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(false);
	const [billPayment, setBillPayment] = useState(0);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	// ADD PAYMENT
	const handelSubmit = async (e) => {
		e.preventDefault();

		const id = nextId();

		//add vers
		dispatch(ADD_TRANSACTION_START());
		try {
			const res = await axiosI.post(
				'transaction',
				{
					billNumber: bills[0]?.number,
					billId: bills[0]?._id,
					clientName: client.name,
					billAmount: bills[0]?.totalRemise
						? bills[0]?.totalRemise
						: bills[0]?.total,
					date,
					vers: billPayment,
					clientId: bills[0]?.clientId,
					id,
				},
				{
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				}
			);
			dispatch(ADD_TRANSACTION_SUCCESS(res.data));
			toast.success('Transaction Added successfully.');

			//update bill
			updateBill(dispatchBill, {
				_id: billId,
				vers: [...bills[0]?.vers, { amount: billPayment, date, id }],
			});

			//clean modal

			//update client credit
			updateClient(dispatchClient, {
				credit: client.credit - billPayment,
				_id: client._id,
			});
		} catch (error) {
			toast.error(error.response.data.message);
			dispatch(ADD_TRANSACTION_FAILURE(error));
		}
	};

	// UPDATE ORDER
	const handelSaveClick = () => {
		//save new bill
		updateBill(dispatchBill, {
			_id: billId,
			productsReturned: returnedProducts.map((r) => ({
				name: r.name,
				quantity: r.quantity,
			})),
		});

		//update client credit
		updateClient(dispatchClient, {
			credit: client.credit - moneyMin,
			_id: bills[0]?.clientId,
		});
	};

	const getProductPrice = (productName) => {
		return products.find((p) => p.name === productName);
	};

	// RETURN PRODUCT
	const handelReturnOneProductClick = () => {
		if (returnProduct && returnQuantity) {
			setReturnedProducts((prev) => [
				...prev,
				{ name: returnProduct, quantity: returnQuantity },
			]);

			setMoneyMin(
				(prev) =>
					prev +
					(bills[0]?.remise
						? getProductPrice(returnProduct)?.price * returnQuantity -
						  (getProductPrice(returnProduct)?.price *
								returnQuantity *
								bills[0]?.remise) /
								100
						: getProductPrice(returnProduct)?.price * returnQuantity)
			);

			setReturnProduct('');
			setReturnQuantity(0);
		} else toast.error('Product name,and Quantity are required.');
	};

	// GET RETURNED PRODUCT PRICE
	const getDesc = (p) => {
		if (bills[0]?.remise !== 0) {
			return (
				getProductPrice(p.name)?.price * p.quantity -
				(getProductPrice(p.name)?.price * p.quantity * bills[0]?.remise) / 100
			);
		} else {
			return getProductPrice(p.name)?.price * p.quantity;
		}
	};

	return (
		<div className="updateBill">
			<div className="wrapper">
				<div className="top">
					<div className="top--header">
						<h1 className="top--header__title">Update order</h1>
						<div className="top--header__buttons">
							<Button
								size="small"
								variant="outlined"
								color="default"
								startIcon={<Add />}
								className="button"
								onClick={handleOpen}>
								New Payment
							</Button>
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
								content={() => bonRef.current}
							/>
							<Button
								size="small"
								variant="contained"
								color="primary"
								startIcon={<SaveOutlined />}
								onClick={handelSaveClick}>
								save
							</Button>
						</div>
					</div>

					{/* update products */}
					<div className="form">
						<div className="items">
							<div className="item">
								<div className="item--label">Select product</div>
								<Autocomplete
									size="small"
									value={returnProductValue}
									onChange={handelReturnAutoCompleatChange}
									inputValue={returnInputValue}
									onInputChange={(event, newInputValue) => {
										setReturnInputValue(newInputValue);
									}}
									id="controllable-states-demo"
									options={autoCompleatProducts}
									getOptionLabel={(option) => option.title}
									renderInput={(params) => (
										<TextField {...params} label="" variant="standard" />
									)}
								/>
							</div>
							<div className="item">
								<div className="item--label">Quantity</div>
								<TextField
									size="small"
									id="rq"
									label=""
									placeholder="Quantity"
									type="number"
									variant="standard"
									InputLabelProps={{
										shrink: true,
									}}
									onChange={(e) => setReturnQuantity(e.target.value)}
									value={returnQuantity}
								/>
							</div>
							<div className="item">
								<Button
									size="small"
									variant="contained"
									color="default"
									startIcon={<KeyboardReturnOutlined />}
									onClick={handelReturnOneProductClick}>
									return product
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="ticket" ref={bonRef}>
					<div className="ticket--header">
						<div className="ticket--header__info">
							<div className="ticket--header__info--top">
								<div className="logo">
									<img src={logo} alt="logo" />
									<p>EL MELSSA PLAST</p>
								</div>
								<div className="title">
									<h2>Bon De Livraison</h2>
									<p>Numéro: {bills[0]?.number} </p>
								</div>
								<p className="date"> {bills[0]?.date} </p>
							</div>

							<div className="ticket--header__info--bottom">
								<div className="left" style={{ border: 'none' }}>
									<div className="item">
										<span className="key">Nom:</span>
										<span className="value">{client?.name}</span>
									</div>{' '}
									<div className="item">
										<span className="key">Address:</span>
										<span className="value"> {client?.address} </span>
									</div>{' '}
									<div className="item">
										<span className="key">Numéro de Téléphone:</span>
										<span className="value"> {client?.phone} </span>
									</div>{' '}
								</div>

								<div className="right" style={{ border: 'none' }}>
									<div className="item">
										<span className="key">Production:</span>
										<span className="value">Produit Citernes</span>
									</div>
									<div className="item">
										<span className="key">Address:</span>
										<span className="value">
											Ain El Melssa Ain Arnet Sétif{' '}
										</span>
									</div>
									<div className="item">
										<span className="key">Contact:</span>
										<span className="value"> 0776012015/0555753828 </span>
									</div>
								</div>
							</div>
						</div>
						<div className="ticket--header__table">
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell width={250} className="tableCell">
												Libellé
											</TableCell>
											<TableCell align="right" className="tableCell">
												Quantité
											</TableCell>
											<TableCell align="right" className="tableCell">
												Prix&nbsp;(U)
											</TableCell>
											{bills[0]?.remise !== 0 && (
												<>
													<TableCell align="right" className="tableCell">
														Remise
													</TableCell>
													<TableCell align="right" className="tableCell">
														Prix Remisé
													</TableCell>
												</>
											)}
											<TableCell align="right" className="tableCell">
												Total
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{bills[0]?.products?.map((row, index) => (
											<TableRow key={index}>
												<TableCell
													component="th"
													scope="row"
													className="tableCell">
													{row.name}
												</TableCell>
												<TableCell align="right" className="tableCell">
													{/* {row.quantity || row.q} */}
													{row.quantity}
												</TableCell>
												<TableCell align="right" className="tableCell">
													{row.price},00
												</TableCell>
												{bills[0]?.remise !== 0 && (
													<>
														<TableCell align="right" className="tableCell">
															{row.remise} %
														</TableCell>
														<TableCell align="right" className="tableCell">
															{row.priceRemisé},00
														</TableCell>
													</>
												)}
												<TableCell align="right" className="tableCell last">
													<div className="content">
														<span>{row.total},00 </span>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
						<div className="ticket--header__return">
							{returnedProducts.length > 0 && (
								<>
									<h3>Produits Retournés:</h3>
									<div className="ticket--header__return__products">
										{returnedProducts.map((p, index) => (
											<div className="ticket--header__return__products--product">
												<div className="dot" />
												<div className="pr" key={index + Math.random()}>
													<div className="nameValue">
														<span className="name"> Name:</span>
														<span className="value"> {p.name}</span>
													</div>
													<div className="nameValue">
														<span className="name">Quantity:</span>
														<span className="value">{p.quantity}</span>
													</div>
													<div className="nameValue">
														<span className="name">Price:</span>
														<span className="value">{getDesc(p)},00 DA</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					</div>
					<div className="ticket--footer">
						<div className="ticket--footer__stats">
							<div className="ticket--footer__stats--left">
								<div className="calcItem">
									<span className="key">Nouveau Solde:</span>
									<span className="value">
										{bills[0]?.newSold}
										,00 DA
									</span>
								</div>
								<div className="calcItem" style={{ marginTop: '10px' }}>
									<span className="key">Ancien Solde:</span>
									<span className="value">
										{bills[0]?.oldSold}
										,00 DA
									</span>
								</div>
								{bills[0]?.vers?.map((v) => (
									<div
										className="calcItem"
										style={{ marginTop: '10px' }}
										key={v._id}>
										<span className="key">Vers:</span>
										<span className="value">
											{' '}
											{v.amount},00 DA | {v.date}{' '}
										</span>
									</div>
								))}
							</div>
							<div className="ticket--footer__stats--right">
								<div className="calcItem">
									<span className="key">Total Bon:</span>
									<span className="value">{bills[0]?.total},00 DA</span>
								</div>
								{bills[0]?.remise !== 0 && (
									<>
										<div className="calcItem">
											<span className="key">Remise:</span>
											<span className="value">
												{bills[0]?.total - bills[0]?.totalRemise},00 DA
											</span>
										</div>
										<div className="calcItem">
											<span className="key">Total Avec remise:</span>
											<span className="value">
												{bills[0]?.totalRemise},00 DA
											</span>
										</div>
									</>
								)}
							</div>
						</div>
						<div className="ticket--footer__cache">Cache&Signature</div>
						<small className="ticket--footer__brand">
							<span style={{ color: 'blue' }}>FactoryPro</span>{' '}
							<span style={{ fontSize: '11px' }}>(Application Web) </span>
							bennailyes19@gmail.com
						</small>
					</div>
				</div>
			</div>

			{/* NEW PAYMENT */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description">
				{/* body */}
				<div style={modalStyle} className={classes.paper}>
					<h2 id="simple-modal-title" style={{ marginBottom: '10px' }}>
						New Payment:
					</h2>

					<div id="simple-modal-description">
						<form className="newTransactionForm" onSubmit={handelSubmit}>
							<div className="formGroup">
								<label htmlFor="billVers" style={{ marginBottom: '15px' }}>
									Payment
								</label>
								<input
									type="number"
									name="billVers"
									id="billVers"
									placeholder="Amount"
									value={billPayment}
									onChange={(e) => setBillPayment(e.target.value)}
								/>
							</div>

							<div className="formGroup">
								<Button
									type="submit"
									color="primary"
									variant="contained"
									size="small">
									Send
								</Button>
							</div>
						</form>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default UpdateBill;
