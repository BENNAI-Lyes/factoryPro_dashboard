import './client.scss';

import { useLocation } from 'react-router-dom';

import { useContext, useState } from 'react';
import { ClientsContext } from '../../context/clientContext/clientContext';
import { updateClient } from '../../context/clientContext/clientApiCalls';

export default function Client() {
  const client = useLocation().client;
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [address, setAddress] = useState(client.address);
  const [phone, setPhone] = useState(client.phone);

  const [driver, setDriver] = useState(client.driver);
  const [nif, setNif] = useState(client.nif);
  const [rc, setRc] = useState(client.rc);
  const [activity, setActivity] = useState(client.activity);
  const [credit, setCredit] = useState(client.credit);
  const [remise, setRemise] = useState(client.remise);
  const [na, setNa] = useState(client.na);

  const { dispatch } = useContext(ClientsContext);

  const handelSubmit = (e) => {
    e.preventDefault();
    updateClient(dispatch, {
      name,
      email,
      address,
      phone,
      activity,
      driver,
      nif,
      rc,
      credit,
      remise,
      na,
      _id: client._id,
    });
  };

  return (
    <div className="client">
      <div className="titleContainer">
        <h3 className="title"> Update client</h3>
      </div>
      <div className="productContainer">
        <form className="form" onSubmit={handelSubmit}>
          <div className="group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="name"
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
              placeholder="Address"
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
              placeholder=" phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="driver">Driver</label>
            <input
              type="string"
              id="driver"
              className="input"
              placeholder="Driver"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
            />
          </div>
          <div className="group">
            <label htmlFor="nif">NIF</label>
            <input
              type="string"
              id="nif"
              className="input"
              placeholder="NIF"
              value={nif}
              onChange={(e) => setNif(e.target.value)}
            />
          </div>
          <div className="group">
            <label htmlFor="rc">RC</label>
            <input
              type="string"
              id="rc"
              className="input"
              placeholder="RC"
              value={rc}
              onChange={(e) => setRc(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="rc">Activity</label>
            <input
              type="string"
              id="activity"
              className="input"
              placeholder="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="na">Article Number</label>
            <input
              type="string"
              id="activity"
              className="input"
              placeholder="Article Number"
              value={na}
              onChange={(e) => setNa(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="rc">Total Debt</label>
            <input
              type="string"
              id="credit"
              className="input"
              placeholder="Total Debt"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
            />
          </div>

          <div className="group">
            <label htmlFor="remise">Discount</label>
            <input
              type="number"
              id="remise"
              className="input"
              placeholder="Discount"
              value={remise}
              onChange={(e) => setRemise(e.target.value)}
            />
          </div>

          <div className="group">
            <button className="add" type="submit">
              update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
