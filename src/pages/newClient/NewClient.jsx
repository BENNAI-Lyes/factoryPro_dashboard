import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import './newClient.scss';
import { ClientsContext } from '../../context/clientContext/clientContext';
import {
	ADD_CLIENT_FAILURE,
	ADD_CLIENT_START,
	ADD_CLIENT_SUCCESS,
} from '../../context/clientContext/clientContextActions';

import { axiosI } from '../../config';
import { AuthContext } from '../../context/authContext/authContext';

export default function NewClient() {
	const history = useHistory();

	const { user } = useContext(AuthContext);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	const [driver, setDriver] = useState('');
	const [nif, setNif] = useState('');
	const [rc, setRc] = useState('');
	const [phone, setPhone] = useState('');
	const [activity, setActivity] = useState('');
	const [credit, setCredit] = useState(0);
	const [remise, setRemise] = useState(0);
	const [na, setNa] = useState('');

	const { dispatch } = useContext(ClientsContext);

	const handelSubmit = async (e) => {
		e.preventDefault();

		dispatch(ADD_CLIENT_START());
		try {
			const res = await axiosI.post(
				'client',
				{
					name,
					email,
					address,
					phone,
					driver,
					nif,
					rc,
					activity,
					credit,
					remise,
					na,
				},
				{
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				}
			);
			dispatch(ADD_CLIENT_SUCCESS(res.data));
			toast.success('Client Added successfully.');
			setName('');
			setEmail('');
			setAddress('');
			setPhone('');
			setDriver('');
			setNif('');
			setRc('');
			setNa('');
			setActivity('');
			setCredit(0);
			setRemise(0);

			history.push('/customers');
		} catch (error) {
			toast.error(error?.response?.data?.message);
			dispatch(ADD_CLIENT_FAILURE(error));
		}
	};

	return (
		<div className="newClient">
			<h2>New client</h2>
			<form className="form">
				<div className="group">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Enter Customer Name"
						className="input"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						placeholder="Enter Customer Email"
						className="input"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="group">
					<label htmlFor="address">Address</label>
					<input
						type="text"
						id="address"
						className="input"
						placeholder="Enter Customer Address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
				</div>

				<div className="group">
					<label htmlFor="phone">Phone Number</label>
					<input
						type="text"
						id="phone"
						className="input"
						placeholder="Enter Customer Phone Number"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<div className="group">
					<label htmlFor="driver">Driver</label>
					<input
						type="string"
						id="driver"
						className="input"
						placeholder="Enter Customer Driver"
						value={driver}
						onChange={(e) => setDriver(e.target.value)}
					/>
				</div>
				<div className="group">
					<label htmlFor="nif">NIF</label>
					<input
						type="string"
						id="nif"
						className="input"
						placeholder="Enter Customer NIF"
						value={nif}
						onChange={(e) => setNif(e.target.value)}
					/>
				</div>
				<div className="group">
					<label htmlFor="rc">RC</label>
					<input
						type="string"
						id="rc"
						className="input"
						placeholder="Enter Customer RC"
						value={rc}
						onChange={(e) => setRc(e.target.value)}
					/>
				</div>
				<div className="group">
					<label htmlFor="rc">Activity</label>
					<input
						type="string"
						id="activity"
						className="input"
						placeholder="Enter Customer Activity"
						value={activity}
						onChange={(e) => setActivity(e.target.value)}
					/>
				</div>

				<div className="group">
					<label htmlFor="na">Article Number</label>
					<input
						type="string"
						id="activity"
						className="input"
						placeholder="Enter Customer Article Number"
						value={na}
						onChange={(e) => setNa(e.target.value)}
					/>
				</div>

				<div className="group">
					<label htmlFor="credit">Debt</label>
					<input
						type="number"
						id="credit"
						className="input"
						placeholder="Enter Customer  debt"
						value={credit}
						onChange={(e) => setCredit(e.target.value)}
					/>
				</div>

				<div className="group">
					<label htmlFor="remise">Discount by Percent</label>
					<input
						type="number"
						id="remise"
						className="input"
						placeholder="Enter Customer Discount  "
						value={remise}
						onChange={(e) => setRemise(e.target.value)}
					/>
				</div>
			</form>

			<Button
				variant="contained"
				size="small"
				color="primary"
				startIcon={<AddOutlined />}
				onClick={handelSubmit}>
				Add new customer
			</Button>
		</div>
	);
}
