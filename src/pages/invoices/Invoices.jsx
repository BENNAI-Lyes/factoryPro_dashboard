import './invoices.scss';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline, Add, Visibility } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { InvoicesContext } from '../../context/invoiceContext/invoiceContext';
import {
  deleteInvoice,
  getInvoices,
} from '../../context/invoiceContext/invoiceApiCalls';
import ReactToPrint from 'react-to-print';

const Bills = () => {
  const { dispatch, invoices, isFetching } = useContext(InvoicesContext);
  const invoicesRef = useRef();

  useEffect(() => {
    getInvoices(dispatch);
  }, [dispatch]);

  const columns = [
    { field: 'number', headerName: 'N°', width: 130 },

    {
      field: 'clientName',
      headerName: 'client',
      width: 250,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 270,
      renderCell: (params) => {
        return params.row.createdAt.slice(0, 10);
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 280,
      renderCell: (params) => {
        return params.row.total + ',00 DA';
      },
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      renderCell: (params) => {
        return (
          <div className="actionCell">
            <Link
              to={{
                pathname: `/invoice/${params.row._id}`,
                invoice: params.row,
              }}
            >
              <Visibility className="editIcon" style={{ color: 'blue' }} />
            </Link>
            <DeleteOutline
              className="deleteIcon"
              onClick={() => {
                deleteInvoice(dispatch, params.row._id);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="invoices">
      <div className="wrapper">
        <div className="header">
          <h2 className="title">Invoices</h2>
          <div className="headerButton">
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" size="small">
                  Print
                </Button>
              )}
              content={() => invoicesRef.current}
            />
            <Link to="/newInvoice">
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                className="button"
                size="small"
              >
                New Invoice
              </Button>
            </Link>
          </div>
        </div>

        {!isFetching ? (
          <div
            className="table"
            style={{ height: '250vh', width: '100%', paddingTop: '20px' }}
            ref={invoicesRef}
          >
            <DataGrid
              rows={invoices}
              columns={columns}
              pageSize={28}
              checkboxSelection
              disableSelectionOnClick
              getRowId={(row) => row._id}
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

export default Bills;
