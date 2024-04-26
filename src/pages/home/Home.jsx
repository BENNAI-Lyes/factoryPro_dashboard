import { useContext, useEffect, useState } from 'react';
import { getBillsStats } from '../../context/billContext/billContextApiCalls';
import './home.scss';
import { BillsContext } from '../../context/billContext/billContext';
import { ReturnProductsContext } from '../../context/returnProductContext/returnProductContext';
import { getReturnProductStats } from '../../context/returnProductContext/returnProductContextApiCalls';
import Chart from '../../components/chart/Chart';

import { getProducts } from '../../context/productContext/productApiCalls';
import { ProductsContext } from '../../context/productContext/productContext';

import { toast } from 'react-toastify';

// import SellsReturnStats from '../../components/swiper/SellsReturnStats';
import { axiosI } from '../../config';

const Home = () => {
  const { dispatch: dispatchBill, } = useContext(BillsContext);
  const { dispatch, } = useContext(ReturnProductsContext);

  //fetch products
  const { dispatch: dispatchProduct, } = useContext(ProductsContext);
  useEffect(() => {
    getProducts(dispatchProduct);
  }, [dispatchProduct]);

  useEffect(() => getBillsStats(dispatchBill), [dispatchBill]);
  useEffect(() => getReturnProductStats(dispatch), [dispatch]);

  //get sells stats
  const [sellsStats, setSellsStats] = useState([]);
  useEffect(() => {
    const fetchSellsStats = async () => {
      try {
        const res = await axiosI.get('bon/sells-stats', {
          headers: {
            token:
              'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        });

        setSellsStats(res.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchSellsStats();
  }, []);

  //get expense stats
  const [expenseStats, setExpenseStats] = useState([]);
  useEffect(() => {
    const fetchSellsStats = async () => {
      try {
        const res = await axiosI.get('expense/stats', {
          headers: {
            token:
              'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        });
        setExpenseStats(res.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchSellsStats();
  }, []);

  const expenseStatsM = expenseStats
    .map((e) => ({
      name: e._id,
      total: e.total,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );

  const sellsStatsM = sellsStats
    .map((e) => ({
      name: e._id,
      total: e.total,
      transport: e.transport,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );

  return (
    <div className="home">
      <div className="wrapper">
        {/* <SellsReturnStats
          products={products}
          sellsStats={bills}
          returnStats={returnProducts}
          sellsStatsM={sellsStatsM}
          expenseStatsM={expenseStatsM}
        /> */}

        <div className="stat">
          <Chart
            data={sellsStatsM}
            dataKey="total"
            title="Total sales"
            grid={true}
          />
        </div>
        <div className="stat">
          <Chart
            data={expenseStatsM}
            dataKey="total"
            title="Total expencess"
            grid={true}
          />
        </div>
      </div>

    </div>
  );
};

export default Home;
