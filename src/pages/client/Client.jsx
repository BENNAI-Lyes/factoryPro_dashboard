import { useLocation, useHistory } from 'react-router-dom';
import { UpdateOutlined } from '@material-ui/icons';
import { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';

import { ClientsContext } from '../../context/clientContext/clientContext';
import './client.scss';
import {
	ADD_CLIENT_FAILURE,
	ADD_CLIENT_START,
	ADD_CLIENT_SUCCESS,
} from '../../context/clientContext/clientContextActions';
import { axiosI } from '../../config';
import { AuthContext } from '../../context/authContext/authContext';

export default function Client() {
	const history = useHistory();
	const client = useLocation().client;

	const { user } = useContext(AuthContext);

	const [name, setName] = useState(client.name);
	const [email, setEmail] = useState(client.email);
	const [address, setAddress] = useState(client.address);
	const [phone, setPhone] = useState(client.phone);
	const [driver, setDriver] = useState(client.driver);
	const [nif, setNif] = useState(client.nif);
	const [rc, setRc] = useState(client.rc);
	const [activity, setActivity] = useState(client.activity);
	const [credit, setCredit] = useState(client.credit);
	const [remise, setRemise] = useState(client.remise);
	const [na, setNa] = useState(client.na);

	const { dispatch } = useContext(ClientsContext);

	const handelSubmit = async (e) => {
		e.preventDefault();

		dispatch(ADD_CLIENT_START());
		try {
			const res = await axiosI.put(
				'client/' + client._id,
				{
					name,
					email,
					address,
					phone,
					activity,
					driver,
					nif,
					rc,
					credit,
					remise,
					na,
					_id: client._id,
				},
				{
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				}
			);
			dispatch(ADD_CLIENT_SUCCESS(res.data));
			toast.success('Client Updated successfully.');
			history.push('/customers');
		} catch (error) {
			toast.error(error?.response?.data?.message);
			dispatch(ADD_CLIENT_FAILURE(error));
		}
	};

	return (
		<div className="client">
			<div className="wrapper">
				<h2 className="title"> Update Customer</h2>

				<form className="form">
					<div className="group">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							placeholder="name"
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
							placeholder="Email"
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
							placeholder="Address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</div>

					<div className="group">
						<label htmlFor="phone">Phone Number</label>
						<input
							type="string"
							id="phone"
							className="input"
							placeholder=" phone Number"
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
							placeholder="Driver"
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
							placeholder="NIF"
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
							placeholder="RC"
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
							placeholder="activity"
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
							placeholder="Article Number"
							value={na}
							onChange={(e) => setNa(e.target.value)}
						/>
					</div>

					<div className="group">
						<label htmlFor="rc">Total Debt</label>
						<input
							type="string"
							id="credit"
							className="input"
							placeholder="Total Debt"
							value={credit}
							onChange={(e) => setCredit(e.target.value)}
						/>
					</div>

					<div className="group">
						<label htmlFor="remise">Discount</label>
						<input
							type="number"
							id="remise"
							className="input"
							placeholder="Discount"
							value={remise}
							onChange={(e) => setRemise(e.target.value)}
						/>
					</div>
				</form>
				<Button
					variant="contained"
					size="small"
					color="primary"
					startIcon={<UpdateOutlined />}
					onClick={handelSubmit}>
					update customer
				</Button>
			</div>
		</div>
	);
}
