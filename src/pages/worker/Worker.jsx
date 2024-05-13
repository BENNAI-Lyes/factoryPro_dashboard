import { useLocation, useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';

import './worker.scss';
import { WorkersContext } from '../../context/workerContext/workerContext';
import { Button } from '@material-ui/core';
import { UpdateOutlined } from '@material-ui/icons';
import {
	UPDATE_WORKER_FAILURE,
	UPDATE_WORKER_START,
	UPDATE_WORKER_SUCCESS,
} from '../../context/workerContext/workerContextActions';
import { axiosI } from '../../config';
import { toast } from 'react-toastify';

export default function Worker() {
	const history = useHistory();
	const worker = useLocation().worker;

	const [name, setName] = useState(worker.name);
	const [email, setEmail] = useState(worker.email);
	const [address, setAddress] = useState(worker.address);
	const [phone, setPhone] = useState(worker.phone);

	const { dispatch } = useContext(WorkersContext);

	const handelSubmit = async (e) => {
		e.preventDefault();
		dispatch(UPDATE_WORKER_START());
		try {
			const res = await axiosI.put(
				'worker/' + worker._id,
				{
					_id: worker._id,
					name,
					email,
					address,
					phone,
				},
				{
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				}
			);
			dispatch(UPDATE_WORKER_SUCCESS(res.data));
			toast.success('Worker Updated successfully.');
			history.push('/workers');
		} catch (error) {
			console.log('update worker error', error);
			toast.error(error?.response?.data?.message);
			dispatch(UPDATE_WORKER_FAILURE(error));
		}
	};

	return (
		<div className="worker">
			<h2>Update Worker </h2>

			<form className="form" onSubmit={handelSubmit}>
				<div className="group">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Name"
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
						placeholder="Adsress"
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
						placeholder="Enter Phone Number"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
			</form>
			<Button
				variant="contained"
				size="small"
				color="primary"
				startIcon={<UpdateOutlined />}
				onClick={handelSubmit}>
				update worker
			</Button>
		</div>
	);
}
