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

const AreaChartComponent = ({ data }) => {
	return (
		<div className="areaChart">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart width={500} height={400} data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="_id" />
					<YAxis />
					<Tooltip />
					<Area
						type="monotone"
						dataKey="sales"
						stroke="#8fce00"
						fill="#bbe166"
					/>
					<Area
						type="monotone"
						dataKey="expense"
						stroke="#cc0000"
						fill="#e06666"
					/>
					<Area
						type="monotone"
						dataKey="transport"
						stroke="#842593"
						fill="#a866b3"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default AreaChartComponent;
