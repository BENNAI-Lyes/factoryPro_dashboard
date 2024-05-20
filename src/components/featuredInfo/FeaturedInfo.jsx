import {
	ArrowDownward,
	ArrowUpward,
	LocalShipping,
	MonetizationOn,
	MoneyOff,
	People,
} from '@material-ui/icons';

import './featuredInfo.scss';
import { useEffect, useState, useContext } from 'react';
import { axiosI } from '../../config';
import { AuthContext } from '../../context/authContext/authContext';

export default function FeaturedInfo({ data }) {
	const [customersStats, setCustomersStats] = useState({});

	const { user } = useContext(AuthContext);

	//FETCH CUSTOMERS STATS
	useEffect(() => {
		const fetchCustomersStats = async () => {
			try {
				const res = await axiosI('client/total-by-month', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});
				setCustomersStats(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchCustomersStats();
	}, [user.accessToken]);

	//GET DATE AS (ex: 2024-05) FORMAT
	const date = new Date();
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const formattedDate = `${year}-${month}`;

	// Parse the current date to extract the year and month
	const [currentYear, currentMonth] = formattedDate.split('-').map(Number);

	// Determine the previous month and year
	let prevMonth, prevYear;
	if (currentMonth === 1) {
		prevMonth = 12;
		prevYear = currentYear - 1;
	} else {
		prevMonth = currentMonth - 1;
		prevYear = currentYear;
	}

	// Format the previous month and year as a string
	const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

	// Initialize variables to store the totals
	let currentMonthSales = 0;
	let prevMonthSales = 0;
	let currentMonthTransport = 0;
	let prevMonthTransport = 0;
	let currentMonthExpense = 0;
	let prevMonthExpense = 0;

	// Iterate over the array to find the totals
	data.forEach((item) => {
		if (item._id === formattedDate) {
			currentMonthSales = item.sales;
			currentMonthExpense = item.expense;
			currentMonthTransport = item.transport;
		}
		if (item._id === prevMonthStr) {
			prevMonthSales = item.sales;
			prevMonthExpense = item.expense;
			prevMonthTransport = item.transport;
		}
	});

	return (
		<div className="featured">
			<div
				className={`featuredItem ${
					customersStats?.currentMonthCount -
						customersStats?.previousMonthCount >=
					0
						? 'positive'
						: 'negative'
				}`}>
				<div className="featuredTitle">
					<h2>Total Customers</h2>
					<People className="icon" />
				</div>

				<p className="featuredMoney"> {customersStats?.totalCustomers} </p>

				<div className="featuredSub">
					<span
						className={`featuredMoneyRate ${
							customersStats?.currentMonthCount -
								customersStats?.previousMonthCount >=
							0
								? 'positive'
								: 'negative'
						}`}>
						<span>
							{customersStats?.currentMonthCount -
								customersStats?.previousMonthCount >=
								0 && '+'}
							{customersStats?.currentMonthCount -
								customersStats?.previousMonthCount}
						</span>{' '}
						{customersStats?.currentMonthCount -
							customersStats?.previousMonthCount >=
						0 ? (
							<ArrowUpward className="featuredIcon " />
						) : (
							<ArrowDownward className="featuredIcon " />
						)}
					</span>
					<span className="lastMonth">Since last month</span>
				</div>
			</div>

			<div
				className={`featuredItem ${
					currentMonthSales - prevMonthSales >= 0 ? 'positive' : 'negative'
				}`}>
				<div className="featuredTitle">
					<h2>Monthly Sales</h2>
					<MonetizationOn className="icon" />
				</div>

				<p className="featuredMoney"> {currentMonthSales},00 DA</p>

				<div className="featuredSub ">
					<span
						className={`featuredMoneyRate ${
							currentMonthSales - prevMonthSales >= 0 ? 'positive' : 'negative'
						}`}>
						<span>
							{currentMonthSales - prevMonthSales >= 0 && '+'}
							{currentMonthSales - prevMonthSales},00 DA
						</span>{' '}
						{currentMonthSales - prevMonthSales >= 0 ? (
							<ArrowUpward className="featuredIcon " />
						) : (
							<ArrowDownward className="featuredIcon " />
						)}
					</span>
					<span className="lastMonth">Since last month</span>
				</div>
			</div>

			<div
				className={`featuredItem ${
					currentMonthExpense - prevMonthExpense >= 0 ? 'positive' : 'negative'
				} `}>
				<div className="featuredTitle">
					<h2>Monthly Expenses</h2>
					<MoneyOff className="icon" />
				</div>

				<p className="featuredMoney">{currentMonthExpense},00 DA</p>

				<div className="featuredSub">
					<span
						className={`featuredMoneyRate ${
							currentMonthExpense - prevMonthExpense >= 0
								? 'positive'
								: 'negative'
						}`}>
						<span>
							{currentMonthExpense - prevMonthExpense >= 0 && '+'}
							{currentMonthExpense - prevMonthExpense},00 DA
						</span>{' '}
						{currentMonthExpense - prevMonthExpense >= 0 ? (
							<ArrowUpward className="featuredIcon " />
						) : (
							<ArrowDownward className="featuredIcon " />
						)}
					</span>
					<span className="lastMonth">Since last month</span>
				</div>
			</div>

			<div
				className={`featuredItem  ${
					currentMonthTransport - prevMonthTransport >= 0
						? 'positive'
						: 'negative'
				} `}>
				<div className="featuredTitle">
					<h2>Monthly Transportation</h2>
					<LocalShipping className="icon" />
				</div>

				<p className="featuredMoney"> {currentMonthTransport},00 DA</p>

				<div className="featuredSub">
					<span
						className={`featuredMoneyRate ${
							currentMonthTransport - prevMonthTransport >= 0
								? 'positive'
								: 'negative'
						}`}>
						<span
							className={`featuredMoneyRate ${
								currentMonthTransport - prevMonthTransport >= 0
									? 'positive'
									: 'negative'
							}`}>
							<span>
								{currentMonthTransport - prevMonthTransport >= 0 && '+'}
								{currentMonthTransport - prevMonthTransport},00 DA
							</span>{' '}
							{currentMonthTransport - prevMonthTransport >= 0 ? (
								<ArrowUpward className="featuredIcon " />
							) : (
								<ArrowDownward className="featuredIcon " />
							)}
						</span>
					</span>
					<span className="lastMonth">Since last month</span>
				</div>
			</div>
		</div>
	);
}
