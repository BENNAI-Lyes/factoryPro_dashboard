import './clientInfo.scss';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline, Add } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import { TransactionsContext } from '../../context/transactionContext/transactionContext';
import {
  deleteTransaction,
  getTransactions,
} from '../../context/transactionContext/transactionContextApiCalls';
import {
  ADD_TRANSACTION_FAILURE,
  ADD_TRANSACTION_START,
  ADD_TRANSACTION_SUCCESS,
} from '../../context/transactionContext/transactionContextActions';

import { toast } from 'react-toastify';
import ReactToPrint from 'react-to-print';
import {
  getBills,
  updateBill,
} from '../../context/billContext/billContextApiCalls';
import { BillsContext } from '../../context/billContext/billContext';
import { axiosI } from '../../config';
import { updateClient } from '../../context/clientContext/clientApiCalls';
import { ClientsContext } from '../../context/clientContext/clientContext';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '90%',
    height: '80vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
    border: 'none',
    borderRadius: '5px',
    overflowY: 'auto',
  },
}));

const ClientInfo = () => {
  const tabelRef = useRef();

  const clientId = useLocation().pathname.split('/')[2];
  const client = useLocation().client;
  const { dispatch, transactions } = useContext(TransactionsContext);
  const { dispatch: dispatchClient } = useContext(ClientsContext);

  const [billNumber, setBillNumber] = useState(0);
  const [billPayment, setBillPayment] = useState(0);

  const [bill, setBill] = useState({});

  useEffect(() => {
    getTransactions(dispatch, client?._id);
  }, [dispatch, client]);

  const { dispatch: dispatchBills, bills } = useContext(BillsContext);

  console.log('bills===>', bills);

  useEffect(() => {
    getBills(dispatchBills);
  }, [dispatchBills]);

  useEffect(() => {
    setBill(bills.find((b) => b.number === parseInt(billNumber)));
  }, [bills, billNumber]);

  const columns = [
    { field: 'billNumber', headerName: 'Bill Number', width: 250 },
    {
      field: 'date',
      headerName: 'Date',
      width: 300,
    },
    {
      field: 'vers',
      headerName: 'Payment',
      width: 350,
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 180,

      renderCell: (params) => {
        return (
          <div className="actionCell">
            <DeleteOutline
              className="deleteIcon"
              onClick={() => {
                console.log(params.row);
                deleteTransaction(dispatch, params.row._id);

                //update client
                updateClient(dispatchClient, {
                  credit: client.credit + params.row.vers,
                  _id: params.row.clientId,
                });

                //delete vers from the bill
                updateBill(dispatchBills, {
                  _id: params.row.billId,

                  vers: bills
                    .find((b) => b._id === params.row.billId)
                    .vers.filter((v) => v.id !== params.row.id),
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  //modal
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [copen, setCopen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCclose = () => {
    setCopen(false);
  };

  const today = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = today.toLocaleDateString('fr-FR', options);

  const handelSubmit = async (e) => {
    e.preventDefault();

    dispatch(ADD_TRANSACTION_START());
    try {
      const res = await axiosI.post(
        'transaction',
        {
          billNumber,
          clientName: client.name,
          billAmount: bill.totalRemise ? bill.totalRemise : bill.total,
          date,
          vers: billPayment,
          clientId,
        },
        {
          headers: {
            token:
              'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        }
      );
      dispatch(ADD_TRANSACTION_SUCCESS(res.data));
      toast.success('Transaction Added successfully.');

      //clean modal
      setBillNumber('');
      setBillPayment('');

      //update client credit
      updateClient(dispatchClient, {
        credit: client.credit - billPayment,
        _id: client._id,
      });
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(ADD_TRANSACTION_FAILURE(error));
    }
  };

  // const handleCalc = () => {
  //   transactions.forEach((t) => {
  //     vers = vers + parseFloat(t.vers);
  //     credit = credit + parseFloat(t.credit);
  //     total = total - parseFloat(t.billAmount);

  //     transactions.forEach((tt) => {
  //       if (t.billNumber === tt.billNumber)
  //         total = total - parseFloat(t.billAmount);
  //     });
  //   });
  // };

  const transactionGroupedByBillNumber = transactions.reduce(
    (groupedTransactions, transaction) => {
      const key = transaction.billNumber;
      if (!groupedTransactions[key]) groupedTransactions[key] = [];
      groupedTransactions[key].push(transaction);
      return groupedTransactions;
    },
    {}
  );

  const transactionOnArray = Object.keys(transactionGroupedByBillNumber).map(
    (o) => ({
      billNumber: o,
      data: transactionGroupedByBillNumber[o],
    })
  );

  const allT = transactionOnArray.map((t) => {
    const data = t.data.reduce((a, b) => {
      return {
        credit: b.credit,
        vers: a.vers + b.vers,
        total: b.billAmount,
      };
    });
    return {
      id: t.billNumber,
      ...data,
    };
  });

  const handelBlur = () => {
    if (!bill)
      alert(
        "il n'y a pas de bon avec ce numéro, veuillez entrer un numéro de facture valide !!!"
      );
  };

  return (
    <div className="clients">
      <div className="wrapper">
        <div className="header">
          <h2
            className="title"
            style={{ textTransform: 'capitalize', fontSize: '24px' }}
          >
            {' '}
            Payments off: {client?.name}{' '}
          </h2>
          <div className="headerButton">
            <ReactToPrint
              trigger={() => (
                <Button variant="outlined" color="secondary">
                  print
                </Button>
              )}
              content={() => tabelRef.current}
            />
            {/* <Button
              variant="outlined"
              color="primary"
              className="button"
              onClick={() => {
                handleCalc();
                handleCopen();
              }}
            >
              calcul
            </Button> */}
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              className="button"
              onClick={handleOpen}
            >
              Nouveau transaction
            </Button> */}
          </div>
        </div>

        <div
          className="table"
          style={{ height: '145vh', width: '100%' }}
          ref={tabelRef}
        >
          <DataGrid
            rows={transactions}
            columns={columns}
            pageSize={14}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(r) => r._id}
            className={classes.root}
          />
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {/* body */}
          <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title" style={{ marginBottom: '10px' }}>
              Nouveau transaction:
            </h2>

            <div id="simple-modal-description">
              <form className="newTransactionForm" onSubmit={handelSubmit}>
                <div className="formGroup">
                  <label htmlFor="billNumber">Numéro de Billet</label>
                  <input
                    type="number"
                    name="billNumber"
                    id="billNumber"
                    placeholder="Entrez le numéro de billet"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    onBlur={handelBlur}
                  />
                </div>

                <div className="formGroup">
                  <label htmlFor="billVers">Versement</label>
                  <input
                    type="number"
                    name="billVers"
                    id="billVers"
                    placeholder="Entrez le paiement de la billet"
                    value={billPayment}
                    onChange={(e) => setBillPayment(e.target.value)}
                  />
                </div>

                <div className="formGroup">
                  <Button type="submit" color="primary" variant="outlined">
                    envoyer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>

        <Modal
          open={copen}
          onClose={handleCclose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {/* body */}
          <div style={modalStyle} className={classes.paper}>
            <div className="modalHead">
              <h2 id="simple-modal-title" style={{ marginBottom: '10px' }}>
                Calcul:
              </h2>
            </div>
            <div className="head">
              <span>N°</span>
              <span>Numéro de billet</span>
              <span>Crédit</span>
              <span>Paiement</span>
              <span>Total</span>
            </div>
            {allT.length > 0 ? (
              allT.map((b, index) => (
                <div key={index} className="calc">
                  <div className="body">
                    <div className={b.credit === 0 ? 'b success' : 'b danger'}>
                      <span> {index + 1} </span>
                      <span> {b?.id} </span>
                      <span> {b?.credit} </span>
                      <span> {b?.vers} </span>
                      <span> {b.total || b.billAmount} </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="noT">Il n'y a pas encore de transaction.</div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ClientInfo;
