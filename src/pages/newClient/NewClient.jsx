import './newClient.scss';
import { useContext, useState } from 'react';
import { ClientsContext } from '../../context/clientContext/clientContext';

import {
  ADD_CLIENT_FAILURE,
  ADD_CLIENT_START,
  ADD_CLIENT_SUCCESS,
} from '../../context/clientContext/clientContextActions';

import { toast } from 'react-toastify';
import { axiosI } from '../../config';

export default function NewClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [driver, setDriver] = useState('');
  const [nif, setNif] = useState('');
  const [rc, setRc] = useState('');
  const [phone, setPhone] = useState('');
  const [activity, setActivity] = useState('');
  const [credit, setCredit] = useState(0);
  const [remise, setRemise] = useState(0);
  const [na, setNa] = useState('');

  const { dispatch } = useContext(ClientsContext);

  const handelSubmit = async (e) => {
    e.preventDefault();

    dispatch(ADD_CLIENT_START());
    try {
      const res = await axiosI.post(
        'client',
        {
          name,
          email,
          address,
          phone,
          driver,
          nif,
          rc,
          activity,
          credit,
          remise,
          na,
        },
        {
          headers: {
            token:
              'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        }
      );
      dispatch(ADD_CLIENT_SUCCESS(res.data));
      toast.success('Client Added successfully.');
      setName('');
      setEmail('');
      setAddress('');
      setPhone('');
      setDriver('');
      setNif('');
      setRc('');
      setNa('');
      setActivity('');
      setCredit(0);
      setRemise(0);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(ADD_CLIENT_FAILURE(error));
    }
  };

  return (
    <div className="newClient">
      <h2>New client</h2>
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
            placeholder="Entrer l'adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            className="input"
            placeholder="Phone Number"
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
            placeholder="client NIF"
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
            placeholder="client RC"
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
          <label htmlFor="credit">Old Debt</label>
          <input
            type="number"
            id="credit"
            className="input"
            placeholder="Old debt"
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
