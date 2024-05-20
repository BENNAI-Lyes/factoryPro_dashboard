import './home.scss';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import AreaChartComponent from '../../components/areaChartComponent/AreaChartComponent';
import LatestTransactions from '../../components/latestTransactions/LatestTransactions';
import NewCustomers from '../../components/newCustomers/NewCustomers';
import { useContext, useEffect, useState } from 'react';
import { axiosI } from '../../config';
import PieChartComponent from '../../components/pieChartComponent/PieChartComponent';
import { AuthContext } from '../../context/authContext/authContext';

const Home = () => {
	const [salesTransportStats, setSalesTransportStats] = useState([]);
	const [expensesStats, setExpensesStats] = useState([]);

	const { user } = useContext(AuthContext);

	// FETCH SALES && TRANSPORT STATS
	useEffect(() => {
		const fetchSalesStats = async () => {
			try {
				const res = await axiosI.get('bon/sells-stats', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});

				console.log('sales&&transport data', res.data);
				setSalesTransportStats(res.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchSalesStats();
	}, [user.accessToken]);

	// FETCH EXPENSES STATS
	useEffect(() => {
		const fetchSalesStats = async () => {
			try {
				const res = await axiosI.get('expense/stats', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});

				setExpensesStats(res.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchSalesStats();
	}, [user.accessToken]);

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
