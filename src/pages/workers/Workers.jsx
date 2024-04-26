import './workers.scss';
import { DataGrid } from '@material-ui/data-grid';
import { Edit, DeleteOutline, Add, } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { WorkersContext } from '../../context/workerContext/workerContext';
import {
  deleteWorker,
  getWorkers,
} from '../../context/workerContext/workerApiCalls';
import ReactToPrint from 'react-to-print';

const Workers = () => {
  const { dispatch, workers, isFetching } = useContext(WorkersContext);

  const workerRef = useRef();

  useEffect(() => {
    getWorkers(dispatch);
  }, [dispatch]);

  const columns = [
    {
      field: 'détails',
      headerName: 'Details',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="actionCell">
            <Link
              to={{
                pathname: `/workerInfo/${params.row._id}`,
                worker: params.row,
              }}
            >
              <p style={{ textDecoration: 'underline' }}>Details</p>
            </Link>
          </div>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 240,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 270,
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      width: 250,
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
                pathname: `/worker/${params.row._id}`,
                worker: params.row,
              }}
            >
              <Edit className="editIcon" />
            </Link>
            <DeleteOutline
              className="deleteIcon"
              onClick={() => {
                deleteWorker(dispatch, params.row._id);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="workers">
      <div className="wrapper">
        <div className="header">
          <h3 className="title">Employees</h3>
          <div className="headerButton">
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" size="small">
                  print
                </Button>
              )}
              content={() => workerRef.current}
            />
            <Link to="/newWorker">
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                className="button"
                size="small"
              >
                new Employee
              </Button>
            </Link>
          </div>
        </div>
        {!isFetching ? (
          <div
            className="table"
            style={{ height: '250vh', width: '100%', paddingTop: '20px' }}
            ref={workerRef}
          >
            <DataGrid
              rows={workers}
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
      </div>
    </div>
  );
};

export default Workers;
