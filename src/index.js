import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from './context/authContext/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BillsContextProvider } from './context/billContext/billContext';
import { ProductsContextProvider } from './context/productContext/productContext';
import { InvoicesContextProvider } from './context/invoiceContext/invoiceContext';
import { ClientsContextProvider } from './context/clientContext/clientContext';
import { WorkersContextProvider } from './context/workerContext/workerContext';
import { ReturnProductsContextProvider } from './context/returnProductContext/returnProductContext';
import { TransactionsContextProvider } from './context/transactionContext/transactionContext';
import { ExpensesContextProvider } from './context/expenseContext/expenseContext';
import { PayrollsContextProvider } from './context/payrollContext/payrollContext';

ReactDOM.render(
	<React.StrictMode>
		<AuthContextProvider>
			<BillsContextProvider>
				<ProductsContextProvider>
					<InvoicesContextProvider>
						<ClientsContextProvider>
							<WorkersContextProvider>
								<ReturnProductsContextProvider>
									<TransactionsContextProvider>
										<ExpensesContextProvider>
											<PayrollsContextProvider>
												<App />
											</PayrollsContextProvider>
										</ExpensesContextProvider>
									</TransactionsContextProvider>
								</ReturnProductsContextProvider>
							</WorkersContextProvider>
						</ClientsContextProvider>
					</InvoicesContextProvider>
				</ProductsContextProvider>
			</BillsContextProvider>
		</AuthContextProvider>
		<ToastContainer />
	</React.StrictMode>,
	document.getElementById('root')
);
