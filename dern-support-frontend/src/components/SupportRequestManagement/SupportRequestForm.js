import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

const SupportRequestForm = () => {
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  useEffect(() => {
    const account = JSON.parse(localStorage.getItem('account'));
    if (account && account.token) {
      try {
        const decodedToken = jwtDecode(account.token);
        const id = decodedToken?.Id;

        if (id) {
          setCustomerId(id);
          fetchSupportRequests(id);
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

  const fetchSupportRequests = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7121/api/Customers/${id}/supportrequests`);
      setSupportRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching support requests:", error);
      Swal.fire('Error', 'Failed to fetch support requests.', 'error');
    }
  };

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      Swal.fire('Error', 'Customer ID is not available.', 'error');
      return;
    }

    setErrorMessage('');
    try {
      const response = await axios.post('https://localhost:7121/api/Support', {
        CustomerId: customerId,
        Description: description,
      });

      if (response.data) {
        Swal.fire('Success!', 'Support request submitted successfully!', 'success');
        setDescription(''); // Reset form
        fetchSupportRequests(customerId); // Refresh the list
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred. Please try again.';
      setErrorMessage(message);
      Swal.fire('Error!', message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7121/api/Support/${id}`);
      Swal.fire('Success!', 'Support request deleted successfully!', 'success');
      fetchSupportRequests(customerId); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while deleting. Please try again.';
      Swal.fire('Error!', message, 'error');
    }
  };

  const handleEdit = (request) => {
    setEditingRequestId(request.supportRequestId);
    setNewDescription(request.description);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('https://localhost:7121/api/Customers/EditSupportRequest', {
        RequestId: editingRequestId,
        CustomerId: customerId,
        Description: newDescription,
      });

      if (response.data) {
        Swal.fire('Success!', 'Support request updated successfully!', 'success');
        setEditingRequestId(null); // Reset editing state
        setNewDescription(''); // Reset new description
        fetchSupportRequests(customerId); // Refresh the list
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while updating. Please try again.';
      Swal.fire('Error!', message, 'error');
    }
  };

  const openFeedbackModal = (request) => {
    setSelectedRequest(request);
    setFeedbackMessage('');
    setFeedbackRating(5);
    setFeedbackModalOpen(true);
  };

  const handleFeedback = async () => {
    try {
      await axios.post(`https://localhost:7121/api/Feedbacks`, {
        CustomerId: customerId,
        SupportRequestId: selectedRequest.supportRequestId,
        Comments: feedbackMessage,
        Rating: feedbackRating,
      });

      Swal.fire('Success!', 'Feedback submitted successfully!', 'success');
      setFeedbackMessage('');
      setFeedbackModalOpen(false); // Close modal
      fetchSupportRequests(customerId); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while submitting feedback. Please try again.';
      Swal.fire('Error!', message, 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'In Progress':
        return 'text-primary';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Submit Support Request</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow mb-4">
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

      <h3 className="mb-4">Your Support Requests</h3>
      {supportRequests.length === 0 ? (
        <div className="alert alert-info">No support requests found.</div>
      ) : (
        <ul className="list-group">
          {supportRequests.map((request) => (
            <li key={request.supportRequestId} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Description:</strong> {editingRequestId === request.supportRequestId ? (
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                ) : (
                  request.description
                )} <br />
                <strong>Status:</strong> <span className={getStatusClass(request.status)}>{request.status}</span> <br />
                <strong>Created At:</strong> {formatDate(request.createdAt)} <br />
                <strong>Location:</strong> {request.location || 'N/A'}
              </div>
              <div>
                {editingRequestId === request.supportRequestId ? (
                  <button className="btn btn-success" onClick={handleUpdate}>
                    Save
                  </button>
                ) : (
                  <>
                    <button className="btn btn-warning" onClick={() => handleEdit(request)}>
                      Edit
                    </button>
                    {request.status === 'Completed' && (
                      <button className="btn btn-primary" onClick={() => openFeedbackModal(request)}>
                        Add Feedback
                      </button>
                    )}
                  </>
                )}
                <button className="btn btn-danger" onClick={() => handleDelete(request.supportRequestId)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Custom Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Feedback</h5>
                <button type="button" className="btn-close" onClick={() => setFeedbackModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control mb-2"
                  placeholder="Add feedback"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Rating (1-5)"
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                  min="1"
                  max="5"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setFeedbackModalOpen(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleFeedback}>Submit Feedback</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportRequestForm;