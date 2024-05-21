import './commande.scss';
import logo from '../../assets/img/logo.png';
import { Button, TextField } from '@material-ui/core';
import { useContext, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { formatDate, getDate } from '../../helpers/getDate';
import { getClients } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { PrintOutlined } from '@material-ui/icons';
import DatePicker from '../../components/datePicker/DatePicker';

const Commande = () => {
	const bottom = useRef();

	const date = getDate();

	const [deleg, setDeleg] = useState('0662 08 92 26 - 0555 89 12 18');
	const [selectedDate, setSelectedDate] = useState('');

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

	const handelAutoCompleatClientChange = (event, newValue) => {
		setClient(newValue.title);
		setClientValue(newValue);
	};

	return (
		<div className="order">
			<div className="wrapper">
				<div className="header">
					<h2 className="title">Customer Order Intake and Processing</h2>
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
						content={() => bottom.current}
					/>
				</div>
				<div className="form">
					<div className="item">
						<div className="item--label">Select client</div>
						<Autocomplete
							size="small"
							value={clientValue}
							onChange={handelAutoCompleatClientChange}
							inputValue={clientInputValue}
							style={{ width: 300 }}
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
									style={{ width: 300 }}
								/>
							)}
						/>
					</div>
					<div className="item">
						<label className="item--label">Change date</label>
						<DatePicker
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
						/>
					</div>

					<div className="item">
						<label className="item--label">Salesperson Phone Number</label>
						<TextField
							size="small"
							id="deleg"
							label=""
							type="string"
							variant="standard"
							style={{ width: '250px' }}
							value={deleg}
							onChange={(e) => setDeleg(e.target.value)}
						/>
					</div>
				</div>
				<div className="commandebottom" ref={bottom}>
					<div className="commandelogo">
						<img src={logo} alt="logo" className="commandelogoImg" />
						<p className="commandelogoTextL">EL MALSSA MOULDING</p>
						<p className="commandelogoTextS">Réservoir Alimentaire</p>
					</div>
					<div className="commandeinfo">
						<h3 className="commandetitle"> BON DE COMMANDE</h3>
						<div className="commandeinfoFlex">
							<div className="commandeleft">AIN MALSSA AIN ARNET SETIF</div>
							<div className="commanderight">
								<p className="commandeclientName"> {clientValue?.name} </p>
								<p className="commandedate">
									{' '}
									{selectedDate ? formatDate(selectedDate) : date}{' '}
								</p>
							</div>
						</div>
						<div className="commandedeleg">
							DELEGUE COMMERCIALE TEL: {deleg}
						</div>
					</div>
					<div className="commandetable">
						{/* vertical */}
						<table>
							<caption>VERTICALE</caption>
							<thead>
								<tr>
									<th>GAMME</th>
									<th>DOUBLE COUCHE</th>
									<th>TRIPLE COUCHE</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										200 VL <span>63*73</span>{' '}
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										300 VL <span>74*79</span>{' '}
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										500 VLS <span>55*225</span>{' '}
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										500 VLM <span>61*184</span>{' '}
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										500 VL <span>71*150</span>{' '}
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										800 VLS <span>68*240</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										800 VLM <span>71*214</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										1000 VLS <span>76*236</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										1000 VLM <span>86*195</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
							</tbody>
						</table>

						{/* horizonrtal */}
						<table>
							<caption>HORIZONTALE</caption>
							<thead>
								<tr>
									<th>GAMME</th>
									<th>DOUBLE COUCHE</th>
									<th>TRIPLE COUCHE</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>200 H</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>300 H</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>500 H</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>1000 H</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>1500 H</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>2000 H</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>3000 H</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
							</tbody>
						</table>

						{/* large */}
						<table>
							<caption>LARGE</caption>
							<thead>
								<tr>
									<th>GAMME</th>
									<th>DOUBLE COUCHE</th>
									<th>TRIPLE COUCHE</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										500 VL Large <span>85*98</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										1000 VL Large <span>105*127</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										1500 VL Large <span>120*145</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
								<tr>
									<td>
										2000 VL Large <span>130*162</span>
									</td>
									<td>
										{' '}
										<input type="text" />{' '}
									</td>
									<td>
										<input type="text" />{' '}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Commande;
