import './worker.scss';
import { useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { WorkersContext } from '../../context/workerContext/workerContext';
import { updateWorker } from '../../context/workerContext/workerApiCalls';

export default function Worker() {
  const worker = useLocation().worker;
  const [name, setName] = useState(worker.name);
  const [email, setEmail] = useState(worker.email);
  const [address, setAddress] = useState(worker.address);
  const [phone, setPhone] = useState(worker.phone);

  const { dispatch } = useContext(WorkersContext);

  const handelSubmit = (e) => {
    e.preventDefault();
    updateWorker(dispatch, {
      name,
      email,
      address,
      phone,

      _id: worker._id,
    });
  };

  return (
    <div className="worker">
      <div className="titleContainer">
        <h1 className="title" style={{ fontSize: '18px' }}>
          Update Employee{' '}
        </h1>
      </div>
      <div className="productContainer">
        <form className="form" onSubmit={handelSubmit}>
          <div className="group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="input"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              className="input"
              placeholder="Adsress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="string"
              id="phone"
              className="input"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
  );
}
