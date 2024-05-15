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
import {
	AddOutlined,
	DeleteOutline,
	PrintOutlined,
	SaveOutlined,
} from '@material-ui/icons';
import ReactToPrint from 'react-to-print';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import './newBill.scss';
import logo from '../../assets/img/logo.png';
import {
	getProducts,
	updateProduct,
} from '../../context/productContext/productApiCalls';
import { ProductsContext } from '../../context/productContext/productContext';
import { BillsContext } from '../../context/billContext/billContext';
import { getBills } from '../../context/billContext/billContextApiCalls';
import {
	ADD_BILL_FAILURE,
	ADD_BILL_START,
	ADD_BILL_SUCCESS,
} from '../../context/billContext/billContextActions';
import {
	ADD_TRANSACTION_START,
	ADD_TRANSACTION_SUCCESS,
	ADD_TRANSACTION_FAILURE,
} from '../../context/transactionContext/transactionContextActions';
import { ClientsContext } from '../../context/clientContext/clientContext';
import {
	getClients,
	updateClient,
} from '../../context/clientContext/clientApiCalls';
import { axiosI } from '../../config';
import { formatDate, getDate } from '../../helpers/getDate';
import DatePicker from '../../components/datePicker/DatePicker';

const NewBill = () => {
	const history = useHistory();
	const bonRef = useRef();
	const date = getDate();

	const [bonData, setBonData] = useState({
		remise: '0',
		vers: 0,
	});
	const [loading, setLoading] = useState(false);
	const [rows, setRows] = useState([]);
	const [q, setQ] = useState(0);
	const [total, setTotal] = useState(0);
	const [totalRemise, setTotalRemise] = useState(0);
	const [selectedDate, setSelectedDate] = useState('');
	const [transport, setTransport] = useState(0);

	//fetch bills
	const { dispatch: dispatchBill, bills } = useContext(BillsContext);
	useEffect(() => {
		getBills(dispatchBill);
	}, [dispatchBill]);

	//fetch products
	const { dispatch, products } = useContext(ProductsContext);
	useEffect(() => {
		getProducts(dispatch);
	}, [dispatch]);

	// format product
	const formattedProducts = products.map((p) => ({
		title: p.name,
		price: p.price,
		quantity: p.quantity,
	}));

	const [product, setProduct] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [productValue, setProductValue] = useState(null);

	const handelAutoCompleatChange = (event, newValue) => {
		setProduct(newValue.title);
		setProductValue(newValue);
	};

	//fetch clients
	const { dispatch: dispatchClient, clients } = useContext(ClientsContext);
	useEffect(() => {
		getClients(dispatchClient);
	}, [dispatchClient]);

	//set auto compleat clients data format
	const formattedClient = clients.map((client) => ({
		...client,
		title: client.name,
	}));

	const [client, setClient] = useState('');
	const [clientInputValue, setClientInputValue] = useState('');
	const [clientValue, setClientValue] = useState(null);

	console.log('client', client);

	//set remise value
	useEffect(() => {
		setBonData((prev) => {
			return { ...prev, remise: clientValue?.remise };
		});
	}, [clientValue]);

	const handelAutoCompleatClientChange = (event, newValue) => {
		setClient(newValue.title);
		setClientValue(newValue);
	};

	//handel save new bill
	const handelSaveClick = async () => {
		/* */
		setLoading(true);
		dispatch(ADD_BILL_START());
		try {
			const res = await axiosI.post(
				'bon',
				{
					clientId: clientValue._id,
					date: selectedDate ? selectedDate : date,
					number: bills.length === 0 ? 1 : bills[bills.length - 1]?.number + 1,
					remise: bonData.remise,
					total,
					totalRemise,
					transport,
					newSold:
						bonData?.remise !== '0'
							? totalRemise + clientValue?.credit
							: total + clientValue?.credit,
					oldSold: clientValue?.credit,
					vers: [
						{ date: selectedDate ? selectedDate : date, amount: bonData.vers },
					],
					products: rows.map((r) => ({
						name: r.name,
						price: r.price,
						priceRemisé: r.priceRemisé,
						quantity: r.q,
						remise: r.remise,
						total: r.total,
					})),
				},
				{
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				}
			);
			toast.success('Bill Added Successfully.');
			dispatch(ADD_BILL_SUCCESS(res.data));

			//update client credit
			updateClient(dispatchClient, {
				credit:
					clientValue.credit +
					(totalRemise ? totalRemise - bonData.vers : total - bonData.vers),
				_id: clientValue._id,
			});

			//discount products quantity
			products.forEach((product) => {
				res.data.products.forEach((p) => {
					if (product.name === p.name)
						updateProduct(dispatch, {
							name: product.name,
							price: product.price,
							quantity: product.quantity - p.quantity,
							_id: product._id,
						});
				});
			});

			//clean form
			setBonData({
				remise: '0',
				credit: 0,
				vers: 0,
			});
			setRows([]);
			setProduct('');
			setQ(0);
			setTotal(0);
			setTotalRemise(0);
			setTransport(0);

			// add transactions
			dispatch(ADD_TRANSACTION_START());
			try {
				const res = await axiosI.post(
					'transaction',
					{
						billNumber:
							bills.length === 0 ? 1 : bills[bills.length - 1]?.number + 1,
						clientId: clientValue._id,
						date: selectedDate ? selectedDate : date,
						vers: bonData.vers,
						billAmount: total,
						credit:
							total.remise !== 0
								? clientValue.credit + (totalRemise - bonData.vers)
								: clientValue.credit + (total - bonData.vers),
					},
					{
						headers: {
							token:
								'Bearer ' +
								JSON.parse(localStorage.getItem('user')).accessToken,
						},
					}
				);
				dispatch(ADD_TRANSACTION_SUCCESS(res.data));
				toast.success('Transaction Added successfully.');
			} catch (error) {
				toast.error(error.response.data.message);
				dispatch(ADD_TRANSACTION_FAILURE(error));
			}

			history.push('/orders', { replace: true });
		} catch (error) {
			dispatch(ADD_BILL_FAILURE(error));
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
		}
		/**/
	};

	function createDataR(name, q, price, remise, priceRemisé, total) {
		return { name, q, price, remise, priceRemisé, total };
	}

	function createData(name, q, price, total) {
		return { name, q, price, total };
	}

	const getPriceU = (productName) =>
		formattedProducts.find((p) => p.title === productName).price;

	const getPriceUR = (price, remise) => price - (price * remise) / 100;

	const getTotal = (price, q) => parseInt(price, 10) * parseInt(q, 10);

	const handelClickWithR = () => {
		const currentProduct = products.find((p) => p.name === product);

		if (q > currentProduct.quantity) {
			toast.error(`There is Only ${currentProduct.quantity} in the stoke. `);
		} else {
			setRows([
				...rows,
				createDataR(
					product,
					q,
					getPriceU(product),
					bonData.remise,
					getPriceUR(getPriceU(product), bonData.remise),
					getTotal(getPriceUR(getPriceU(product), bonData.remise), q)
				),
			]);
			setTotal((prv) => prv + getTotal(getPriceU(product), q));
			setTotalRemise(
				(prv) =>
					prv + getTotal(getPriceUR(getPriceU(product), bonData.remise), q)
			);
		}
	};

	const handelClickWithOutR = () => {
		const currentProduct = products.find((p) => p.name === product);

		// console.log(pr.quantity);
		if (q > currentProduct.quantity) {
			toast.error(`There is Only ${currentProduct.quantity} in the stoke. `);
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

	const handelChange = (e) => {
		setBonData({ ...bonData, [e.target.id]: e.target.value });
	};

	const handelDeleteClick = (r) => {
		setRows(rows.filter((row) => r !== row));

		if (bonData.remise === '0') {
			setTotal((prev) => prev - r.total);
		} else {
			setTotal((prev) => prev - r.price * r.q);
			setTotalRemise((prev) => prev - r.total);
		}
	};

	return (
		<div className="newBill">
			<div className="wrapper">
				<div className="top">
					<div className="top--header">
						<h1 className="top--header__title">New order</h1>
						<div className="top--header__buttons">
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
								content={() => bonRef.current}
							/>

							<Button
								size="small"
								variant="contained"
								color="primary"
								onClick={handelSaveClick}
								startIcon={<SaveOutlined />}
								disabled={loading}>
								Save
							</Button>
						</div>
					</div>
					<div className="form">
						<div className="items">
							<div className="item">
								<div className="item--label">Select client</div>
								<Autocomplete
									size="small"
									value={clientValue}
									onChange={handelAutoCompleatClientChange}
									inputValue={clientInputValue}
									onInputChange={(event, newInputValue) => {
										setClientInputValue(newInputValue);
									}}
									id="controllable-states-demo"
									options={formattedClient}
									getOptionLabel={(option) => option.title}
									renderInput={(params) => (
										<TextField
											{...params}
											label=""
											variant="standard"
											size="small"
										/>
									)}
								/>
							</div>
							<div className="item">
								<div className="item--label">Transportation price</div>
								<TextField
									size="small"
									id="transport"
									label=""
									placeholder="La transport"
									type="number"
									variant="standard"
									InputLabelProps={{
										shrink: true,
									}}
									onChange={(e) => setTransport(e.target.value)}
									value={transport}
								/>
							</div>
							<div className="item">
								<div className="item--label">Payment</div>
								<TextField
									size="small"
									id="vers"
									label=""
									placeholder="Entrez Vers"
									type="number"
									variant="standard"
									InputLabelProps={{
										shrink: true,
									}}
									value={bonData.vers}
									onChange={handelChange}
								/>
							</div>
						</div>

						<div className="items">
							<div className="item">
								<div className="item--label">Select product</div>
								<Autocomplete
									size="small"
									value={productValue}
									onChange={handelAutoCompleatChange}
									inputValue={inputValue}
									onInputChange={(event, newInputValue) => {
										setInputValue(newInputValue);
									}}
									id="controllable-states-demo"
									options={formattedProducts}
									getOptionLabel={(option) => option.title}
									renderInput={(params) => (
										<TextField {...params} label="" variant="standard" />
									)}
								/>
							</div>
							<div className="item">
								<TextField
									size="small"
									id="q"
									label="Quantity"
									placeholder="Quantity"
									type="number"
									variant="standard"
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
									color="default"
									startIcon={<AddOutlined />}
									onClick={
										bonData.remise !== '0'
											? handelClickWithR
											: handelClickWithOutR
									}>
									Add Product
								</Button>
							</div>
						</div>

						<div className="items">
							<div className="item">
								<div className="item--label">Change date</div>
								<DatePicker
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* TICKET */}
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
									<p>
										Numéro:{' '}
										{bills.length === 0
											? 1
											: bills[bills.length - 1]?.number + 1}{' '}
									</p>
								</div>
								<p className="date">
									{' '}
									{selectedDate ? formatDate(selectedDate) : date}{' '}
								</p>
							</div>

							<div className="ticket--header__info--bottom">
								<div className="left" style={{ border: 'none' }}>
									<div className="item">
										<span className="key">Nom:</span>
										<span className="value">{clientValue?.name}</span>
									</div>{' '}
									<div className="item">
										<span className="key">Address:</span>
										<span className="value"> {clientValue?.address} </span>
									</div>{' '}
									<div className="item">
										<span className="key">Numéro de Téléphone:</span>
										<span className="value"> {clientValue?.phone} </span>
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
											{bonData.remise !== '0' && (
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
										{rows.map((row, index) => (
											<TableRow key={index}>
												<TableCell
													component="th"
													scope="row"
													className="tableCell">
													{row.name}
												</TableCell>
												<TableCell align="right" className="tableCell">
													{row.q}
												</TableCell>
												<TableCell align="right" className="tableCell">
													{row.price},00 DA
												</TableCell>
												{bonData.remise !== '0' && (
													<>
														<TableCell align="right" className="tableCell">
															{row.remise} %
														</TableCell>
														<TableCell align="right" className="tableCell">
															{row.priceRemisé},00 DA
														</TableCell>
													</>
												)}
												<TableCell align="right" className="tableCell last">
													<div className="content">
														<span>{row.total},00 DA</span>
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
					</div>

					<div className="ticket--footer">
						<div className="ticket--footer__stats">
							<div className="ticket--footer__stats--left">
								<div className="calcItem">
									<span className="key">Nouveau Solde:</span>
									<span className="value">
										{bonData?.remise !== '0'
											? totalRemise + clientValue?.credit
											: total + clientValue?.credit}
										,00 DA
									</span>
								</div>
								<div className="calcItem" style={{ marginTop: '10px' }}>
									<span className="key">Ancien Solde:</span>
									<span className="value"> {clientValue?.credit},00 DA</span>
								</div>
								<div className="calcItem" style={{ marginTop: '10px' }}>
									<span className="key">Vers:</span>
									<span className="value">
										{bonData.vers},00 DA | {selectedDate ? selectedDate : date}{' '}
									</span>
								</div>
							</div>
							<div className="ticket--footer__stats--right">
								<div className="calcItem">
									<span className="key">Total Bon:</span>
									<span className="value">{total},00 DA</span>
								</div>
								{bonData.remise !== '0' && (
									<>
										<div className="calcItem">
											<span className="key">Remise:</span>
											<span className="value">{total - totalRemise},00 DA</span>
										</div>
										<div className="calcItem">
											<span className="key">Total Avec remise:</span>
											<span className="value">{totalRemise},00 DA</span>
										</div>
									</>
								)}
							</div>
						</div>
						<div className="ticket--footer__cache">Cache&Signature</div>
						<small className="ticket--footer__brand">
							<span style={{ color: 'blue' }}>FactoryPro</span>{' '}
							<span style={{ fontSize: '11px' }}>(Web Application) </span>
							bennailyes19@gmail.com
						</small>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewBill;
