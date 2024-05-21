import './home.scss';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import AreaChartComponent from '../../components/areaChartComponent/AreaChartComponent';
import LatestTransactions from '../../components/latestTransactions/LatestTransactions';
import NewCustomers from '../../components/newCustomers/NewCustomers';
import { useContext, useEffect, useState } from 'react';
import { axiosI } from '../../config';
import PieChartComponent from '../../components/pieChartComponent/PieChartComponent';
import { AuthContext } from '../../context/authContext/authContext';
import { mergeArrays } from '../../helpers/mergeArrays';

const Home = () => {
	const [salesTransportStats, setSalesTransportStats] = useState([]);
	const [expensesStats, setExpensesStats] = useState([]);

	const [salesLoading, setSalesLoading] = useState(false);
	const [expensesLoading, setExpensesLoading] = useState(false);

	const { user } = useContext(AuthContext);

	// FETCH SALES && TRANSPORT STATS
	useEffect(() => {
		const fetchSalesStats = async () => {
			try {
				setSalesLoading(true);
				const res = await axiosI.get('bon/sells-stats', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});

				setSalesTransportStats(res.data);
			} catch (error) {
				console.log(error);
			} finally {
				setSalesLoading(false);
			}
		};

		fetchSalesStats();
	}, [user.accessToken]);

	// FETCH EXPENSES STATS
	useEffect(() => {
		const fetchSalesStats = async () => {
			try {
				setExpensesLoading(true);
				const res = await axiosI.get('expense/stats', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});

				setExpensesStats(res.data);
			} catch (error) {
				console.log(error);
			} finally {
				setExpensesLoading(false);
			}
		};

		fetchSalesStats();
	}, [user.accessToken]);

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
				<FeaturedInfo
					data={data}
					salesLoading={salesLoading}
					expensesLoading={expensesLoading}
				/>
				<div className="charts">
					<AreaChartComponent
						data={data}
						salesLoading={salesLoading}
						expensesLoading={expensesLoading}
					/>
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
