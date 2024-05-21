import { DataGrid } from '@material-ui/data-grid';
import { Edit, DeleteOutline, Add, PrintOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import ReactToPrint from 'react-to-print';

import './products.scss';
import { ProductsContext } from '../../context/productContext/productContext';
import {
	deleteProduct,
	getProducts,
} from '../../context/productContext/productApiCalls';

const Products = () => {
	const productsRef = useRef();

	const { dispatch, products, isFetching } = useContext(ProductsContext);

	useEffect(() => {
		getProducts(dispatch);
	}, [dispatch]);

	const columns = [
		{ field: 'number', headerName: 'Number', flex: 1 },
		{
			field: 'name',
			headerName: 'Name',
			flex: 1,
		},
		{
			field: 'price',
			headerName: 'Price',
			flex: 1,
			renderCell: (params) => {
				return params.row.price + ',00 DA';
			},
		},
		{
			field: 'quantity',
			headerName: 'Quantity',
			flex: 1,
		},
		{
			field: 'action',
			headerName: 'Action',
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="action--icons">
						<Link
							to={{
								pathname: `/product/${params.row._id}`,
								product: params.row,
							}}>
							<Edit className="edit icon" />
						</Link>
						<div>
							<DeleteOutline
								className="delete icon"
								onClick={() => {
									deleteProduct(dispatch, params.row._id);
								}}
							/>
						</div>
					</div>
				);
			},
		},
	];

	return (
		<div className="products">
			<div className="wrapper">
				<div className="header">
					<h2 className="products-title">Products list</h2>

					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button
									variant="outlined"
									size="small"
									color="primary"
									startIcon={<PrintOutlined />}>
									print
								</Button>
							)}
							content={() => productsRef.current}
						/>
						<Link to="/new-product">
							<Button
								variant="contained"
								color="primary"
								startIcon={<Add />}
								className="button"
								size="small">
								New Product
							</Button>
						</Link>
					</div>
				</div>

				{!isFetching ? (
					<div
						className="table"
						style={{ height: '80vh', width: '100%', paddingTop: '20px' }}
						ref={productsRef}>
						<DataGrid
							rows={products}
							columns={columns}
							pageSize={10}
							getRowId={(r) => r._id || Math.random()}
						/>
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '100px',
						}}>
						<CircularProgress style={{ color: 'lightGray' }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Products;
