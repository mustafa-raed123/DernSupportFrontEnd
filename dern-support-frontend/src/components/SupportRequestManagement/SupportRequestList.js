import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const SupportRequestsPage = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch all support requests when the component is mounted
  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const response = await axios.get('https://localhost:7121/api/Support/GetAllSupport'); // Update with your API endpoint
        setSupportRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching support requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupportRequests();
  }, []);

  // Handle loading state
  if (loading) {
    return <div className="text-center"><p>Loading support requests...</p></div>;
  }

  // Handle error state
  if (error) {
    return <div className="alert alert-danger text-center">Error: {error}</div>;
  }

  // Handle update request
  const handleUpdateClick = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status || ''); // Set the current status as default
    setShowModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`https://localhost:7121/api/Support/${selectedRequest.supportRequestId}`, {
        SupportRequestId: selectedRequest.supportRequestId,
        Status: newStatus,
      });
      setSupportRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.supportRequestId === selectedRequest.supportRequestId
            ? { ...req, status: newStatus }
            : req
        )
      );
      setShowModal(false);
      setNewStatus('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating support request.');
    }
  };

  // Handle delete request
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this support request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://localhost:7121/api/Support/${id}`);
        setSupportRequests((prevRequests) =>
          prevRequests.filter((request) => request.supportRequestId !== id)
        );
        Swal.fire('Deleted!', 'The support request has been deleted.', 'success');
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting support request.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Support Requests</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Support Request ID</th>
            <th>Customer ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supportRequests.map((request) => (
            <tr key={request.supportRequestId}>
              <td>{request.supportRequestId}</td>
              <td>{request.customerId}</td>
              <td>{request.description}</td>
              <td>{request.status}</td>
              <td>{new Date(request.createdAt).toLocaleString()}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleUpdateClick(request)}>
                  Update
                </button>
                <button className="btn btn-danger ml-2" onClick={() => handleDeleteClick(request.supportRequestId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Support Request</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="status">New Status</label>
                  <input
                    type="text"
                    className="form-control"
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateSubmit}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportRequestsPage;