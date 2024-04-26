import './expenses.scss';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline, Add } from '@material-ui/icons';

import { useContext, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { ExpensesContext } from '../../context/expenseContext/expenseContext';
import {
  deleteExpense,
  getExpenses,
} from '../../context/expenseContext/expenseContextApiCalls';
import {
  ADD_EXPENSE_FAILURE,
  ADD_EXPENSE_START,
  ADD_EXPENSE_SUCCESS,
} from '../../context/expenseContext/expenseContextActions';

import { toast } from 'react-toastify';
import { axiosI } from '../../config';
import ReactToPrint from 'react-to-print';

//modal
// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

function getModalStyle() {
  // const top = 50 + rand();
  // const left = 50 + rand();

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
    width: '55%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid blue',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '5px',
  },
}));

const Expenses = () => {
  const { dispatch, expenses, isFetching } = useContext(ExpensesContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const expense = useRef();

  useEffect(() => {
    getExpenses(dispatch);
  }, [dispatch]);

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 130,
      renderCell: (params) => {
        return params.row.createdAt.slice(0, 10);
      },
    },
    {
      field: 'name',
      headerName: 'Description',
      width: 640,
    },
    {
      field: 'price',
      headerName: 'Amount',
      width: 220,
      renderCell: (params) => {
        return params.row.price + ',00 DA';
      },
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 60,
      renderCell: (params) => {
        return (
          <div className="actionCell">
            <DeleteOutline
              className="deleteIcon"
              style={{
                color: 'red',
              }}
              onClick={() => {
                deleteExpense(dispatch, params.row._id);
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    dispatch(ADD_EXPENSE_START());
    try {
      const res = await axiosI.post(
        'expense',
        {
          name,
          price,
        },
        {
          headers: {
            token:
              'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        }
      );
      dispatch(ADD_EXPENSE_SUCCESS(res.data));
      toast.success('Expense Added successfully.');

      //clean modal
      setName('');
      setPrice('');
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(ADD_EXPENSE_FAILURE(error));
    }
  };

  return (
    <div className="expenses">
      <div className="wrapper">
        <div className="header">
          <h3 className="title" style={{ textTransform: 'capitalize' }}>
            {' '}
            Expencess{' '}
          </h3>
          <div className="headerButton">
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" size="small">
                  print
                </Button>
              )}
              content={() => expense.current}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              className="button"
              onClick={handleOpen}
              size="small"
            >
              New expences
            </Button>
          </div>
        </div>

        {!isFetching ? (
          <div
            className="table"
            style={{ height: '250vh', width: '100%', paddingTop: '20px' }}
            ref={expense}
          >
            <DataGrid
              rows={expenses}
              columns={columns}
              pageSize={28}
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

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <h2
              id="simple-modal-title"
              style={{ marginBottom: '10px', fontSize: '18px', color: '#333' }}
            >
              New Expence:
            </h2>
            <div id="simple-modal-description">
              <form className="newTransactionForm" onSubmit={handelSubmit}>
                <div className="formGroup">
                  <label htmlFor="name">Description:</label>
                  <textarea
                    type="string"
                    name="name"
                    id="name"
                    placeholder="description "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ height: '100px', padding: '10px' }}
                  ></textarea>
                </div>
                <div className="formGroup">
                  <label htmlFor="price">Amount:</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="Amount"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="formGroup">
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="small"
                  >
                    send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Expenses;
