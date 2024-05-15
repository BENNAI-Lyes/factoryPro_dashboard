import React, { useContext } from 'react';
import { ExitToAppOutlined } from '@material-ui/icons';

import './topbar.scss';
import logo from '../../assets/img/logo.png';
import { AuthContext } from '../../context/authContext/authContext';
import { LOGOUT } from '../../context/authContext/authContextActions';

export default function Topbar() {
	const { dispatch } = useContext(AuthContext);

	const onLogout = () => {
		dispatch(LOGOUT());
		console.log('logout');
	};

	return (
		<div className="topbar">
			<div className="topbarWrapper">
				<div className="topLeft">
					<span className="logo">
						<img src={logo} alt="" />
						<span>FactoryPro</span>
					</span>
				</div>
				<div className="topRight">
					<div className="topbarIconContainer">
						<ExitToAppOutlined className="icon" onClick={onLogout} />
					</div>
				</div>
			</div>
		</div>
	);
}
