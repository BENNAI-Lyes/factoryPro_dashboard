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
import { Link, useLocation } from 'react-router-dom';

import './sidebar.scss';

export default function Sidebar() {
	const href = useLocation().pathname;

	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
				{/* Dashboard */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Dashboard</h3>
					<ul className="sidebarList">
						<Link to="/" className="link">
							<li className={` ${href === '/' && 'active'} sidebarListItem `}>
								<LineStyle className="sidebarIcon" />
								Home
							</li>
						</Link>
						<li
							className={` ${
								href === '/analytics' && 'active'
							} sidebarListItem `}>
							<Timeline className="sidebarIcon" />
							Analytics
						</li>
						<li
							className={` ${href === '/sales' && 'active'} sidebarListItem `}>
							<TrendingUp className="sidebarIcon" />
							Sales
						</li>
					</ul>
				</div>

				{/* Finance */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Finance</h3>
					<ul className="sidebarList">
						<Link to="/orders" className="link">
							<li
								className={` ${
									href === '/orders' && 'active'
								} sidebarListItem `}>
								<AttachMoney className="sidebarIcon" />
								Orders
							</li>
						</Link>
						<Link to="/expenses" className="link">
							<li
								className={` ${
									href === '/expenses' && 'active'
								} sidebarListItem `}>
								<MoneyOffOutlined className="sidebarIcon" />
								Expenses
							</li>
						</Link>
						<Link to="/invoices" className="link">
							<li
								className={` ${
									href === '/invoices' && 'active'
								} sidebarListItem `}>
								<InsertDriveFileOutlined className="sidebarIcon" />
								Invoices
							</li>
						</Link>
					</ul>
				</div>

				{/* Human resources */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Human resources</h3>
					<ul className="sidebarList">
						<Link to="/customers" className="link">
							<li
								className={` ${
									href === '/customers' && 'active'
								} sidebarListItem `}>
								<PeopleOutline className="sidebarIcon" />
								Customers
							</li>
						</Link>
						<Link to="/workers" className="link">
							<li
								className={` ${
									href === '/workers' && 'active'
								} sidebarListItem `}>
								<WorkOutline className="sidebarIcon" />
								Workers
							</li>
						</Link>
					</ul>
				</div>

				{/* Store */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Store</h3>
					<ul className="sidebarList">
						<Link to="/products" className="link">
							<li
								className={` ${
									href === '/products' && 'active'
								} sidebarListItem `}>
								<Storefront className="sidebarIcon" />
								Products
							</li>
						</Link>
						<Link to="/returned-products" className="link">
							<li
								className={` ${
									href === '/returned-products' && 'active'
								} sidebarListItem `}>
								<RestoreOutlined className="sidebarIcon" />
								Returned products
							</li>
						</Link>
					</ul>
				</div>

				{/* Printing */}
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Printing</h3>
					<ul className="sidebarList">
						<Link to="/new-order-products" className="link">
							<li
								className={` ${
									href === '/new-order-products' && 'active'
								} sidebarListItem `}>
								<CreateOutlined className="sidebarIcon" />
								New Order
							</li>
						</Link>
						<Link to="/payment-ticket" className="link">
							<li
								className={` ${
									href === '/payment-ticket' && 'active'
								} sidebarListItem `}>
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
