import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateKnowledgeBaseArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    problemDescription: '',
    category: ''
    // Removed solution from initial state
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://localhost:7121/api/KnowledgeBase', formData);
      if (response.status === 201) {
        setSuccessMessage('Article created successfully!');
        setErrorMessage('');
        
        Swal.fire({
          title: 'Success!',
          text: 'Article created successfully!',
          icon: 'success',
          confirmButtonText: 'Okay'
        });

        // Reset form data
        setFormData({
          title: '',
          problemDescription: '',
          category: ''
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating article';
      setErrorMessage(message);
      setSuccessMessage('');

      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create Knowledge Base Article</h1>
      
      {successMessage && <p className="text-success">{successMessage}</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input 
            type="text" 
            name="title" 
            className="form-control" 
            value={formData.title} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Problem Description</label>
          <textarea 
            name="problemDescription" 
            className="form-control" 
            value={formData.problemDescription} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input 
            type="text" 
            name="category" 
            className="form-control" 
            value={formData.category} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        {/* Solution field removed */}
        
        <button type="submit" className="btn btn-primary">Create Article</button>
      </form>
    </div>
  );
};

export default CreateKnowledgeBaseArticle;
