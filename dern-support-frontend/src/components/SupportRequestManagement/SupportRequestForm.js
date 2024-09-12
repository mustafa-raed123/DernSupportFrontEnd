import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'; // Correct import
import 'bootstrap/dist/css/bootstrap.min.css';

const SupportRequestForm = () => {
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [customerId, setCustomerId] = useState(null); // State to hold customer ID

  useEffect(() => {
    // Get the token from localStorage
    const account = JSON.parse(localStorage.getItem('account'));
    if (account && account.token) {
      try {
        // Decode the JWT token to extract the Id
        const decodedToken = jwtDecode(account.token);
        const id = decodedToken?.Id; // Adjust this if your token payload uses a different key

        if (id) {
          setCustomerId(id); // Set customer ID if Id exists
        } else {
          console.error("Id not found in the token.");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.error("No token found in localStorage.");
    }
  }, []);

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      Swal.fire({
        title: 'Error',
        text: 'Customer ID is not available.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      return;
    }

    setErrorMessage(''); // Reset error message
    try {
      const response = await axios.post('https://localhost:7121/api/Support', {
        CustomerId: customerId, // Include customer ID in the request
        Description: description,
      });

      if (response.data) {
        Swal.fire({
          title: 'Success!',
          text: 'Support request submitted successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
        setDescription(''); // Reset form
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
    
      <h2 className="mb-4">Submit Support Request</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Issue Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
    </div>
  );
};

export default SupportRequestForm;
