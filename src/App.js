import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import { useContext } from 'react';

import './App.scss';

import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';

import { AuthContext } from './context/authContext/authContext';

import Login from './pages/login/Login';

import Home from './pages/home/Home';
import Products from './pages/products/Products';
import ReturnProducts from './pages/returnProducts/ReturnProducts';
import Customers from './pages/clients/Clients';
import Workers from './pages/workers/Workers';
import Orders from './pages/bills/Bills';
import Expenses from './pages/expenses/Expenses';
import Invoices from './pages/invoices/Invoices';
import NewOrder from './pages/commande/Commande';
import PaymentTicket from './pages/vers/Vers';

function App() {
	const { user } = useContext(AuthContext);

	return (
		<>
			<Router>
				{!user ? <Login /> : <Redirect to="/" />}

				{user ? (
					<>
						<Topbar />
						<div className="container">
							<Sidebar />
							<Switch>
								<Route exact path="/">
									<Home />
								</Route>
								<Route path="/products">
									<Products />
								</Route>
								<Route path="/returned-products">
									<ReturnProducts />
								</Route>
								<Route path="/customers">
									<Customers />
								</Route>
								<Route path="/workers">
									<Workers />
								</Route>
								<Route path="/orders">
									<Orders />
								</Route>
								<Route path="/expenses">
									<Expenses />
								</Route>
								<Route path="/invoices">
									<Invoices />
								</Route>
								<Route path="/new-order">
									<NewOrder />
								</Route>
								<Route path="/payment-ticket">
									<PaymentTicket />
								</Route>

								{/* old routes
								<Route path="/users">
									<UserList />
								</Route>
								<Route path="/user/:userId">
									<User />
								</Route>
								<Route path="/newUser">
									<NewUser />
								</Route>

								<Route path="/product/:productId">
									<Products />
								</Route>
								<Route path="/newproduct">
									<NewProduct />
								</Route> */}
							</Switch>
						</div>
					</>
				) : (
					<Redirect to="/" />
				)}
			</Router>
		</>
	);
}

export default App;
