import {
	LineStyle,
	Timeline,
	TrendingUp,
	Storefront,
	AttachMoney,
	WorkOutline,
	RestoreOutlined,
	PeopleOutline,
	MoneyOffOutlined,
	InsertDriveFileOutlined,
	ReceiptOutlined,
	CreateOutlined,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';

import './sidebar.scss';

export default function Sidebar() {
	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
				{/* Dashboard */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Dashboard</h3>
					<ul className="sidebarList">
						<Link to="/" className="link">
							<li className="sidebarListItem active">
								<LineStyle className="sidebarIcon" />
								Home
							</li>
						</Link>
						<li className="sidebarListItem">
							<Timeline className="sidebarIcon" />
							Analytics
						</li>
						<li className="sidebarListItem">
							<TrendingUp className="sidebarIcon" />
							Sales
						</li>
					</ul>
				</div>

				{/* Store */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Store</h3>
					<ul className="sidebarList">
						<Link to="/products" className="link">
							<li className="sidebarListItem">
								<Storefront className="sidebarIcon" />
								Products
							</li>
						</Link>
						<Link to="/returned-products" className="link">
							<li className="sidebarListItem">
								<RestoreOutlined className="sidebarIcon" />
								Returned products
							</li>
						</Link>
					</ul>
				</div>

				{/* Human resources */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Human resources</h3>
					<ul className="sidebarList">
						<Link to="/customers" className="link">
							<li className="sidebarListItem">
								<PeopleOutline className="sidebarIcon" />
								Customers
							</li>
						</Link>
						<Link to="/workers" className="link">
							<li className="sidebarListItem">
								<WorkOutline className="sidebarIcon" />
								Workers
							</li>
						</Link>
					</ul>
				</div>

				{/* Finance */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Finance</h3>
					<ul className="sidebarList">
						<Link to="/orders" className="link">
							<li className="sidebarListItem">
								<AttachMoney className="sidebarIcon" />
								Orders
							</li>
						</Link>
						<Link to="/expenses" className="link">
							<li className="sidebarListItem">
								<MoneyOffOutlined className="sidebarIcon" />
								Expenses
							</li>
						</Link>
						<Link to="/invoices" className="link">
							<li className="sidebarListItem">
								<InsertDriveFileOutlined className="sidebarIcon" />
								Invoices
							</li>
						</Link>
					</ul>
				</div>

				{/* Printing */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Printing</h3>
					<ul className="sidebarList">
						<Link to="/new-order" className="link">
							<li className="sidebarListItem">
								<CreateOutlined className="sidebarIcon" />
								New Order
							</li>
						</Link>
						<Link to="/payment-ticket" className="link">
							<li className="sidebarListItem">
								<ReceiptOutlined className="sidebarIcon" />
								Payment Ticket
							</li>
						</Link>
					</ul>
				</div>
			</div>
		</div>
	);
}
