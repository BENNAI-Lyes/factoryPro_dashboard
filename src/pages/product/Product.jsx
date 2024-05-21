import { useLocation, useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';

import './product.scss';
import { ProductsContext } from '../../context/productContext/productContext';
import {
	UPDATE_PRODUCT_FAILURE,
	UPDATE_PRODUCT_START,
	UPDATE_PRODUCT_SUCCESS,
} from '../../context/productContext/productContextActions';
import { axiosI } from '../../config';
import { toast } from 'react-toastify';
import { Button } from '@material-ui/core';
import { UpdateOutlined } from '@material-ui/icons';
import { AuthContext } from '../../context/authContext/authContext';

export default function Product() {
	const history = useHistory();

	const { user } = useContext(AuthContext);
	const product = useLocation().product;
	const [name, setName] = useState(product.name);
	const [price, setPrice] = useState(product.price);
	const [quantity, setQuantity] = useState(product.quantity);

	const { dispatch } = useContext(ProductsContext);

	const handelSubmit = async (e) => {
		e.preventDefault();
		dispatch(UPDATE_PRODUCT_START());
		try {
			const res = await axiosI.put(
				'product/' + product._id,
				{ name, price, quantity },
				{
					headers: {
						token: 'Bearer ' + user.accessToken,
					},
				}
			);
			dispatch(UPDATE_PRODUCT_SUCCESS(res?.data));
			toast.success('Product Updated successfully.');
			history.push('/products');
		} catch (error) {
			toast.error(error.response.data?.message);
			dispatch(UPDATE_PRODUCT_FAILURE(error));
		}
	};

	return (
		<div className="product">
			<div className="wrapper">
				<h2 className="title">Update product</h2>

				<form className="form">
					<div className="group">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							placeholder="Enter Name"
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
							placeholder="Enter Price"
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
							placeholder="Enter Quantity"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
						/>
					</div>
				</form>
				<Button
					variant="contained"
					size="small"
					color="primary"
					startIcon={<UpdateOutlined />}
					onClick={handelSubmit}>
					update product
				</Button>
			</div>
		</div>
	);
}
