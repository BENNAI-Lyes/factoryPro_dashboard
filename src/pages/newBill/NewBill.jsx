import { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ReactToPrint from 'react-to-print';

import './newBill.scss';
import logo from '../../assets/img/logo.png';
import { DeleteOutline } from '@material-ui/icons';
import {
  getProducts,
  updateProduct,
} from '../../context/productContext/productApiCalls';
import { ProductsContext } from '../../context/productContext/productContext';
import { BillsContext } from '../../context/billContext/billContext';
import { getBills } from '../../context/billContext/billContextApiCalls';
import {
  ADD_BILL_FAILURE,
  ADD_BILL_START,
  ADD_BILL_SUCCESS,
} from '../../context/billContext/billContextActions';

import { toast } from 'react-toastify';
import {
  ADD_TRANSACTION_START,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_FAILURE,
} from '../../context/transactionContext/transactionContextActions';
import { ClientsContext } from '../../context/clientContext/clientContext';
import {
  getClients,
  updateClient,
} from '../../context/clientContext/clientApiCalls';
import { axiosI } from '../../config';
import { useHistory } from 'react-router-dom';

const NewBill = () => {
  const history = useHistory();
  //date
  const today = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const date = today.toLocaleDateString('fr-FR', options);
  const bonRef = useRef();
  const [bonData, setBonData] = useState({
    remise: '0',
    vers: 0,
  });
  const [vers, setVers] = useState([{ date: '', amount: 0 }]);

  const [disabelSaveButton, setDisabelSaveButton] = useState(false);

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalRemise, setTotalRemise] = useState(0);
  const [dateC, setDateC] = useState('');

  const [transport, setTransport] = useState(0);

  const { dispatch: dispatchBill, bills } = useContext(BillsContext);
  //fetch products
  const { dispatch, products } = useContext(ProductsContext);
  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  useEffect(() => {
    getBills(dispatchBill);
  }, [dispatchBill]);

  // set autoCompleat data format
  const autoCompleatProducts = products.map((p) => ({
    title: p.name,
    price: p.price,
    quantity: p.quantity,
  }));

  const [product, setProduct] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [productValue, setProductValue] = useState(null);

  const handelAutoCompleatChange = (event, newValue) => {
    setProduct(newValue.title);
    setProductValue(newValue);
  };

  //fetch clients
  const { dispatch: dispatchClient, clients } = useContext(ClientsContext);

  useEffect(() => {
    getClients(dispatchClient);
  }, [dispatchClient]);

  //set auto compleat clients data format
  const clientsAutoCompleat = clients.map((c) => ({
    ...c,
    title: c.name,
  }));

  const [client, setClient] = useState('');
  const [clientInputValue, setClientInputValue] = useState('');
  const [clientValue, setClientValue] = useState(null);

  //set remise value
  useEffect(() => {
    setBonData({ ...bonData, remise: clientValue?.remise });
  }, [clientValue]);

  const handelAutoCompleatClientChange = (event, newValue) => {
    setClient(newValue.title);
    setClientValue(newValue);
  };

  //handel save new bill
  const handelSaveClick = async () => {
    /* */
    setDisabelSaveButton(true);
    dispatch(ADD_BILL_START());
    try {
      const res = await axiosI.post(
        'bon',
        {
          clientId: clientValue._id,
          date,
          number: bills.length === 0 ? 1 : bills[bills.length - 1]?.number + 1,
          clientName: clientValue?.name,
          remise: bonData.remise,
          total,
          totalRemise,
          transport,
          address: clientValue?.address,
          phone: clientValue?.phone,
          credit: totalRemise
            ? totalRemise - bonData.vers
            : total - bonData.vers,
          oldCredit: clientValue?.credit,
          vers: [{ date, amount: bonData.vers }],
          products: rows.map((r) => ({
            name: r.name,
            price: r.price,
            priceRemisé: r.priceRemisé,
            quantity: r.q,
            remise: r.remise,
            total: r.total,
          })),
        },
        {
          headers: {
            token:
              'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        }
      );
      toast.success('Bill Added Successfully.');
      dispatch(ADD_BILL_SUCCESS(res.data));

      //update client credit
      updateClient(dispatchClient, {
        credit:
          clientValue.credit +
          (totalRemise ? totalRemise - bonData.vers : total - bonData.vers),
        _id: clientValue._id,
      });

      //discount products quantity
      products.forEach((product) => {
        res.data.products.forEach((p) => {
          if (product.name === p.name)
            updateProduct(dispatch, {
              name: product.name,
              price: product.price,
              quantity: product.quantity - p.quantity,
              _id: product._id,
            });
        });
      });

      //clean form
      setBonData({
        remise: '0',
        credit: 0,
        vers: 0,
      });
      setRows([]);
      setProduct('');
      setQ(0);
      setTotal(0);
      setTotalRemise(0);
      setTransport(0);

      // add transactions
      dispatch(ADD_TRANSACTION_START());
      try {
        const res = await axiosI.post(
          'transaction',
          {
            billNumber:
              bills.length === 0 ? 1 : bills[bills.length - 1]?.number + 1,
            clientName: clientValue?.name,
            billAmount: total,
            date,
            vers: bonData.vers,
            credit:
              total.remise !== 0
                ? clientValue.credit + (totalRemise - bonData.vers)
                : clientValue.credit + (total - bonData.vers),
            clientId: clientValue._id,
          },
          {
            headers: {
              token:
                'Bearer ' +
                JSON.parse(localStorage.getItem('user')).accessToken,
            },
          }
        );
        dispatch(ADD_TRANSACTION_SUCCESS(res.data));
        toast.success('Transaction Added successfully.');
      } catch (error) {
        toast.error(error.response.data.message);
        dispatch(ADD_TRANSACTION_FAILURE(error));
      }

      //disabeld button
      setTimeout(() => {
        setDisabelSaveButton(false);
        history.push('/billets', { replace: true });
      }, 100);
    } catch (error) {
      dispatch(ADD_BILL_FAILURE(error));
      toast.error(error.response.data.message);
      setTimeout(() => {
        setDisabelSaveButton(false);
      }, 100);
    }
    /**/
  };

  function createDataR(name, q, price, remise, priceRemisé, total) {
    return { name, q, price, remise, priceRemisé, total };
  }

  function createData(name, q, price, total) {
    return { name, q, price, total };
  }

  const getPriceU = (productName) =>
    autoCompleatProducts.find((p) => p.title === productName).price;

  const getPriceUR = (price, remise) => price - (price * remise) / 100;

  const getTotal = (price, q) => parseInt(price, 10) * parseInt(q, 10);

  const handelClickWithR = () => {
    const productDB = products.find((p) => p.name === product);

    // console.log(pr.quantity);
    if (q > productDB.quantity) {
      toast.error(`There is Only ${productDB.quantity} in the stoke. `);
    } else {
      setRows([
        ...rows,
        createDataR(
          product,
          q,
          getPriceU(product),
          bonData.remise,
          getPriceUR(getPriceU(product), bonData.remise),
          getTotal(getPriceUR(getPriceU(product), bonData.remise), q)
        ),
      ]);
      setTotal((prv) => prv + getTotal(getPriceU(product), q));
      setTotalRemise(
        (prv) =>
          prv + getTotal(getPriceUR(getPriceU(product), bonData.remise), q)
      );
    }
  };

  const handelClickWithOutR = () => {
    const productDB = products.find((p) => p.name === product);

    // console.log(pr.quantity);
    if (q > productDB.quantity) {
      toast.error(`There is Only ${productDB.quantity} in the stoke. `);
    } else {
      setRows([
        ...rows,
        createData(
          product,
          q,
          getPriceU(product),
          getTotal(getPriceU(product), q)
        ),
      ]);
      setTotal((prv) => prv + getTotal(getPriceU(product), q));
    }
  };

  const handelChange = (e) => {
    setBonData({ ...bonData, [e.target.id]: e.target.value });
  };

  const handelDeleteClick = (r) => {
    setRows(rows.filter((row) => r !== row));

    if (bonData.remise === '0') {
      setTotal((prev) => prev - r.total);
    } else {
      setTotal((prev) => prev - r.price * r.q);
      setTotalRemise((prev) => prev - r.total);
    }
  };

  return (
    <div className="newBill">
      <div className="wrapper">
        <div className="top">
          <h1 className="mainTitle">New Bill</h1>
          <div className="items">
            {/* client */}
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
                options={clientsAutoCompleat}
                getOptionLabel={(option) => option.title}
                style={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    variant="outlined"
                  />
                )}
              />
            </div>

            <div className="item">
              <TextField
                size="small"
                id="remise"
                label="Discount"
                type="number"
                variant="outlined"
                sx={{ width: 80 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={bonData.remise}
                onChange={handelChange}
              />
            </div>

            <div className="item">
              <TextField
                size="small"
                id="vers"
                label="Payment"
                placeholder="Entrez Vers"
                type="number"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={bonData.vers}
                onChange={handelChange}
              />
            </div>
            <div className="item">
              <TextField
                size="small"
                id="transport"
                label="transport price"
                sx={{ width: 200 }}
                placeholder="La transport"
                type="number"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setTransport(e.target.value)}
                value={transport}
              />
            </div>
            <div className="item">
              <TextField
                size="small"
                id="dd"
                label="Date"
                sx={{ width: 100 }}
                placeholder="La date"
                type="string"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setDateC(e.target.value)}
                value={dateC}
              />
            </div>
          </div>

          <div className="items">
            <div className="item">
              <Autocomplete
                size="small"
                value={productValue}
                onChange={handelAutoCompleatChange}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={autoCompleatProducts}
                getOptionLabel={(option) => option.title}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="item">
              <TextField
                size="small"
                id="q"
                label="Quantity"
                sx={{ width: 80 }}
                placeholder="Quantity"
                type="number"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setQ(e.target.value)}
                value={q}
              />
            </div>
            <div className="item">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={
                  bonData.remise !== '0'
                    ? handelClickWithR
                    : handelClickWithOutR
                }
              >
                Add Product
              </Button>
            </div>
          </div>

          <div className="items">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handelSaveClick}
              disabled={disabelSaveButton}
            >
              Save
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" size="small">
                  Print
                </Button>
              )}
              content={() => bonRef.current}
            />
          </div>
        </div>

        {/* ///////bon/////// */}
        <div className="bottom" ref={bonRef}>
          <div className="backgroundImg">
            <img src={logo} alt="background" />
          </div>

          <div className="bottomContent">
            <div className="t">
              <div className="info">
                <div className="topInfo">
                  <div className="logo">
                    <img src={logo} alt="logo" />
                    <p>EL MELSSA PLAST</p>
                  </div>
                  <div className="bonTitle">
                    <h2>Bon De Livraison</h2>
                    <p>
                      Numéro:{' '}
                      {bills.length === 0
                        ? 1
                        : bills[bills.length - 1]?.number + 1}{' '}
                    </p>
                  </div>
                  <p className="bonDate"> {dateC ? dateC : date} </p>
                </div>

                <div className="bottomInfo billBottomInfo">
                  <div className="left" style={{ border: 'none' }}>
                    <div className="item">
                      <span className="key">Nom:</span>
                      <span className="value">{clientValue?.name}</span>
                    </div>{' '}
                    <div className="item">
                      <span className="key">Address:</span>
                      <span className="value"> {clientValue?.address} </span>
                    </div>{' '}
                    <div className="item">
                      <span className="key">Numéro de Téléphone:</span>
                      <span className="value"> {clientValue?.phone} </span>
                    </div>{' '}
                  </div>

                  <div className="right" style={{ border: 'none' }}>
                    <div className="item">
                      <span className="key">Production:</span>
                      <span className="value">Produit Citernes</span>
                    </div>
                    <div className="item">
                      <span className="key">Address:</span>
                      <span className="value">
                        Ain El Melssa Ain Arnet Sétif{' '}
                      </span>
                    </div>
                    <div className="item">
                      <span className="key">Contact:</span>
                      <span className="value"> 0776012015/0555753828 </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="m">
              <div className="table">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell width={250} className="tableCell">
                          Libellé
                        </TableCell>
                        <TableCell align="right" className="tableCell">
                          Quantité
                        </TableCell>
                        <TableCell align="right" className="tableCell">
                          Prix&nbsp;(U)
                        </TableCell>
                        {bonData.remise != '0' && (
                          <>
                            <TableCell align="right" className="tableCell">
                              Remise
                            </TableCell>
                            <TableCell align="right" className="tableCell">
                              Prix Remisé
                            </TableCell>
                          </>
                        )}
                        <TableCell align="right" className="tableCell">
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            scope="row"
                            className="tableCell"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell align="right" className="tableCell">
                            {row.q}
                          </TableCell>
                          <TableCell align="right" className="tableCell">
                            {row.price},00 DA
                          </TableCell>
                          {bonData.remise != '0' && (
                            <>
                              <TableCell align="right" className="tableCell">
                                {row.remise} %
                              </TableCell>
                              <TableCell align="right" className="tableCell">
                                {row.priceRemisé},00 DA
                              </TableCell>
                            </>
                          )}
                          <TableCell align="right" className="tableCell last">
                            <div className="content">
                              <span>{row.total},00 DA</span>
                              <button
                                type="button"
                                onClick={() => handelDeleteClick(row)}
                                className="delete"
                              >
                                <DeleteOutline className="deleteIcon" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            <div className="b">
              <div className="calc billCalc">
                <div className="calcLeft">
                  <div className="calcItem">
                    <span className="key">Nouveau Solde:</span>
                    <span className="value">
                      {' '}
                      {totalRemise
                        ? totalRemise - bonData.vers
                        : total - bonData.vers}
                      ,00 DA
                    </span>
                  </div>
                  <div className="calcItem" style={{ marginTop: '10px' }}>
                    <span className="key">Ancien Solde:</span>
                    <span className="value"> {clientValue?.credit},00 DA</span>
                  </div>
                  <div className="calcItem" style={{ marginTop: '10px' }}>
                    <span className="key">Vers:</span>
                    <span className="value">
                      {' '}
                      {bonData.vers},00 DA | {date}{' '}
                    </span>
                  </div>
                </div>
                <div className="calcRight">
                  <div className="calcItem">
                    <span className="key">Total Bon:</span>
                    <span className="value">{total},00 DA</span>
                  </div>
                  {bonData.remise != '0' && (
                    <>
                      <div className="calcItem">
                        <span className="key">Remise:</span>
                        <span className="value">
                          {total - totalRemise},00 DA
                        </span>
                      </div>
                      <div className="calcItem">
                        <span className="key">Total Avec remise:</span>
                        <span className="value">{totalRemise},00 DA</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="footer">Cache&Signature</div>
            </div>
            <small>
              <span style={{ color: 'blue' }}>FactoryProManager</span>{' '}
              <span style={{ fontSize: '11px' }}>(Web Application) </span>
              bennailyes19@gmail.com
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBill;
