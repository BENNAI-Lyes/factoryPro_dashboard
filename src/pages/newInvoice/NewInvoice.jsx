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
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { ToWords } from 'to-words';

import './newInvoice.scss';
import logo from '../../assets/img/logo.png';
import {
	AddOutlined,
	DeleteOutline,
	PrintOutlined,
	SaveOutlined,
} from '@material-ui/icons';
import { getProducts } from '../../context/productContext/productApiCalls';
import { ProductsContext } from '../../context/productContext/productContext';
import { InvoicesContext } from '../../context/invoiceContext/invoiceContext';
import { getInvoices } from '../../context/invoiceContext/invoiceApiCalls';
import {
	ADD_INVOICE_FAILURE,
	ADD_INVOICE_START,
	ADD_INVOICE_SUCCESS,
} from '../../context/invoiceContext/invoiceContextActions';

import { getClients } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { axiosI } from '../../config';
import DatePicker from '../../components/datePicker/DatePicker';
import { formatDate, getDate } from '../../helpers/getDate';

const NewInvoice = () => {
	const history = useHistory();
	const bonRef = useRef();

	// GET CURRENT DATE
	const date = getDate();

	// convert total price to a words.
	const toWords = new ToWords({
		localeCode: 'fr-FR',
		converterOptions: {
			currency: true,
			ignoreDecimal: false,
			ignoreZeroCurrency: false,
			doNotAddOnly: true,
			currencyOptions: {
				// can be used to override defaults for the selected locale
				name: 'Dinar',
				plural: 'Dinar',
				symbol: 'DA',
				fractionalUnit: {
					name: '',
					plural: '',
					symbol: '',
				},
			},
		},
	});

	const [newDate, setNewDate] = useState('');

	const { dispatch: dispatchClient, clients } = useContext(ClientsContext);

	useEffect(() => {
		getClients(dispatchClient);
	}, [dispatchClient]);

	//set auto compleat clients data format
	const clientsAutoCompleat = clients.map((c) => ({
		...c,
		title: c.name,
	}));

	const [client, setClient] = useState('');
	const [clientInputValue, setClientInputValue] = useState('');
	const [clientValue, setClientValue] = useState(null);

	const handelAutoCompleatClientChange = (event, newValue) => {
		setClient(newValue.title);
		setClientValue(newValue);
	};

	const [rows, setRows] = useState([]);
	const [q, setQ] = useState(0);
	const [total, setTotal] = useState(0);

	const { dispatch: dispatchInvoice, invoices } = useContext(InvoicesContext);
	//fetch products
	const { dispatch, products } = useContext(ProductsContext);
	useEffect(() => {
		getProducts(dispatch);
	}, [dispatch]);

	useEffect(() => {
		getInvoices(dispatchInvoice);
	}, [dispatchInvoice]);

	// set autoCompleat data format
	const autoCompleatProducts = products.map((p) => ({
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

	// HANDEL ADD INVOICE
	const handelSaveClick = async () => {
		dispatchInvoice(ADD_INVOICE_START());
		try {
			const res = await axiosI.post(
				'facture',
				{
					date,
					number:
						invoices.length === 0
							? 1
							: invoices[invoices.length - 1]?.number + 1,
					clientId: clientValue?._id,
					totalPrice: total,
					totalPriceWords: toWords.convert(total + total * 0.19, {
						currency: true,
					}),
					products: rows.map((r) => ({
						name: r.name,
						price: r.price,
						quantity: r.q,
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
			dispatchInvoice(ADD_INVOICE_SUCCESS(res.data));
			toast.success('Invoice Added successfully.');

			//clean form

			setRows([]);
			setQ(0);
			setTotal(0);
			setTotal('');
			setProductValue(null);
			setClientValue(null);

			history.push('/invoices', { replace: true });
		} catch (error) {
			toast.error(error.response.data.message);
			dispatchInvoice(ADD_INVOICE_FAILURE(error));
		}
	};

	function createData(name, q, price, total) {
		return { name, q, price, total };
	}

	const getPriceU = (productName) =>
		autoCompleatProducts.find((p) => p.title === productName).price;

	const getTotal = (price, q) => parseInt(price, 10) * parseInt(q, 10);

	const handelClickWithOutR = () => {
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
	};

	const handelDeleteClick = (r) => {
		setRows(rows.filter((row) => r !== row));
		setTotal((prev) => prev - r.total);
	};

	return (
		<div className="newInvoice">
			<div className="wrapper">
				<div className="top">
					<div className="top--header">
						<h1 className="top--header__title">New Invoice</h1>
						<div className="top--header__buttons">
							<ReactToPrint
								trigger={() => (
									<Button
										variant="outlined"
										color="primary"
										startIcon={<PrintOutlined />}
										size="small">
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
									options={clientsAutoCompleat}
									getOptionLabel={(option) => option.title}
									style={{ width: 300 }}
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
								<div className="item--label">Change date</div>
								<DatePicker
									value={newDate}
									onChange={(e) => setNewDate(e.target.value)}
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
									options={autoCompleatProducts}
									getOptionLabel={(option) => option.title}
									style={{ width: 300 }}
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
								<div className="item--label">Quantity</div>
								<TextField
									size="small"
									id="q"
									label=""
									placeholder=""
									style={{ width: 138 }}
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
									variant="outlined"
									color="default"
									startIcon={<AddOutlined />}
									onClick={handelClickWithOutR}
									size="small">
									add product
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
									<h2>Facture</h2>
									<p>
										Numéro:{' '}
										{invoices.length === 0
											? 1
											: invoices[invoices.length - 1]?.number + 1}{' '}
									</p>
								</div>
								<p className="date"> {newDate ? formatDate(newDate) : date} </p>
							</div>

							<div className="ticket--header__info--bottom">
								<div className="left" style={{ border: 'none' }}>
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
										<span className="key">NIF:</span>
										<span className="value"> 18404120111119600000 </span>
									</div>
									<div className="item">
										<span className="key">R.C:</span>
										<span className="value"> 19/01-0508950A14 </span>
									</div>
									<div className="item">
										<span className="key">Activité:</span>
										<span className="value"> fabrication des citernes</span>
									</div>
									<div className="item">
										<span className="key">Numéro d'article:</span>
										<span className="value"> 19260720051 </span>
									</div>
									<div className="item">
										<span className="key">NIS:</span>
										<span className="value"> 198404120111154 </span>
									</div>
								</div>

								<div className="right" style={{ border: 'none' }}>
									<div className="item">
										<span className="key">Nom:</span>
										<span className="value">{clientValue?.name}</span>
									</div>{' '}
									<div className="item">
										<span className="key">Address:</span>
										<span className="value"> {clientValue?.address} </span>
									</div>{' '}
									<div className="item">
										<span className="key">NIF:</span>
										<span className="value"> {clientValue?.nif} </span>
									</div>{' '}
									<div className="item">
										<span className="key">R.C:</span>
										<span className="value"> {clientValue?.rc} </span>
									</div>{' '}
									<div className="item">
										<span className="key">Activité:</span>
										<span className="value"> {clientValue?.activity} </span>
									</div>{' '}
									<div className="item">
										<span className="key">Numéro d'article:</span>
										<span className="value"> {clientValue?.na} </span>
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
													{row.price},00
												</TableCell>

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
					</div>
					<div className="ticket--footer">
						<div className="ticket--footer__stats">
							<div className="ticket--footer__stats--left">
								<p className="totalString">
									{' '}
									{toWords.convert(total + total * 0.19, {
										currency: true,
									})}{' '}
								</p>
							</div>

							<div className="ticket--footer__stats--right">
								<div className="calcItem">
									<span className="key">HT:</span>
									<span className="value">{total},00 DA</span>
								</div>
								<div className="calcItem">
									<span className="key">TVA:</span>
									<span className="value">19%</span>
								</div>

								<div className="calcItem">
									<span className="key">TTC:</span>
									<span className="value">{total + total * 0.19},00 DA</span>
								</div>
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
		</div>
	);
};

export default NewInvoice;
