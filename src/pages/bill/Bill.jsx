import { useContext, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import './bill.scss';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import logo from '../../assets/img/logo.png';
import ReactToPrint from 'react-to-print';
import { ProductsContext } from '../../context/productContext/productContext';
import { getProducts } from '../../context/productContext/productApiCalls';

import {
  deleteBill,
  getBills,
} from '../../context/billContext/billContextApiCalls';
import {
  getClient,
  updateClient,
} from '../../context/clientContext/clientApiCalls';
import {
  deleteReturnedProduct,
  getReturnProducts,
} from '../../context/returnProductContext/returnProductContextApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { ReturnProductsContext } from '../../context/returnProductContext/returnProductContext';
import { axiosI } from '../../config';
import { toast } from 'react-toastify';

const Bill = () => {
  const history = useHistory();
  const bill = useLocation().bill;

  const bonRef = useRef();

  const { dispatch, products } = useContext(ProductsContext);
  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  const { dispatch: dispatchClient, clients } = useContext(ClientsContext);
  useEffect(() => {
    getClient(dispatchClient, bill?.clientId);
  }, [dispatchClient]);

  console.log('clients=====>', clients);

  const { dispatch: dispatchReturnProduct, returnProducts } = useContext(
    ReturnProductsContext
  );

  const getProductPrice = (productName) => {
    return products.find((p) => p.name === productName);
  };

  const getDesc = (p) => {
    if (bill.remise !== 0) {
      return (
        getProductPrice(p.name)?.price * p.quantity -
        (getProductPrice(p.name)?.price * p.quantity * bill.remise) / 100
      );
    } else {
      return getProductPrice(p.name)?.price * p.quantity;
    }
  };

  const handelDelete = async () => {
    // deleteBill(dispatch, bill?._id);
    await axiosI.delete('bon/' + bill?._id, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    toast.success('Bill Deleted Successfully.');
    history.push('/billets', { replace: true });

    updateClient(dispatchClient, {
      credit: clients[0].credit - bill.credit,
      _id: bill.clientId,
    });

    //delete return products
    deleteReturnedProduct(
      dispatchReturnProduct,
      returnProducts.find((r) => r.returnProductId === bill?.returnProductId)
        ._id
    );
  };

  return (
    <div className="bill">
      <div className="wrapper">
        <div className="buttons" style={{ justifyContent: 'flex-end' }}>
          <div className="button">
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" size="small" color="info">
                  print
                </Button>
              )}
              content={() => bonRef.current}
            />
          </div>
          <div className="button">
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handelDelete}
            >
              Delete
            </Button>
          </div>
        </div>
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
                    <p>Numéro: {bill.number} </p>
                  </div>
                  <p className="bonDate"> {bill.date} </p>
                </div>

                <div className="bottomInfo billBottomInfo">
                  <div className="left" style={{ border: 'none' }}>
                    <div className="item">
                      <span className="key">Nom:</span>
                      <span className="value">{bill.clientName}</span>
                    </div>{' '}
                    <div className="item">
                      <span className="key">Address:</span>
                      <span className="value"> {bill.address} </span>
                    </div>{' '}
                    <div className="item">
                      <span className="key">Numéro de Téléphone:</span>
                      <span className="value"> {bill.phone} </span>
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
                        {bill.remise !== 0 && (
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
                      {bill.products.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            scope="row"
                            className="tableCell"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell align="right" className="tableCell">
                            {row.quantity}
                          </TableCell>
                          <TableCell align="right" className="tableCell">
                            {row.price},00
                          </TableCell>
                          {bill.remise !== 0 && (
                            <>
                              <TableCell align="right" className="tableCell">
                                {row.remise} %
                              </TableCell>
                              <TableCell align="right" className="tableCell">
                                {row.priceRemisé},00
                              </TableCell>
                            </>
                          )}
                          <TableCell align="right" className="tableCell last">
                            <div className="content">
                              <span>{row.total},00 </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {bill.productsReturned.length > 0 && (
                <div className="productR">
                  <h3>Produits Retournés:</h3>
                  <div className="prs">
                    {bill.productsReturned.map((p, index) => (
                      <div
                        className="pr"
                        style={{ display: 'flex', alignItems: 'center' }}
                        key={index + Math.random()}
                      >
                        <span className="prQ">{p.quantity}:</span>
                        <span className="prName"> {p.name}</span>
                        <span className="prQ" style={{ fontSize: '14px' }}>
                          ({getDesc(p)},00 DA){' '}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="b">
              <div className="calc billCalc">
                <div className="calcLeft">
                  <div className="calcItem">
                    <span className="key">Nouveau Solde:</span>
                    <span className="value">
                      {' '}
                      {bill.credit}
                      ,00 DA
                    </span>
                  </div>
                  <div className="calcItem" style={{ marginTop: '10px' }}>
                    <span className="key">Ancien Solde:</span>
                    <span className="value"> {bill?.oldCredit},00 DA </span>
                  </div>
                  {bill?.vers?.map((v) => (
                    <div
                      className="calcItem"
                      style={{ marginTop: '10px' }}
                      key={v._id}
                    >
                      <span className="key">Vers:</span>
                      <span className="value">
                        {' '}
                        {v.amount},00 DA | {v.date}{' '}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="calcRight">
                  <div className="calcItem">
                    <span className="key">Total Bon:</span>
                    <span className="value">{bill.total},00 DA</span>
                  </div>
                  {bill.remise !== 0 && (
                    <>
                      <div className="calcItem">
                        <span className="key">Remise:</span>
                        <span className="value">
                          {bill.total - bill.totalRemise},00 DA
                        </span>
                      </div>
                      <div className="calcItem">
                        <span className="key">Total Avec remise:</span>
                        <span className="value">{bill.totalRemise},00 DA</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="footer">Cache&Signature</div>
            </div>
            <small>
              <span style={{ color: 'blue' }}>EasyManage</span>{' '}
              <span style={{ fontSize: '11px' }}>(Application Web) </span>
              bennailyes19@gmail.com
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Bill;
