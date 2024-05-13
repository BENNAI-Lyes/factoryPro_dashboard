import './vers.scss';
import logo from '../../assets/img/logo.png';
import ReactToPrint from 'react-to-print';
import { useRef } from 'react';
import { Button } from '@material-ui/core';
import { PrintOutlined } from '@material-ui/icons';

const Vers = () => {
	const bonRef = useRef();

	return (
		<div className="vers">
			<div className="wrapper">
				<div className="header">
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
				</div>

				<div className="items" ref={bonRef}>
					<div className="versWrapper">
						<div className="top">
							<div className="topLeft">
								<img src={logo} alt="logo" className="logo" />
								<p>EL MELSSA PLAST</p>
							</div>
							<div className="topRight">
								<h2>EL MELSSA PLAST</h2>
								<h4>صناعة خزانات المياه بالبوليتيلان</h4>
								<h4>
									PRODUCTION DES RESERVOIRS EN POLYETHYLENE DE QUALITY
									ALIMENTAIRE
								</h4>
							</div>
						</div>
						<div className="center">
							<p>
								<b>Adresse:</b>{' '}
								<span>
									Zone Industrielle Ain El Melssa Ain Arnet Sétif Algerie
								</span>{' '}
							</p>
							<p>
								<b>Mob:</b> <span>+213 (0) 776 01 20 15</span>{' '}
							</p>
							<p>
								<b>Mob:</b> <span>+213 (0) 555 75 38 28</span>{' '}
							</p>
						</div>
						<div className="bottom">
							<div className="bottomLeft">
								<h2>BON DE VERSEMENT</h2>
								<p>
									AG:{' '}
									<span className="dots">
										.................................................................................................
									</span>{' '}
								</p>
								<p>
									CLN:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p>
									WIL:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p>
									N°:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p>
									DATE:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p className="price">
									<span className="dots">
										.................................................................................................
									</span>{' '}
									DA
								</p>
								<p className="sign">
									Signature:{' '}
									<span className="dots">
										.........................................................................................
									</span>
								</p>
								<p className="visa">
									Visa Ciassier:{' '}
									<span className="dots">
										...................................................................................
									</span>
								</p>
							</div>

							<div className="bottomRight">
								<h2>Produits Retourné</h2>
								<div className="pr">
									<span>
										1- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										2- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										3- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										4- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										5- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="versWrapper">
						<div className="top">
							<div className="topLeft">
								<img src={logo} alt="logo" className="logo" />
								<p>EL MELSSA PLAST</p>
							</div>
							<div className="topRight">
								<h2>EL MELSSA PLAST</h2>
								<h4>صناعة خزانات المياه بالبوليتيلان</h4>
								<h4>
									PRODUCTION DES RESERVOIRS EN POLYETHYLENE DE QUALITY
									ALIMENTAIRE
								</h4>
							</div>
						</div>
						<div className="center">
							<p>
								<b>Adresse:</b>{' '}
								<span>
									Zone Industrielle Ain El Melssa Ain Arnet Sétif Algerie
								</span>{' '}
							</p>
							<p>
								<b>Mob:</b> <span>+213 (0) 776 01 20 15</span>{' '}
							</p>
							<p>
								<b>Mob:</b> <span>+213 (0) 555 75 38 28</span>{' '}
							</p>
						</div>
						<div className="bottom">
							<div className="bottomLeft">
								<h2>BON DE VERSEMENT</h2>
								<p>
									AG:{' '}
									<span className="dots">
										.................................................................................................
									</span>{' '}
								</p>
								<p>
									CLN:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p>
									WIL:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p>
									N°:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p>
									DATE:{' '}
									<span className="dots">
										.................................................................................................
									</span>
								</p>
								<p className="price">
									<span className="dots">
										.................................................................................................
									</span>{' '}
									DA
								</p>
								<p className="sign">
									Signature:{' '}
									<span className="dots">
										.........................................................................................
									</span>
								</p>
								<p className="visa">
									Visa Ciassier:{' '}
									<span className="dots">
										...................................................................................
									</span>
								</p>
							</div>

							<div className="bottomRight">
								<h2>Produits Retourné</h2>
								<div className="pr">
									<span>
										1- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										2- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										3- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										4- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
								<div className="pr">
									<span>
										5- Nome:{' '}
										<span className="dots">
											..................................................................................
										</span>{' '}
									</span>
									<span>
										Quantité: <span className="dots">..........</span>{' '}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Vers;
