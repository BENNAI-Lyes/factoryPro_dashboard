import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import './newProduct.scss';

import { ProductsContext } from '../../context/productContext/productContext';
import { Button } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import {
	ADD_PRODUCT_FAILURE,
	ADD_PRODUCT_START,
	ADD_PRODUCT_SUCCESS,
} from '../../context/productContext/productContextActions';
import { axiosI } from '../../config';
import { toast } from 'react-toastify';

export default function NewProduct() {
	const history = useHistory();

	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(0);

	const { dispatch, products } = useContext(ProductsContext);

	const handelSubmit = async (e) => {
		e.preventDefault();
		dispatch(ADD_PRODUCT_START());
		try {
			const res = await axiosI.post(
				'product',
				{
					name,
					price,
					quantity,
					number: products.length + 1,
				},
				{
					headers: {
						token:
							'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
					},
				}
			);
			dispatch(ADD_PRODUCT_SUCCESS(res?.data));
			toast.success('Product Added successfully.');
			history.push('/products');
			setName('');
			setPrice(0);
			setQuantity(0);
		} catch (error) {
			toast.error(error.response.data?.message);
			dispatch(ADD_PRODUCT_FAILURE(error));
		}
	};

	return (
		<div className="newProduct">
			<h2>New Product</h2>
			<form className="form">
				<div className="group">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Enter Product Name"
						className="input"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				<div className="group">
					<label htmlFor="price">Price</label>
					<input
						type="number"
						id="price"
						className="input"
						placeholder="Price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</div>

				<div className="group">
					<label htmlFor="quantity">Quantity</label>
					<input
						type="number"
						id="quantity"
						className="input"
						placeholder="Quantity"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
					/>
				</div>
			</form>
			<Button
				variant="contained"
				size="small"
				color="primary"
				startIcon={<AddOutlined />}
				onClick={handelSubmit}>
				Add new product
			</Button>
		</div>
	);
}
