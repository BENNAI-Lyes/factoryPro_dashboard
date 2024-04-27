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

import './updateBill.scss';
import logo from '../../assets/img/logo.png';

import { getProducts } from '../../context/productContext/productApiCalls';
import {
	addReturnProduct,
	getReturnProducts,
	updateReturnedProduct,
} from '../../context/returnProductContext/returnProductContextApiCalls';
import { ProductsContext } from '../../context/productContext/productContext';
import { BillsContext } from '../../context/billContext/billContext';
import {
	getBill,
	updateBill,
} from '../../context/billContext/billContextApiCalls';
import { ReturnProductsContext } from '../../context/returnProductContext/returnProductContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { updateClient } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';

import {
	ADD_TRANSACTION_FAILURE,
	ADD_TRANSACTION_START,
	ADD_TRANSACTION_SUCCESS,
} from '../../context/transactionContext/transactionContextActions';

import { axiosI } from '../../config';
import { Add, DeleteOutline } from '@material-ui/icons';

import nextId from 'react-id-generator';

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
		width: '40%',
		height: '50vh',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
		border: 'none',
		borderRadius: '5px',
		overflowY: 'auto',
	},
}));

const NewBill = () => {
	const bonRef = useRef();

	const bill = useLocation().bill;

	const { dispatch: dispatchBill, bills } = useContext(BillsContext);
	const { dispatch: dispatchClient } = useContext(ClientsContext);

	useEffect(() => {
		getBill(dispatchBill, bill._id);
	}, [dispatchBill]);

	const [rows, setRows] = useState(bill.products);

	const [total, setTotal] = useState(bill.total);
	const [totalRemise, setTotalRemise] = useState(bill.totalRemise);
	const [credit, setCredit] = useState(bill.credit);

	const { dispatch: dispatchReturnProduct, returnProducts } = useContext(
		ReturnProductsContext
	);

	useEffect(() => {
		getReturnProducts(dispatchReturnProduct);
	}, [dispatchReturnProduct]);

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
	useEffect(() => {
		const getClient = async () => {
			try {
				const res = await axiosI.get('client/find/' + bill.clientId, {
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
	}, [bill.clientId]);

	const [returnQuantity, setReturnQuantity] = useState(0);
	const [returnProduct, setReturnProduct] = useState('');
	const [returnInputValue, setReturnInputValue] = useState('');
	const [returnProductValue, setReturnProductValue] = useState(null);
	const [returnedProducts, setReturnedProducts] = useState(
		bill.productsReturned
	);

	const [moneyMin, setMoneyMin] = useState(0);

	const handelReturnAutoCompleatChange = (event, newValue) => {
		setReturnProduct(newValue.title);
		setReturnProductValue(newValue);
	};

	//date
	const today = new Date();
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	const date = today.toLocaleDateString('fr-FR', options);

	//
	//modal
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(false);
	const [copen, setCopen] = useState(false);
	const [billPayment, setBillPayment] = useState(0);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleCclose = () => {
		setCopen(false);
	};

	// update products
	const [q, setQ] = useState(0);

	const [product, setProduct] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [productValue, setProductValue] = useState(null);

	const handelAutoCompleatChange = (event, newValue) => {
		setProduct(newValue.title);
		setProductValue(newValue);
	};

	function createDataR(name, q, price, remise, priceRemisé, total) {
		return { name, q, price, remise, priceRemisé, total };
	}

	function createData(name, q, price, total) {
		return { name, q, price, total };
	}

	const getPriceU = (productName) =>
		autoCompleatProducts.find((p) => p.title === productName).price;

	const getPriceUR = (price, remise) => price - (price * remise) / 100;

	const getTotal = (price, q) => parseInt(price, 10) * parseInt(q, 10);

	const handelClickWithR = () => {
		const productDB = products.find((p) => p.name === product);

		if (q > productDB.quantity) {
			toast.error(`There is Only ${productDB.quantity} in the stoke. `);
		} else {
			setRows([
				...rows,
				createDataR(
					product,
					q,
					getPriceU(product),
					bill.remise,
					getPriceUR(getPriceU(product), bill.remise),
					getTotal(getPriceUR(getPriceU(product), bill.remise), q)
				),
			]);
			setTotal((prv) => prv + getTotal(getPriceU(product), q));
			setTotalRemise(
				(prv) => prv + getTotal(getPriceUR(getPriceU(product), bill.remise), q)
			);
		}
	};

	const handelClickWithOutR = () => {
		const productDB = products.find((p) => p.name === product);

		if (q > productDB.quantity) {
			toast.error(`There is Only ${productDB.quantity} in the stoke. `);
		} else {
			setRows([
				...rows,
				createData(
					product,
					q,
					getPriceU(product),
					getTotal(getPriceU(product), q)
				),
			]);
			setTotal((prv) => prv + getTotal(getPriceU(product), q));
		}
	};

	const handelDeleteClick = (r) => {
		setRows(rows.filter((row) => r !== row));

		if (bill.remise != '0') {
			setTotal((prev) => prev - parseInt(r.price) * parseInt(r.quantity));
			setTotalRemise((prev) => prev - r.total);
		} else {
			setTotal((prev) => prev - r.total);
		}
	};

	// add transaction
	const handelSubmit = async (e) => {
		e.preventDefault();

		const id = nextId();

		//add vers
		dispatch(ADD_TRANSACTION_START());
		try {
			const res = await axiosI.post(
				'transaction',
				{
					billNumber: bill.number,
					billId: bill._id,
					clientName: client.name,
					billAmount: bill.totalRemise ? bill.totalRemise : bill.total,
					date,
					vers: billPayment,
					clientId: bill.clientId,
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
				_id: bill._id,

				vers: [...bill.vers, { amount: billPayment, date, id }],
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

	const handelSaveClick = () => {
		const id = nextId();

		//add return products
		if (bill.productsReturned.length === 0) {
			addReturnProduct(dispatchReturnProduct, {
				billNumber: bill.number,
				bDate: bill.date,
				rDate: date,
				clientName: bill.clientName,
				products: returnedProducts,
				returnProductId: id,
			});
		} else {
			const rp = returnProducts.find((r) => r.billNumber === bill.number);
			updateReturnedProduct(dispatchReturnProduct, rp?._id, {
				products: returnedProducts,
			});
		}

		setReturnedProducts([]);

		//save new bill
		updateBill(dispatchBill, {
			_id: bill._id,
			date: bill.date,
			number: bill.number,
			clientName: bill.clientName,
			remise: bill.remise,
			total,
			totalRemise,
			address: bill.address,
			phone: bill.phone,
			credit,
			returnProductId: id,

			products: rows.map((r) => ({
				name: r.name,
				price: r.price,
				priceRemisé: r.priceRemisé,
				quantity: r.quantity,
				remise: r.remise,
				total: r.total,
			})),
			productsReturned: returnedProducts.map((r) => ({
				name: r.name,
				quantity: r.quantity,
			})),
		});

		//update client credit
		updateClient(dispatchClient, {
			credit: client.credit - moneyMin,
			_id: bill.clientId,
		});
	};

	const getProductPrice = (productName) => {
		return products.find((p) => p.name === productName);
	};

	const handelReturnOneProductClick = () => {
		if (returnProduct && returnQuantity) {
			setReturnedProducts([
				...returnedProducts,
				{ name: returnProduct, quantity: returnQuantity },
			]);

			setMoneyMin(
				(prev) =>
					prev +
					(bill.remise
						? getProductPrice(returnProduct)?.price * returnQuantity -
						  (getProductPrice(returnProduct)?.price *
								returnQuantity *
								bill.remise) /
								100
						: getProductPrice(returnProduct)?.price * returnQuantity)
			);
		} else toast.error('Product name,and Quantity are required.');
	};

	useEffect(() => {
		setTotal(bill.total - (moneyMin + (bill.remise * moneyMin) / 100));
		setTotalRemise(bill.totalRemise - moneyMin);
		setCredit(
			bill.remise != 0
				? bill.totalRemise - moneyMin - bill.vers[0].amount
				: bill.total -
						(moneyMin + (bill.remise * moneyMin) / 100) -
						bill.vers[0].amount
		);

		if (moneyMin > 0) {
			returnedProducts.forEach((rp) => {
				let items = [...rows];
				rows.forEach((r, i) => {
					if (r.name === rp.name) {
						let item = { ...rows[i] };

						item.quantity = item.quantity - rp.quantity;
						item.total = item.remise
							? item.quantity * item.priceRemisé
							: item.quantity * item.price;

						items[i] = item;
					}
				});
				setRows(items);
			});
		}
	}, [moneyMin]);

	const getDesc = (p) => {
		if (bill.remise !== 0) {
			return (
				getProductPrice(p.name)?.price * p.quantity -
				(getProductPrice(p.name)?.price * p.quantity * bill.remise) / 100
			);
		} else {
			return getProductPrice(p.name)?.price * p.quantity;
		}
	};

	useEffect(() => {
		console.log(billPayment);
	}, [billPayment]);

	return (
		<div className="newBill">
			<div className="wrapper">
				<div className="top">
					<div className="items">
						<div className="item">
							<Button
								size="small"
								variant="contained"
								color="primary"
								startIcon={<Add />}
								className="button"
								onClick={handleOpen}>
								New Payment
							</Button>
						</div>
					</div>

					{/* update products */}
					<div className="items">
						<h1 className="mainTitle">Add new products:</h1>
						<div className="item">
							<Autocomplete
								size="small"
								value={productValue}
								onChange={handelAutoCompleatChange}
								inputValue={inputValue}
								onInputChange={(event, newInputValue) => {
									setInputValue(newInputValue);
								}}
								id="controllable-states-demo"
								options={autoCompleatProducts}
								getOptionLabel={(option) => option.title}
								style={{ width: 300 }}
								renderInput={(params) => (
									<TextField {...params} label="Product" variant="outlined" />
								)}
							/>
						</div>
						<div className="item">
							<TextField
								size="small"
								id="q"
								label="Quantité"
								sx={{ width: 80 }}
								placeholder="Quantity"
								type="number"
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
								onChange={(e) => setQ(e.target.value)}
								value={q}
							/>
						</div>
						<div className="item">
							<Button
								size="small"
								variant="outlined"
								color="primary"
								onClick={
									bill.remise !== '0' ? handelClickWithR : handelClickWithOutR
								}>
								Add
							</Button>
						</div>
					</div>
					{/* end of update products */}

					<div className="items">
						<h3 className="subTitle">Returned Products:</h3>
						<div className="item">
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
								style={{ width: 300 }}
								renderInput={(params) => (
									<TextField {...params} label="Product" variant="outlined" />
								)}
							/>
						</div>
						<div className="item">
							<TextField
								size="small"
								id="rq"
								label="Quantité"
								sx={{ width: 80 }}
								placeholder="Quantity"
								type="number"
								variant="outlined"
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
								variant="outlined"
								color="primary"
								onClick={handelReturnOneProductClick}>
								return
							</Button>
						</div>
					</div>

					<div className="items">
						<Button
							size="small"
							variant="contained"
							color="primary"
							onClick={handelSaveClick}>
							save
						</Button>
						<ReactToPrint
							trigger={() => (
								<Button variant="contained" size="small">
									print
								</Button>
							)}
							content={() => bonRef.current}
						/>
					</div>
				</div>

				{/* ///////bon/////// */}
				<div className="bottom" ref={bonRef}>
					<div className="backgroundImg">
						<img src={logo} alt="background" />
					</div>

					<div className="bottomContent">
						<div className="t">
							<div className="info">
								<div className="topInfo">
									<div className="logo">
										<img src={logo} alt="logo" />
										<p>EL MELSSA PLAST</p>
									</div>
									<div className="bonTitle">
										<h2>Bon De Livraison</h2>
										<p>Numéro: {bill.number} </p>
									</div>
									<p className="bonDate"> {bill.date} </p>
								</div>

								<div className="bottomInfo billBottomInfo">
									<div className="left" style={{ border: 'none' }}>
										<div className="item">
											<span className="key">Nom:</span>
											<span className="value">{bill.clientName}</span>
										</div>{' '}
										<div className="item">
											<span className="key">Address:</span>
											<span className="value"> {bill.address} </span>
										</div>{' '}
										<div className="item">
											<span className="key">Numéro de Téléphone:</span>
											<span className="value"> {bill.phone} </span>
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
						</div>

						<div className="m">
							<div className="table">
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
												{bill.remise !== 0 && (
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
											{rows?.map((row, index) => (
												<TableRow key={index}>
													<TableCell
														component="th"
														scope="row"
														className="tableCell">
														{row.name}
													</TableCell>
													<TableCell align="right" className="tableCell">
														{row.quantity || row.q}
													</TableCell>
													<TableCell align="right" className="tableCell">
														{row.price},00
													</TableCell>
													{bill.remise !== 0 && (
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
															<button
																type="button"
																onClick={() => handelDeleteClick(row)}
																className="delete">
																<DeleteOutline className="deleteIcon" />
															</button>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>

							{returnedProducts.length > 0 && (
								<div className="productR">
									{!bill.productsReturned && <h3>Produits Retournés: </h3>}
									<div className="prs">
										{returnedProducts.map((p, index) => (
											<div
												className="pr"
												style={{ display: 'flex', alignItems: 'center' }}
												key={index + Math.random()}>
												<span className="prQ">{p.quantity}:</span>
												<span className="prName"> {p.name}</span>
												<span className="prQ" style={{ fontSize: '14px' }}>
													({getDesc(p)},00 DA){' '}
												</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						<div className="b">
							<div className="calc billCalc">
								<div className="calcLeft">
									<div className="calcItem">
										<span className="key">Nouveau Solde:</span>
										<span className="value">
											{' '}
											{bill.remise != 0
												? totalRemise - bill?.vers[0]?.amount
												: total - bill?.vers[0]?.amount}
											,00 DA
										</span>
									</div>
									<div className="calcItem" style={{ marginTop: '10px' }}>
										<span className="key">Ancien Solde:</span>
										<span className="value"> {bill?.oldCredit},00 DA </span>
									</div>
									{bills[0]?.vers?.map((v) => (
										<div
											key={v._id}
											className="calcItem"
											style={{ marginTop: '10px' }}>
											<span className="key">Vers:</span>
											<span className="value">
												{' '}
												{v.amount},00 DA | {v.date}{' '}
											</span>
										</div>
									))}
								</div>
								<div className="calcRight">
									<div className="calcItem">
										<span className="key">Total Bon:</span>
										<span className="value">{total},00</span>
									</div>
									{bill.remise != '0' && (
										<>
											<div className="calcItem">
												<span className="key">Remise:</span>
												<span className="value">{total - totalRemise},00</span>
											</div>
											<div className="calcItem">
												<span className="key">Total Avec remise:</span>
												<span className="value">{totalRemise},00</span>
											</div>
										</>
									)}
								</div>
							</div>
							<div className="footer">Cache&Signature</div>
						</div>
						<small>
							<span style={{ color: 'blue' }}>EasyManage</span>{' '}
							<span style={{ fontSize: '11px' }}>(Application Web) </span>
							bennailyes19@gmail.com
						</small>
					</div>
				</div>
			</div>

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

export default NewBill;
