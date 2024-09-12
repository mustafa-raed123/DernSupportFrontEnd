import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    contactInfo: '',
    customerType: 'Individual',
    location: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7121/api/Account/register-User', formData);
      if (response.data) {
        Swal.fire({
          title: 'Success!',
          text: 'You have signed up successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred. Please try again.';
      setErrorMessage(message);
      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sign Up</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">Username</label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="form-control"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contactInfo" className="form-label">Contact Info</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            className="form-control"
            value={formData.contactInfo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="customerType" className="form-label">Customer Type</label>
          <select
            id="customerType"
            name="customerType"
            className="form-select"
            value={formData.customerType}
            onChange={handleChange}
            required
          >
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
          </select>
        </div>
        {formData.customerType === 'Business' && (
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>

      {/* Display location if customer type is Business */}
      {formData.customerType === 'Business' && formData.location && (
        <div className="mt-4">
          <h5>Location: {formData.location}</h5>
        </div>
      )}
    </div>
  );
};

export default Signup;