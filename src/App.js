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
import Product from './pages/product/Product';
import NewProduct from './pages/newProduct/NewProduct';
import ReturnProducts from './pages/returnProducts/ReturnProducts';
import Customers from './pages/clients/Clients';
import NewCustomer from './pages/newClient/NewClient';
import Customer from './pages/client/Client';
import CustomerTransactions from './pages/clientInfo/ClientInfo';
import Workers from './pages/workers/Workers';
import NewWorker from './pages/newWorker/NewWorker';
import Worker from './pages/worker/Worker';
import WorkerAccount from './pages/workerInfo/WorkerInfo';
import Orders from './pages/bills/Bills';
import NewOrder from './pages/newBill/NewBill';
import Order from './pages/bill/Bill';
import UpdateOrder from './pages/updatBill/updateBill';
import Expenses from './pages/expenses/Expenses';
import Invoices from './pages/invoices/Invoices';
import Invoice from './pages/invoice/Invoice';
import NewInvoice from './pages/newInvoice/NewInvoice';
import NewOrderProducts from './pages/commande/Commande';
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
								<Route path="/product/:id">
									<Product />
								</Route>
								<Route path="/new-product">
									<NewProduct />
								</Route>
								<Route path="/returned-products">
									<ReturnProducts />
								</Route>

								<Route path="/customers">
									<Customers />
								</Route>
								<Route path="/customer/:id">
									<Customer />
								</Route>
								<Route path="/new-customer">
									<NewCustomer />
								</Route>
								<Route path="/customer-transactions/:id">
									<CustomerTransactions />
								</Route>

								<Route path="/workers">
									<Workers />
								</Route>
								<Route path="/new-worker">
									<NewWorker />
								</Route>
								<Route path="/worker/:id">
									<Worker />
								</Route>
								<Route path="/worker-account/:id">
									<WorkerAccount />
								</Route>

								<Route path="/orders">
									<Orders />
								</Route>
								<Route path="/new-order">
									<NewOrder />
								</Route>
								<Route path="/order/:id">
									<Order />
								</Route>
								<Route path="/order-update/:id">
									<UpdateOrder />
								</Route>

								<Route path="/expenses">
									<Expenses />
								</Route>

								<Route path="/invoices">
									<Invoices />
								</Route>
								<Route path="/new-invoice">
									<NewInvoice />
								</Route>
								<Route path="/invoice/:id">
									<Invoice />
								</Route>

								<Route path="/new-order-products">
									<NewOrderProducts />
								</Route>
								<Route path="/payment-ticket">
									<PaymentTicket />
								</Route>
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
