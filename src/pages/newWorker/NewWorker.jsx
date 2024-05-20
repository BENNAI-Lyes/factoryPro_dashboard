import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import './newWorker.scss';
import { WorkersContext } from '../../context/workerContext/workerContext';
import { Button } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import {
	ADD_WORKER_FAILURE,
	ADD_WORKER_START,
	ADD_WORKER_SUCCESS,
} from '../../context/workerContext/workerContextActions';
import { axiosI } from '../../config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/authContext/authContext';

export default function NewWorker() {
	const history = useHistory();

	const { user } = useContext(AuthContext);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	const [phone, setPhone] = useState('');

	const { dispatch } = useContext(WorkersContext);

	const handelSubmit = async (e) => {
		e.preventDefault();
		dispatch(ADD_WORKER_START());
		try {
			const res = await axiosI.post(
				'worker',
				{ name, email, address, phone },
				{
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				}
			);
			dispatch(ADD_WORKER_SUCCESS(res.data));
			toast.success('Worker Added successfully.');
			setName('');
			setEmail('');
			setAddress('');
			setPhone('');

			history.push('/workers');
		} catch (error) {
			toast.error(error?.response?.data?.message);
			dispatch(ADD_WORKER_FAILURE(error));
		}
	};

	return (
		<div className="newWorker">
			<h2>New Worker</h2>
			<form className="form">
				<div className="group">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Entre Worker Name"
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
						placeholder="Entre Worker Email"
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
						placeholder="Entre Worker address"
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
						placeholder="Entre Worker phone number "
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
			</form>
			<Button
				variant="contained"
				size="small"
				color="primary"
				startIcon={<AddOutlined />}
				onClick={handelSubmit}>
				Add new worker
			</Button>
		</div>
	);
}
