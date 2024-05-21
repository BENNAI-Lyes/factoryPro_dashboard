import { CircularProgress } from '@material-ui/core';
import './areaChartComponent.scss';

import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

const AreaChartComponent = ({ data, salesLoading, expensesLoading }) => {
	return (
		<div className="areaChart">
			<h2 className="areaChartTitle">
				Total Sales, Expenses, and Transportation
			</h2>
			<ResponsiveContainer width="100%" height="100%">
				{salesLoading || expensesLoading ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '100px',
						}}>
						<CircularProgress style={{ color: 'lightGray' }} />
					</div>
				) : (
					<AreaChart width={500} height={400} data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="_id" />
						<YAxis />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="sales"
							stroke="#90EE90"
							fill="#98FB98"
						/>
						<Area
							type="monotone"
							dataKey="expense"
							stroke="#FFA07A"
							fill="#FFDAB9"
						/>
						<Area
							type="monotone"
							dataKey="transport"
							stroke="#87CEFA"
							fill="#B0E0E6"
						/>
					</AreaChart>
				)}
			</ResponsiveContainer>
		</div>
	);
};

export default AreaChartComponent;
