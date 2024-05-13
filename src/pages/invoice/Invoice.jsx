import { useLocation } from 'react-router-dom';
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
import ReactToPrint from 'react-to-print';
import { useContext, useEffect, useRef } from 'react';

import logo from '../../assets/img/logo.png';
import './invoice.scss';
import { getClient } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { PrintOutlined } from '@material-ui/icons';

const Invoice = () => {
	const invoiceRef = useRef();
	const invoice = useLocation().invoice;

	//GET CLIENT
	const { dispatch, clients } = useContext(ClientsContext);

	useEffect(() => {
		if (!invoice.clientId) return;

		getClient(dispatch, invoice.clientId);
	}, [dispatch, invoice]);

	return (
		<div className="invoice">
			<div className="wrapper">
				<ReactToPrint
					trigger={() => (
						<Button
							variant="outlined"
							color="primary"
							size="small"
							startIcon={<PrintOutlined />}
							className="invoice--print"
							style={{ float: 'right' }}>
							print
						</Button>
					)}
					content={() => invoiceRef.current}
				/>
				<div className="ticket" ref={invoiceRef}>
					<div className="ticket--header">
						<div className="ticket--header__info">
							<div className="ticket--header__info--top">
								<div className="logo">
									<img src={logo} alt="logo" />
									<p>EL MELSSA PLAST</p>
								</div>
								<div className="title">
									<h2>Facture</h2>
									<p>Numéro: {invoice.number} </p>
								</div>
								<p className="date"> {invoice.date} </p>
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
										<span className="value"> fabrication des citernes </span>
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
										<span className="value">{clients[0]?.name}</span>
									</div>{' '}
									<div className="item">
										<span className="key">Address:</span>
										<span className="value"> {clients[0]?.address} </span>
									</div>{' '}
									<div className="item">
										<span className="key">NIF:</span>
										<span className="value"> {clients[0]?.nif} </span>
									</div>{' '}
									<div className="item">
										<span className="key">R.C:</span>
										<span className="value"> {clients[0]?.rc} </span>
									</div>{' '}
									<div className="item">
										<span className="key">Activité:</span>
										<span className="value"> {clients[0]?.activity} </span>
									</div>
									<div className="item">
										<span className="key">Numéro d'article:</span>
										<span className="value"> {clients[0]?.na} </span>
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
										{invoice.products.map((row, index) => (
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
					</div>

					<div className="ticket--footer">
						<div className="ticket--footer__stats">
							<div className="ticket--footer__stats--left">
								<p className="totalString"> {invoice.totalPriceWords} </p>
							</div>
							<div className="ticket--footer__stats--right">
								<div className="calcItem">
									<span className="key">HT:</span>
									<span className="value">{invoice.totalPrice},00 DA</span>
								</div>
								<div className="calcItem">
									<span className="key">TVA:</span>
									<span className="value">19%</span>
								</div>

								<div className="calcItem">
									<span className="key">TTC:</span>
									<span className="value">
										{invoice.totalPrice + invoice.totalPrice * 0.19},00 DA
									</span>
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
export default Invoice;
