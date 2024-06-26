import { useEffect, useState, useContext } from 'react';
import './pieChartComponent.scss';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { axiosI } from '../../config';
import { AuthContext } from '../../context/authContext/authContext';
import { CircularProgress } from '@material-ui/core';

const COLORS = ['#00FF7F', '#F08080'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

const PieChartComponent = () => {
	const [billsCreatedThisMonth, setBillsCreatedThisMonth] = useState([]);
	const [totalSoldProducts, setTotalSoldProducts] = useState(0);
	const [totalReturnedProducts, setTotalReturnedProducts] = useState(0);

	const [loading, setLoading] = useState(false);

	const { user } = useContext(AuthContext);
	// FETCH DATA
	useEffect(() => {
		const fetchBillsCreatedThisMonth = async () => {
			setLoading(true);
			try {
				const res = await axiosI.get('bon/created-this-month', {
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				});

				setBillsCreatedThisMonth(res.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		fetchBillsCreatedThisMonth();
	}, [user.accessToken]);

	const data = [
		{ name: 'products sold', value: totalSoldProducts },
		{ name: 'product returned', value: totalReturnedProducts },
	];

	useEffect(() => {
		const totalSoldProductsData = billsCreatedThisMonth
			?.map((bill) => {
				return bill?.products?.reduce(
					(total, currentVal) => total + currentVal?.quantity,
					0
				);
			})
			.reduce((acc, currentVal) => acc + currentVal, 0);

		const totalReturnedProductsData = billsCreatedThisMonth
			?.map((bill) => {
				return bill?.productsReturned?.reduce(
					(total, currentVal) => total + currentVal?.quantity,
					0
				);
			})
			.reduce((acc, currentVal) => acc + currentVal, 0);

		setTotalSoldProducts(totalSoldProductsData);
		setTotalReturnedProducts(totalReturnedProductsData);
	}, [billsCreatedThisMonth]);

	return (
		<div className="pieChartComponent">
			<h2 className="pieChartTitle">Total Products Sold vs. Returned</h2>
			{loading ? (
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
				<>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart style={{ marginTop: '-30px' }}>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={renderCustomizedLabel}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value">
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="footer">
						<div className="item">
							<div className="circle sold" />
							<div className="desc">
								Product sold in this month{' '}
								<span className="sold">{totalSoldProducts} products </span>{' '}
							</div>
						</div>
						<div className="item ">
							<div className="circle returned" />
							<div className="desc">
								Product returned in this month{' '}
								<span className="returned">
									{' '}
									{totalReturnedProducts} products{' '}
								</span>{' '}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default PieChartComponent;
