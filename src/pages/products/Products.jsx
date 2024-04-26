import './products.scss';
import { DataGrid } from '@material-ui/data-grid';
import { Edit, DeleteOutline, Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, TextField } from '@material-ui/core';
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
	const { dispatch, products, isFetching } = useContext(ProductsContext);

	const [product, setProduct] = useState({});

	const [newQ, setNewQ] = useState(0);

	const productsRef = useRef();

	useEffect(() => {
		getProducts(dispatch);
	}, [dispatch]);

	const columns = [
		{ field: 'number', headerName: 'N°', width: 100 },
		{
			field: 'name',
			headerName: 'Name',
			width: 300,
		},
		{
			field: 'price',
			headerName: 'Price',
			width: 180,
			renderCell: (params) => {
				return params.row.price + ',00 DA';
			},
		},
		{
			field: 'quantity',
			headerName: 'Quantity',
			width: 180,
		},
		{
			field: 'netProfit',
			headerName: 'Net Profit',
			width: 180,
			renderCell: (params) => {
				return params.row.netProfit + ',00 DA';
			},
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			renderCell: (params) => {
				return (
					<div className="actionCell">
						<Link
							to={{
								pathname: `/product/${params.row._id}`,
								product: params.row,
							}}>
							<Edit className="editIcon" />
						</Link>
						<DeleteOutline
							className="deleteIcon"
							onClick={() => {
								deleteProduct(dispatch, params.row._id);
							}}
						/>
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
				<div className="changeOfStoke">
					<h3 className="title">Add to stock</h3>
					<div className="items">
						<div className="item">
							<Autocomplete
								size="small"
								value={clientValue}
								onChange={handelAutoCompleatClientChange}
								inputValue={clientInputValue}
								onInputChange={(event, newInputValue) => {
									setClientInputValue(newInputValue);
								}}
								id="controllable-states-demo"
								options={clientsAutoCompleatVal}
								getOptionLabel={(option) => option.title}
								style={{ width: 300 }}
								renderInput={(params) => (
									<TextField
										size="small"
										{...params}
										label="Product"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>
						<div className="item">
							<TextField
								size="small"
								id="remise"
								label="Quantity"
								type="number"
								variant="outlined"
								sx={{ width: 80 }}
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
								variant="outlined"
								color="primary"
								onClick={handelAdd}
								size="small">
								Add
							</Button>
						</div>
					</div>
				</div>

				<div className="header">
					<h2 className="title">Products:</h2>

					<div className="headerButton">
						<ReactToPrint
							trigger={() => (
								<Button variant="contained" size="small">
									print
								</Button>
							)}
							content={() => productsRef.current}
						/>
						<Link to="/newProduct">
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
						style={{ height: '650px', width: '100%', paddingTop: '20px' }}
						ref={productsRef}>
						<DataGrid
							rows={products}
							columns={columns}
							pageSize={10}
							checkboxSelection
							disableSelectionOnClick
							getRowId={(r) => r._id}
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
