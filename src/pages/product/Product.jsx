import './product.scss';

import { useLocation } from 'react-router-dom';
// import Chart from "../../components/chart/Chart";
// import { productData } from "../../data";
import { useContext, useState } from 'react';
import { ProductsContext } from '../../context/productContext/productContext';
import { updateProduct } from '../../context/productContext/productApiCalls';

export default function Product() {
	const product = useLocation().product;
	const [name, setName] = useState(product.name);
	const [price, setPrice] = useState(product.price);
	const [quantity, setQuantity] = useState(product.quantity);
	const [netProfit, setNetProfit] = useState(product.netProfit);

	const { dispatch } = useContext(ProductsContext);

	const handelSubmit = (e) => {
		e.preventDefault();

		updateProduct(dispatch, {
			name,
			price,
			quantity,
			netProfit,
			_id: product._id,
		});
	};

	return (
		<div className="product">
			<div className="titleContainer">
				<h1 className="title">Update product:</h1>
			</div>
			<div className="productContainer">
				{/* <div className="top">
		      <div className="left">
		        <Chart
		          title="Sales Performance"
		          data={productData}
		          dataKey="Sales"
		        />
		      </div>
		    </div> */}
				<div className="bottom">
					<div className="left">
						<form className="form" onSubmit={handelSubmit}>
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

							<div className="group">
								<label htmlFor="quantity">Net Profit</label>
								<input
									type="number"
									id="netProfit"
									className="input"
									placeholder="Enter Net Profit"
									value={netProfit}
									onChange={(e) => setNetProfit(e.target.value)}
								/>
							</div>

							<div className="group">
								<button className="add" type="submit">
									Update
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
