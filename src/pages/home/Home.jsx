import './home.scss';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import AreaChartComponent from '../../components/areaChartComponent/AreaChartComponent';
import LatestTransactions from '../../components/latestTransactions/LatestTransactions';
import NewCustomers from '../../components/newCustomers/NewCustomers';
import { useEffect, useState } from 'react';
import { axiosI } from '../../config';
import PieChartComponent from '../../components/pieChartComponent/PieChartComponent';

const Home = () => {
	const [salesTransportStats, setSalesTransportStats] = useState([]);
	const [expensesStats, setExpensesStats] = useState([]);

	// FETCH SALES && TRANSPORT STATS
	useEffect(() => {
		const fetchSalesStats = async () => {
			try {
				const res = await axiosI.get('bon/sells-stats', {
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				});

				setSalesTransportStats(res.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchSalesStats();
	}, []);

	// FETCH EXPENSES STATS
	useEffect(() => {
		const fetchSalesStats = async () => {
			try {
				const res = await axiosI.get('expense/stats', {
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				});

				console.log('expenses stat', res.data);
				setExpensesStats(res.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchSalesStats();
	}, []);

	const mergeArrays = (expenses, sales) => {
		const combinedMap = {};

		const mergeObjects = (target, source) => {
			for (const key in source) {
				if (source.hasOwnProperty(key)) {
					target[key] = source[key];
				}
			}
		};

		expenses.forEach((item) => {
			combinedMap[item._id] = { ...item };
		});

		sales.forEach((item) => {
			if (combinedMap[item._id]) {
				mergeObjects(combinedMap[item._id], item);
			} else {
				combinedMap[item._id] = { ...item };
			}
		});

		return Object.values(combinedMap);
	};

	const data = mergeArrays(salesTransportStats, expensesStats)?.sort((a, b) => {
		if (a._id < b._id) {
			return -1;
		}
		if (a._id > b._id) {
			return 1;
		}
		return 0;
	});

	return (
		<div className="home">
			<div className="wrapper">
				<FeaturedInfo data={data} />
				<div className="charts">
					<AreaChartComponent data={data} />
					<PieChartComponent />
				</div>
				<div className="tables">
					<LatestTransactions />
					<NewCustomers />
				</div>
			</div>
		</div>
	);
};

export default Home;
