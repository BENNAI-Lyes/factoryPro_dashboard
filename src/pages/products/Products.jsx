import { DataGrid } from '@material-ui/data-grid';
import {
	Edit,
	DeleteOutline,
	Add,
	PrintOutlined,
	AddOutlined,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, TextField } from '@material-ui/core';

import './products.scss';
import { ProductsContext } from '../../context/productContext/productContext';
import {
	deleteProduct,
	getProducts,
} from '../../context/productContext/productApiCalls';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { updateProduct } from '../../context/productContext/productApiCalls';
import ReactToPrint from 'react-to-print';
import { GET_PRODUCT_START } from '../../context/productContext/productContextActions';
import { axiosI } from '../../config';

const Products = () => {
	const productsRef = useRef();
	const { dispatch, products, isFetching } = useContext(ProductsContext);

	const [product, setProduct] = useState({});

	const [newQ, setNewQ] = useState(0);

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
			field: 'netProfit',
			headerName: 'Net Profit',
			flex: 1,
			renderCell: (params) => {
				return params.row.netProfit + ',00 DA';
			},
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

	//set auto compleat clients data format
	const clientsAutoCompleat = products.map((c) => ({
		...c,
		title: c.name,
	}));

	const [clientsAutoCompleatVal, setClientsAutoCompleatVal] =
		useState(clientsAutoCompleat);

	const [client, setClient] = useState('');
	const [clientInputValue, setClientInputValue] = useState('');
	const [clientValue, setClientValue] = useState(null);

	const handelAutoCompleatClientChange = (event, newValue) => {
		setClient(newValue.title);
		setClientValue(newValue);
	};

	const handelAdd = () => {
		updateProduct(dispatch, {
			quantity: product?.quantity + parseInt(newQ),
			name: clientValue.name,
			price: clientValue.price,
			_id: clientValue._id,
		});

		setNewQ(0);
		setClient('');
		setClientValue('');
	};

	useEffect(() => {
		const getProduct = async (dispatch, id) => {
			try {
				const res = await axiosI.get('product/find/' + id, {
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				});

				setProduct(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		getProduct(dispatch, clientValue?._id);
	}, [dispatch, clientValue]);

	return (
		<div className="products">
			<div className="wrapper">
				<div className="addToStoke">
					<h3 className="title">Add to stock</h3>
					<div className="items">
						<div className="item">
							<label htmlFor="selectProduct" className="label">
								Select product
							</label>
							<Autocomplete
								size="small"
								value={clientValue}
								onChange={handelAutoCompleatClientChange}
								inputValue={clientInputValue}
								onInputChange={(event, newInputValue) => {
									setClientInputValue(newInputValue);
								}}
								id="selectProduct"
								options={clientsAutoCompleatVal}
								getOptionLabel={(option) => option.title}
								style={{ width: 250 }}
								renderInput={(params) => (
									<TextField
										size="small"
										{...params}
										label=""
										variant="standard"
										fullWidth
									/>
								)}
							/>
						</div>
						<div className="item">
							<label htmlFor="quantity" className="label">
								Quantity
							</label>
							<TextField
								size="small"
								id="quantity"
								label=""
								type="number"
								variant="standard"
								sx={{ width: 250 }}
								InputLabelProps={{
									shrink: true,
								}}
								value={newQ}
								onChange={(e) => {
									setNewQ(e.target.value);
								}}
							/>
						</div>
						<div className="item">
							<Button
								variant="contained"
								color="default"
								onClick={handelAdd}
								startIcon={<AddOutlined />}
								size="large">
								Add
							</Button>
						</div>
					</div>
				</div>

				<div className="header">
					<h2 className="title">Products list</h2>

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
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress color="primary" style={{ marginTop: '50px' }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Products;
