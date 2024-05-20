import './login.scss';

import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { EmailOutlined, LockOutlined } from '@material-ui/icons';

import { AuthContext } from '../../context/authContext/authContext';
import {
	LOGIN_FAILURE,
	LOGIN_START,
	LOGIN_SUCCESS,
} from '../../context/authContext/authContextActions';
import { axiosI } from '../../config';
import { toast } from 'react-toastify';

const Login = () => {
	const history = useHistory();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { dispatch, isFetching } = useContext(AuthContext);

	const handelSubmit = async (e) => {
		e.preventDefault();

		dispatch(LOGIN_START());
		try {
			const res = await axiosI.post('auth/login', { email, password });
			if (res.data.isAdmin) {
				dispatch(LOGIN_SUCCESS(res.data));
				history.push('/');
			}
		} catch (error) {
			dispatch(LOGIN_FAILURE(error));
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<div className="login">
			<div className="wrapper">
				<div className="header">
					{/* <img src={logo} alt="logo" className="logo" /> */}
					<h2 className="title">Login</h2>
				</div>
				<form className="form" onSubmit={handelSubmit}>
					<div className="formGroup">
						<label htmlFor="email">Email</label>
						<div>
							<EmailOutlined className="inputIcon" />
							<input
								type="email"
								name="email"
								id="email"
								className="input"
								placeholder="admin@gmail.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</div>
					<div className="formGroup">
						<label htmlFor="password">Password</label>
						<div>
							<LockOutlined className="inputIcon" />
							<input
								type="password"
								name="password"
								id="password"
								className="input"
								placeholder="admin123"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
					<div className="buttonContainer">
						<button type="submit" disabled={isFetching} className="btn">
							{isFetching && <CircularProgress className="loading" size={18} />}{' '}
							login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
