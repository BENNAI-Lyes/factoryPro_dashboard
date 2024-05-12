import { useContext, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { DeleteOutline, PrintOutlined } from '@material-ui/icons';

import './bill.scss';
import logo from '../../assets/img/logo.png';
import { ProductsContext } from '../../context/productContext/productContext';
import { getProducts } from '../../context/productContext/productApiCalls';
import {
	getClient,
	updateClient,
} from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { axiosI } from '../../config';
import { BillsContext } from '../../context/billContext/billContext';
import { getBill } from '../../context/billContext/billContextApiCalls';

const Bill = () => {
	const billId = useParams().id;
	const history = useHistory();
	const bonRef = useRef();

	//FETCH ORDER
	const { dispatch: dispatchBill, bills } = useContext(BillsContext);
	useEffect(() => {
		getBill(dispatchBill, billId);
	}, [dispatchBill, billId]);

	//FETCH PRODUCTS
	const { dispatch, products } = useContext(ProductsContext);
	useEffect(() => {
		getProducts(dispatch);
	}, [dispatch]);

	//FETCH CLIENT
	const { dispatch: dispatchClient, clients } = useContext(ClientsContext);
	useEffect(() => {
		if (bills.length === 0) return;
		getClient(dispatchClient, bills[0]?.clientId);
	}, [dispatchClient, bills]);

	const getProductPrice = (productName) => {
		return products.find((p) => p.name === productName);
	};

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

	const handelDelete = async () => {
		await axiosI.delete('bon/' + bills[0]?._id, {
			headers: {
				token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
			},
		});
		toast.success('Bill Deleted Successfully.');
		history.push('/orders', { replace: true });

		updateClient(dispatchClient, {
			credit: clients[0]?.credit - bills[0]?.credit,
			_id: bills[0]?.clientId,
		});
	};

	return (
		<div className="bill">
			<div className="wrapper">
				<div className="buttons" style={{ justifyContent: 'flex-end' }}>
					<div className="button">
						<ReactToPrint
							trigger={() => (
								<Button
									variant="contained"
									size="small"
									color="primary"
									startIcon={<PrintOutlined />}>
									print
								</Button>
							)}
							content={() => bonRef.current}
						/>
					</div>
					<div className="button">
						<Button
							variant="contained"
							size="small"
							color="secondary"
							onClick={handelDelete}
							startIcon={<DeleteOutline />}>
							Delete
						</Button>
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
										<span className="value">{clients[0]?.name}</span>
									</div>{' '}
									<div className="item">
										<span className="key">Address:</span>
										<span className="value"> {clients[0]?.address} </span>
									</div>{' '}
									<div className="item">
										<span className="key">Numéro de Téléphone:</span>
										<span className="value"> {clients[0]?.phone} </span>
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
										{bills[0]?.products.map((row, index) => (
											<TableRow key={index}>
												<TableCell
													component="th"
													scope="row"
													className="tableCell">
													{row.name}
												</TableCell>
												<TableCell align="right" className="tableCell">
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
							{bills[0]?.productsReturned.length > 0 && (
								<>
									<h3>Produits Retournés:</h3>
									<div className="ticket--header__return__products">
										{bills[0]?.productsReturned.map((p, index) => (
											<div
												key={index + Math.random()}
												className="ticket--header__return__products--product">
												<div className="dot" />
												<div className="pr">
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
		</div>
	);
};
export default Bill;
